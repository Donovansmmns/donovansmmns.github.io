

GameEngine = Class.extend({
  tileSize: 32,
  tilesX: 17,
  tilesY: 13,
  size: {},
  fps: 50,
  botsCount: 2, /* 0 - 3 */
  playersCount: 2, /* 1 - 2 */
  bonusesPercent: 16,

  stage: null,
  menu: null,
  players: [],
  bots: [],
  tiles: [],
  bombs: [],
  bonuses: [],

  playerBoyImg: null,
  playerGirlImg: null,
  playerGirl2Img: null,
  tilesImgs: {},
  bombImg: null,
  fireImg: null,
  bonusesImg: null,

  playing: false,
  mute: false,
  soundtrackLoaded: false,
  soundtrackPlaying: false,
  soundtrack: null,

  init: function() {
      this.size = {
          w: this.tileSize * this.tilesX,
          h: this.tileSize * this.tilesY
      };
  },

  load: function() {
      // Init canvas
      this.stage = new createjs.Stage("canvas");
      this.stage.enableMouseOver();

      // Load assets
      let queue = new createjs.LoadQueue();
      let that = this;
      queue.addEventListener("complete", function() {
          that.playerBoyImg = queue.getResult("playerBoy");
          that.playerGirlImg = queue.getResult("playerGirl");
          that.playerGirl2Img = queue.getResult("playerGirl2");
          that.tilesImgs.grass = queue.getResult("tile_grass");
          that.tilesImgs.wall = queue.getResult("tile_wall");
          that.tilesImgs.wood = queue.getResult("tile_wood");
          that.bombImg = queue.getResult("bomb");
          that.fireImg = queue.getResult("fire");
          that.bonusesImg = queue.getResult("bonuses");
          that.setup();
      });
      queue.loadManifest([
          {id: "playerBoy", src: "img/george.png"},
          {id: "playerGirl", src: "img/betty.png"},
          {id: "playerGirl2", src: "img/betty2.png"},
          {id: "tile_grass", src: "img/tile_grass.png"},
          {id: "tile_wall", src: "img/tile_wall.png"},
          {id: "tile_wood", src: "img/tile_wood.png"},
          {id: "bomb", src: "img/bomb.png"},
          {id: "fire", src: "img/fire.png"},
          {id: "bonuses", src: "img/bonuses.png"}
      ]);

      createjs.Sound.addEventListener("fileload", this.onSoundLoaded);
      createjs.Sound.alternateExtensions = ["mp3"];
      createjs.Sound.registerSound("sound/bomb.ogg", "bomb");
      createjs.Sound.registerSound("sound/game.ogg", "game");

      // Create menu
      this.menu = new Menu();
  },

  setup: function() {
      if (!gInputEngine.bindings.length) {
          gInputEngine.setup();
      }

      this.bombs = [];
      this.tiles = [];
      this.bonuses = [];

      // Draw tiles
      this.drawTiles();
      this.drawBonuses();

      this.spawnBots();
      this.spawnPlayers();

      // Toggle sound
      gInputEngine.addListener('mute', this.toggleSound);

      // Restart listener
      // Timeout because when you press enter in address bar too long, it would not show menu
      setTimeout(function() {
          gInputEngine.addListener('restart', function() {
              if (gGameEngine.playersCount == 0) {
                  gGameEngine.menu.setMode('single');
              } else {
                  gGameEngine.menu.hide();
                  gGameEngine.restart();
              }
          });
      }, 200);

      // Escape listener
      gInputEngine.addListener('escape', function() {
          if (!gGameEngine.menu.visible) {
              gGameEngine.menu.show();
          }
      });

      // Start loop
      if (!createjs.Ticker.hasEventListener('tick')) {
          createjs.Ticker.addEventListener('tick', gGameEngine.update);
          createjs.Ticker.setFPS(this.fps);
      }

      if (gGameEngine.playersCount > 0) {
          if (this.soundtrackLoaded) {
              this.playSoundtrack();
          }
      }

      if (!this.playing) {
          this.menu.show();
      }
  },

  onSoundLoaded: function(sound) {
      if (sound.id == 'game') {
          gGameEngine.soundtrackLoaded = true;
          if (gGameEngine.playersCount > 0) {
              gGameEngine.playSoundtrack();
          }
      }
  },

  playSoundtrack: function() {
      if (!gGameEngine.soundtrackPlaying) {
          gGameEngine.soundtrack = createjs.Sound.play("game", "none", 0, 0, -1);
          gGameEngine.soundtrack.setVolume(1);
          gGameEngine.soundtrackPlaying = true;
      }
  },

  update: function() {
      // Player
      for (let i = 0; i < gGameEngine.players.length; i++) {
          let player = gGameEngine.players[i];
          player.update();
      }

      // Bots
      for (let i = 0; i < gGameEngine.bots.length; i++) {
          let bot = gGameEngine.bots[i];
          bot.update();
      }

      // Bombs
      for (let i = 0; i < gGameEngine.bombs.length; i++) {
          let bomb = gGameEngine.bombs[i];
          bomb.update();
      }

      // Menu
      gGameEngine.menu.update();

      // Stage
      gGameEngine.stage.update();
  },

  drawTiles: function() {
      for (let i = 0; i < this.tilesY; i++) {
          for (let j = 0; j < this.tilesX; j++) {
              if ((i == 0 || j == 0 || i == this.tilesY - 1 || j == this.tilesX - 1)
                  || (j % 2 == 0 && i % 2 == 0)) {
                  // Wall tiles
                  let tile = new Tile('wall', { x: j, y: i });
                  this.stage.addChild(tile.bmp);
                  this.tiles.push(tile);
              } else {
                  // Grass tiles
                  let tile = new Tile('grass', { x: j, y: i });
                  this.stage.addChild(tile.bmp);

                  // Wood tiles
                  if (!(i <= 2 && j <= 2)
                      && !(i >= this.tilesY - 3 && j >= this.tilesX - 3)
                      && !(i <= 2 && j >= this.tilesX - 3)
                      && !(i >= this.tilesY - 3 && j <= 2)) {

                      let wood = new Tile('wood', { x: j, y: i });
                      this.stage.addChild(wood.bmp);
                      this.tiles.push(wood);
                  }
              }
          }
      }
  },

  drawBonuses: function() {
      // Cache woods tiles
      let woods = [];
      for (let i = 0; i < this.tiles.length; i++) {
          let tile = this.tiles[i];
          if (tile.material == 'wood') {
              woods.push(tile);
          }
      }

      // Sort tiles randomly
      woods.sort(function() {
          return 0.5 - Math.random();
      });

      // Distribute bonuses to quarters of map precisely fairly
      for (let j = 0; j < 4; j++) {
          let bonusesCount = Math.round(woods.length * this.bonusesPercent * 0.01 / 4);
          let placedCount = 0;
          for (let i = 0; i < woods.length; i++) {
              if (placedCount > bonusesCount) {
                  break;
              }

              let tile = woods[i];
              if ((j == 0 && tile.position.x < this.tilesX / 2 && tile.position.y < this.tilesY / 2)
                  || (j == 1 && tile.position.x < this.tilesX / 2 && tile.position.y > this.tilesY / 2)
                  || (j == 2 && tile.position.x > this.tilesX / 2 && tile.position.y < this.tilesX / 2)
                  || (j == 3 && tile.position.x > this.tilesX / 2 && tile.position.y > this.tilesX / 2)) {

                  let typePosition = placedCount % 3;
                  let bonus = new Bonus(tile.position, typePosition);
                  this.bonuses.push(bonus);

                  // Move wood to front
                  this.moveToFront(tile.bmp);

                  placedCount++;
              }
          }
      }
  },

  spawnBots: function() {
      this.bots = [];

      if (this.botsCount >= 1) {
          let bot2 = new Bot({ x: 1, y: this.tilesY - 2 });
          this.bots.push(bot2);
      }

      if (this.botsCount >= 2) {
          let bot3 = new Bot({ x: this.tilesX - 2, y: 1 });
          this.bots.push(bot3);
      }

      if (this.botsCount >= 3) {
          let bot = new Bot({ x: this.tilesX - 2, y: this.tilesY - 2 });
          this.bots.push(bot);
      }

      if (this.botsCount >= 4) {
          let bot = new Bot({ x: 1, y: 1 });
          this.bots.push(bot);
      }
  },

  spawnPlayers: function() {
      this.players = [];

      if (this.playersCount >= 1) {
          let player = new Player({ x: 1, y: 1 });
          this.players.push(player);
      }

      if (this.playersCount >= 2) {
          let controls = {
              'up': 'up2',
              'left': 'left2',
              'down': 'down2',
              'right': 'right2',
              'bomb': 'bomb2'
          };
          let player2 = new Player({ x: this.tilesX - 2, y: this.tilesY - 2 }, controls, 1);
          this.players.push(player2);
      }
  },

  /**
   * Checks whether two rectangles intersect.
   */
  intersectRect: function(a, b) {
      return (a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom);
  },

  /**
   * Returns tile at given position.
   */
  getTile: function(position) {
      for (let i = 0; i < this.tiles.length; i++) {
          let tile = this.tiles[i];
          if (tile.position.x == position.x && tile.position.y == position.y) {
              return tile;
          }
      }
  },

  /**
   * Returns tile material at given position.
   */
  getTileMaterial: function(position) {
      let tile = this.getTile(position);
      return (tile) ? tile.material : 'grass' ;
  },

  gameOver: function(status) {
      if (gGameEngine.menu.visible) { return; }

      if (status == 'win') {
          let winText = "You won!";
          if (gGameEngine.playersCount > 1) {
              let winner = gGameEngine.getWinner();
              winText = winner == 0 ? "Player 1 won!" : "Player 2 won!";
          }
          this.menu.show([{text: winText, color: '#669900'}, {text: ' ;D', color: '#99CC00'}]);
      } else {
          this.menu.show([{text: 'Game Over', color: '#CC0000'}, {text: ' :(', color: '#FF4444'}]);
      }
  },

  getWinner: function() {
      for (let i = 0; i < gGameEngine.players.length; i++) {
          let player = gGameEngine.players[i];
          if (player.alive) {
              return i;
          }
      }
  },

  restart: function() {
      gInputEngine.removeAllListeners();
      gGameEngine.stage.removeAllChildren();
      gGameEngine.setup();
  },

  /**
   * Moves specified child to the front.
   */
  moveToFront: function(child) {
      let children = gGameEngine.stage.getNumChildren();
      gGameEngine.stage.setChildIndex(child, children - 1);
  },

  toggleSound: function() {
      if (gGameEngine.mute) {
          gGameEngine.mute = false;
          gGameEngine.soundtrack.resume();
      } else {
          gGameEngine.mute = true;
          gGameEngine.soundtrack.pause();
      }
  },

  countPlayersAlive: function() {
      let playersAlive = 0;
      for (let i = 0; i < gGameEngine.players.length; i++) {
          if (gGameEngine.players[i].alive) {
              playersAlive++;
          }
      }
      return playersAlive;
  },

  getPlayersAndBots: function() {
      let players = [];

      for (let i = 0; i < gGameEngine.players.length; i++) {
          players.push(gGameEngine.players[i]);
      }

      for (let i = 0; i < gGameEngine.bots.length; i++) {
          players.push(gGameEngine.bots[i]);
      }

      return players;
  }
});
InputEngine = Class.extend({
  /**
   * A dictionary mapping ASCII key codes to string values describing
   * the action we want to take when that key is pressed.
   */
  bindings: {},

  /**
   * A dictionary mapping actions that might be taken in our game
   * to a boolean value indicating whether that action is currently being performed.
   */
  actions: {},

  listeners: [],

  init: function() {
  },

  setup: function() {
      this.bind(38, 'up');
      this.bind(37, 'left');
      this.bind(40, 'down');
      this.bind(39, 'right');
      this.bind(32, 'bomb');
      this.bind(18, 'bomb');

      this.bind(87, 'up2');
      this.bind(65, 'left2');
      this.bind(83, 'down2');
      this.bind(68, 'right2');
      this.bind(16, 'bomb2');

      this.bind(13, 'restart');
      this.bind(27, 'escape');
      this.bind(77, 'mute');

      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
  },

  onKeyDown: function(event) {
      let action = gInputEngine.bindings[event.keyCode];
      if (action) {
          gInputEngine.actions[action] = true;
          event.preventDefault();
      }
      return false;
  },

  onKeyUp: function(event) {
      let action = gInputEngine.bindings[event.keyCode];
      if (action) {
          gInputEngine.actions[action] = false;

          let listeners = gInputEngine.listeners[action];
          if (listeners) {
              for (let i = 0; i < listeners.length; i++) {
                  let listener = listeners[i];
                  listener();
              }
          }
          event.preventDefault();
      }
      return false;
  },

  /**
   * The bind function takes an ASCII keycode and a string representing
   * the action to take when that key is pressed.
   */
  bind: function(key, action) {
      this.bindings[key] = action;
  },

  addListener: function(action, listener) {
      this.listeners[action] = this.listeners[action] || new Array();
      this.listeners[action].push(listener);
  },

  removeAllListeners: function() {
      this.listeners = [];
  }
});

