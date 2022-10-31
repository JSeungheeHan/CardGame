
import java.util.HashMap;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/game")
public class GameEndpoint {
	
	public static IchiParser parser = new IchiParser();
	
	private static Map<String, GameServer> gameServers = new HashMap<String, GameServer>();
	
	@OnOpen
	public void onOpen(Session session) {
		System.out.println("onOpen");
	}
	
	
	@OnMessage
	public void onMessage(Session session, String messageString) {
		System.out.println("onMessage");
		try {
			//Parse input
			ClientMessage message = parser.parseClientMessage(messageString);
			
			//If the message is trying to create a new server, do that
			//Otherwise, get the server it pertains to
			GameServer server;
			synchronized(gameServers) {
				if(message.type == "createGame") {
					message.gameCode = makeNewGameCode();
					server = new GameServer(message.gameCode);
					gameServers.put(message.gameCode, server);
				}else {
					server = gameServers.get(message.gameCode);
				}
			}
			
			//If the game server couldn't be found, close the connection
			if(server == null) {
				session.close();
				return;
			}
			
			//Do a different behavior based on the message's type
			synchronized(server) {
				if(message.type == "createGame" || message.type == "joinGame") {
					//The player wants to join the server
					boolean success = server.addPlayer(message.username, session);
					if(!success) {
						session.close();
					}
				}else if(message.type == "draw") {
					//The player wants to draw a card
					server.draw(message.username, message.stateId);
				}else if(message.type == "ichi") {
					//The player hit the "ichi" button
					server.ichi(message.username, message.stateId);
				}else if(message.type == "move") {
					//The player selected a card
					server.makeMove(message.username, message.stateId, message.data);
				}else if(message.type == "startGame") {
					//The player wants to start the game
					server.startGame(message.username);
				}
			}
		} catch (Exception e) {
			//If there was an error, print it
			System.out.println("Failed to process message");
			e.printStackTrace();
		}

	}
	
	@OnClose
	public void onClose(Session session) {
		System.out.println("onClose");
		//Go through all game servers and try to remove this session from them
		synchronized(gameServers) {
			for(String gameCode : gameServers.keySet()) {
				GameServer server = gameServers.get(gameCode);
				if(server.removePlayerBySession(session)) {
					//If this server has no players left, shut it down
					if(!server.hasPlayers()) {
						gameServers.remove(gameCode);
					}
					break;
				}
			}
		}
	}
	
	/**
	 * Generates a random 4-letter uppercase numeric code (e.g. BCDF)
	 * Guaranteed to be unique among the codes already in gameServers
	 */
	private String makeNewGameCode() {
		synchronized(gameServers) {
			while(true) {
				String code = "";
				for(int i = 0; i < 4; i++) {
					char newChar = (char)((int)'A' + (int)(Math.random() * 26));
					code += newChar;
				}
				if(!gameServers.containsKey(code)) {
					return code;
				}
			}
		}
	}
}
