
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.Session;

public class GameServer {
	
	private Game game;
	private Map<String, Session> connections;
	private String gameCode;
	private Thread turnTimer;
	
	public GameServer(String gameCode) {
		this.gameCode = gameCode;
		connections = new HashMap<String, Session>();
		game = new Game(gameCode);
		turnTimer = null;
	}
	
	public boolean addPlayer(String username, Session session) {
		boolean success = game.addPlayer(username);
		if(success) {
			connections.put(username, session);
			broadcastGameState();
		}
		return success;
	}
	
	public void makeMove(String username, int stateId, List<String> cardData) {
		if(game.makeMove(username, stateId, cardData)) {
			broadcastGameState();
		}else {
			sendServerMessage(username, "Card move invalid", null);
		}
	}
	
	public void draw(String username, int stateId) {
		if(game.draw(username, stateId)) {
			broadcastGameState();
		}else {
			sendServerMessage(username, "Draw move invalid", null);
		}
	}
	
	public void ichi(String username, int stateId) {
		if(game.ichi(username, stateId)) {
			broadcastGameState();
		}else {
			sendServerMessage(username, "Ichi move invalid", null);
		}
	}
	
	public void startGame(String username) {
		if(game.startGame()) {
			broadcastGameState();
		}else {
			sendServerMessage(username, "Start game invalid", null);
		}
	}
	
	public boolean removePlayerBySession(Session session) {
		//Search through all connected users for one whose session id matches that of the given session
		for(String username : connections.keySet()) {
			if(connections.get(username).getId().equals(session.getId())) {
				//This is the user we're trying to remove
				connections.remove(username);
				game.removePlayer(username);
				broadcastGameState();
				return true;
			}
		}
		return false;
	}

	public void timerExpire() {
		//The current turn has expired
		System.out.println("The timer has expired!");
		turnTimer = null;
		game.turnExpire();
		broadcastGameState();
	}
	
	public boolean hasPlayers() {
		return connections.size() > 0;
	}
	
	private void broadcastGameState() {
		//Stop the turn timer
		if(turnTimer != null) {
			turnTimer.interrupt();
			turnTimer = null;
		}
		
		//Send the game state to all connected players
		//TODO: Make this happen in a multithreaded manner
		int newTurnExpiry = -1;
		for(String username : connections.keySet()) {
			GameState gameState = game.getGameState(username);
			if(newTurnExpiry == -1 && gameState.turnExpiry != -1) { newTurnExpiry = gameState.turnExpiry; }	//keep track of the a turn expiry so we can set a timer on it
			sendServerMessage(username, null, gameState);
		}
		
		//Start the turn timer
		if(newTurnExpiry != -1) {
			turnTimer = new TurnTimerThread(this, newTurnExpiry);
			turnTimer.start();
		}
	}
	
	private void sendServerMessage(String username, String error, GameState gameState) {
		//Construct the output
		ServerMessage message = new ServerMessage();
		message.error = error;
		message.gameState = gameState;
		String messageStr = GameEndpoint.parser.stringifyServerMessage(message);
		
		//Send the message
		Session session = connections.get(username);
		if(session == null) {
			System.out.println("Error: game " + gameCode + " attempted to send message to " + username + ", but didn't have a session with that user");
		}else {
			try {
				session.getBasicRemote().sendText(messageStr);
			} catch (IOException e) {
				System.out.println("Error: game " + gameCode + " attempted to send message to " + username + ", but received an IOException:");
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * Called when the server is being closed
	 * We can assume that all connections are already closed at this point
	 */
	public void shutdown() {
		if(turnTimer != null) {
			turnTimer.interrupt();
			turnTimer = null;
		}
	}

	
}