Fire = Entity.extend({
  /**
   * Entity position on map grid
   */
  position: {},

  /**
   * Bitmap dimensions
   */
  size: {
      w: 38,
      h: 38
  },

  /**
   * Bitmap animation
   */
  bmp: null,

  /**
   * The bomb that triggered this fire
   */
  bomb: null,

  init: function(position, bomb) {
      this.bomb = bomb;

      let spriteSheet = new createjs.SpriteSheet({
          images: [gGameEngine.fireImg],
          frames: { width: this.size.w, height: this.size.h, regX: 0, regY: 0 },
          animations: {
              idle: [0, 5, null, 0.4],
          }
      });
      this.bmp = new createjs.Sprite(spriteSheet);
      this.bmp.gotoAndPlay('idle');
      let that = this;
      this.bmp.addEventListener('animationend', function() {
          that.remove();
      });

      this.position = position;

      let pixels = Utils.convertToBitmapPosition(position);
      this.bmp.x = pixels.x + 2;
      this.bmp.y = pixels.y - 5;

      gGameEngine.stage.addChild(this.bmp);
  },

  update: function() {
  },

  remove: function() {
      if (this.bomb.explodeListener) {
          this.bomb.explodeListener();
          this.bomb.explodeListener = null;
      }

      gGameEngine.stage.removeChild(this.bmp);

      for (let i = 0; i < this.bomb.fires.length; i++) {
          let fire = this.bomb.fires[i];
          if (this == fire) {
              this.bomb.fires.splice(i, 1);
          }
      }

      for (let i = 0; i < gGameEngine.bombs.length; i++) {
          let bomb = gGameEngine.bombs[i];
          if (this.bomb == bomb) {
              gGameEngine.bombs.splice(i, 1);
          }
      }
  }
});

