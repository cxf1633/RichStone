//战斗逻辑

var MoveDir = cc.Enum({
    None : cc.p(0, 0),
    
    LeftUp : cc.p(-1, 1),//左上
    RightUp : cc.p(1, 1),//右上

    LeftDown : cc.p(-1, -1),//左下
    RightDown : cc.p(1, -1),//右下
});

cc.Class({
    extends: cc.Component,
    properties: {
        // player: {
        //     default: null,
        //     type: cc.Prefab,
        // },
    },

    //1，第一个调用
    onLoad: function() {
        //实例化预制体
        //var newStar = cc.instantiate(this.starPrefab);

        var Utils = require("Utils/Utils")
        cc.utils = new Utils() 

        this.canvasPos = this.node.getPosition();

        this.mapNode = this.node.getChildByName("map");
        //this._tiledMap = this.mapNode.getComponent('cc.TiledMap');

        var tmxMap = this.mapNode.getComponent('cc.TiledMap');

        this.cellXCount = tmxMap.getMapSize().width;
        this.cellYCount = tmxMap.getMapSize().height;
        this.cellWidth = tmxMap.getTileSize().width;
        this.cellHeight = tmxMap.getTileSize().height;
        this.mapPixWidth = this.cellWidth * this.cellXCount;
        this.mapPixHeight = this.cellHeight * this.cellYCount;

        this.player1 = this.mapNode.getChildByName("player1")
    },

 
    //2，onLoad之后调用
    start: function() {
        // var self = this;
        // //加载 Prefab
        // cc.loader.loadRes("prefab/player", function (err, prefab) {
        //     var player1 = cc.instantiate(prefab);
        //     //player1.setPosition(self._getScenePos(6, 15));
        //     player1.setPosition(cc.p(0, 0));
        //     self.node.addChild(player1);
        //     //cc.director.getScene().addChild(player1);
        // });

        //玩家初始位置
        this.playerStartTiledPos = cc.p(6, 15);
        this.currentTiledPos = this.playerStartTiledPos;

        this.player1OriginPos = this.player1.getPosition();

        this.UIRoot = this.node.getChildByName("UIRoot")
        this._moveBtn = this.UIRoot.getChildByName("MoveButton")
        cc.utils.addClickEvent(this._moveBtn, this.node, "BattleLogic", "_moveBtnClick")
    },
    _moveBtnClick: function(){
        cc.log("_moveBtnClick");

        //this._playerMove();
        this._playerMoveByGID();

        this.paths = new Array();
        this.paths.push( {x : 6, y: 14});
        this.paths.push( {x : 6, y: 13});
        this.paths.push( {x : 6, y: 12});
        this.paths.push( {x : 7, y: 12});

        // for (let index = 0; index < paths.length; index++) {
        //     const element = paths[index];
        //     cc.log("element=", element);
        //     this._playerMoveByPath(element);
        // }

        this.pathIndex = 0;
        this._playerMoveByPath(this.paths[this.pathIndex]);

        //this._fixPlayerInCenter();


    },

    _playerMoveByGID: function(gid) {
        cc.log("player pos =", this.player1OriginPos);
        var pos = this._getScenePos(6, 15);
        cc.log("pos =", pos);
        this.player1.setPosition(pos);
    },
    // cellX和cellY是tilemap中的单元格。
    _getScenePos: function(cellX, cellY){
        cc.log("cellX =", cellX);
        cc.log("cellY =", cellY);
        var posX = this.mapPixWidth / 2 + (cellX - cellY) * this.cellWidth / 2;
        var posY = this.mapPixHeight - (cellX + cellY) * this.cellHeight / 2;
        cc.log("posX =", posX);
        cc.log("posY =", posY);
        // var x = posX - this.canvasPos .x;
        // var y = posY - this.canvasPos .y;
        // cc.log("x =", x);
        // cc.log("y =", y);
        return cc.p(posX, posY-40);
    },
    _playerMoveByPath: function(path){    
        var newPlayerPos = this._getScenePos(path.x, path.y);   
        var moveAction = cc.moveTo(1, newPlayerPos);
        //let action1 = cc.delayTime(1);
        var callback = cc.callFunc(this._hasNextPath, this);

        this.player1.runAction(cc.sequence(moveAction, callback));

        // var mapPos = this.mapNode.getPosition();
        // var newPos = cc.p(mapPos.x  - dir.x * this.cellWidth / 2, mapPos.y - dir.y *  this.cellHeight / 2);
        // //this.mapNode.setPosition(newPos);
        // this.mapNode.runAction(cc.moveTo(1, newPos));
    },
    _hasNextPath: function(){
        this.pathIndex += 1;
        cc.log("_hasNextPath = ", this.pathIndex);
        if(this.paths[this.pathIndex] == null ){
            this._doStopEvent();
        }
        else{
            this._playerMoveByPath(this.paths[this.pathIndex]);
        }
    },

    _doStopEvent: function(){
        cc.log("_doStopEvent");
    },
    //
    _playerMove: function() {
        var dir = MoveDir.RightUp;
        var player1Pos = this.player1.getPosition();
        var newPlayer1Pos = cc.p(player1Pos.x  + dir.x * this.cellWidth / 2, player1Pos.y + dir.y *  this.cellHeight / 2);
        //this.player1.setPosition(newPlayer1Pos);
        this.player1.runAction(cc.moveTo(1, newPlayer1Pos));
    },

    
    _getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        cc.log("mapSize =", mapSize);
        var tileSize = this._tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);

        return cc.p(x, y);
    },

    _updatePlayerPos: function() {
        var pos = this._layerFloor.getPositionAt(this._curTile);
        this._player.setPosition(pos);
    },

    //onLoad 之后，start 之前被调用。
    onEnable: function(){

    },
    // called every frame
    update: function (dt) {
        this._fixPlayerInCenter();
    },
    _fixPlayerInCenter: function(){
        var playerPos = this.player1.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);
        this.mapNode.setPosition(mapPos);
    },
});

