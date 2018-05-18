const GAME_CONFIG = {
  FPS            : 15,
  SCREEN_WIDTH   : 360,
  SCREEN_HEIGHT  : 360,
  FIELD_IMAGES   : "images/map0.png",
  FIELD_WIDTH    : 16,
  FIELD_HEIGHT   : 16,
  PLAYER_IMAGE   : "images/garbage_collector.png",
  PLAYER_WIDTH   : 32,
  PLAYER_HEIGHT  : 32,
  GARBAGE_IMAGE  : "images/garbage.png",
  GARBAGE_WIDTH  : 32,
  GARBAGE_HEIGHT : 32,
  COUNTDOWN_SEC  : 3,
  TIME_LIMIT     : 60,
  SCORE_POINTS   : 10
};
const PRELOAD_IMAGES = [
  GAME_CONFIG.FIELD_IMAGES,
  GAME_CONFIG.PLAYER_IMAGE,
  GAME_CONFIG.GARBAGE_IMAGE
];
const GARBAGE_PROBABILITY = 1 / (GAME_CONFIG.FPS * 5);


enchant();
window.onload = function() {
  var game = new Game(GAME_CONFIG.SCREEN_WIDTH, GAME_CONFIG.SCREEN_HEIGHT);
  game.preload(PRELOAD_IMAGES);
  game.frame = GAME_CONFIG.FPS;

  game.onload = function() {
    game.pushScene(generateStartScene());
  }

  game.start();

  function generateStartScene() {
    var scene = new Scene();
    var label = new Label("Press space key!");
    label.font = "bold 16pt monospace";
    label.x = (scene.width - label._boundWidth) / 2;
    label.y = (scene.height - label._boundHeight) / 2;
    scene.addChild(label);

    game.keybind(32, "space");
    game.addEventListener("spacebuttondown", function() {
      scene = null;
      game.clearEventListener("spacebuttondown");
      game.replaceScene(generateCountdownScene());
    });

    return scene;
  }

  function generateCountdownScene() {
    const start_frame = game.frame;

    var scene = new Scene();
    var label = new Label(GAME_CONFIG.COUNTDOWN_SEC);
    label.font = "bold 16pt monospace";
    label.x = (scene.width - label._boundWidth) / 2;
    label.y = (scene.height - label._boundHeight) / 2;
    scene.addChild(label);

    game.score = 0;
    game.addEventListener(enchant.Event.ENTER_FRAME, function() {
      var progress = (game.frame - start_frame) / game.fps;

      if(progress < GAME_CONFIG.COUNTDOWN_SEC) {
        label.text = Math.ceil(GAME_CONFIG.COUNTDOWN_SEC - progress);
      } else {
        scene = null;
        game.clearEventListener(enchant.Event.ENTER_FRAME);
        game.replaceScene(generateGameScene());
      }
    });

    return scene;
  }

  function generateGameScene() {
    const start_frame = game.frame;
    const field_map  = [
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
      [ 0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0, 10, 10,  0,  0,  0],
    ];
    const collision_map = [
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
    ];

    var scene = new Scene();

    var remain_label = new Label(`${GAME_CONFIG.TIME_LIMIT}s remains.`);
    remain_label.font = "bold 12pt monospace";
    remain_label.moveTo(20, 20);

    var result_label = new Label(`${game.score} points`);
    result_label.font = "bold 14pt monospace";
    result_label.color = "#0000ff";
    result_label.x = scene.width - result_label._boundWidth - 20;
    result_label.y = 10;

    var field = new Map(GAME_CONFIG.FIELD_WIDTH, GAME_CONFIG.FIELD_HEIGHT);
    field.image = game.assets[GAME_CONFIG.FIELD_IMAGES];
    field.loadData(field_map);
    field.collisionData = collision_map;
    field.x = (scene.width - field.width) / 2;
    field.y = (scene.height - field.height) / 2;

    var collector = new Sprite(GAME_CONFIG.PLAYER_WIDTH, GAME_CONFIG.PLAYER_HEIGHT);
    collector.image = game.assets[GAME_CONFIG.PLAYER_IMAGE];
    collector.x = field.x + GAME_CONFIG.FIELD_WIDTH * 3;
    collector.y = field.y + GAME_CONFIG.FIELD_HEIGHT * 3;

    var garbages = [];

    scene.addChild(remain_label);
    scene.addChild(result_label);
    scene.addChild(field);
    scene.addChild(collector);

    game.addEventListener(enchant.Event.ENTER_FRAME, function() {
      var progress = (game.frame - start_frame) / game.fps;
      if(progress < GAME_CONFIG.TIME_LIMIT) {
        var remain = Math.floor(GAME_CONFIG.TIME_LIMIT - progress);
        remain_label.text = `${remain}s remains.`;

        if(Math.random() < GARBAGE_PROBABILITY) {
          do {
            var x = field.x + (field.tileWidth * Math.floor(Math.random() * (field_map[0].length - 1)));
            var y = field.y + (field.tileHeight * Math.floor(Math.random() * (field_map.length - 1)));
          } while(field.hitTest(x - field.x, y - field.y)
                    || field.hitTest(x + GAME_CONFIG.GARBAGE_WIDTH - field.x - 1, y + GAME_CONFIG.GARBAGE_HEIGHT - field.y - 1));

          var garbage = new Sprite(GAME_CONFIG.GARBAGE_WIDTH, GAME_CONFIG.GARBAGE_HEIGHT);
          garbage.image = game.assets[GAME_CONFIG.GARBAGE_IMAGE];
          garbage.moveTo(x, y);
          garbages.push(garbage);
          scene.addChild(garbage);
        }
      } else {
        scene = null;
        game.clearEventListener(enchant.Event.ENTER_FRAME);
        game.replaceScene(generateResultScene());
      }

      if(game.input.left) {
        var left = collector.x - field.tileWidth;
        if(left >= field.x
             && !field.hitTest(left - field.x, collector.y - field.y)
             && !field.hitTest(left - field.x, collector.y + collector.height - field.y - 1)) {
          collector.x = left;
        }
      }

      if(game.input.right) {
        var right = collector.x + field.tileWidth;
        if(right <= field.x + field.width - collector.width
             && !field.hitTest(right + collector.width - field.x, collector.y - field.y)
             && !field.hitTest(right + collector.width - field.x, collector.y + collector.height - field.y - 1)) {
          collector.x = right;
        }
      }

      if(game.input.up) {
        var up = collector.y - field.tileHeight;
        if(up >= field.y
             && !field.hitTest(collector.x - field.x, up - field.y)
             && !field.hitTest(collector.x + collector.width - field.x - 1, up - field.y)) {
          collector.y = up;
        }
      }

      if(game.input.down) {
        var down = collector.y + field.tileHeight;
        if(down <= field.y + field.height - collector.height
             && !field.hitTest(collector.x - field.x, down + collector.height - field.y)
             && !field.hitTest(collector.x + collector.width - field.x - 1, down + collector.height - field.y)) {
          collector.y = down;
        }
      }

      for(var i in garbages) {
        if(collector.intersect(garbages[i])) {
          scene.removeChild(garbages[i]);
          garbages[i] = null;
          garbages.splice(i, 1);
          game.score += GAME_CONFIG.SCORE_POINTS;
          result_label.text = `${game.score} points`;
        }
      }
    });

    return scene;
  }

  function generateResultScene() {
    var scene = new Scene();
    var result_label = new Label(`result: ${game.score} points`);
    result_label.font = "bold 16pt monospace";
    result_label.x = (scene.width - result_label._boundWidth) / 2;
    result_label.y = (scene.height - result_label._boundHeight) / 2;

    var retry_label = new Label("Press space to retry.");
    retry_label.font = "normal 14pt monospace";
    retry_label.x = (scene.width - result_label._boundWidth) / 2;
    retry_label.y = result_label.y + result_label._boundHeight + 30;

    scene.addChild(result_label);
    scene.addChild(retry_label);

    game.addEventListener("spacebuttondown", function() {
      scene = null;
      game.clearEventListener("spacebuttondown");
      game.replaceScene(generateCountdownScene());
    });

    return scene;
  }

}