Entity = Class.extend({
  init: function() {
  },

  update: function() {
  }
});

Bot = Player.extend({
    /**
     * Current direction
     */
    direction: 'up',
    lastDirection: '',

    /**
     * Directions that are not allowed to go because of collision
     */
    excludeDirections: [],

    /**
     * Current X axis direction
     */
    dirX: 0,

    /**
     * Current Y axis direction
     */
    dirY: -1,

    /**
     * Target position on map we are heading to
     */
    previousPosition: {},
    targetPosition: {},
    targetBitmapPosition: {},

    bombsMax: 1,

    wait: false,

    startTimerMax: 60,
    startTimer: 0,
    started: false,

    init: function(position) {
        this._super(position);
        this.findTargetPosition();
        this.startTimerMax = Math.random() * 60;
    },

    update: function() {
         if (!this.alive) {
            this.fade();
            return;
        }

        this.wait = false;

        if (!this.started && this.startTimer < this.startTimerMax) {
            this.startTimer++;
            if (this.startTimer >= this.startTimerMax) {
                this.started = true;
            }
            this.animate('idle');
            this.wait = true;
        }

        if (this.targetBitmapPosition.x == this.bmp.x && this.targetBitmapPosition.y == this.bmp.y) {

            // If we bumped into the wood, burn it!
            // If we are near player, kill it!
            if (this.getNearWood() || this.wantKillPlayer()) {
                this.plantBomb();
            }

            // When in safety, wait until explosion
            if (this.bombs.length) {
                if (this.isSafe(this.position)) {
                    this.wait = true;
                }
            }

            if (!this.wait) {
                this.findTargetPosition();
            }
        }

        if (!this.wait) {
            this.moveToTargetPosition();
        }
        this.handleBonusCollision();

        if (this.detectFireCollision()) {
            // Bot has to die
            this.die();
        }

    },

    /**
     * Finds the next tile position where we should move.
     */
    findTargetPosition: function() {
        let target = { x: this.position.x, y: this.position.y };
        target.x += this.dirX;
        target.y += this.dirY;

        let targets = this.getPossibleTargets();
        // Do not go the same way if possible
        if (targets.length > 1) {
            let previousPosition = this.getPreviousPosition();
            for (let i = 0; i < targets.length; i++) {
                let item = targets[i];
                if (item.x == previousPosition.x && item.y == previousPosition.y) {
                    targets.splice(i, 1);
                }
            }
        }
        this.targetPosition = this.getRandomTarget(targets);
        if (this.targetPosition && this.targetPosition.x) {
            this.loadTargetPosition(this.targetPosition);
            this.targetBitmapPosition = Utils.convertToBitmapPosition(this.targetPosition);
        }
    },

    /**
     * Moves a step forward to target position.
     */
    moveToTargetPosition: function() {
        this.animate(this.direction);

        let velocity = this.velocity;
        let distanceX = Math.abs(this.targetBitmapPosition.x - this.bmp.x);
        let distanceY = Math.abs(this.targetBitmapPosition.y - this.bmp.y);
        if (distanceX > 0 && distanceX < this.velocity) {
            velocity = distanceX;
        } else if (distanceY > 0 && distanceY < this.velocity) {
            velocity = distanceY;
        }

        let targetPosition = { x: this.bmp.x + this.dirX * velocity, y: this.bmp.y + this.dirY * velocity };
        if (!this.detectWallCollision(targetPosition)) {
            this.bmp.x = targetPosition.x;
            this.bmp.y = targetPosition.y;
        }

        this.updatePosition();
    },

    /**
     * Returns near grass tiles.
     */
    getPossibleTargets: function() {
        let targets = [];
        for (let i = 0; i < 4; i++) {
            let dirX;
            let dirY;
            if (i == 0) { dirX = 1; dirY = 0; }
            else if (i == 1) { dirX = -1; dirY = 0; }
            else if (i == 2) { dirX = 0; dirY = 1; }
            else if (i == 3) { dirX = 0; dirY = -1; }

            let position = { x: this.position.x + dirX, y: this.position.y + dirY };
            if (gGameEngine.getTileMaterial(position) == 'grass' && !this.hasBomb(position)) {
                targets.push(position);
            }
        }

        let safeTargets = [];
        for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            if (this.isSafe(target)) {
                safeTargets.push(target);
            }
        }

        let isLucky = Math.random() > 0.3;
        return safeTargets.length > 0 && isLucky ? safeTargets : targets;
    },

    /**
     * Loads vectors and animation name for target position.
     */
    loadTargetPosition: function(position) {
        this.dirX = position.x - this.position.x;
        this.dirY = position.y - this.position.y;
        if (this.dirX == 1 && this.dirY == 0) {
            this.direction = 'right';
        } else if (this.dirX == -1 && this.dirY == 0) {
            this.direction = 'left';
        } else if (this.dirX == 0 && this.dirY == 1) {
            this.direction = 'down';
        } else if (this.dirX == 0 && this.dirY == -1) {
            this.direction = 'up';
        }
    },

    /**
     * Gets previous position by current position and direction vector.
     */
    getPreviousPosition: function() {
        let previous = { x: this.targetPosition.x, y: this.targetPosition.y };
        previous.x -= this.dirX;
        previous.y -= this.dirY;
        return previous;
    },

    /**
     * Returns random item from array.
     */
    getRandomTarget: function(targets) {
        return targets[Math.floor(Math.random() * targets.length)];
    },

    applyBonus: function(bonus) {
        this._super(bonus);

        // It is too dangerous to have more bombs available
        this.bombsMax = 1;
    },

    /**
     * Game is over when no bots and one player left.
     */
    die: function() {
        this._super();
        let botsAlive = false;

        // Cache bots
        let bots = [];
        for (let i = 0; i < gGameEngine.bots.length; i++) {
            bots.push(gGameEngine.bots[i]);
        }

        for (let i = 0; i < bots.length; i++) {
            let bot = bots[i];
            // Remove bot
            if (bot == this) {
                gGameEngine.bots.splice(i, 1);
            }
            if (bot.alive) {
                botsAlive = true;
            }
        }

        if (!botsAlive && gGameEngine.countPlayersAlive() == 1) {
            gGameEngine.gameOver('win');
        }
    },

    /**
     * Checks whether there is any wood around.
     */
    getNearWood: function() {
        for (let i = 0; i < 4; i++) {
            let dirX;
            let dirY;
            if (i == 0) { dirX = 1; dirY = 0; }
            else if (i == 1) { dirX = -1; dirY = 0; }
            else if (i == 2) { dirX = 0; dirY = 1; }
            else if (i == 3) { dirX = 0; dirY = -1; }

            let position = { x: this.position.x + dirX, y: this.position.y + dirY };
            if (gGameEngine.getTileMaterial(position) == 'wood') {
                return gGameEngine.getTile(position);
            }
        }
    },

    /**
     * Checks whether player is near. If yes and we are angry, return true.
     */
    wantKillPlayer: function() {
        let isNear = false;

        for (let i = 0; i < 4; i++) {
            let dirX;
            let dirY;
            if (i == 0) { dirX = 1; dirY = 0; }
            else if (i == 1) { dirX = -1; dirY = 0; }
            else if (i == 2) { dirX = 0; dirY = 1; }
            else if (i == 3) { dirX = 0; dirY = -1; }

            let position = { x: this.position.x + dirX, y: this.position.y + dirY };
            for (let j = 0; j < gGameEngine.players.length; j++) {
                let player = gGameEngine.players[j];
                if (player.alive && Utils.comparePositions(player.position, position)) {
                    isNear = true;
                    break;
                }
            }
        }

        let isAngry = Math.random() > 0.5;
        if (isNear && isAngry) {
            return true;
        }
    },

    /**
     * Places the bomb in current position
     */
    plantBomb: function() {
        for (let i = 0; i < gGameEngine.bombs.length; i++) {
            let bomb = gGameEngine.bombs[i];
            if (Utils.comparePositions(bomb.position, this.position)) {
                return;
            }
        }

        if (this.bombs.length < this.bombsMax) {
            let bomb = new Bomb(this.position, this.bombStrength);
            gGameEngine.stage.addChild(bomb.bmp);
            this.bombs.push(bomb);
            gGameEngine.bombs.push(bomb);

            let that = this;
            bomb.setExplodeListener(function() {
                Utils.removeFromArray(that.bombs, bomb);
                that.wait = false;
            });
        }
    },

    /**
     * Checks whether position is safe  and possible explosion cannot kill us.
     */
    isSafe: function(position) {
        for (let i = 0; i < gGameEngine.bombs.length; i++) {
            let bomb = gGameEngine.bombs[i];
            let fires = bomb.getDangerPositions();
            for (let j = 0; j < fires.length; j++) {
                let fire = fires[j];
                if (Utils.comparePositions(fire, position)) {
                    return false;
                }
            }
        }
        return true;
    },

    hasBomb: function(position) {
        for (let i = 0; i < gGameEngine.bombs.length; i++) {
            let bomb = gGameEngine.bombs[i];
            if (Utils.comparePositions(bomb.position, position)) {
                return true;
            }
        }
        return false;
    }
});

