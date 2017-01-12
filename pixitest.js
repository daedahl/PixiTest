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
  bear.accelerationX = 0;
  bear.accelerationY = 0;
  bear.frictionX = 1;
  bear.frictionY = 1;
  bear.speed = 0.2;
  bear.drag = 0.98;
  stage.addChild(bear);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  //Left arrow key `press` method
  left.press = function() {
    //Change the bear's velocity when the key is pressed
    bear.accelerationX = -bear.speed;
    bear.frictionX = 1;
  };
  //Left arrow key `release` method
  left.release = function() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the bear isn't moving vertically:
    //Slow the bear
    if (!right.isDown) {
      bear.accelerationX = 0;
      bear.frictionX = bear.drag;
    }
  };
  //Up
  up.press = function() {
    bear.accelerationY = -bear.speed;
    bear.frictionY = 1;
  };
  up.release = function() {
    if (!down.isDown) {
      bear.accelerationY = 0;
      bear.frictionY = bear.drag;
    }
  };
  //Right
  right.press = function() {
    bear.accelerationX = bear.speed;
    bear.frictionX = 1;
  };
  right.release = function() {
    if (!left.isDown) {
      bear.accelerationX = 0;
      bear.frictionX = bear.drag;
    }
  };
  //Down
  down.press = function() {
    bear.accelerationY = bear.speed;
    bear.frictionY = 1;
  };
  down.release = function() {
    if (!up.isDown) {
      bear.accelerationY = 0;
      bear.frictionY = bear.drag;
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

  //Apply acceleration by adding the acceleration to the sprite's velocity
  bear.vx += bear.accelerationX;
  bear.vy += bear.accelerationY;

  //Apply friction by multiplying sprite's veloctiy by the frictionY
  bear.vx *= bear.frictionX;
  bear.vy *= bear.frictionY;

  //Gravity as a constant downwards force
  bear.vy += 0.1;

  //Apply the veloctiy to the sprite's position to make it move
  bear.x += bear.vx;
  bear.y += bear.vy;

  let collision = contain(
    bear,
    {
      x: 0,
      y: 0,
      width: renderer.view.width,
      height: renderer.view.height
    }
  );

  //Check for a collision. If the value of 'collision' isn't 'undefined' the sprite hit a boundry
  if (collision) {

    //Reverse the sprite's 'vx' if it hits left or right
    if (collision.has("leftside") || collision.has("rightside")){
      bear.vx = -bear.vx;
    }

    //Reverse the sprite's 'vy' if it hits topside or bottomside
    if (collision.has("topside") || collision.has("bottomside")){
      bear.vy = -bear.vy;
    }
  }
}

function contain(sprite, container) {

  //Create a 'Set' called 'collision' to track boundries
  var collision = new Set();

  //Leftside
  //If the sprite's x position is less than the container's, move it inside and add "leftside" to set
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision.add("leftside");
  }

  //Topside
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision.add("topside");
  }

  //Rightside
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision.add("rightside");
  }

  //Bottomside
  if (sprite.y +sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision.add("bottomside");
  }

  //If no collisions, set 'collision' to 'undefined'
  if (collision.size === 0) collision = undefined;

  return collision;
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
