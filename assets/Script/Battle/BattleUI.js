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
    },
    //1，第一个调用
    onLoad: function() {


        cc.changit.utils.addClickEvent(this.moveBtn1, this.node, "BattleUI", "onClick1");
        cc.changit.utils.addClickEvent(this.moveBtn2, this.node, "BattleUI", "onClick2");
        cc.changit.utils.addClickEvent(this.moveBtn3, this.node, "BattleUI", "onClick3");

        cc.changit.msgMgr.register(cc.changit.opcode.ROUND, this.roundChange, this);
    },

    roundChange:function(data){
        this.roundCount.string = data.roundCount;
        this.roundOwner.string = data.roundOwner;
    },
    onClick1:function(){
        cc.log("onClick1==>>");
        cc.changit.msgMgr.dispatch(cc.changit.opcode.PLAYER_MOVE, "ff11");
        //cc.changit.msgMgr.register("test", this.doTest2, this);
    },
    onClick2:function(){
        cc.log("onClick2==>>");
        //cc.changit.msgMgr.dispatch("test", "ff11");
    },
    onClick3:function(){
        cc.log("onClick3==>>");
        //cc.changit.msgMgr.remove("test", this.doTest2);
    },

    doTest:function(param){
        cc.log("doTest==>", param);
    },
    doTest2:function(param){
        cc.log("doTest2==>>", param);
    },

    onDestroy:function(){
        cc.log("battleui onDestroy");
        cc.changit.msgMgr.remove(cc.changit.opcode.ROUND, this.roundChange);
    },
});
