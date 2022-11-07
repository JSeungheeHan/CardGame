

import java.io.IOException;
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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//Parse the input
		String input = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		String[] strs = input.split(" ");
		String username = strs[0];
		String password = strs[1];
		
		//TODO: make a jdbc call and see if this exists. for now, just verify if the username is levi-pinkert and the password is password1111
		boolean result = username.equals("levi-pinkert") && password.equals("password1111");
		
		//Send a response
		response.getWriter().append(result ? "Success" : "Failure");
	}

}
