package com.csci201;

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
		if (color > Color.length || face > Face.length ||
			color < 0 || face < 0) {
			System.out.println("Array OOB in Card Constructor: " + color + " " + face);
			throw new IllegalArgumentException("Card Construction Aborted");
		}
		
		this.color = Color[color];
		this.face = Face[face];
		this.id = this.face + this.color + variant;
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
}
