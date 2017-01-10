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

//This `setup` function will run when the image has loaded
function setup() {

  //Create the sprite from the texture
  var bear = new PIXI.Sprite(
    PIXI.loader.resources["img/Lotso_Bear.png"].texture
  );

  //Add the sprite to the stage
  stage.addChild(bear);

  //Tell the `renderer` to `render` the `stage`
  renderer.render(stage);
}
