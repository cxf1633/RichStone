//战斗UI
var BattleData = require("BattleData");

var BaseCompont = require("BaseCompont");
var BattleUI = cc.Class({
    extends: BaseCompont,

    properties: {
        owner:cc.Node,
        roundCount: cc.Label,
        roundOwner: cc.Label,
        dicePoint: cc.Label,
        roomId: cc.Label,
        nowPlayer:cc.Label,
        playerMoney: cc.Label,
        moveBtn1: cc.Button,
        moveBtn2: cc.Button,
        moveBtn3:  cc.Button,
        branch0: cc.Button,
        branch1: cc.Button,
        openBtn: cc.Button,
        buildHouseUI: cc.Node,
    },
    //1，第一个调用
    onLoad() {
        //cc.log("battle ui onLoad===>");
    },
    start(){
        //cc.log("battle ui start===>");

        cc.vv.Utils.addClickEvent(this.moveBtn1, this.node, "BattleUI", "onClick1");
        cc.vv.Utils.addClickEvent(this.moveBtn2, this.node, "BattleUI", "onClick2");
        cc.vv.Utils.addClickEvent(this.moveBtn3, this.node, "BattleUI", "onClick3");
        cc.vv.Utils.addClickEvent(this.branch0, this.node, "BattleUI", "onClickBranch0");
        cc.vv.Utils.addClickEvent(this.branch1, this.node, "BattleUI", "onClickBranch1");

        cc.vv.MsgMgr.register(cc.vv.Opcode.BUY_HOUSE, this.OnOpenBulidHousePanel, this); //测试
        
        this.owner = this.owner.getComponent('Battle');
        this.owner.LoadEnd();
    },
    updataRoomInfo(userData, battleData){
        this.roundOwner.string = "玩家:" + userData.userName;
        this.roundCount.string = "回合:" + battleData.roundId;
        this.nowPlayer.string = "当前:" + battleData.curActor;
        this.roomId.string = "房间：" + battleData.roomId;
        this.playerMoney.string = "金钱:" + battleData.getUserDataByUid(userData.userId).money;
        
        // var data = battleData.getUserDataByUid(userData.userId);
        // //没有投过骰子并且是自己回合
        // if(!data.dice_over && userData.userId == battleData.curActor){
        //     this.showMoveBtn(true);
        // }
        // else{
        //     this.showMoveBtn(false);
        // }
    },
    showMoveBtn(ret){
        this.moveBtn1.node.active = ret;
    },
    //
    refreshTurn(str){
        this.roundCount.string = "回合:" + str;
    },
    //
    refreshActor(str){
        this.nowPlayer.string = "当前:" + str;
    },
    //
    refreshDice(str) {
        this.dicePoint.string = "点数:" + str;
        this.dice = str;
    },
    //
    refreshMoney(str, currentMoney) {
        var differenceMoney = currentMoney - str;
        var _tempLabel = "";
        if(differenceMoney === 0) {
            return
        }
        else if(differenceMoney > 0) {
            _tempLabel = " - " + differenceMoney;
        }
        else if(differenceMoney < 0) {
            _tempLabel = " + " + Math.abs(differenceMoney);
        }
        this.playerMoney.string = "金钱:" + currentMoney + _tempLabel;
        var timeCallback = function (dt) {
            this.playerMoney.string = "金钱:" + str;
        }
        this.scheduleOnce(timeCallback, 1);
        
    },
    onClick1:function(){
        cc.log("onClick1==>>");
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.DICE, [1]);
        this.showMoveBtn(false);
    },
    onClick2:function(){
        cc.log("onClick2==>>");
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.TEST);
    },
    onClick3:function(){
        cc.log("onClick3==>>");
        //cc.vv.SocketMgr.sendPackage("JoinRoom", 123, 456, "789");
        //cc.vv.MsgMgr.remove("test", this.doTest2);
    },
    onClickBranch0:function(){
        cc.log("onClickBranch0==>>");
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.CHOOSE_BRANCH, [0]);
        this.branch0.node.active = false;
        this.branch1.node.active = false;
    },
    onClickBranch1:function(){
        cc.log("onClickBranch1==>>");
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.CHOOSE_BRANCH, [1]); 
        this.branch0.node.active = false;
        this.branch1.node.active = false;
    },
    
    OnOpenBulidHousePanel: function(_landsData) {
        if(this.buildHouseUI.active == false) {
            this.buildHouseUI.getComponent("BuildHouseUI").openAndUpdatePanel(_landsData);
        }
    },

    onDestroy:function(){
        cc.log("battleui onDestroy");
        cc.vv.MsgMgr.remove(cc.vv.Opcode.BUY_HOUSE, this.OnOpenBulidHousePanel);
    },
});
