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
	private Stack<Card> deck = new Stack<>();
	private Stack<Card> discard = new Stack<>();
	private int currentTurn = 0;
	private boolean turnDirection = true;
	private boolean bombSet = false;
	private int firstPlayerWithEmptyHand = -1;
	
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
			state.victor = firstPlayerWithEmptyHand;
		}else {
			state.victor = -1;
		}
		
		if(currentPhase == Phase.Playing) {
			//TODO: make this info accurate once we have implemented turns
			state.currentPlayer = currentTurn;
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
		for(CardInfo i : topTwo) { i.revealed = true; }
		state.playedCards = topTwo;
		state.remainingCards = deck.size();
		
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
						if (c.isPlayable(discard.peek()) && 
							currentTurn == getPlayerIndex(username))
							cardInfo.selectable = true;
					}
					info.hand.add(cardInfo);
				}
			}
			
			state.players.add(info);
		}
		
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
		players.add(new Player(username, false));
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
		// If it is a wild or shuffle card then try again
		// Also get the first card for discard
		deck = Card.GenerateFreshDeck();
		while (deck.peek().getColor().equals("special")) {
			deck = Card.ReshuffleDeck(deck);
		}
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
		// Ensure the request is valid
		int playerIdx = getPlayerIndex(username);
		if(playerIdx == -1 || playerIdx != currentTurn) { return false; }
		if(stateId != this.stateId) {
			System.out.println("Rejecting move request for invalid state id");
			return false;
		}
		
		Player player = players.get(playerIdx);
		Card card = player.searchForCard(cardInfo.get(0));
		if (card == null) {
			System.out.println("Invalid card search in player " + username + "'s hand");
			return false;
		}
		
		if (!card.isPlayable(discard.peek()))
			return false;
			
		// Move card from player's hand to the discard pile
		discard.push(card);
		player.removeFromHand(card);
			
		// Handle special cards
		specialCardImplementation(card, player, cardInfo);
			
		// Debugging Purposes
		PrintDiscardPeek();
			
		// Player's turn is finished
		endTurn();
			
		// Check if Player has no more cards - determines Game Victor
		if(player.handSize() == 0) {
			System.out.printf("Player: %s has won the game!\n", username);
			currentPhase = Phase.Finished;
			firstPlayerWithEmptyHand = playerIdx;
		}
			
		return true;
	}
	
	/**
	 * Helper function for makeMove to handle special card cases after placing card into discard pile
	 * e.g., reverse, bomb, shuffle, etc.
	 */
	private void specialCardImplementation(Card card, Player player, List<String> cardInfo) {
		// Reverse Card implementation
		if (card.getFace().equals("reverse"))
			turnDirection = false;
							
		// Bomb Card implementation
		if (card.getFace().equals("bomb"))
			bombSet = true;
					
		// Shuffle Card implementation
		if (card.getFace().equals("shuffle")) {
			//TODO: Change color of card to selected color.
			int handSize = player.handSize();
			for (Card c : player.getCards()) {
				deck.push(c);
			}
			player.clearHand();
			deck = Card.ReshuffleDeck(deck);
			for (int h = 0; h < handSize; h++) {
				player.addToHand(deck.pop());
			}
						
			//Uncomment this once cardInfo 1 is sent
			//card.setColor(cardInfo.get(1));
		}
					
		// Wild Card implementation
		if (card.getFace().equals("wild")) {
			card.setColor(cardInfo.get(1));
		}
		
		// Swap Card implementation
		// This has to come before 'actually' playing the card, since if
		// if it is an invalid move we don't want to change any hands.
		// Uncomment this once cardInfo 1 and 2 are sent
//		if (card.getFace().equals("swap")) {
//			Player otherPlayer = null;
//			Card otherCard = null;
//			Card chosenCard = player.searchForCard(cardInfo.get(1));
//			for (Player p : players) {
//				Card temp = p.searchForCard(cardInfo.get(2));
//				if (temp != null) {
//					otherPlayer = p;
//					otherCard = temp;
//				}
//			}
//			if (otherPlayer == null || otherCard == null)
//				return false;
//						
//			otherPlayer.removeFromHand(otherCard);
//			player.removeFromHand(chosenCard);
//			otherPlayer.addToHand(chosenCard);
//			player.addToHand(otherCard);
//		}
	}
	
	/**
	 * The given player has elected to draw a card.
	 * The game state must be updated accordingly.
	 * Returns true if that is a legal action, and false otherwise.
	 */
	public boolean draw(String username, int stateId) {
		//Validate the request is valid
		int playerIdx = getPlayerIndex(username);
		if(playerIdx == -1 || playerIdx != currentTurn) { return false; }
		if(stateId != this.stateId) {
			System.out.println("Rejecting draw request for invalid state id");
			return false;
		}
		
		//Draw the card
		Player player = players.get(playerIdx);
		player.addToHand(deck.pop());
		
		// If the last card is drawn reset the deck and the stack
		if (deck.isEmpty()) {
			Card top = discard.pop();
			deck = Card.ReshuffleDeck(discard);
			discard.push(top);
		}
		
		// Bomb Card implementation
		if (bombSet) {
			if (deck.size() <= 2)
			{
				Card top = discard.pop();
				deck = Card.ReshuffleDeck(discard);
				discard.push(top);
			}
			
			player.addToHand(deck.pop());
			player.addToHand(deck.pop());
			
			bombSet = false;
		}
		
		//End the turn
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
		System.out.println("ichi was called by " + username);
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
		if (turnDirection)
			currentTurn++;
		else
			currentTurn--;
		
		if (currentTurn > players.size() - 1)
			currentTurn = 0;
		if (currentTurn < 0)
			currentTurn = players.size() - 1;
		
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
