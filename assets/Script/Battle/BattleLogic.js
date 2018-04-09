//战斗逻辑

cc.Class({
    extends: cc.Component,

    properties: {
        _currentPlayer:null,
        _playerList:null,
        _roundCount:0,
    },
    //1，第一个调用
    onLoad: function() {
    
    },
    //2，onLoad之后调用
    start: function() {
        
        cc.changit.msgMgr.register(cc.changit.opcode.PLAYER_MOVE, this._playerMove, this);
        cc.changit.msgMgr.register(cc.changit.opcode.MOVE_END, this._playerMoveEnd, this);

        this.mapNode = this.node.getChildByName("map");
        var tmxMap = this.mapNode.getComponent('cc.TiledMap');
        // var self = this;
        // //加载 Prefab
        // cc.loader.loadRes("prefab/player", function (err, prefab) {
        //     self.player1 = cc.instantiate(prefab);
        //     //player1.setPosition(self._getScenePos(6, 15));
        //     self.player1.setPosition(cc.p(0, 0));
        //     self.mapNode.addChild(self.player1);
        // });

        var gid = {x:12, y:12};
        this.player1 = this.mapNode.getChildByName("player1");
        this.player1.getComponent("GameRole").setMapInfo(tmxMap);
        this.player1.getComponent("GameRole").set("currentGid", gid);
        this.player1.getComponent("GameRole").set("name", "player1");


        this.player2 = this.mapNode.getChildByName("player2");
        this.player2.getComponent("GameRole").setMapInfo(tmxMap);
        this.player2.getComponent("GameRole").set("currentGid", gid);
        this.player2.getComponent("GameRole").set("name", "player2");

        this._playerList = new Array();
        this._playerList.push(this.player1);
        this._playerList.push(this.player2);

        //随机一个先开始
        var firstMan = cc.changit.mathEx.getRandom(1,2);
        if(firstMan == 1){
            this.player1.getComponent("GameRole").set("index", 1);
            this.player2.getComponent("GameRole").set("index", 2);
        }
        else{
            this.player1.getComponent("GameRole").set("index", 2);
            this.player2.getComponent("GameRole").set("index", 1);
        }
        this._roundLoop();

    },
    //回合循环
    _roundLoop:function(){
        this._roundCount += 1;
        cc.log("回合：", this._roundCount);

        var player = null;
        for (var i = 0; i < this._playerList.length; i++) {
            var index = this._playerList[i].getComponent("GameRole").get("index");
            cc.log("index", index);
            if(index == 1){
                player = this._playerList[i];
                break;
            }
        }
        if(player != null){
            this._currentPlayer = player;
            this._currentPlayer.getComponent("GameRole").doRound(this._roundCount);
        }    
    },

    _playerMoveEnd:function(){
        var player = this._findNextPlayer();
        if(player != null){
            this._currentPlayer = player;
            player.getComponent("GameRole").doRound(this._roundCount);
        }
        else{
            this._roundLoop();
        }
    },
    _findNextPlayer:function(){
        var player = null;
        for (var i = 0; i < this._playerList.length; i++) {
            var roundCound = this._playerList[i].getComponent("GameRole")._roundCount;
            cc.log("_playerMoveEnd roundCound ==", roundCound);
            if(roundCound < this._roundCount){
                player = this._playerList[i];
                break;
            }
        }
        return player;
    },
    _playerMove:function(data){
        var paths = this._getTestPath();
        this._currentPlayer.getComponent("GameRole").moveByPath(paths);
    },
    _getTestPath: function(){
        var num = cc.changit.mathEx.getRandom(1,3);
        var x =  this._currentPlayer.getComponent("GameRole").get("currentGid").x;
        var y =  this._currentPlayer.getComponent("GameRole").get("currentGid").y;

        var paths = new Array();
        for (var i = 0; i < num; i++) {
            var tx = x;
            var ty = y -= 1;
            paths.push( {x:tx, y:ty} );
        }
        return paths;
    },

    // called every frame
    update: function (dt) {
        this._fixPlayerInCenter();
    },

    _fixPlayerInCenter: function(){
        var playerPos = this._currentPlayer.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);
        this.mapNode.setPosition(mapPos);
    },

    onDestroy:function(){
        cc.log("battleLogic onDestroy");
        cc.changit.msgMgr.remove(cc.changit.opcode.PLAYER_MOVE, this._playerMove);
        cc.changit.msgMgr.remove(cc.changit.opcode.MOVE_END, this._playerMoveEnd);
    },
});
