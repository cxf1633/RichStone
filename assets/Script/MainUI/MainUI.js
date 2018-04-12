//主城界面
var MainUI = cc.Class({
    extends: cc.Component,

    properties: {
        playerNameLab : {
            default:null,
            type: cc.Label,
        },

        matchBtn : {
            default:null,
            type: cc.Button,
        },

        closeMatchBtn : {
            default:null,
            type: cc.Button,
        },

        matchTimeLab : {
            default:null,
            type: cc.Label,
        },

        _isStartMatch : false,
        _matchTime : 0,
    },

    start () {
        console.log("==========Init Main UI=============");
        cc.changit.Utils.addClickEvent(this.matchBtn, this.node, "MainUI", "_onMatchBattleClick");
        cc.changit.Utils.addClickEvent(this.closeMatchBtn, this.node, "MainUI", "_onCloseMatchBattleClick");
        this.playerNameLab.string = cc.changit.PlayerData.userName;

        cc.changit.MsgMgr.register(cc.changit.Opcode.QUICKMATCH, this._startMatchBattle, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.RETRIEVEMATCHRESULT, this._updateMatchStatus, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.CANCELMATCH, this._cancelMatch, this);

        //
        cc.changit.MsgMgr.register(cc.changit.Opcode.CONNECT_SOCKET_SUCCESS, this._getRoomData, this);
    },

    //开始匹配
    _onMatchBattleClick(){
        if (this._isStartMatch) return;
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.QUICKMATCH);
    },

    //取消匹配按钮
    _onCloseMatchBattleClick(){
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.CANCELMATCH);
    },

    //成功取消匹配
    _cancelMatch(){
        this._isStartMatch = false;
        this.matchTimeLab.string = "";
        if (this.callback != null)
            this.unschedule(this.callback);
    },

    //间隔一秒请求一次匹配数据
    _startMatchBattle(){
        this._isStartMatch = true;
        var self =  this;
        this.callback = function() {
            cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.RETRIEVEMATCHRESULT);
            self._matchTime += 1;
            self.matchTimeLab.string = self._matchTime;
        }
        this.schedule(this.callback, 1);
    },

    //更新匹配状态
    _updateMatchStatus(data){
        if (data.status == -1){
            this._isStartMatch = false;
            this.unschedule(this.callback);
            console.log("匹配失败！");
        }
        else if (data.status == -2){
            console.log("匹配中！");
        }
        else if (data.status > 0){
            this._isStartMatch = false;
            this.unschedule(this.callback);
            console.log("匹配成功！");
            cc.changit.PlayerData.set("roomId", data.status);
            cc.changit.SocketMgr.connectToServer(data.addr);
        }
    },

    _getRoomData(){
        var roomId = cc.changit.PlayerData.get("roomId");
        var uid =  cc.changit.HttpMgr.uid;
        var token = cc.changit.HttpMgr.token;
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.JOIN_ROOM, [roomId, uid, token]);
        cc.director.loadScene('battleScene');
    },

    onDestroy(){
        cc.log("MainUI onDestroy");
        cc.changit.MsgMgr.remove(cc.changit.Opcode.QUICKMATCH, this._startMatchBattle);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.RETRIEVEMATCHRESULT, this._updateMatchStatus);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.CANCELMATCH, this._cancelMatch);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.CONNECT_SOCKET_SUCCESS, this._getRoomData);
    }

});
