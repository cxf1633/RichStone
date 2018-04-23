var BaseCompont = require("BaseCompont");
var MapMgrClass = require("MapMgr");
var MapMgr = new MapMgrClass();
var BattleData = require("BattleData");
//战斗逻辑
var Battle = cc.Class({
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
        cc.vv.MsgMgr.register(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.MOVE_END, this.OnMoveEnd, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.TEST, this.OnTest, this);

        //初始化地图信息
        var tmxMap = this.mapNode.getComponent('cc.TiledMap');
        MapMgr.init(tmxMap);

        //地块控件
        this._mapHouseMode = this.mapNode.getChildByName("House");
        this._mapHouseParent = this.mapNode.getChildByName("houseParent");

        //角色
        this._playerObjList = new Array();
        this.player0 = this.mapNode.getChildByName("player0");
        this.player1 = this.mapNode.getChildByName("player1");
        this._playerObjList.push(this.player0);
        this._playerObjList.push(this.player1);

        this._battleUI = this.node.getChildByName("BattleUI").getComponent("BattleUI");
        
        this._battleData = new BattleData();
        this._battleData.initRoomData(cc.vv.UserData.get("roomInfo"));
        cc.vv.BattleData = this._battleData;

        this.initPlayerObj();

        this.initMapHouseObj();
        //刷新UI
        this._battleUI.updataRoomInfo(cc.vv.UserData, this._battleData);

        this.startTurn();
    },
    //UI调用
    LoadEnd(){
        //发送加载完成
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.LOAD_END);
        var roomId = cc.vv.UserData.get("roomId");
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.GM_SET_NOT_AUTO, [roomId, true]);
    },
    initPlayerObj(){
        for (var v of this._battleData.playerList){
            //cc.log("_initPlayerObj value=", v);
            var view = v.figure;
            //cc.log("形象：" + view + " uid:" + v.uid);
            this[view].getComponent("GameRole").set("uid", v.uid);
            this[view].getComponent("GameRole").set("data", v);
            //掉线上来从房间信息设置位置
            var pos = MapMgr.getPositionByGid(v.pos);
            this[view].setPosition(pos);
            this[view].getComponent("GameRole").set("orginPos", pos);
            this[view].getComponent("GameRole").set("curPos", pos);
        }
    },
    initMapHouseObj() {
        var _tempLandsData = this._battleData.lands;
        if(this._mapGridTable === null) {
            this._mapGridTable = cc.vv.ConfigData.getConfigData("map_grid");
        }
        for (var k in _tempLandsData) { 
            this._mapHouseTable[k] = cc.instantiate(this._mapHouseMode);
            var _housePos = MapMgr.getPositionByGid(k);
            this._mapHouseTable[k].setPosition(_housePos);
            this._mapHouseTable[k].getComponent("GameHouse").set("mapId", _tempLandsData[k].id);
            this._mapHouseTable[k].getComponent("GameHouse").set("data", _tempLandsData[k]);

            this._mapHouseTable[k].parent = this._mapHouseParent
            this._mapHouseTable[k].active = true;
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
            this._battleUI.showMoveBtn(false);
            return;
        }
        var gameRoleData = this._currentPlayer.getComponent("GameRole").get("data");
        //掉线上来如果已经投过骰子
        if(gameRoleData.dice_end ){
            //岔路选择
            if(gameRoleData.branches){
                this.showBranch(gameRoleData.branches);
            }
            //没有岔路发送消息
            else{
                cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.TURN_END); 
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
        this.startTurn();
    },
    //net 下一个玩家
    NextActor(data){
        this._curActorId = data.actor;
        this._currentPlayer = this.getPlayerObjByUid(this._curActorId);
        this._battleUI.refreshActor(data.actor);
        this._battleUI.showMoveBtn(this._curActorId == cc.vv.UserData.userId);
        this.switchPlayerConversionPerspective();
    },
    //net 移动
    Move(data){
        this._bInCmd = true;
        var paths = new Array();
        var finallyLandId = data.path[data.path.length - 1];//测试
        this._currentPlayer.getComponent("GameRole").set("finallyLandId", finallyLandId);//测试
        for(var v of data.path){
            var pos = MapMgr.getPositionByGid(v);
            paths.push(pos);
        }
        this._currentPlayer.getComponent("GameRole").moveByPath(paths);
    },
    //cmd 移动结束
    OnEventDispose(){//测试
        var playerUid = this._currentPlayer.getComponent("GameRole").get("uid");
        if(playerUid == cc.vv.UserData.userId){
            var _finallyLandId = this._currentPlayer.getComponent("GameRole").get("finallyLandId");

            if(this._mapGridTable === null) {
                this._mapGridTable = cc.vv.ConfigData.getConfigData("map_grid");
            }
            var _mapGrid = this._mapGridTable[this._currentPlayer.getComponent("GameRole").get("finallyLandId") - 1]; //获取配置表下标从0开始 需 -1
            if(_mapGrid.grid_type === 1) {
                var _landData = this._battleData.getlandState(_mapGrid.attach_grid_id);
                if(_landData.owner_id == 0 || _landData.owner_id == playerUid) {

                    if(this._gridLvDataTable === null) {
                        this._gridLvDataTable = cc.vv.ConfigData.getConfigData("grid_lv");
                    }
                    var _UserData = this._battleData.getUserDataByUid(playerUid);

                    var _urrentLv = _landData.lv;

                    if(_UserData.circle > _urrentLv) {
                        var _testData = this._gridLvDataTable[_urrentLv + 1];
                        if(_testData.is_landmark == 0) {
                            var _lvCost = _testData.lv_cost_times * _mapGrid.cost;
                            
                            if(_UserData.money >= _lvCost) {
                                cc.vv.MsgMgr.dispatch(cc.vv.Opcode.BUY_HOUSE, _mapGrid);
                            }
                            else {
                                cc.vv.Tooltip.show("金钱不足,不能购买");
                                this.OnMoveEnd();
                            }
                        }
                        else {
                            //地标(新框)
                            cc.vv.Tooltip.show("是否购买地标");
                        }
                    }
                    else {
                        cc.vv.Tooltip.show("圈数不足,不能购买");
                        this.OnMoveEnd();
                    }
                }
                else{
                    //cc.vv.Tooltip.show("你移动到得地块是 UID:" + _landData.owner_id + " 的土地, 需要缴交过路费");
                    this.OnMoveEnd();
                }
            }
            else {
                this.OnMoveEnd();
            }
        }
        else {
            this._bInCmd = false;
        }
    },
    OnMoveEnd() {
        var playerUid = this._currentPlayer.getComponent("GameRole").get("uid");
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
        for(var i = 0; i < branchs.length; i ++){
            var branch = branchs[i];
            var len = branch.length;
            var lastPos = branch[len-1];
            var pos = MapMgr.getPositionByGid(lastPos);
            this.mapNode.getChildByName("branch" + i).setPosition(pos);
            this.mapNode.getChildByName("branch" + i).active = true;
        }
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
        if (this._bIsSwitchPlayer) return;
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
        cc.vv.MsgMgr.remove(cc.vv.Opcode.BATTLE_START, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.MOVE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEXT_ACTOR, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.DICE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEW_TURN, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NEW_CIRCLE, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.UPDATE_MONEY, this.OnPushNetCmd);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.ACQUIREHOUSE, this.OnPushNetCmd);

        cc.vv.MsgMgr.remove(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.TEST, this.OnTest);
    },
});
