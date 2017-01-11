//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi stage and renderer
var stage = new Container(),
    renderer = autoDetectRenderer(512, 512);
document.body.appendChild(renderer.view);

//Load an image and the run the `setup` function
loader
  .add("img/Lotso_Bear.png")
  .load(setup);

//Define any variables that are used in more than one function
var bear, state;

function setup() {

  //Create the `bear` sprite
  bear = new Sprite(resources["img/Lotso_Bear.png"].texture);
  bear.scale.set(0.25,0.25);
  bear.y = 96;
  bear.vx = 0;
  bear.vy = 0;
  stage.addChild(bear);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  //Left arrow key `press` method
  left.press = function() {
    //Change the bear's velocity when the key is pressed
    bear.vx = -5;
    bear.vy = 0;
  };
  //Left arrow key `release` method
  left.release = function() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the bear isn't moving vertically:
    //Stop the bear
    if (!right.isDown && bear.vy === 0) {
      bear.vx = 0;
    }
  };
  //Up
  up.press = function() {
    bear.vy = -5;
    bear.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && bear.vx === 0) {
      bear.vy = 0;
    }
  };
  //Right
  right.press = function() {
    bear.vx = 5;
    bear.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && bear.vy === 0) {
      bear.vx = 0;
    }
  };
  //Down
  down.press = function() {
    bear.vy = 5;
    bear.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && bear.vx === 0) {
      bear.vy = 0;
    }
  };

  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
}

function gameLoop(){

  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  //Update the current game state:
  state();

  //Render the stage
  renderer.render(stage);
}

function play() {

  //Move the bear 1 pixel to the right each frame
  bear.x += bear.vx;
  bear.y += bear.vy;
}

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