Bonus = Entity.extend({
  types: ['speed', 'bomb', 'fire'],

  type: '',
  position: {},
  bmp: null,

  init: function(position, typePosition) {
      this.type = this.types[typePosition];

      this.position = position;

      this.bmp = new createjs.Bitmap(gGameEngine.bonusesImg);
      let pixels = Utils.convertToBitmapPosition(position);
      this.bmp.x = pixels.x;
      this.bmp.y = pixels.y;
      this.bmp.sourceRect = new createjs.Rectangle(typePosition * 32, 0, 32, 32);
      gGameEngine.stage.addChild(this.bmp);
  },

  destroy: function() {
      gGameEngine.stage.removeChild(this.bmp);
      Utils.removeFromArray(gGameEngine.bonuses, this);
  }
});

Bomb = Entity.extend({
  /**
   * Entity position on map grid
   */
  position: {},

  /**
   * How far the fire reaches when bomb explodes
   */
  strength: 1,

  /**
   * Bitmap dimensions
   */
  size: {
      w: 28,
      h: 28
  },

  /**
   * Bitmap animation
   */
  bmp: null,

  /**
   * Timer in frames
   */
  timer: 0,

  /**
   * Max timer value in seconds
   */
  timerMax: 2,

  exploded: false,

  fires: [],

  explodeListener: null,

  init: function(position, strength) {
      this.strength = strength;

      let spriteSheet = new createjs.SpriteSheet({
          images: [gGameEngine.bombImg],
          frames: {
              width: this.size.w,
              height: this.size.h,
              regX: 5,
              regY: 5
          },
          animations: {
              idle: [0, 4, "idle", 0.2]
          }
      });
      this.bmp = new createjs.Sprite(spriteSheet);
      this.bmp.gotoAndPlay('idle');

      this.position = position;

      let pixels = Utils.convertToBitmapPosition(position);
      this.bmp.x = pixels.x + this.size.w / 4;
      this.bmp.y = pixels.y + this.size.h / 4;

      this.fires = [];

      // Allow players and bots that are already on this position to escape
      let players = gGameEngine.getPlayersAndBots();
      for (let i = 0; i < players.length; i++) {
          let player = players[i];
          if (Utils.comparePositions(player.position, this.position)) {
              player.escapeBomb = this;
          }
      }
  },

  update: function() {
      if (this.exploded) { return; }

      this.timer++;
      if (this.timer > this.timerMax * createjs.Ticker.getMeasuredFPS()) {
          this.explode();
      }
  },

  explode: function() {
      this.exploded = true;

      if (!gGameEngine.mute && gGameEngine.soundtrackPlaying) {
          let bombSound = createjs.Sound.play("bomb");
          bombSound.setVolume(0.2);
      }

      // Fire in all directions!
      let positions = this.getDangerPositions();
      for (let i = 0; i < positions.length; i++) {
          let position = positions[i];
          this.fire(position);

          let material = gGameEngine.getTileMaterial(position);
          if (material == 'wood') {
              let tile = gGameEngine.getTile(position);
              tile.remove();
          } else if (material == 'grass') {
              // Explode bombs in fire
              for (let j = 0; j < gGameEngine.bombs.length; j++) {
                  let bomb = gGameEngine.bombs[j];
                  if (!bomb.exploded
                      && Utils.comparePositions(bomb.position, position)) {
                      bomb.explode();
                  }
              }
          }
      }

      this.remove();
  },

  /**
   * Returns positions that are going to be covered by fire.
   */
  getDangerPositions: function() {
      let positions = [];
      positions.push(this.position);

      for (let i = 0; i < 4; i++) {
          let dirX;
          let dirY;
          if (i == 0) { dirX = 1; dirY = 0; }
          else if (i == 1) { dirX = -1; dirY = 0; }
          else if (i == 2) { dirX = 0; dirY = 1; }
          else if (i == 3) { dirX = 0; dirY = -1; }

          for (let j = 1; j <= this.strength; j++) {
              let explode = true;
              let last = false;

              let position = { x: this.position.x + j * dirX, y: this.position.y + j * dirY };


              let material = gGameEngine.getTileMaterial(position);
              if (material == 'wall') { // One can not simply burn the wall
                  explode = false;
                  last = true;
              } else if (material == 'wood') {
                  explode = true;
                  last = true;
              }

              if (explode) {
                  positions.push(position);
              }

              if (last) {
                  break;
              }
          }
      }

      return positions;
  },

  fire: function(position) {
      let fire = new Fire(position, this);
      this.fires.push(fire);
  },

  remove: function() {
      gGameEngine.stage.removeChild(this.bmp);
  },

  setExplodeListener: function(listener) {
      this.explodeListener = listener;
  }
});

