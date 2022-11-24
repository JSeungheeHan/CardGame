const prod = false;    //Change this before deploying

let env = {
    gameEndpoint: "ws://localhost:8080/game",
    apiUrl: "http://localhost:8080"
};

if(prod){
    env = {
        gameEndpoint: "wss://backend-dot-ichi-366421.uc.r.appspot.com/game",
        apiUrl: "https://backend-dot-ichi-366421.uc.r.appspot.com"
    }
}

export default env;