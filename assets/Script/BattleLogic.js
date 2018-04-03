//战斗逻辑

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

        this._canvasPos = this.node.getPosition();

        this._mapNode = this.node.getChildByName("map");
        //this._tiledMap = this._mapNode.getComponent('cc.TiledMap');

        var tmxMap = this._mapNode.getComponent('cc.TiledMap');

        this.cellXCount = tmxMap.getMapSize().width;
        this.cellYCount = tmxMap.getMapSize().height;
        this.cellWidth = tmxMap.getTileSize().width;
        this.cellHeight = tmxMap.getTileSize().height;
        this.mapPixWidth = this.cellWidth * this.cellXCount;
        this.mapPixHeight = this.cellHeight * this.cellYCount;


      
    },

 
    //2，onLoad之后调用
    start: function() {
        var self = this;
        //加载 Prefab
        cc.loader.loadRes("prefab/player", function (err, prefab) {
            var player1 = cc.instantiate(prefab);
            //player1.setPosition(self._getScenePos(6, 15));
            player1.setPosition(cc.p(0, 0));
            self.node.addChild(player1);
            //cc.director.getScene().addChild(player1);
        });

        //玩家初始位置
        this.playerStartTiledPos = cc.p(6, 15);
        this.currentTiledPos = this.playerStartTiledPos;
        this._getScenePos(6,15);

        this.UIRoot = this.node.getChildByName("UIRoot")
        this._moveBtn = this.UIRoot.getChildByName("MoveButton")
        cc.utils.addClickEvent(this._moveBtn, this.node, "BattleLogic", "_moveBtnClick")
    },
    _moveBtnClick: function(){
        cc.log("_moveBtnClick");
       
        this._playerMove();
    },
    //实际是是地图移动
    _playerMove: function() {
        var mapPos = this._mapNode.getPosition();
        var newPos = cc.p(mapPos.x - this.cellWidth / 2, mapPos.y - this.cellHeight / 2);
        this._mapNode.setPosition(newPos);
    },
    // cellX和cellY是tilemap中的单元格。
    _getScenePos: function(cellX, cellY){
        cc.log("cellX =", cellX);
        cc.log("cellY =", cellY);
        var posX = this.mapPixWidth / 2 + (cellX - cellY) * this.cellWidth / 2;
        var posY = this.mapPixHeight - (cellX + cellY) * this.cellHeight / 2;
        cc.log("posX =", posX);
        cc.log("posY =", posY);
        var x = posX - this._canvasPos .x;
        var y = posY - this._canvasPos .y;
        cc.log("x =", x);
        cc.log("y =", y);
        return cc.p(x, y-40);
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

    },
});

