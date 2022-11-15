

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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
public class LoginServlet extends HttpServlet {
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
		//OUTPUTS: success, logged in successfully or not.
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		String password = strs[1];
		
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
			//searches in database for entries with the given username.
			st = con.createStatement();
			rs = st.executeQuery("SELECT * from accountdata WHERE accountdata.Username='" + username + "'");
			
			//iterates through all entries with the username. THERE SHOULD ONLY BE ONE, but this is just
			//a safety precaustion
			while (rs.next()) {
				int passwordInput = hashPassword(password);
				if(passwordInput == rs.getInt("Password"))
				{
					//This is how you would grab the values. They don't do anything currently.
					int gamesWon = rs.getInt("GamesWon");
					int gamesLost = rs.getInt("GamesLost");
					String date = rs.getString("DateJoined");
					
					result = true;
				}
			}

		}
		catch (Exception ie)
		{
			//Catching exception if something went wrong. Should not happen though.
			result = false;
		}
		
		//Send a response, whether login was successful or not.
		response.getWriter().append(result ? "Success" : "Failure");
	}

}
