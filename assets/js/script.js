function fncStart(oldHighScore) {

    $("#showBoard").hide();

    $("#backgroundGame").append("<div id='player'  class='clPlayer'></div>");
    $("#backgroundGame").append("<div id='enemy1' class='clEnemy1'></div>");
    $("#backgroundGame").append("<div id='enemy2' class='clEnemy2'></div>");
    $("#backgroundGame").append("<div id='friend' class='clFriend'></div>");
    $("#backgroundGame").append("<div id='bluebat' class='clBluebat'></div>");
    $("#backgroundGame").append("<div id='score' class='textScore'></div>");
    $("#backgroundGame").append("<div id='scoreValue' class='textScore'></div>");
    $("#backgroundGame").append("<div id='saveFriend' class='textScore'></div>");
    $("#backgroundGame").append("<div id='saveFriendValue' class='textScore'></div>");
    $("#backgroundGame").append("<div id='highScore' class='textScore'></div>");
    $("#backgroundGame").append("<div id='highScoreValue' class='textScore'></div>");
    $("#backgroundGame").append("<div id='life' class='textScore'></div>");
    $("#backgroundGame").append("<div id='jackImg'</div>");
    
    /// VARIAVEIS DE TESTE
    var varCounter = 1;


    //Variables
    // Enemy
    const areaGameSize = parseInt($("#backgroundGame").width());
	const enemy1Size = parseInt($("#enemy1").width());
	const enemy2Size = parseInt($("#enemy2").width());
    const notShotEnemy1 = 2; // number of times the enemy passed without being hit

    var randomPosition = parseInt(Math.random() * (486 - 50)) + 50;
    var enemy1Position = parseInt(areaGameSize - enemy1Size);
    var enemy2Position = parseInt(areaGameSize - enemy2Size);
    var unkilledEnemy1 = 0;
    
    var restartTimeEnemy1 = 1000;  // time to restart enemy 1 (1 second)
    var restartTimeEnemy2 = 5000;  // time to restart enemy 2
    
    var initialSpeed = 5
    var increasesEnemy1Speed = 0.1;
    var increasesEnemy2Speed = 0;

     // Shooting
    var shotLimit = 1050;  // max left shot
    
    var ableShooting = true;
    var endGame = false;
    
    // Points
    var points = 0; // initial points
    var highScore = oldHighScore;
    var pointsToKillEnemy1 = 100; // points for killing enemy 1
    var pointsToKillEnemy2 = 50;  // points for killing enemy 2
    var extraPointsBlueBat = 555; // Special points to catch Blue Bat
    
    // Missile
    var ableMissile = true;
    var missileSpeed = 2; // missile displacement speed

    // Friend
    var savedFriends = 0;    // friend saved by player
    var friendLimit = 1000;  // max px left
    var restartTime = 700;   // time in ms to restart friend
    
    //Bluebat
    var vooFront = true;  // controls the side of the Bluebat movement
    var subir = 0;
    
    // Explosion
    var timeToRemoveExplosive = 2000; // remove explosive (ms)

    // Lifes
    var atualLife = 3;
    var bonusExtraLife = 10;

    //var perdidos = 0;

    var gameKey = {}
    var TECLA = {
		ArrowUp: 38,
		ArrowDown: 40,
		Space: 32
	}

    gameKey.pressed  = [];

    var gunshotSound = document.getElementById("gunshotSound");
    var explosionSound = document.getElementById("explosionSound");
    var soundEffect = document.getElementById("soundEffect");
    var gameOverSound = document.getElementById("gameOverSound");
    var friendDieSound = document.getElementById("friendDieSound");
    var rescueSound = document.getElementById("rescueSound");

    //Música em loop
    soundEffect.addEventListener("ended", function () {
        soundEffect.currentTime = 0;
        //soundEffect.play();
    }, false);
    //soundEffect.play();
    
    //Verifica se o usuário pressed  alguma tecla	
    $(document).keydown(function (e) {
        gameKey.pressed [e.which] = true;
    });

    $(document).keyup(function (e) {
        gameKey.pressed [e.which] = false;
    });

    //Game Loop
    gameKey.timer = setInterval(loop, 30);

    // Console.Log - small
    function cl(param){
		console.log(param);
	}

    function loop() {

        fncMoveBackground();
        fncMovePlayer();
        fncMoveEnemy1();
        fncMoveEnemy2();
        fncMoveFriend();
        fncMoveBlubat();
        fncCollision();
        fncScore();
        fncEnergyBar();
    }

    function fncMoveBackground() {
        let leftPosition = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", leftPosition - 1);
    }

    function fncMovePlayer() {
        if (gameKey.pressed [TECLA.ArrowUp]) {
            let playerUP = parseInt($("#player").css("top"));
            $("#player").css("top", playerUP - 10);
            if (playerUP <= 0) {
                $("#player").css("top", playerUP + 10);
            }
        }

        if (gameKey.pressed [TECLA.ArrowDown]) {
            let playerDown = parseInt($("#player").css("top"));
            $("#player").css("top", playerDown + 10);
            if (playerDown >= 450) {
                $("#player").css("top", playerDown - 10);
            }
        }

        if (gameKey.pressed [TECLA.Space]) {
            fncShooting();
        }
    }

    // Move Enemy 1
    function fncMoveEnemy1() {
        let leftEnemy1 = parseInt($("#enemy1").css("left"));

        $("#enemy1").css("left", leftEnemy1 - initialSpeed);
        $("#enemy1").css("top", randomPosition);
        if (leftEnemy1 <= 0) {
            unkilledEnemy1++;
            randomPosition = parseInt(Math.random() * (486 - 50)) + 50;
            $("#enemy1").css("left", enemy1Position);
            $("#enemy1").css("top", randomPosition);
            if (unkilledEnemy1 > notShotEnemy1 && ableMissile) {
                ableMissile = false
                fncMoveMissile();
            }
        }
    }
 
    // Move Enemy 2
    function fncMoveEnemy2() {
        let leftEnemy2 = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left", leftEnemy2 - 5);
        if (leftEnemy2 <= 0) {
            $("#enemy2").css("left", enemy2Position);
        }
    }
 
    // Move friend
    function fncMoveFriend() {
        let leftFriend = parseInt($("#friend").css("left"));
        $("#friend").css("left", leftFriend + 1);

        if (leftFriend > friendLimit) {
            $("#friend").css("left", 0);
        }

    }
 
    // Move BlueBat 
    function fncMoveBlubat() {

        let leftBluebat = parseInt($("#bluebat").css("left"));
        let topBluebat = parseInt($("#bluebat").css("top"));
        
        if (varCounter++ < 2){
            console.log("Top: " ,topBluebat)
        }

        if (vooFront){
            $("#bluebat").css('left', leftBluebat + 1);
            $("#bluebat").css('transform', 'scaleX(-1)');
        } else {
            $("#bluebat").css('transform', 'scaleX(1)');
            $("#bluebat").css('left', leftBluebat - 1.8);
        }
        //$("#bluebat").css('top', subir+=5)

        if (leftBluebat > 1030){
            vooFront = false;
        } else if (leftBluebat < 800){
            vooFront = true;
        }
    }

    // Shooting
    function fncShooting() {
        if (ableShooting == true) {
            gunshotSound.play();
            ableShooting = false;

            let topPlayer = parseInt($("#player").css("top"))
            let leftPlayer = parseInt($("#player").css("left"))

            let shotX = leftPlayer + 68;
            let topShot = topPlayer + 65;

            $("#backgroundGame").append("<div id='shot'></div");
            $("#shot").css("top", topShot);
            $("#shot").css("left", shotX);

            var timeToShot = window.setInterval(shotNow, 30);
        }

        // Executa disparo
        function shotNow() {
            let leftShot = parseInt($("#shot").css("left"));
            $("#shot").css("left", leftShot + 15);

            if (leftShot > shotLimit) {

                window.clearInterval(timeToShot);
                timeToShot = null;
                $("#shot").remove();
                ableShooting = true;
            }
        }
    }

    function fncCollision() {
        var collision01 = ($("#player").collision($("#enemy1")));
        var collision02 = ($("#player").collision($("#enemy2")));
        var collision03 = ($("#shot").collision($("#enemy1")));
        var collision04 = ($("#shot").collision($("#enemy2")));
        var collision05 = ($("#player").collision($("#friend")));
        var collision06 = ($("#enemy2").collision($("#friend")));
        var collision07 = ($("#bluebat").collision($("#friend")));
        var collision08 = ($("#missile").collision($("#friend")));
        var collision09 = ($("#missile").collision($("#player")));
        var collision10 = ($("#enemy1").collision($("#friend")));

        // player com o enemy1
        if (collision01.length > 0) {
            atualLife--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            fncExplosion1(enemy1X, enemy1Y);

            randomPosition = parseInt(Math.random() * (486 - 50)) + 50;
            $("#enemy1").css("left", enemy1Position);
            $("#enemy1").css("top", randomPosition);
        }

        // player com o enemy2 
        if (collision02.length > 0) {
            atualLife--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            fncExplosion2(enemy2X, enemy2Y);

            $("#enemy2").remove();
            $("#player").remove();
            restartEnemy2();
            fncRestartPlayer();
        }

        // Shot and enemy1
        if (collision03.length > 0) {
            initialSpeed = initialSpeed + increasesEnemy1Speed;
            points += pointsToKillEnemy1;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            $("#enemy1").remove();

            fncExplosion1(enemy1X, enemy1Y);
            $("#shot").css("left", shotLimit);

            fncRestartEnemy1();
        }

        // Shot and enemy2
        if (collision04.length > 0) {
            initialSpeed += increasesEnemy2Speed;
            points += pointsToKillEnemy2;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();

            fncExplosion2(enemy2X, enemy2Y);
            $("#shot").css("left", shotLimit);
            restartEnemy2();
        }

        // player and friend
        if (collision05.length > 0) {

            savedFriends++;

            rescueSound.play();
            fncRestartFriend();
            $("#friend").remove();
        }

        //Enemy 2 and friend
        if (collision06.length > 0) {

            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            
            fncFriendDie(friendX, friendY);
            $("#friend").remove();

            fncRestartFriend();

        }
        
        //Friend and BlueBat
        if (collision07.length > 0) {
            
            points += extraPointsBlueBat;
            bluebatX = parseInt($("#bluebat").css("left"));
            bluebatY = parseInt($("#bluebat").css("top"));
            
            fncExplosion3(bluebatX, bluebatY);
            $("#bluebat").remove();
            $('#friend').remove();
            fncRestartFriend();
        }
        
        //Friend and missile
        if (collision08.length > 0) {
            
            // perdidos++;
            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            
            $("#missile").remove()
            ableMissile = true // after remove missile, able to new attach
            fncFriendDie(friendX, friendY);
            $("#friend").remove();
            
            fncRestartFriend();
        }
        
        //Player and missile
        if (collision09.length > 0) {
            
            atualLife--;
            playerX = parseInt($("#player").css("left"));
            playerY = parseInt($("#player").css("top"));
            
            $("#missile").remove();
            $("#player").remove();
            
            ableMissile = true // after remove missile, able to new attach
            fncExplosion1(playerX, playerY);
            fncRestartPlayer();
        }

        //Enemy 1 and friend
        if (collision10.length > 0) {

            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            
            fncFriendDie(friendX, friendY);
            $("#friend").remove();

            fncRestartFriend();

        }
    }

    //Explosion 1
    function fncExplosion1(enemy1X, enemy1Y) {
        explosionSound.play();
        $("#backgroundGame").append("<div id='explosive1'></div");
        $("#explosive1").css("background-image", "url(/assets/img/explosion.png)");
        var div = $("#explosive1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({
            width: 200,
            opacity: 0
        }, "slow");

        let timeExplosion = window.setInterval(restart, timeToRemoveExplosive);

        function restart() {
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }
    
    // Restart Enemy 1
    function fncRestartEnemy1() {
        let timeCollision = window.setInterval(restart, restartTimeEnemy1);

        function restart() {
            window.clearInterval(timeCollision);
            timeCollision = null;
            randomPosition = parseInt(Math.random() * (486 - 50)) + 50;
            if (endGame == false) {
                $("#backgroundGame").append("<div id='enemy1' class='clEnemy1'></div>");
            }
        }
    }

    // Restart Enemy 2
    function restartEnemy2() {

        let timeCollision = window.setInterval(restart, restartTimeEnemy2);

        function restart() {
            window.clearInterval(timeCollision);
            timeCollision = null;
            if (endGame == false) {
                $("#backgroundGame").append("<div id='enemy2' class='clEnemy2'></div>");
            }
        }
    }
    
    // Explosion 2
    function fncExplosion2(enemy2X, enemy2Y) {

        explosionSound.play();

        $("#backgroundGame").append("<div id='explosive2'></div");
        $("#explosive2").css("background-image", "url(/assets/img/explosion.png)");
        var div2 = $("#explosive2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({
            width: 200,
            opacity: 0
        }, "slow");

        let timeExplosion = window.setInterval(restart, timeToRemoveExplosive);
          
        function restart() {
            div2.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }

    // Explosion 3
    function fncExplosion3(bluebatX, bluebatY) {

        explosionSound.play();

        $("#explosive3").css("background-image", "url(/assets/img/explosion.png)");
        var div3 = $("#explosive3");
        div3.css("top", bluebatY - 80);
        div3.css("left", bluebatX - 150);
        div3.animate({
            width: 400,
            opacity: 0
        }, 1500);

        let timeExplosion = window.setInterval(restart, timeToRemoveExplosive);

        function restart() {
            div3.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }

    // Restart Player
    function fncRestartPlayer(){
        $("#backgroundGame").append("<div id='player'  class='clPlayer'></div>");
    }

    // Restart friend
    function fncRestartFriend() {

        let timeToRestart = window.setInterval(restart, 3000);

        function restart() {
            window.clearInterval(timeToRestart);
            timeToRestart = null;
            if (endGame == false) {
                if(!$("#friend").length){
                    $("#backgroundGame").append("<div id='friend' class='clFriend'></div>");
                }
                if(!$("#bluebat").length){
                    $("#backgroundGame").append("<div id='bluebat' class='clBluebat'></div>");
                }
            }
        }
    }

    // Friend dying
    function fncFriendDie(friendX, friendY) {
        friendDieSound.play();
        $("#backgroundGame").append("<div id='friendDie' class='friendDying'></div");
        $("#friendDie").css("top", friendY);
        $("#friendDie").css("left", friendX);
        let timeExplosion = window.setInterval(restart, restartTime);

        function restart() {
            $("#friendDie").remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }

    // Score
    function fncScore() {
        $("#score").html("SCORE");
        $("#scoreValue").html(points );
        $("#saveFriend").html("FRIEND");
        $("#saveFriendValue").html(savedFriends );
        $("#highScore").html("HIGH SCORE");
        if (highScore < points){
            highScore = points;
        }
        $("#highScoreValue").html(highScore);
    }

    // EnergyBar
    function fncEnergyBar() {

        if (savedFriends >= bonusExtraLife){
            if (atualLife < 3){
                atualLife++;
                savedFriends = savedFriends - bonusExtraLife;
            }
        }
        if (unkilledEnemy1 > notShotEnemy1){
            if (savedFriends > 1) {
                savedFriends--;
            }
        }

        switch (atualLife){
            case 3:
                $('#jackImg').width(130);
                break;
            case 2:
                $('#jackImg').width(90);
                break;
            case 1:
                $('#jackImg').width(45);
                break;
            case 0:
                $('#jackImg').width(45);
                $("#jackImg").css('transform', 'rotate(-90deg)');
                $('#jackImg').css('background-image', 'url(/assets/img/jackDead.png)');
                gameOver();
        }
    }

    // Missile
    function fncMoveMissile() {

        if (unkilledEnemy1 > notShotEnemy1) {
            unkilledEnemy1 = 0; 
            gunshotSound.play();

            topEnemyMissile = parseInt($("#enemy1").css("top"))
            positionLeftEnemy1 = parseInt($("#enemy1").css("left"))
            $("#backgroundGame").append("<div id='missile' class='missile'></div");
            $("#missile").css("top", topEnemyMissile);
            $("#missile").css("left", positionLeftEnemy1);

            var timeToShot = window.setInterval(shotNow, 30);
        }

        // Shooting
        function shotNow() {
            xAxis = parseInt($("#missile").css("left"));
            yAxis = parseInt($("#missile").css("top"));

            if (yAxis > 480){ 
                $("#missile").css('transform', 'rotate(180deg)')
                $("#missile").css("left", xAxis - missileSpeed);
            } else {
                $("#missile").css("top", yAxis + missileSpeed);
            }

            if (xAxis <= 0) {
                window.clearInterval(timeToShot);
                timeToShot = null;
                $("#missile").remove();
                ableMissile = true
            }
        }
    }

    //GAME OVER
    function gameOver() {
        endGame = true;
        soundEffect.pause();
        gameOverSound.play();

        window.clearInterval(gameKey.timer);
        gameKey.timer = null;

        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();
        $("#bluebat").remove();
        $("#missile").remove();

        while (true){
            if ($("#showBoard").length){
                $("#showBoard").remove();
            } else if ($("#explosive1").length) {
                $("#explosive1").remove();
            } else {
                break;
            }
        }

        $("#backgroundGame").append("<div id='showBoard'><div id='showBoardText'></div></div>");

        highScore = oldHighScore > points ? oldHighScore : points;
        $("#showBoardText").html("<div class='title'><p>Game Over</p></div>" +
        "<div class='showBoardText'><p>High Score " + highScore + "<br> Score " + points + "</p></div>" + 
        "<div class='textPlay' onClick=fncRestartGame(" + highScore + ")><p>Play again</p></div>");

    }
}

//Restart Game
function fncRestartGame(score) {
    gameOverSound.pause();
    $("#jackImg").remove();
    $("#showBoard").remove();
    fncStart(score);
}