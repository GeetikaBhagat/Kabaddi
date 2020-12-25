var player1, player1Score, pos1, player1Anim;

var player2, player2Score, pos2, player2Anim;

var gameState, database;

function preload() {
  player1Anim = loadAnimation("assests/player1a.png", "assests/player1b.png", "assests/player1a.png");
  player2Anim = loadAnimation("assests/player2a.png", "assests/player2b.png", "assests/player2a.png");
}

function setup() {
  database = firebase.database();
  createCanvas(600, 600);

  player1 = createSprite(150, 300, 10, 10);
  player1.addAnimation("one", player1Anim);
  player1.scale = 0.5
  player1.setCollider("circle", 0, 0, 60)

  var player1PositionRef = database.ref('player1/position');
  player1PositionRef.on("value", function (data) {
    pos1 = data.val();
    player1.x = pos1.x;
    player1.y = pos1.y;
  });

  player2 = createSprite(450, 300, 10, 10);
  player2.addAnimation("two", player2Anim);
  player2.scale = -0.5;
  player2.setCollider("circle", 0, 0, 60);
  player2.debug = true;

  var player2PositionRef = database.ref('player2/position');
  player2PositionRef.on("value", function (data) {
    pos2 = data.val();
    player2.x = pos2.x;
    player2.y = pos2.y;
  });


  gameState = database.ref('gameState/');
  gameState.on("value", function (data) {
    gameState = data.val();
  });

  player1Score = database.ref('player1Score/');
  player1Score.on("value", function (data) {
    player1Score = data.val();
  });

  player2Score = database.ref('player2Score/');
  player2Score.on("value", function (data) {
    player2Score = data.val();
  });
}

function draw() {
  background(190);
  text(mouseX + ", " + mouseY, mouseX, mouseY)
  if (gameState === 0) {
    fill("black");
    textSize(20)
    //fill(100)
    text("Press 'SPACE' to Toss", 200, 180);


    if (keyDown("space")) {
      var rand = Math.round(random(1, 2))
      if (rand === 1) {
        database.ref('/').update({
          'gameState': 1
        })
        alert("RED RIDE");
      }
      if (rand === 2) {
        database.ref('/').update({
          'gameState': 2
        })
        alert("YELLOW RIDE")
      }
      database.ref('player1/position').update({
        'x': 150,
        'y': 300
      })

      database.ref('player2/position').update({
        'x': 450,
        'y': 300
      })

    }

  }

  if (gameState === 1) {

    if (keyDown(LEFT_ARROW)) {
      player1Position(-5, 0);
    }
    else if (keyDown(RIGHT_ARROW)) {
      player1Position(5, 0);
    }
    else if (keyDown(UP_ARROW)) {
      player1Position(0, -5);
    }
    else if (keyDown(DOWN_ARROW)) {
      player1Position(0, +5);
    }
    else if (keyDown("w")) {
      player2Position(0, -5);
    }
    else if (keyDown("d")) {
      player2Position(0, +5);
    }

    if (player1.x > 500) {
      database.ref('/').update({
        'player1Score': player1Score - 5,
        'player2Score': player2Score + 5,
        'gameState': 0

      })
    }

    if (player1.isTouching(player2)) {
      database.ref('/').update({
        'gameState': 0,
        'player1Score': player1Score + 5,
        'player2Score': player2Score - 5
      })
      alert("RED LOST");
    }
  }

  if (gameState === 2) {

    if (keyDown("q")) {
      player2Position(-5, 0);
    }
    else if (keyDown("a")) {
      player2Position(5, 0);
    }
    else if (keyDown("w")) {
      player2Position(0, -5);
    }
    else if (keyDown("s")) {
      player2Position(0, +5);
    }
    else if (keyDown(UP_ARROW)) {
      player1Position(0, -5);
    }
    else if (keyDown(DOWN_ARROW)) {
      player1Position(0, +5);
    }

    if (player2.x < 150) {
      database.ref('/').update({
        'player1Score': player1Score + 5,
        'player2Score': player2Score - 5,
        'gameState': 0,
      })
    }

    if (player1.isTouching(player2)) {
      database.ref('/').update({
        'player1Score': player1Score - 5,
        'player2Score': player2Score + 5,
        'gameState': 0
      })

      alert("YELLOW LOST");
    }
  }
  textSize(15)
  fill('red');
  text("RED: " + player1Score, 350, 15);
  fill('yellow');
  text("YELLOW: " + player2Score, 150, 15);

  line1();
  line2();
  line3();

  drawSprites();
}

function player1Position(x, y) {
  database.ref('player1/position').set({
    'x': pos1.x + x,
    'y': pos1.y + y
  })
}

function player2Position(x, y) {
  database.ref('player2/position').set({
    'x': pos2.x + x,
    'y': pos2.y + y
  })
}



function line1() {
  for (var i = 0; i < 600; i = i + 20) {
    line(300, i, 300, i + 10)
  }
}

function line2() {
  for (var i = 0; i < 600; i = i + 20) {
    stroke("yellow");
    strokeWeight(4)
    line(100, i, 100, i + 10)
  }
}

function line3() {
  for (var i = 0; i < 600; i = i + 20) {
    stroke("red");
    strokeWeight(4);
    line(500, i, 500, i + 10)
  }
}
