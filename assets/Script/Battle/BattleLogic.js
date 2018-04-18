//战斗逻辑

var BattleLogic = cc.Class({
    extends: cc.Component,

    properties: {
        _currentPlayer:null,
        _playerObjList:null,
        _roundCount:0,
        _bIsSwitchPlayer: false,
        _bBattleStart:false,
        _bTurnStart:false,

        
        _netCmdList:null,   //网络队列
        _bInCmd:false,      //是否在命令中
    },
    //1，第一个调用
    onLoad() {
        //cc.log("battle logc onLoad===>");
    },
    //2，onLoad之后调用
    start() {
        //网络全部压入队列
        cc.changit.MsgMgr.register(cc.changit.Opcode.BATTLE_START, this.OnPushNetCmd, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.MOVE, this.OnPushNetCmd, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.NEW_TURN, this.OnPushNetCmd, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.NEXT_ACTOR, this.OnPushNetCmd, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.DICE, this.OnPushNetCmd, this);

        //自定义消息立即执行
        cc.changit.MsgMgr.register(cc.changit.Opcode.MOVE_END, this.OnMoveEnd, this);

        //cc.changit.MsgMgr.register(cc.changit.Opcode.TEST, this.OnTest, this);

        //初始化地图信息
        this.mapNode = this.node.getChildByName("map");
        var tmxMap = this.mapNode.getComponent('cc.TiledMap');
        cc.changit.MapMgr.init(tmxMap);

        //角色
        this._playerObjList = new Array();
        this.player0 = this.mapNode.getChildByName("player0");
        this.player1 = this.mapNode.getChildByName("player1");
        this._playerObjList.push(this.player0);
        this._playerObjList.push(this.player1);

        this._battleUI = this.node.getChildByName("UIRoot").getComponent("BattleUI");
        
        this._battleData = cc.changit.BattleData;
        this._battleData.initRoomData(cc.changit.PlayerData.roomInfo);

        this._initPlayerObj();

        //创建网络命令队列
        this._netCmdList = new Array;

        this._startTurn();
        //cc.log("battle logc start===>");
    },
    _initPlayerObj(){
        for (var v of this._battleData.playerList){
            //cc.log("_initPlayerObj value=", v);
            var view = v.figure;
            //cc.log("形象：" + view + " uid:" + v.uid);
            this[view].getComponent("GameRole").set("uid", v.uid);
            this[view].getComponent("GameRole").set("data", v);
            //掉线上来从房间信息设置位置
            var pos = cc.changit.MapMgr.getPositionByGid(v.pos);
            this[view].setPosition(pos);
            this[view].getComponent("GameRole").set("_orginPos", pos);
        }
    },
    _startTurn(){
        if(this._battleData.status != 2 ){
            cc.log("房间还没有开启");
        }

        this._curActorId = this._battleData.curActor;
        this._currentPlayer = this.getPlayerObjByUid(this._curActorId);
        this._bTurnStart = true;//开始刷新位置

        //不是自己的回合
        if(cc.changit.PlayerData.id != this._curActorId) {
            this._battleUI.showMoveBtn(false);
            return;
        }
        var gameRoleData = this._currentPlayer.getComponent("GameRole").get("data");
        //掉线上来如果已经投过骰子
        if(gameRoleData.dice_end ){
            //岔路选择
            if(gameRoleData.branches){
                this._showBranch(gameRoleData.branches);
            }
            //没有岔路发送消息
            else{
                cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.TURN_END); 
            }
        }
        else{
            this._battleUI.showMoveBtn(true);
        }
    },
    //收到网络消息，压入队列
    OnPushNetCmd(data){
        this._netCmdList.push(data);
    },

    //net 战斗开始
    BattleStart(){
        this._battleData.status = 2;
        this._startTurn();
    },
    //net 下一个玩家
    NextActor(data){
        this._curActorId = data.actor;
        this._currentPlayer = this.getPlayerObjByUid(this._curActorId);
        this._battleUI.refreshActor(data.actor);
        this._battleUI.showMoveBtn(this._curActorId == cc.changit.PlayerData.id);
        this._switchPlayerConversionPerspective();
    },
    //net 移动
    Move(data){
        this._bInCmd = true;
        var paths = new Array();
        for(var v of data.path){
            var pos = cc.changit.MapMgr.getPositionByGid(v);
            paths.push(pos);
        }
        this._currentPlayer.getComponent("GameRole").moveByPath(paths);
    },
    //cmd 移动结束
    OnMoveEnd(){
        var playerUid = this._currentPlayer.getComponent("GameRole").get("uid");
        if(playerUid == cc.changit.PlayerData.id){
            cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.TURN_END); 
        }
        this._bInCmd = false;
    },
    //net 点数，选择岔路
    Dice(data){
        if(data.branch){
            this._showBranch(data.branch);            
        }
        this._battleData.setData("dicePoint", data.dice_point);
        this._battleUI.refreshDice(data.dice_point);
    },
    _showBranch(branchs){
        for(var i = 0; i < branchs.length; i ++){
            var branch = branchs[i];
            var len = branch.length;
            var lastPos = branch[len-1];
            var pos = cc.changit.MapMgr.getPositionByGid(lastPos);
            this.mapNode.getChildByName("branch" + i).setPosition(pos);
            this.mapNode.getChildByName("branch" + i).active = true;
        }
    },
    //net 新回合
    NewTurn(data){
        this._battleUI.refreshTurn(data.turn);
    },
    
    update(dt) {
        if (!this._bTurnStart) return;

        this.battleLoop();
        if (this._bIsSwitchPlayer) return;
        this._fixPlayerInCenter();
    },

    _fixPlayerInCenter(){
        var playerPos = this._currentPlayer.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);
        this.mapNode.setPosition(mapPos);
    },

    battleLoop(){
        if(this._bInCmd) return;
        if(this._netCmdList.length > 0){
            var cmd = this._netCmdList.shift();
            cc.log("当前执行的cmd是：", cmd.func_name, " data=", cmd.data);
            var func = this[cmd.func_name];
            if(func){
                func.call(this, cmd.data)
            }
            else{
                cc.log("找不到函数：", cmd.func_name);
            }
        }
    },

    _switchPlayerConversionPerspective(){
        this._bIsSwitchPlayer = true;
        var playerPos = this._currentPlayer.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);

        var moveAction = cc.moveTo(0.3, mapPos);
        var callback = cc.callFunc(function(){
            this._bIsSwitchPlayer = false;
        }, this);

        this.mapNode.runAction(cc.sequence(moveAction, callback));
    },

    //通过uid获取预制体
    getPlayerObjByUid(uid){
        for (var i = 0; i < this._playerObjList.length; i++) {
            var v = this._playerObjList[i];
            var vuid = v.getComponent("GameRole").get("uid");
            if(vuid == uid){
               return v;
            }
        }
    },
    onDestroy(){
        cc.log("battleLogic onDestroy");
        cc.changit.MsgMgr.remove(cc.changit.Opcode.BATTLE_START, this.OnPushNetCmd);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.MOVE, this.OnPushNetCmd);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.NEXT_ACTOR, this.OnPushNetCmd);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.DICE, this.OnPushNetCmd);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.NEW_TURN, this.OnPushNetCmd);


        cc.changit.MsgMgr.remove(cc.changit.Opcode.MOVE_END, this.OnMoveEnd);
    },

    
    // _createPlayer(index, playerData){
        // cc.log("_createPlayer index=", index);
        // cc.log(playerData);
        // var self = this;
        // //加载 Prefab
        // cc.loader.loadRes("prefab/player", function (err, prefab) {
        //     self.player1 = cc.instantiate(prefab);
        //     //player1.setPosition(self._getScenePos(6, 15));
        //     self.player1.setPosition(cc.p(0, 0));
        //     self.mapNode.addChild(self.player1);
        // });  
    // },
});
