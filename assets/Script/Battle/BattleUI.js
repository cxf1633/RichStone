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
        gameSpeed: {
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
        moveBtn4: {
            default: null,
            type: cc.Button
        },
        moveBtn5: {
            default: null,
            type: cc.Button
        },
        moveBtn6: {
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
        cc.changit.Utils.addClickEvent(this.moveBtn4, this.node, "BattleUI", "onClick4");
        cc.changit.Utils.addClickEvent(this.moveBtn5, this.node, "BattleUI", "onClick5");
        cc.changit.Utils.addClickEvent(this.moveBtn6, this.node, "BattleUI", "onClick6");

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
        this.roundOwner.string = "自己名字:" + playerData.userName;
        this.roundCount.string = "回合:" + battleData.roundId;
        this.nowPlayer.string = "当前玩家:" + battleData.curActor;
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
        this.nowPlayer.string = "当前玩家:" + str;
    },
    //
    refreshDice(str) {
        this.dicePoint.string = "点数:" + str;
        this.dice = str;
    },
    refreshGameSpeed(str) {
        this.gameSpeed.string = "当前速度:" + str;
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
        //cc.changit.MsgMgr.dispatch(cc.changit.Opcode.TEST);
        var speed = cc.changit.BattleData.battleSpeed;
        speed += 1;
        if(speed > 3){
            speed = 1;
        }
        this.refreshGameSpeed(speed)
        cc.changit.BattleData.battleSpeed = speed;
    },
    onClick3:function(){
        var speed = cc.changit.BattleData.battleSpeed;
        speed -= 1;
        if(speed < 1){
            speed = 1;
        }
        this.refreshGameSpeed(speed)
        cc.changit.BattleData.battleSpeed = speed;
    },
    onClick4:function(){

    },
    onClick5:function(){
        // this.res_speed = cc.changit.BattleData.battleSpeed;
        // cc.changit.BattleData.battleSpeed = 0;
        //cc.changit.BattleData.pauseAnimation();
        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.MOVE_END, "_doStopEvent");
    },
    onClick6:function(){
        //cc.changit.BattleData.battleSpeed = this.res_speed;
        cc.changit.BattleData.resumeAnimation();
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
    
    onDestroy:function(){
        cc.log("battleui onDestroy");
        cc.changit.MsgMgr.remove(cc.changit.Opcode.REFRESH_DICE, this.OnMoveEnd);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.DICE, this.OnDice);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.NEW_TURN, this._updataRoundNum);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.NEXT_ACTOR, this.OnNextActor);
        // cc.changit.MsgMgr.remove(cc.changit.Opcode.MOVE_END, this.OnMoveEnd);
    },
});
