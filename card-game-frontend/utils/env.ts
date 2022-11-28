const prod = true;    //Change this before deploying

let env = {
    gameEndpoint: "ws://localhost:8080/game",
    apiUrl: "http://localhost:8080"
};

if(prod){
    env = {
        gameEndpoint: "wss://backend-dot-ichiwest.wl.r.appspot.com/game",
        apiUrl: "https://backend-dot-ichiwest.wl.r.appspot.com"
    }
}

export default env;