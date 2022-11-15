package com.csci201;
public class TurnTimerThread extends Thread {
	
	private GameServer gameServer;
	private int expireTime;
	
	public TurnTimerThread(GameServer gameServer, int expireTime) {
		this.gameServer = gameServer;
		this.expireTime = expireTime;
	}

	public void run() {
		//Figure out how long to wait
		long expireTimeMs = ((long)expireTime) * 1000L;
		long currentTimeMs = System.currentTimeMillis();
		long waitTime = expireTimeMs - currentTimeMs;
		try {
			//Wait until the turn is over
			if(waitTime > 0) {
				sleep(waitTime);
			}
			
			//If we get this far without being interrupted, the turn must have expired without a move
			gameServer.timerExpire();
		}catch(InterruptedException e) {
			//This is meant to happen most of the time, so just don't do anything
		}
	}
	
	

}
