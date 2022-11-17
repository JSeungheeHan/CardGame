package com.csci201;

import java.util.Collections;
import java.util.Stack;

public class Card {
	private static final String[] Color = {
			"red", "green", "blue",
			"yellow", "special",
	};
	
	private static final String[] Face = {
			"0", "1", "2", "3", "4",
			"5", "6", "7", "8", "9",
			"reverse", "swap", "shuffle",
			"wild", "bomb"
	};
	
	private static final int numBaseColors = 4;
	private static final int numBaseFaces = 10;
	private static final int numWildCards = 4;
	
	private String id;
	private String color;
	private String face;
	
	/**
	 * Create a Card. 
	 * @throws IllegalArgumentException the parameters are invalid.
	 * @param color		A value 0 - 4 representing a color type.
	 * @param face		A value 0 - 14 representing a face type.
	 * @param variant 	An int that should be '1' or '2'.
	 */
	public Card(int color, int face, int variant) {
		if (color > Color.length - 1 || face > Face.length - 1 ||
			color < 0 || face < 0) {
			System.out.println("Array OOB in Card Constructor: " + color + " " + face);
			throw new IllegalArgumentException("Card Construction Aborted");
		}
		
		this.color = Color[color];
		this.face = Face[face];
		this.id = this.face + this.color + variant;
	}
	
	/**
	 * Takes a card info and turns it into a card. This is useful for
	 * when a player makes a move, since a Card object needs to be removed
	 * from the player's hand and added to the discard pile.
	 * @param cardInfo A CardInfo object,
	 */
	public Card(CardInfo cardInfo) {
		this.id = cardInfo.id;
		this.face = cardInfo.face;
		this.color = cardInfo.color;
	}
	
	/**
	 * Static function to be able to generate a CardInfo from anywhere.
	 * @param 	card 	A target card to get the CardInfo from.
	 * @return 			A CardInfo object based on the given card.
	 */
	public static CardInfo GetCardInfo(Card card) {
		CardInfo cardInfo = new CardInfo();
		
		// Set the CardInfo id, face, and color
		cardInfo.id = card.id;
		cardInfo.face = card.face;
		cardInfo.color = card.color;
		
		// These should be set properly in getGameState
		// They are set false here so we don't reference a null value
		cardInfo.revealed = false;
		cardInfo.selectable = false;
		
		return cardInfo;
	}
	
	/**
	 * @return 	A CardInfo for the card this method is called on.
	 */
	public CardInfo toCardInfo() {
		return GetCardInfo(this);
	}
	
	/**
	 * Checks if this card is playable to some other card.
	 * @param topCard 	Should be the top card of the deck, but can be used to check other cards.
	 * @return			A bool to represent that this card can be played on the given card.
	 */
	public boolean isPlayable(Card topCard) {
		if (face.equals(topCard.getFace()))
			return true;
		
		if (color.equals(topCard.getColor()) || color.equals("special"))
			return true;
		
		return false;
	}
	
	/**
	 * @return The face of this card.
	 */
	public String getFace() {
		return this.face;
	}
	
	/**
	 * @return The color of this card.
	 */
	public String getColor() {
		return this.color;
	}
	
	/**
	 * @return The color of this card.
	 */
	public String getId() {
		return this.id;
	}
	
	/**
	 * If this card is a Wild or Shuffle Card, reset its color to 'special'.
	 */
	public void resetCard() {
		if (face.equals("wild") || face.equals("shuffle"))
			color = "special";
	}
	
	/**
	 * Sets the cards color to something else. Can only be used on shuffle and wild cards.
	 * If used on other cards this does nothing.
	 */
	public void setColor(String color) {
		if (color == null) {
			System.out.println("null color in set color");
			return;
		}
		if (this.color.equals("special"))
			this.color = color;
		else
			System.out.println("Cannot change card of color " + this.color + " to " + color);
	}
	
	/**
	 * Creates the game's first deck. Should create 108 cards: two of each
	 * card 1-9 of every color, a 0 of every color, two of each special card
	 * of each color, and finally four of each wild card
	 * @return A Stack of Card objects, shuffled.
	 */
	public static Stack<Card> GenerateFreshDeck() {
		Stack<Card> deck = new Stack<>();
		
		// Create the "0" cards
		for (int c = 0; c < numBaseColors; c++)
			for (int i = 0; i < 2; i++) {
				Card card = new Card(c, 0, i);
				deck.push(card);
			}
		
		// Create all the "normal" cards
		for (int c = 0; c < numBaseColors; c++)
			for (int f = 1; f < numBaseFaces; f++)
				for (int i = 0; i < 2; i++) {
					Card card = new Card(c, f, i);
					deck.push(card);
				}
		
		// Create the Reverse Cards
		for (int c = 0; c < numBaseColors; c++)
			for (int i = 0; i < 2; i++) {
				Card card = new Card(c, 10, i);
				deck.push(card);
			}
		
		// Create the Swap Cards
		for (int c = 0; c < numBaseColors; c++)
			for (int i = 0; i < 2; i++) {
				Card card = new Card(c, 11, i);
				deck.push(card);
			}
		
		// Create the Shuffle Cards
		for (int w = 0; w < numWildCards; w++) {
			Card card = new Card(4, 12, w);
			deck.push(card);
		}
		
		// Create the Wild Cards
		for (int w = 0; w < numWildCards; w++) {
			Card card = new Card(4, 13, w);
			deck.push(card);
		}
		
		// Create the Bomb Cards
		for (int c = 0; c < numBaseColors; c++)
			for (int i = 0; i < 2; i++) {
				Card card = new Card(c, 14, i);
				deck.push(card);
					}
		
		Collections.shuffle(deck);
		return deck;
	}
	
	/**
	 * Reshuffles the stack.
	 * @param stack 	This should be the Stack<Card> 'discard pile' of the game.
	 * @return 			A Stack of Cards that has been randomly shuffled.
	 */
	public static Stack<Card> ReshuffleDeck(Stack<Card> stack) {
		Collections.shuffle(stack);
		
		// Go through the stack and reset the cards
		for (Card card : stack)
			card.resetCard();
		
		return stack;
	}
}
