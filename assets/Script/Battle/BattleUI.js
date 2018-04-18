//战斗UI

cc.Class({
    extends: cc.Component,

    properties: {
        roundCount: {
            default: null,
            type: cc.Label
        },
        roundOwner: {
            default: null,
            type: cc.Label
        },
        dicePoint: {
            default: null,
            type: cc.Label
        },
        roomId: {
            default: null,
            type: cc.Label
        },
        nowPlayer: {
            default: null,
            type: cc.Label
        },
        moveBtn1: {
            default: null,
            type: cc.Button
        },
        moveBtn2: {
            default: null,
            type: cc.Button
        },
        moveBtn3: {
            default: null,
            type: cc.Button
        },
        branch0: {
            default: null,
            type: cc.Button
        },
        branch1: {
            default: null,
            type: cc.Button
        },
    },
    //1，第一个调用
    onLoad: function() {


        cc.changit.Utils.addClickEvent(this.moveBtn1, this.node, "BattleUI", "onClick1");
        cc.changit.Utils.addClickEvent(this.moveBtn2, this.node, "BattleUI", "onClick2");
        cc.changit.Utils.addClickEvent(this.moveBtn3, this.node, "BattleUI", "onClick3");

        cc.changit.Utils.addClickEvent(this.branch0, this.node, "BattleUI", "onClickBranch0");
        cc.changit.Utils.addClickEvent(this.branch1, this.node, "BattleUI", "onClickBranch1");

        // cc.changit.MsgMgr.register(cc.changit.Opcode.DICE, this.OnDice, this);
        // cc.changit.MsgMgr.register(cc.changit.Opcode.NEW_TURN, this.OnNewTurn, this);
        // cc.changit.MsgMgr.register(cc.changit.Opcode.NEXT_ACTOR, this.OnNextActor, this);

        // cc.changit.MsgMgr.register(cc.changit.Opcode.MOVE_END, this.OnMoveEnd, this);

        cc.changit.MsgMgr.register(cc.changit.Opcode.MOVE_ONE, this.OnMoveOne, this);
        //cc.log("battle ui onLoad===>");
    },
    start(){
        //cc.log("battle ui start===>");
        this._updataRoomInfo();
        //发送加载完成
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.LOAD_END);
        var roomId = cc.changit.PlayerData.get("roomId");
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.GM_SET_NOT_AUTO, [roomId, true]);
    },
    _updataRoomInfo(){
        var playerData = cc.changit.PlayerData;
        var battleData = cc.changit.BattleData
        this.roundOwner.string = "玩家:" + playerData.userName;
        this.roundCount.string = "回合:" + battleData.roundId;
        this.nowPlayer.string = "当前:" + battleData.curActor;
        this.roomId.string = "房间：" + battleData.roomId;
        
        // var data = battleData.getPlayerDataByUid(playerData.id);
        // //没有投过骰子并且是自己回合
        // if(!data.dice_over && playerData.id == battleData.curActor){
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
    OnMoveOne(){
        // this.dice -= 1;
        // this.dicePoint.string = "点数:" + this.dice;
    },
    onClick1:function(){
        cc.log("onClick1==>>");
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.DICE, [1]);
        this.showMoveBtn(false);
    },
    onClick2:function(){
        cc.log("onClick2==>>");
        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.TEST);
    },
    onClick3:function(){
        cc.log("onClick3==>>");
        //cc.changit.SocketMgr.sendPackage("JoinRoom", 123, 456, "789");
        //cc.changit.MsgMgr.remove("test", this.doTest2);
    },
    onClickBranch0:function(){
        cc.log("onClickBranch0==>>");
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.CHOOSE_BRANCH, [0]);
        this.branch0.node.active = false;
        this.branch1.node.active = false;
    },
    onClickBranch1:function(){
        cc.log("onClickBranch1==>>");
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.CHOOSE_BRANCH, [1]); 
        this.branch0.node.active = false;
        this.branch1.node.active = false;
    },
    

    doTest:function(param){
        cc.log("doTest==>", param);
    },
    doTest2:function(param){
        cc.log("doTest2==>>", param);
    },

    onDestroy:function(){
        cc.log("battleui onDestroy");
        cc.changit.MsgMgr.remove(cc.changit.Opcode.REFRESH_DICE, this.OnMoveEnd);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.DICE, this.OnDice);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.NEW_TURN, this._updataRoundNum);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.NEXT_ACTOR, this.OnNextActor);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.MOVE_END, this.OnMoveEnd);
    },
});
