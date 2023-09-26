# CardGame
 An UNO-inspired card game for CSCI 201's final project.

# To run the backend locally
1. Make sure Apache Tomcat is setup in Eclipse (we did this for a lab earlier in the year)
2. Open this folder (CardGame) as an Eclipse workspace
3. Go to IchiBackend > Properties > Targeted Runtimes, and make sure Apache v9.0 is setup as a runtime. If not, you may need to give it your installation directory. For me, that was "C:\Program Files\Apache Software Foundation\Tomcat 9.0"
4. Press IchiBackend > Run As > Run on Server

# To test the frontend locally
1. Make sure npm is installed
2. In a terminal, navigate to card-game-frontend
3. Run "npm i" to install all required npm modules (these are like libraries)
4. Run "npm run dev" to start the frontend
5. Go to http://localhost:3000

## How to Play

To play, go to the localhost given by the application. First, you either create an account or log in. This user information is stored in the Google Cloud database. You can either create a new lobby to generate a token key, or you can join a pre-existing lobby by entering in a key instead. When 4 players join, the game begins.

<img src = "https://i.imgur.com/wqPHLyL.png" alt = "Ichi Login" height="360">

Each player is given a hand of 4 cards. Then, you take turns playing in a roundabout fashion, similar to Uno. The server will keep track of your progress, and update your win/loss ratio at the end of the game. It also displays information like the date the account was created.

<img src = "https://i.imgur.com/WQ2isxR.gif" alt = "Ichi Draw Cards" height="360">

As a twist on the original game, we changed what the special cards do. +2s and +4s do not exist, and instead, there's the "Shuffle" card (that redraws your entire hand) and the "Bomb" card (that causes the next person to draw from the deck draw 2 extra cards). Our intention was that the bombs would stack up and create a tense game where you're trying not to be the one facing the punishment.

<img src = "https://i.imgur.com/L4aJtXi.gif" alt = "Ichi Draw Cards" height="360">
