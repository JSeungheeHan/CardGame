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
@WebServlet("/createAccount")
public class CreateAccountServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * This sample code just shows how to get info off of a request and send a response
	 * It doesn't actually verify the request against the database
	 */
	
	private int hashPassword(String input)
	{
		int w[] = {0, 0, 0, 0, 0};
        int current = 0;
        for (int l = 1; l <= 5; l++) {
            current = 0;
            for (int i = 0; i < 6; i++) {
                if ((input.length() - (6 * l) + i) < 0) {
                    continue;
                }
                current = current * 36;
                current = current + (input.charAt(input.length() - (6 * l) + i));
            }
            w[5 - l] = current;
        }
        //I create the result variable, and add each of the w values to it's respective random value.
        Random ran = new Random();
        ran.setSeed(current);
        int result = 0;
        for (int i = 0; i < 5; i++) {
            result = result + w[i] * ran.nextInt();
        }
        return result;
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//INPUTS: username, password
		//OUTPUTS: success, created account successfully or not.
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		String password = strs[1];
		
		//Initializing necessary variables. TODO: change from localhost to public host later on.
		Connection con = null;
		try {
			con = DriverManager.getConnection("jdbc:mysql:///cardgame?cloudSqlInstance=ichi-366421:us-central1:root&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=root&password=root");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			response.getWriter().append(e.getMessage());
			e.printStackTrace();
		}	
		Statement st = null;
		ResultSet rs = null;
		boolean result = true;
		
		try {
			st = con.createStatement();
			rs = st.executeQuery("SELECT * FROM accountdata WHERE accountdata.Username='" + username + "';");
			while (rs.next()) {
				//iterates through all entries with the username. In other words, if an entry with
				//the new username already exists, then the new account can't be created.
				String existingUsername = rs.getString("Username");
				if(existingUsername.equals(username))
				{
					result = false;
					break;
				}
			}
			
			if(result)
			{
				//inserts the new account into the database.
				int pass = hashPassword(password);
				DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
				String joinDate = dtf.format(LocalDateTime.now());
				System.out.println(hashPassword(password));
				String command = "INSERT INTO accountdata (Username, Password, DateJoined, GamesWon, GamesLost) VALUES ('" + username + "', " + pass + ", '" + joinDate + "', 0, 0);";
				st.executeUpdate(command);	
			}
		}
		catch (Exception ie)
		{
			//Exception catching if failed to create an account. This shouldn't happen.
			response.getWriter().append(ie.getMessage());
			result = false;
		}
		
		//Send a response, whether login was successful or not.
		response.getWriter().append(result ? "Success" : "Failure");
	}

}
