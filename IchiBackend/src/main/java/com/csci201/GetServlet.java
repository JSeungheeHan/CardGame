package com.csci201;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/get")
public class GetServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * This sample code just shows how to get info off of a request and send a response
	 * It doesn't actually verify the request against the database
	 */
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("ENV var is " + System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
		//INPUTS: username
		//OUTPUTS: JSON containing the stats, or "Failure"
		//Failure if the username does not exist.
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		
		//Initializing necessary variables.
		Connection con = null;
		try {
			con = DriverManager.getConnection("jdbc:mysql:///cardgame?cloudSqlInstance=ichi-366421:us-central1:root&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=root&password=root");
		} catch (SQLException e) {
			e.printStackTrace();
		}	
		Statement st = null;
		ResultSet rs = null;
		boolean result = false;

		//response headers
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods","GET, OPTIONS, HEAD, PUT, POST");	
		
		try {
			//Updates the value at the field. This fails if the field doesn't exist.
			//TODO: Make it fail if the username can't be found.
			st = con.createStatement();
			//Finds the entry in the table with the given username
			rs = st.executeQuery("SELECT * from accountdata WHERE accountdata.Username='" + username + "'");
			rs.next();
			//Return the JSON containing the info
			String resJson = "{";
			resJson += "\n\"gamesWon\": " + rs.getInt("GamesWon");
			resJson += ",\n\"gamesLost\": " + rs.getInt("GamesLost");
			resJson += ",\n\"username\": \"" + rs.getString("Username") + "\"";
			resJson += ",\n\"dateJoined\": \"" + rs.getString("DateJoined") + "\"";
			resJson += "\n}";
			response.getWriter().append(resJson);
			result = true;
		}
		catch (Exception e)
		{
			//sends failure if there is an error.
			System.out.println(e.getMessage());
			result = false;
		}
		
		if(!result)
		{
			//Sends failure if username or field is invalid.
			response.getWriter().append("Failure");
		}
	}

	public void doOptions(HttpServletRequest req, HttpServletResponse resp)
        throws IOException {
		resp.setHeader("Access-Control-Allow-Headers", "*");
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Methods","GET, OPTIONS, HEAD, PUT, POST");

	}

}
