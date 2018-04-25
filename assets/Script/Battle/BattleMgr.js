var BaseCompont = require("BaseCompont");
var MapMgrClass = require("MapMgr");
var MapMgr = new MapMgrClass();
var BattleData = require("BattleData");
//战斗逻辑
var BattleMgr = cc.Class({
    extends: BaseCompont,

    properties: {
        _currentPlayer:null,
        _playerObjList:null,
        _roundCount:0,
        _bIsSwitchPlayer: false,
        _bBattleStart:false,
        _bTurnStart:false,
    
        
        _netCmdList:null,   //网络队列
        _bInCmd:false,      //是否在命令中
    
        _gridLvDataTable: null, //grid_lv表数据
        _mapGridTable: null,    //map_grid表数据
        _mapHouseTable: [],
        _mapHouseMode: null,
        _mapHouseParent: null,
        //
        mapNode: cc.Node,
    },
    _bTouch:false,
    start () {
        //创建网络命令队列
        this._netCmdList = new Array;
        //网络全部压入队列
        cc.vv.MsgMgr.register(cc.vv.Opcode.BATTLE_START, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.MOVE, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.NEW_TURN, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.NEXT_ACTOR, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.DICE, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.NEW_CIRCLE, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.UPDATE_MONEY, this.OnPushNetCmd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.ACQUIREHOUSE, this.OnPushNetCmd, this);

        //自定义消息立即执行
        cc.vv.MsgMgr.register(cc.vv.Opcode.MOVE_END, this.OnMoveEnd, this);

        //初始化地图信息
        var tmxMap = this.mapNode.getComponent('cc.TiledMap');
        MapMgr.init(tmxMap);

        //地块控件
        this._mapHouseMode = this.mapNode.getChildByName("House");
        this._mapHouseParent = this.mapNode.getChildByName("houseParent");

        //地图信息
        this._battleData = new BattleData();
        this._battleData.initRoomData(cc.vv.UserData.get("roomInfo"));
        cc.vv.BattleData = this._battleData;

        //初始化角色
        this.initPlayerObj();

        //初始化房子
        this.initMapHouseObj();

        //刷新UI 
        this._battleUI = this.node.getChildByName("BattleUI").getComponent("BattleUI");
        this._battleUI.updataRoomInfo(cc.vv.UserData, this._battleData);


    },
    //UI调用
    LoadEnd(){
        //发送加载完成
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.LOAD_END);
        var roomId = cc.vv.UserData.get("roomId");
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.GM_SET_NOT_AUTO, [roomId, true]);
        this.startTurn();
    },

    initPlayerObj(){
        this._playerObjList = new Array();
        var roleRoot = this.mapNode.getChildByName("roleRoot");
        this.player0 = roleRoot.getChildByName("player0");
        this.player1 = roleRoot.getChildByName("player1");
        this._playerObjList.push(this.player0);
        this._playerObjList.push(this.player1);

        for (var v of this._battleData.playerList){
            var view = v.figure;
            //cc.log("形象：" + view + " uid:" + v.uid);
            this[view].getComponent("RoleMgr").initData(v);
            //掉线上来从房间信息设置位置
            var pos = MapMgr.getPositionByGid(v.pos);
            this[view].setPosition(pos);
            this[view].getComponent("RoleMgr").set("curPos", pos);
            //cc.log("curPos:", pos);
        }
    },
    initMapHouseObj() {
        var _tempLandsData = this._battleData.lands;
        if(this._mapGridTable === null) {
            this._mapGridTable = cc.vv.ConfigData.getConfigData("map_grid");
        }

        var _tempLandPosTable = [];
        for (var k in _tempLandsData) {
            var _housePos = MapMgr.getPositionByGid(_tempLandsData[k].id);
            _tempLandPosTable.push({key: k, pos: _housePos});
        }

        //冒泡排序 排序出渲染顺序
        for(var i = 0; i < _tempLandPosTable.length - 1; i++){
            for(var j = 0; j < _tempLandPosTable.length - 1 - i; j++){
                if(_tempLandPosTable[j].pos.y < _tempLandPosTable[j + 1].pos.y){
                    var temp = _tempLandPosTable[j];
                    _tempLandPosTable[j] = _tempLandPosTable[j + 1];
                    _tempLandPosTable[j + 1] = temp;
                }
            }
        }

        for (var v of _tempLandPosTable) {
            this._mapHouseTable[v.key] = cc.instantiate(this._mapHouseMode);
            this._mapHouseTable[v.key].setPosition(v.pos);
            this._mapHouseTable[v.key].getComponent("GameHouse").set("mapId", _tempLandsData[v.key].id);
            this._mapHouseTable[v.key].getComponent("GameHouse").set("data", _tempLandsData[v.key]);
            this._mapHouseTable[v.key].getComponent("GameHouse").set("mapFridData", this._mapGridTable[_tempLandsData[v.key] - 1]);

            this._mapHouseTable[v.key].parent = this._mapHouseParent
            this._mapHouseTable[v.key].active = true;
        }
    },
    startTurn(){
        if(this._battleData.status != 2 ){
            cc.log("房间还没有开启");
        }

        this._curActorId = this._battleData.curActor;
        this._currentPlayer = this.getPlayerObjByUid(this._curActorId);
        this._bTurnStart = true;//开始刷新位置

        //不是自己的回合
        if(cc.vv.UserData.userId != this._curActorId) {
            this._battleUI.showGoBtn(false);
            return;
        }

        var gameRole = this._currentPlayer.getComponent("RoleMgr");
        //掉线上来如果已经投过骰子
        if(gameRole.get("dice_end") ){
            //岔路选择
            if(gameRole.get("branches")){
                this.showBranch(gameRole.get("branches"));
            }
            //没有岔路发送消息
            else{
                cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.TURN_END); 
            }
        }
        else{
            this._battleUI.showGoBtn(true);
        }
    },
    //收到网络消息，压入队列
    OnPushNetCmd(data){
        this._netCmdList.push(data);
    },

    //net 战斗开始
    BattleStart(){
        this._battleData.status = 2;
        this.startTurn();
    },
    //net 下一个玩家
    NextActor(data){
        this._curActorId = data.actor;
        this._currentPlayer = this.getPlayerObjByUid(this._curActorId);
        this._battleUI.refreshActor(data.actor);
        this._battleUI.showGoBtn(this._curActorId == cc.vv.UserData.userId);
        this.switchPlayerConversionPerspective();
    },
    //net 移动
    Move(data){
        this._bTouch = false;
        this._bInCmd = true;
        var pathObjs = new Array();
        for(var v of data.path){
            var p = MapMgr.getPositionByGid(v);
            cc.log("格子=", v, "坐标=",p);
            var pathOjb = {
                id:v,
                pos:p
            }
            pathObjs.push(pathOjb);
        }
        this._currentPlayer.getComponent("RoleMgr").moveByPath(pathObjs);
    },

    OnMoveEnd() {
        var playerUid = this._currentPlayer.getComponent("RoleMgr").get("uid");
        if(playerUid == cc.vv.UserData.userId){
            cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.TURN_END); 
        }
        this._bInCmd = false;
    },
    
    //net 点数，选择岔路
    Dice(data){
        if(data.branch){
            this.showBranch(data.branch);            
        }
        this._battleData.setData("dicePoint", data.dice_point);
        this._battleUI.refreshDice(data.dice_point);
    },
    showBranch(branchs){
        var posList = new Array;
        for(var i = 0; i < branchs.length; i ++){
            var branch = branchs[i];
            var len = branch.length;
            var lastPos = branch[len-1];
            var pos = MapMgr.getPositionByGid(lastPos);
            cc.log("showBranch pos:", pos);
            posList.push(pos);
            // var arrows = this.mapNode.getChildByName("arrows_blue_" +i);
            // arrows.setPosition(pos);
            // arrows.active = true;
        }
        this._battleUI.showBranchUI(posList);
    },

    AcquireHouse(data){
        this._battleData.setlandState(data.id, data);
        this._mapHouseTable[data.id].getComponent("GameHouse").upgradeHouse("data", data);
    },
    //net 新回合
    NewTurn(data){
        this._battleUI.refreshTurn(data.turn);
    },

    // 新的一圈
    NewCircle(data) {
        this._battleData.setUserDataByUid(data.uid, "circle", data.circle);
    },

    //更新金钱
    UpdateMoney(data) {
        for (var k in data) {
            if(cc.vv.UserData.userId == k) {
                this._battleUI.refreshMoney(data[k], this._battleData.getUserDataByUid(k).money);
            }
            this._battleData.setUserDataByUid(k, "money", data[k]);
        }
    },

    update(dt) {
        if (!this._bTurnStart) return;
        this.battleLoop();
        if (this._bIsSwitchPlayer || this._bTouch) return;
        this.fixPlayerInCenter();
    },

    fixPlayerInCenter(){
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

    switchPlayerConversionPerspective(){
        this._bIsSwitchPlayer = true;
        var playerPos = this._currentPlayer.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);

        var moveAction = cc.moveTo(0.3, mapPos);
        var callback = cc.callFunc(function(){
            this._bIsSwitchPlayer = false;
        }, this);

        this.mapNode.runAction(cc.sequence(moveAction, callback));
    },

    isMyTurn(uid){
        return uid == cc.vv.UserData.userId;
    },
    //通过uid获取预制体
    getPlayerObjByUid(uid){
        for (var i = 0; i < this._playerObjList.length; i++) {
            var v = this._playerObjList[i];
            var vuid = v.getComponent("RoleMgr").get("uid");
            if(vuid == uid){
            return v;
            }
        }
    },

    onDestroy(){
        cc.log("battleLogic onDestroy");
        cc.vv.MsgMgr.remove(cc.vv.Opcode.BATTLE_START, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.MOVE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEXT_ACTOR, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.DICE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEW_TURN, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEW_CIRCLE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.UPDATE_MONEY, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.ACQUIREHOUSE, this.OnPushNetCmd);
    },
});
