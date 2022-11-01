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