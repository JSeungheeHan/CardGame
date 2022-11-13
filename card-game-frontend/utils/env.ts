const prod = false;    //Change this before deploying

let env = {
    gameEndpoint: "ws://localhost:43213/IchiBackend/game"
};

if(prod){
    env = {
        gameEndpoint: "ws://ichi-backend-dot-ichi-366421.uc.r.appspot.com/IchiBackend/game"
    }
}

export default env;