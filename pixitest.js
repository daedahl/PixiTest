//Create the renderer
var renderer = PIXI.autoDetectRenderer(512, 512);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

//Use Pixi's built-in `loader` object to load an image
PIXI.loader
  .add("img/Lotso_Bear.png")
  .load(setup);

var bear;

//This `setup` function will run when the image has loaded
function setup() {

  //Create the sprite from the texture
  bear = new PIXI.Sprite(
    PIXI.loader.resources["img/Lotso_Bear.png"].texture
  );

  //Initialize the bear's velocity variables
  bear.vx = 0;
  bear.vy = 0;

  //Adjust the sprite's size and position
  bear.scale.set(0.25, 0.25);
  bear.position.set(90,90);

  //Add the sprite to the stage
  stage.addChild(bear);

  //Start the game loop
  gameLoop();
}

function gameLoop() {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);

  //Update the cat's velocity
  bear.vx = 1;
  bear.vy = 1;

  //Apply the velocity values to the cat's
  //position to make it move
  bear.x += bear.vx;
  bear.y += bear.vy;

  //Render the stage to see the animation
  renderer.render(stage);
}
