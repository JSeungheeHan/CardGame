

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
@WebServlet("/login")
public class GetServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * This sample code just shows how to get info off of a request and send a response
	 * It doesn't actually verify the request against the database
	 */
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//INPUTS: username, field
		//OUTPUTS: The value at the field. Returns null if can't read a string field, -1 if integer.
		//Failure if the username or field does not exist.
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		String field = strs[1];
		
		//Initializing necessary variables. TODO: change from localhost to public host later on.
		Connection con = null;
		try {
			con = DriverManager.getConnection("jdbc:mysql://localhost/cardgame?user=root&password=root");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		Statement st = null;
		ResultSet rs = null;
		boolean result = false;
		
		try {
			//Updates the value at the field. This fails if the field doesn't exist.
			//TODO: Make it fail if the username can't be found.
			st = con.createStatement();
			//Finds the entry in the table with the given username
			rs = st.executeQuery("SELECT * from accountdata WHERE accountdata.Username='" + username + "'");
			//Returns the value at the field of the entry if found.
			if(field.equals("GamesWon") || field.equals("GamesLost") || field.equals("Password"))
			{
				response.getWriter().append("" + rs.getInt(field));
				result = true;
			}
			if(field.equals("Username") || field.equals("DateJoined"))
			{
				response.getWriter().append("" + rs.getString(field));
				result = true;
			}
		}
		catch (Exception e)
		{
			//sends failure if there is an error.
			result = false;
		}
		
		if(!result)
		{
			//Sends failure if username or field is invalid.
			response.getWriter().append("Failure");
		}
	}

}
