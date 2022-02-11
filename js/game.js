class Game {
    constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;

    }    
   
    getState() {
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function(data) {
          gameState = data.val();
        });
      }
      update(state) {
        database.ref("/").update({
          gameState: state
        });
      }
    
    start() {
        player = new Player();
        playerCount = player.getCount();
    
         form = new Form();
         form.display();

         boy1 = createSprite(10, height-180);
         boy1.addAnimation("boy1walking",boy1img);
         boy1.scale = 0.5

         
         boy2 = createSprite(10, height-95);
         boy2.addAnimation("boy2walking",boy2img);
         boy2.scale = 0.6

         boys = [boy1,boy2];

        //boys = boy1 + boy2
        


        
         Waters = new Group();
         powerCoins = new Group();

         obstacles = new Group();

         var obstaclesPositions = [
          { x: width/2 + 400, y: height-100, image: obstacle2Image },
          { x: width/2 + 680, y: height-150, image: obstacle1Image },
          { x: width / 2 + 800, y: height-100, image: obstacle1Image },
          { x: width / 2 + 1000, y: height-130, image: obstacle2Image },
          { x: width / 2 + 1180, y: height-200, image: obstacle2Image },
          { x: width / 2 + 1310, y: height-190, image: obstacle1Image },
          { x: width / 2 + 1500, y: height-100, image: obstacle2Image },
          { x: width / 2 + 1800, y: height-150, image: obstacle2Image },
          { x: width / 2 + 1950, y: height-90, image: obstacle1Image },
          { x: width / 2 + 2100, y: height-180, image: obstacle2Image },
          { x: width / 2 + 2200, y: height-120, image: obstacle1Image },
          { x: width / 2 + 2300, y: height-150, image: obstacle2Image },
          { x: width / 2 + 2400, y: height-100, image: obstacle1Image },
          { x: width / 2 + 2600, y: height-180, image: obstacle2Image },
          { x: width / 2 + 2880, y: height-90, image: obstacle1Image },
          { x: width / 2 + 3000, y: height-120, image: obstacle2Image },
          { x: width / 2 + 3300, y: height-180, image: obstacle2Image },
          { x: width / 2 + 3500, y: height-110, image: obstacle2Image },
          { x: width / 2 + 3800, y: height-130, image: obstacle2Image }
        ];

          //Adding fuel sprite in the game
          this.addSprites(Waters, 4, waterImage, 0.1);

           // Adding coin sprite in the game
            this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

            //Adding obstacles sprite in the game
      this.addSprites(
        obstacles,
        obstaclesPositions.length,
        obstacle1Image,
        0.3,
        obstaclesPositions
      );
            
    }

    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
  
        //C41 //SA
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        } else {
         // x = random(width / 2 + 150, width / 2 - 150);
          x = random(width * 4.5, width-200);
          //y = random(height * 4.5, height - 400);
          y = random(height-100, height-150);
        }
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage);
  
        sprite.scale = scale;
        spriteGroup.add(sprite);

        //console.log("i:"+i);
        console.log("y:"+y)

      }
    }
    
    handleElements() {
        form.hide();
        //form.titleImg.position(40, 50);
        //form.titleImg.class("gameTitleAfterEffect");

        this.resetTitle.html("Reset Game");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 + 300, 60);
    
        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 330, 120);

        this.leadeboardTitle.html("Leaderboard");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 200, 40);

        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 190, 80);

        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 190, 130);
    }

    play() {
        this.handleElements();
        this.handleResetButton();
        Player.getPlayersInfo(); 
        player.getBoysAtEnd();

        if (allPlayers !== undefined) {
          image(track, -width*5, 0, width, height); 

          this.showLife();
          this.showWaterBar();

           //index of the array
          var index = 0;

      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the boys in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        boys[index - 1].position.x = x;
        boys[index - 1].position.y = y;

        console.log(boys[index - 1].position.x)

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 30, 30);

          //this.handleFuel(index);
          //this.handlePowerCoins(index);

          // Changing camera position in y direction
          camera.position.x = boys[index - 1].position.x;
        }
      }
          
       // handling keyboard events
        this.handlePlayerControls();

         // Finshing Line
      const finshLine = width * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateBoysAtEnd(player.rank);
        player.update();
        this.showRank();
      }

            drawSprites();
          
          }
    
      }

      handleResetButton() {
        this.resetButton.mousePressed(() => {
          database.ref("/").set({
            playerCount: 0,
            gameState: 0,
            players: {},
            boysAtEnd: 0
          });
          window.location.reload();
        });
      }

      showLife() {
        push();
        image(lifeImage, width  - 1230, height - 10 - 350, 20, 20);
        fill("white");
        rect(width  - 1200, height - 10 - 350, 185, 20);
        fill("#f50057");
        rect(width  - 1200, height - 10 - 350, player.life, 20);
        noStroke();
        pop();
      }

      showWaterBar() {
        push();
        image(waterImage, width  - 1230, height - 10 - 300, 20, 20);
        fill("white");
        rect(width  - 1200, height - 10 - 300, 185, 20);
        fill("#ffc400");
        rect(width  - 1200, height - 10 - 300, player.water, 20);
        noStroke();
        pop();
      }

      showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allboys);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    This tag is used for displaying four spaces.
          leader1 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader2 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
        }
        this.leader1.html(leader1);
        this.leader2.html(leader2);
        
      }


      handleWater(index) {
        // Adding fuel
        boys[index - 1].overlap(Waters, function(collector, collected) {
          player.water = 185;
          //collected is the sprite in the group collectibles that triggered
          //the event
          collected.remove();
        });
    
        // Reducing Player car fuel
        if (player.water > 0 && this.playerMoving) {
          player.water -= 0.3;
        }
    
        if (player.water <= 0) {
          gameState = 2;
          this.gameOver();
        }
      }

      

      handlePowerCoins(index) {
        boys[index - 1].overlap(powerCoins, function(collector, collected) {
          player.score += 21;
          player.update();
          //collected is the sprite in the group collectibles that triggered
          //the event
          collected.remove();
        });
      }

      showRank() {
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
          text: "You reached the finish line successfully",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }

      handlePlayerControls() {
        if (keyIsDown(RIGHT_ARROW)) {
          this.playerMoving = true;
          player.positionX += 10;
          player.update();
        }

        /*if (keyIsDown(UP_ARROW) && player.positionY >= 100 ) {
          //this.playerMoving = true;
          player.positionY -= 5;
          player.update();
        }

        if (keyIsDown(DOWN_ARROW) && player.positionY <= 250) {
          //this.playerMoving = true;
          player.positionY += 5;
          player.update();
        }*/

        if (keyIsDown(UP_ARROW) && player.positionY <= 200 ) {
          //this.playerMoving = true;
          player.positionY += 5;
          player.update();
        }

        if (keyIsDown(DOWN_ARROW) && player.positionY >= 60 ) {
          //this.playerMoving = true;
          player.positionY -= 5;
          player.update();
        }
      }
    

    }
