//战斗逻辑

var roundLogic = require("Battle/RoundLogic")

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

        this.player1 = this.mapNode.getChildByName("player1");
        this.player1.getComponent("GameRole").setMapInfo(tmxMap);
        this.player1.getComponent("GameRole").setName("player1");
        
        var gid = {x:12, y:12};
        this.player1.getComponent("GameRole").setCurrentGid(gid);

        this.player2 = this.mapNode.getChildByName("player2");
        this.player2.getComponent("GameRole").setMapInfo(tmxMap);
        var gid = {x:12, y:12};
        this.player2.getComponent("GameRole").setCurrentGid(gid);
        this.player1.getComponent("GameRole").setName("player2");

        this._playerList = new Array();
        this._playerList.push(this.player1);
        this._playerList.push(this.player2);

        var firstMan = cc.changit.mathEx.getRandom(1,2);
        var name =  this["player"+ firstMan]._name;
        cc.log("name==>>", name);
        this._currentPlayer = this["player"+ firstMan];

        cc.log("gid222:", this._currentPlayer.getComponent("GameRole").currentGid);
        // this._roundLogic = new roundLogic();
        // this._roundLoop();

        cc.changit.msgMgr.register(cc.changit.opcode.PLAYERMOVE, this._playerMove, this);
        cc.changit.msgMgr.register(cc.changit.opcode.MOVEEND, this._playerMoveEnd, this);
        
        this._startRound();
    },
    // _roundLoop:function(){
    //     this._roundCount += 2;
    //     cc.log("this._roundCount ==", this._roundCount);
    //     this._roundLogic.resetRound(this._roundCount, this._currentPlayer);
    // },
    _startRound:function(){
        this._roundCount += 2;
        var roundString = "第" + this._roundCount + "回合";
        var data = {roundCount:roundString, roundOwner:this._currentPlayer._name};
        cc.changit.msgMgr.dispatch(cc.changit.opcode.ROUND, data);
    },
   
    _playerMove:function(data){
        var paths = this._getTestPath();
        this.player1.getComponent("GameRole").moveByPath(paths);
    },
    _getTestPath: function(){
        cc.log("gid:", this._currentPlayer.getComponent("GameRole").currentGid);

        var num = cc.changit.mathEx.getRandom(1,6);
        cc.log("num:", num);

        var x =  this._currentPlayer.getComponent("GameRole").currentGid.x;
        var y =  this._currentPlayer.getComponent("GameRole").currentGid.y;
        var paths = new Array();
        for (var i = 0; i < num; i++) {
            var tx = x;
            var ty = y -= 1;
            cc.log("ty==>", ty);
            paths.push( {x:tx, y:ty} );
        }
        return paths;
    },

    _playerMoveEnd:function(){
        for (var i = 0; i < this._playerList.length; i++) {
            var player = this._playerList[i];
        }
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

    onDestroy:function(){
        cc.log("battleLogic onDestroy");

        cc.changit.msgMgr.remove(cc.changit.opcode.PLAYERMOVE, this._playerMove);
        cc.changit.msgMgr.remove(cc.changit.opcode.MOVEEND, this._playerMoveEnd);
    },
});
