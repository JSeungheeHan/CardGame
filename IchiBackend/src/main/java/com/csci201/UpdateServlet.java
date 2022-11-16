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
@WebServlet("/update")
public class UpdateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * This sample code just shows how to get info off of a request and send a response
	 * It doesn't actually verify the request against the database
	 */
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//INPUTS: username, update field, update value
		//OUTPUTS: success, changed value successfully or not.
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		String field = strs[1];
		String value = strs[2];
		
		//Initializing necessary variables. TODO: change from localhost to public host later on.
		Connection con = null;
		try {
			con = DriverManager.getConnection("\"jdbc:mysql:///cardgame?cloudSqlInstance=ichi-366421:us-central1:root&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=root&password=root");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		Statement st = null;
		boolean result = true;
		
		try {
			//Updates the value at the field. This fails if the field doesn't exist.
			//TODO: Make it fail if the username can't be found.
			st = con.createStatement();
			st.executeUpdate("UPDATE accountdata s SET s." + field + "='" + value + "' WHERE s.Username='" + username +"'");
		}
		catch (Exception e)
		{
			result = false;
		}
		
		//Send a response, whether login was successful or not.
		response.getWriter().append(result ? "Success" : "Failure");
	}

}
