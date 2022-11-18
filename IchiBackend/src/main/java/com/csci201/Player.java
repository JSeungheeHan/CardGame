package com.csci201;
import java.util.ArrayList;
import java.util.List;

public class Player {
	private List<Card> playerCards = new ArrayList<>();
	
	private String username;
	private boolean ichiCalled;
	
	public Player(String username, boolean ichiCalled) {
		this.username = username;
		this.ichiCalled = ichiCalled;
	}
	
	public String getUsername() {
		return username;
	}
	
	public boolean getIchiStatus() {
		return ichiCalled;
	}
	
	/**
	 * Adds a card to a player's hand. Should be calling deck.pop() to do so.
	 */
	public void addToHand(Card card) {
		playerCards.add(card);
	}
	
	public void removeFromHand(Card card) {
		playerCards.remove(card);
	}
	
	public int handSize() {
		return playerCards.size();
	}
	
	public List<Card> getCards() {
		return playerCards;
	}
	
	/**
	 * Warning! This will erase the player's hand, so make sure you have moves
	 * all the cards in the player's hand to somewhere else first. Otherwise,
	 * they are gone forever! (Or until a new game is started)
	 */
	public void clearHand() {
		playerCards = new ArrayList<Card>();
	}
	
	public Card searchForCard(String id) {
		Card card = null;
		for (Card c : playerCards) {
			if (id.equals(c.getId()))
				card = c;
		}
		return card;
	}
}
