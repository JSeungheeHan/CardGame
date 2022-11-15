package com.csci201;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

class IchiParser {
	
	private Gson gson;
	
	public IchiParser() {
		//Instantiate the gson
		GsonBuilder builder = new GsonBuilder();
		builder.setPrettyPrinting();
		gson = builder.create();
	}
	
	public ClientMessage parseClientMessage(String input) {
		return gson.fromJson(input, ClientMessage.class);
	}
	
	public String stringifyServerMessage(ServerMessage message) {
		return gson.toJson(message);
	}

}

class GameState {
	public int id;
	public List<PlayerInfo> players;
	public List<CardInfo> playedCards;
	public int remainingCards;
	public int currentPlayer;
	public int turnExpiry;
	public int victor;
	public String gameCode;
}

class PlayerInfo {
	public String username;
	public List<CardInfo> hand;
}

class CardInfo {
	public String id;
	/**
	 * "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "reverse" | "swap" | "shuffle" | "wild" | "bomb"
	 */
	public String face;
	/**
	 * "red" | "green" | "blue" | "yellow" | "special"
	 */
	public String color;
	public boolean revealed;
	public boolean selectable;
}

class ClientMessage {
	/**
	 * �createGame� | �joinGame� | �move� | "draw" | "ichi" | "startGame"
	 */
	public String type;
	public String username;
	public String gameCode;
	public int stateId;
	public List<String> data;
}

class ServerMessage {
	public String error;
	public GameState gameState;
}