gGameEngine = new GameEngine();

gInputEngine = new InputEngine();
(function(){
  let initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    let _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    let prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (let name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            let tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            let ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();
Player = Entity.extend({
  id: 0,

  /**
   * Moving speed
   */
  velocity: 2,

  /**
   * Max number of bombs user can spawn
   */
  bombsMax: 1,

  /**
   * How far the fire reaches when bomb explodes
   */
  bombStrength: 1,

  /**
   * Entity position on map grid
   */
  position: {},

  /**
   * Bitmap dimensions
   */
  size: {
      w: 48,
      h: 48
  },

  /**
   * Bitmap animation
   */
  bmp: null,

  alive: true,

  bombs: [],

  controls: {
      'up': 'up',
      'left': 'left',
      'down': 'down',
      'right': 'right',
      'bomb': 'bomb'
  },

  /**
   * Bomb that player can escape from even when there is a collision
   */
  escapeBomb: null,

  deadTimer: 0,

  init: function(position, controls, id) {
      if (id) {
          this.id = id;
      }

      if (controls) {
          this.controls = controls;
      }

      let img = gGameEngine.playerBoyImg;
      if (!(this instanceof Bot)) {
          if (this.id == 0) {
              img = gGameEngine.playerGirlImg;
          } else {
              img = gGameEngine.playerGirl2Img;
          }
      }

      let spriteSheet = new createjs.SpriteSheet({
          images: [img],
          frames: { width: this.size.w, height: this.size.h, regX: 10, regY: 12 },
          animations: {
              idle: [0, 0, 'idle'],
              down: [0, 3, 'down', 0.1],
              left: [4, 7, 'left', 0.1],
              up: [8, 11, 'up', 0.1],
              right: [12, 15, 'right', 0.1],
              dead: [16, 16, 'dead', 0.1]
          }
      });
      this.bmp = new createjs.Sprite(spriteSheet);

      this.position = position;
      let pixels = Utils.convertToBitmapPosition(position);
      this.bmp.x = pixels.x;
      this.bmp.y = pixels.y;

      gGameEngine.stage.addChild(this.bmp);

      this.bombs = [];
      this.setBombsListener();
  },

  setBombsListener: function() {
      // Subscribe to bombs spawning
      if (!(this instanceof Bot)) {
          let that = this;
          gInputEngine.addListener(this.controls.bomb, function() {
              // Check whether there is already bomb on this position
              for (let i = 0; i < gGameEngine.bombs.length; i++) {
                  let bomb = gGameEngine.bombs[i];
                  if (Utils.comparePositions(bomb.position, that.position)) {
                      return;
                  }
              }

              let unexplodedBombs = 0;
              for (let i = 0; i < that.bombs.length; i++) {
                  if (!that.bombs[i].exploded) {
                      unexplodedBombs++;
                  }
              }

              if (unexplodedBombs < that.bombsMax) {
                  let bomb = new Bomb(that.position, that.bombStrength);
                  gGameEngine.stage.addChild(bomb.bmp);
                  that.bombs.push(bomb);
                  gGameEngine.bombs.push(bomb);

                  bomb.setExplodeListener(function() {
                      Utils.removeFromArray(that.bombs, bomb);
                  });
              }
          });
      }
  },

  update: function() {
      if (!this.alive) {
          //this.fade();
          return;
      }
      if (gGameEngine.menu.visible) {
          return;
      }
      let position = { x: this.bmp.x, y: this.bmp.y };

      let dirX = 0;
      let dirY = 0;
      if (gInputEngine.actions[this.controls.up]) {
          this.animate('up');
          position.y -= this.velocity;
          dirY = -1;
      } else if (gInputEngine.actions[this.controls.down]) {
          this.animate('down');
          position.y += this.velocity;
          dirY = 1;
      } else if (gInputEngine.actions[this.controls.left]) {
          this.animate('left');
          position.x -= this.velocity;
          dirX = -1;
      } else if (gInputEngine.actions[this.controls.right]) {
          this.animate('right');
          position.x += this.velocity;
          dirX = 1;
      } else {
          this.animate('idle');
      }

      if (position.x != this.bmp.x || position.y != this.bmp.y) {
          if (!this.detectBombCollision(position)) {
              if (this.detectWallCollision(position)) {
                  // If we are on the corner, move to the aisle
                  let cornerFix = this.getCornerFix(dirX, dirY);
                  if (cornerFix) {
                      let fixX = 0;
                      let fixY = 0;
                      if (dirX) {
                          fixY = (cornerFix.y - this.bmp.y) > 0 ? 1 : -1;
                      } else {
                          fixX = (cornerFix.x - this.bmp.x) > 0 ? 1 : -1;
                      }
                      this.bmp.x += fixX * this.velocity;
                      this.bmp.y += fixY * this.velocity;
                      this.updatePosition();
                  }
              } else {
                  this.bmp.x = position.x;
                  this.bmp.y = position.y;
                  this.updatePosition();
              }
          }
      }

      if (this.detectFireCollision()) {
          this.die();
      }

      this.handleBonusCollision();
  },

  /**
   * Checks whether we are on corner to target position.
   * Returns position where we should move before we can go to target.
   */
  getCornerFix: function(dirX, dirY) {
      let edgeSize = 30;

      // fix position to where we should go first
      let position = {};

      // possible fix position we are going to choose from
      let pos1 = { x: this.position.x + dirY, y: this.position.y + dirX };
      let bmp1 = Utils.convertToBitmapPosition(pos1);

      let pos2 = { x: this.position.x - dirY, y: this.position.y - dirX };
      let bmp2 = Utils.convertToBitmapPosition(pos2);

      // in front of current position
      if (gGameEngine.getTileMaterial({ x: this.position.x + dirX, y: this.position.y + dirY }) == 'grass') {
          position = this.position;
      }
      // right bottom
      // left top
      else if (gGameEngine.getTileMaterial(pos1) == 'grass'
          && Math.abs(this.bmp.y - bmp1.y) < edgeSize && Math.abs(this.bmp.x - bmp1.x) < edgeSize) {
          if (gGameEngine.getTileMaterial({ x: pos1.x + dirX, y: pos1.y + dirY }) == 'grass') {
              position = pos1;
          }
      }
      // right top
      // left bottom
      else if (gGameEngine.getTileMaterial(pos2) == 'grass'
          && Math.abs(this.bmp.y - bmp2.y) < edgeSize && Math.abs(this.bmp.x - bmp2.x) < edgeSize) {
          if (gGameEngine.getTileMaterial({ x: pos2.x + dirX, y: pos2.y + dirY }) == 'grass') {
              position = pos2;
          }
      }

      if (position.x &&  gGameEngine.getTileMaterial(position) == 'grass') {
          return Utils.convertToBitmapPosition(position);
      }
  },

  /**
   * Calculates and updates entity position according to its actual bitmap position
   */
  updatePosition: function() {
      this.position = Utils.convertToEntityPosition(this.bmp);
  },

  /**
   * Returns true when collision is detected and we should not move to target position.
   */
  detectWallCollision: function(position) {
      let player = {};
      player.left = position.x;
      player.top = position.y;
      player.right = player.left + this.size.w;
      player.bottom = player.top + this.size.h;

      // Check possible collision with all wall and wood tiles
      let tiles = gGameEngine.tiles;
      for (let i = 0; i < tiles.length; i++) {
          let tilePosition = tiles[i].position;

          let tile = {};
          tile.left = tilePosition.x * gGameEngine.tileSize + 25;
          tile.top = tilePosition.y * gGameEngine.tileSize + 20;
          tile.right = tile.left + gGameEngine.tileSize - 30;
          tile.bottom = tile.top + gGameEngine.tileSize - 30;

          if(gGameEngine.intersectRect(player, tile)) {
              return true;
          }
      }
      return false;
  },

  /**
   * Returns true when the bomb collision is detected and we should not move to target position.
   */
  detectBombCollision: function(pixels) {
      let position = Utils.convertToEntityPosition(pixels);

      for (let i = 0; i < gGameEngine.bombs.length; i++) {
          let bomb = gGameEngine.bombs[i];
          // Compare bomb position
          if (bomb.position.x == position.x && bomb.position.y == position.y) {
              // Allow to escape from bomb that appeared on my field
              if (bomb == this.escapeBomb) {
                  return false;
              } else {
                  return true;
              }
          }
      }

      // I have escaped already
      if (this.escapeBomb) {
          this.escapeBomb = null;
      }

      return false;
  },

  detectFireCollision: function() {
      let bombs = gGameEngine.bombs;
      for (let i = 0; i < bombs.length; i++) {
          let bomb = bombs[i];
          for (let j = 0; j < bomb.fires.length; j++) {
              let fire = bomb.fires[j];
              let collision = bomb.exploded && fire.position.x == this.position.x && fire.position.y == this.position.y;
              if (collision) {
                  return true;
              }
          }
      }
      return false;
  },

  /**
   * Checks whether we have got bonus and applies it.
   */
  handleBonusCollision: function() {
      for (let i = 0; i < gGameEngine.bonuses.length; i++) {
          let bonus = gGameEngine.bonuses[i];
          if (Utils.comparePositions(bonus.position, this.position)) {
              this.applyBonus(bonus);
              bonus.destroy();
          }
      }
  },

  /**
   * Applies bonus.
   */
  applyBonus: function(bonus) {
      if (bonus.type == 'speed') {
          this.velocity += 0.8;
      } else if (bonus.type == 'bomb') {
          this.bombsMax++;
      } else if (bonus.type == 'fire') {
          this.bombStrength++;
      }
  },

  /**
   * Changes animation if requested animation is not already current.
   */
  animate: function(animation) {
      if (!this.bmp.currentAnimation || this.bmp.currentAnimation.indexOf(animation) === -1) {
          this.bmp.gotoAndPlay(animation);
      }
  },

  die: function() {
      this.alive = false;

      if (gGameEngine.countPlayersAlive() == 1 && gGameEngine.playersCount == 2) {
          gGameEngine.gameOver('win');
      } else if (gGameEngine.countPlayersAlive() == 0) {
          gGameEngine.gameOver('lose');
      }

      this.bmp.gotoAndPlay('dead');
      this.fade();
  },

  fade: function() {
      let timer = 0;
      let bmp = this.bmp;
      let fade = setInterval(function() {
          timer++;

          if (timer > 30) {
              bmp.alpha -= 0.05;
          }
          if (bmp.alpha <= 0) {
              clearInterval(fade);
          }

      }, 30);
  }
});
Menu = Class.extend({
  visible: true,

  views: [],

  init: function() {
      gGameEngine.botsCount = 4;
      gGameEngine.playersCount = 0;

      this.showLoader();
  },

  show: function(text) {
      this.visible = true;

      this.draw(text);
  },

  hide: function() {
      this.visible = false;

      for (let i = 0; i < this.views.length; i++) {
          gGameEngine.stage.removeChild(this.views[i]);
      }

      this.views = [];
  },

  update: function() {
      if (this.visible) {
          for (let i = 0; i < this.views.length; i++) {
              gGameEngine.moveToFront(this.views[i]);
          }
      }
  },

  setHandCursor: function(btn) {
      btn.addEventListener('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });
      btn.addEventListener('mouseout', function() {
          document.body.style.cursor = 'auto';
      });
  },

  setMode: function(mode) {
      this.hide();

      if (mode == 'single') {
          gGameEngine.botsCount = 3;
          gGameEngine.playersCount = 1;
      } else {
          gGameEngine.botsCount = 2;
          gGameEngine.playersCount = 2;
      }

      gGameEngine.playing = true;
      gGameEngine.restart();
  },

  draw: function(text) {
      let that = this;

      // semi-transparent black background
      let bgGraphics = new createjs.Graphics().beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
      let bg = new createjs.Shape(bgGraphics);
      gGameEngine.stage.addChild(bg);
      this.views.push(bg);

      // game title
      text = text || [{text: 'Bomber', color: '#ffffff'}, {text: 'girl', color: '#ff4444'}];

      let title1 = new createjs.Text(text[0].text, "bold 35px Helvetica", text[0].color);
      let title2 = new createjs.Text(text[1].text, "bold 35px Helvetica", text[1].color);

      let titleWidth = title1.getMeasuredWidth() + title2.getMeasuredWidth();

      title1.x = gGameEngine.size.w / 2 - titleWidth / 2;
      title1.y = gGameEngine.size.h / 2 - title1.getMeasuredHeight() / 2 - 80;
      gGameEngine.stage.addChild(title1);
      this.views.push(title1);

      title2.x = title1.x + title1.getMeasuredWidth();
      title2.y = gGameEngine.size.h / 2 - title1.getMeasuredHeight() / 2 - 80;
      gGameEngine.stage.addChild(title2);
      this.views.push(title2);

      // modes buttons
      let modeSize = 110;
      let modesDistance = 20;
      let modesY = title1.y + title1.getMeasuredHeight() + 40;

      // singleplayer button
      let singleX = gGameEngine.size.w / 2 - modeSize - modesDistance;
      let singleBgGraphics = new createjs.Graphics().beginFill("rgba(0, 0, 0, 0.5)").drawRect(singleX, modesY, modeSize, modeSize);
      let singleBg = new createjs.Shape(singleBgGraphics);
      gGameEngine.stage.addChild(singleBg);
      this.views.push(singleBg);
      this.setHandCursor(singleBg);
      singleBg.addEventListener('click', function() {
          that.setMode('single');
      });

      let singleTitle1 = new createjs.Text("single", "16px Helvetica", "#ff4444");
      let singleTitle2 = new createjs.Text("player", "16px Helvetica", "#ffffff");
      let singleTitleWidth = singleTitle1.getMeasuredWidth() + singleTitle2.getMeasuredWidth();
      let modeTitlesY = modesY + modeSize - singleTitle1.getMeasuredHeight() - 20;

      singleTitle1.x = singleX + (modeSize - singleTitleWidth) / 2;
      singleTitle1.y = modeTitlesY;
      gGameEngine.stage.addChild(singleTitle1);
      this.views.push(singleTitle1)

      singleTitle2.x = singleTitle1.x + singleTitle1.getMeasuredWidth();
      singleTitle2.y = modeTitlesY;
      gGameEngine.stage.addChild(singleTitle2);
      this.views.push(singleTitle2)

      let iconsY = modesY + 13;
      let singleIcon = new createjs.Bitmap("img/betty.png");
      singleIcon.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
      singleIcon.x = singleX + (modeSize - 48) / 2;
      singleIcon.y = iconsY;
      gGameEngine.stage.addChild(singleIcon);
      this.views.push(singleIcon);

      // multiplayer button
      let multiX = gGameEngine.size.w / 2 + modesDistance;
      let multiBgGraphics = new createjs.Graphics().beginFill("rgba(0, 0, 0, 0.5)").drawRect(multiX, modesY, modeSize, modeSize);
      let multiBg = new createjs.Shape(multiBgGraphics);
      gGameEngine.stage.addChild(multiBg);
      this.views.push(multiBg);
      this.setHandCursor(multiBg);
      multiBg.addEventListener('click', function() {
          that.setMode('multi');
      });

      let multiTitle1 = new createjs.Text("multi", "16px Helvetica", "#99cc00");
      let multiTitle2 = new createjs.Text("player", "16px Helvetica", "#ffffff");
      let multiTitleWidth = multiTitle1.getMeasuredWidth() + multiTitle2.getMeasuredWidth();

      multiTitle1.x = multiX + (modeSize - multiTitleWidth) / 2;
      multiTitle1.y = modeTitlesY;
      gGameEngine.stage.addChild(multiTitle1);
      this.views.push(multiTitle1)

      multiTitle2.x = multiTitle1.x + multiTitle1.getMeasuredWidth();
      multiTitle2.y = modeTitlesY;
      gGameEngine.stage.addChild(multiTitle2);
      this.views.push(multiTitle2)

      let multiIconGirl = new createjs.Bitmap("img/betty.png");
      multiIconGirl.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
      multiIconGirl.x = multiX + (modeSize - 48) / 2 - 48/2 + 8;
      multiIconGirl.y = iconsY;
      gGameEngine.stage.addChild(multiIconGirl);
      this.views.push(multiIconGirl);

      let multiIconBoy = new createjs.Bitmap("img/betty2.png");
      multiIconBoy.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
      multiIconBoy.x = multiX + (modeSize - 48) / 2 + 48/2 - 8;
      multiIconBoy.y = iconsY;
      gGameEngine.stage.addChild(multiIconBoy);
      this.views.push(multiIconBoy);
  },

  showLoader: function() {
      let bgGraphics = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
      let bg = new createjs.Shape(bgGraphics);
      gGameEngine.stage.addChild(bg);

      let loadingText = new createjs.Text("Loading...", "20px Helvetica", "#FFFFFF");
      loadingText.x = gGameEngine.size.w / 2 - loadingText.getMeasuredWidth() / 2;
      loadingText.y = gGameEngine.size.h / 2 - loadingText.getMeasuredHeight() / 2;
      gGameEngine.stage.addChild(loadingText);
      gGameEngine.stage.update();
  }
});