const prod = false;    //Change this before deploying

let env = {
    gameEndpoint: "ws://localhost:8080/game"
};

if(prod){
    env = {
        gameEndpoint: "wss://backend-dot-ichi-366421.uc.r.appspot.com/game"
    }
}

export default env;