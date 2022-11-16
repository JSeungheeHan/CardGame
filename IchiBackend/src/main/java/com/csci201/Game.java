package com.csci201;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Stack;

public class Game {
	
	enum Phase {
		Lobby,
		Playing,
		Finished
	}
	
	private String gameCode;
	private List<Player> players;
	private Phase currentPhase;
	private int stateId;
	private int turnExpiry;
	private Stack<Card> deck;
	private Stack<Card> discard = new Stack<>();
	
	private final int MAX_PLAYERS = 4;
	
	public Game(String gameCode) {
		this.gameCode = gameCode;
		players = new ArrayList<Player>();
		currentPhase = Phase.Lobby;
		stateId = 0;
		turnExpiry = -1;
	}
	
	/**
	 * Gets the GameState as it will appear to the given player.
	 * All fields must be present according to the specification defined in the tables of the detailed design.
	 * Each player's GameState will be distinct (for example, each player will have different cards set to visible and selectable).
	 */
	public GameState getGameState(String username) {
		//Fill in basic info
		GameState state = new GameState();
		state.id = stateId;
		state.gameCode = gameCode;
		
		//Fill in phase-based info
		if(currentPhase == Phase.Finished) {
			//TODO: Once a victor is determined, reflect that here
		}else {
			state.victor = -1;
		}
		
		if(currentPhase == Phase.Playing) {
			//TODO: make this info accurate once we have implemented turns
			state.currentPlayer = 0;
			state.turnExpiry = turnExpiry;
		}else {
			state.currentPlayer = -1;
			state.turnExpiry = -1;
		}
		
		//Give the GameState the relevant items in the discard pile
		List<CardInfo> topTwo = new ArrayList<>();
		if (discard.size() > 1) {
			Card temp = discard.pop();
			topTwo.add(discard.peek().toCardInfo());
			topTwo.add(temp.toCardInfo());
			discard.push(temp);
		} else if (discard.size() == 1) {
			topTwo.add(discard.peek().toCardInfo());
		}

		state.playedCards = topTwo;
		
		//Fill in player info
		state.players = new ArrayList<PlayerInfo>();
		for(Player p : players) {
			PlayerInfo info = new PlayerInfo();
			info.username = p.getUsername();
			info.hand = new ArrayList<CardInfo>();
			
			// Fill out card info
			if (currentPhase == Phase.Playing) {
				for (Card c : p.getCards()) {
					CardInfo cardInfo = c.toCardInfo();
					if (info.username.equals(username)){
						cardInfo.revealed = true;
						if (c.isPlayable(discard.peek()))
							cardInfo.selectable = true;
					}
					info.hand.add(cardInfo);
				}
			}
			
			state.players.add(info);
		}
		
		//Fill in deck and stack info
		//TODO: make these values accurate once we have implemented the card deck and stack
		state.playedCards = new ArrayList<CardInfo>();
		state.remainingCards = 100;
		
		//Return
		return state;
	}
	
	/**
	 * This adds the given player to the game.
	 * Returns true if that was successful.
	 * Returns false if the player couldn't be added (for example, because the game has already begun or already has 4 players or the username is already in use).
	 */
	public boolean addPlayer(String username) {
		//Verify the game is in the lobby phase
		if(currentPhase != Phase.Lobby) {
			return false;
		}
		
		//Verify there is space in the game
		if(players.size() >= MAX_PLAYERS) {
			return false;
		}
		
		//Verify the new username is unique
		if(getPlayerIndex(username) != -1) {
			return false;
		}
		
		//Add the user to the game
		players.add(new Player(username));
		return true;
	}
	
	/**
	 * This removes the given player from the game.
	 * This may be complicated, since the game could be under way and it could even be this player's turn.
	 */
	public void removePlayer(String username) {
		int playerIdx = getPlayerIndex(username);
		players.remove(playerIdx);
		//TODO: Make sure everything is properly fixed -- especially if it's currently this player's turn
	}
	
	/**
	 * This causes the game to begin, dealing every player their starting cards and setting the current player appropriately.
	 * Before this is called, the game is in a lobby state, waiting for players to come and go.
	 * Returns false if the game has already been started (in which case this function doesn't do anything), and true otherwise.
	 */
	public boolean startGame() {
		if (currentPhase != Phase.Lobby)
			return false;
		
		// Generate the starting deck
		// Also get the first card for discard
		deck = Card.GenerateFreshDeck();
		discard = new Stack<>();
		discard.push(deck.pop());
		
		// Draw seven cards to each player
		for (Player player : players) {
			while (player.handSize() < 7)
				player.addToHand(deck.pop());
		}
		PrintDiscardPeek(); // For debugging. Remove later
		currentPhase = Phase.Playing;
		return true;
	}
	
	/**
	 * !FOR DEBUGGING PURPOSES! This should be removed once the discard
	 * pile can be seen.
	 */
	private void PrintDiscardPeek() {
		System.out.println("Top Card Details: "
				+ discard.peek().getColor() + " "
				+ discard.peek().getFace() + " "
				+ discard.peek().getId());
	}
	
	/**
	 * The given player has selected a card with the intent to play it.
	 * cardInfo holds information about the move:
	 *  - cardInfo[0] will always be the id of the card the player selected
	 *  - if that card is a wild card, cardInfo[1] will be the color they selected
	 *  - if that card is a swap card, cardInfo[1] and cardInfo[2] will be the ids of the cards they selected to swap
	 * Returns true if that is a legal action, and false otherwise.
	 */
	public boolean makeMove(String username, int stateId, List<String> cardInfo) {
		//TODO: Implement
		Player player = players.get(getPlayerIndex(username));
		Card card = player.searchForCard(cardInfo.get(0));
		if (card == null) {
			System.out.println("Invalid card search in player " + username + "'s hand");
			return false;
		}
		
		if (!card.isPlayable(discard.peek()))
			return false;
		
		discard.push(card);
		player.removeFromHand(card);
		PrintDiscardPeek();
		endTurn();
		return true;
	}
	
	/**
	 * The given player has elected to draw a card.
	 * The game state must be updated accordingly.
	 * Returns true if that is a legal action, and false otherwise.
	 */
	public boolean draw(String username, int stateId) {
		//TODO: Implement
		endTurn();
		return true;
	}
	
	/**
	 * The given player has pressed the "ichi" button.
	 * The game must be updated accordingly, depending on whether this was the player who just reached one card, or somebody else beating them to it.
	 * Returns true if that is a legal action, and false otherwise.
	 */
	public boolean ichi(String username, int stateId) {
		//TODO: Implement
		return true;
	}
	
	/**
	 * Called when the current turn expires without the player making a move.
	 * The timer that calls this function is handled by the GameServer.
	 * This function only has to carry out the effect of the current turn expiring.
	 */
	public void turnExpire() {
		//TODO: Implement
		endTurn();
	}
	
	/**
	 * Called to indicate a new turn has begun.
	 * This will increment the state id and reset the turn expiry time
	 */
	private void endTurn() {
		stateId++;
		//TODO: Implement turn expiry here
	}
	
	/**
	 * Returns the index in the players List of the user with the given username
	 * Or, returns -1 if that player doesn't exist
	 */
	private int getPlayerIndex(String username) {
		for(int i = 0; i < players.size(); i++) {
			if(players.get(i).getUsername().equals(username)) {
				return i;
			}
		}
		return -1;
	}
	
}
