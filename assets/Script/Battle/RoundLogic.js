//回合逻辑
var roundLogic = cc.Class({
    extends: cc.Component,
    properties: {
        _player:null,
        _roundId:0,
    },

    resetRound:function(roundId, player){
        cc.log("resetRound");
        this._player = player;
        this._roundId = roundId;
        var roundString = "第" + roundId + "回合";
        var data = {roundCount:roundString, roundOwner:player._name};
        cc.changit.msgMgr.dispatch(cc.changit.opcode.ROUND, data);
    },

    startRound:function(){
        cc.log("startRound");
    },
    endRound:function(){

    },
});
