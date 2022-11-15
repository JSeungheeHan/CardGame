
public class GameTester {

	public static void main(String[] args) {
		if(!test1()) {
			System.out.println("Test 1 failed");
		}else {
			System.out.println("Test 1 succeeded");
		}
	}
	
	private static boolean test1() {
		Game game = new Game("AAAA");
		game.addPlayer("player1");
		game.addPlayer("player2");
		GameState gameState = game.getGameState("player1");
		if(gameState.players.size() != 2) { return false; }
		if(gameState.players.get(0).username != "player1") { return false; }
		return true;
	}

}
