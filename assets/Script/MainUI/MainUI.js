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
        enterBattleBtn : {
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

        cc.changit.Utils.addClickEvent(this.enterBattleBtn, this.node, "MainUI", "_enterBattleScene");

        this.playerNameLab.string = cc.changit.PlayerData.userName;

        cc.changit.MsgMgr.register(cc.changit.Opcode.QUICK_MATCH, this._startMatchBattle, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.RETRIEVE_MATCH_RESULT, this._updateMatchStatus, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.CANCEL_MATCH, this._cancelMatch, this);

        //
        cc.changit.MsgMgr.register(cc.changit.Opcode.CONNECT_SOCKET_SUCCESS, this.OnConnectSocket, this);

        cc.changit.MsgMgr.register(cc.changit.Opcode.ENTER_BATTLE, this.OnEnterBattle, this);

        cc.changit.MsgMgr.register(cc.changit.Opcode.ROOM_INFO, this.OnRoomInfo, this);

        cc.changit.MsgMgr.register(cc.changit.Opcode.JOIN_ROOM, this.OnJoinRoom, this);

        //初始主界面的时候 发送一次"RetrieveMatchResult" 获取战斗匹配状态 如果在战斗中 直接进入战斗
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.RETRIEVE_MATCH_RESULT);
    },
    _enterBattleScene(){
        cc.director.loadScene('battleScene');
    },
    //开始匹配
    _onMatchBattleClick(){
        if (this._isStartMatch) return;
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.QUICK_MATCH);
    },

    //取消匹配按钮
    _onCloseMatchBattleClick(){
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.CANCEL_MATCH);
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
        this._matchTime = 0
        this.callback = function() {
            cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.RETRIEVE_MATCH_RESULT);
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
    //webSocket 连接成功
    OnConnectSocket(){
        var roomId = cc.changit.PlayerData.get("roomId");
        var uid =  cc.changit.HttpMgr.uid;
        var token = cc.changit.HttpMgr.token;
        //房间数据初始化
        //cc.changit.RoomData.init();
        //发送完joinRoom会推送房间数据
        cc.changit.SocketMgr.sendPackage(cc.changit.Opcode.JOIN_ROOM, [roomId, uid, token]);

    },
    OnJoinRoom(cmd){
        cc.log("OnJoinRoom =", cmd);
    },
    
    //收到房间数据就进入游戏
    OnRoomInfo(cmd){
        // cc.log("OnRoomInfo===>>>data:", cmd.func_name);
        // cc.log("OnRoomInfo===>>>data:", cmd.data);
        cc.changit.PlayerData.roomInfo = cmd.data;
        cc.director.loadScene('battleScene');
    },
    onDestroy(){
        cc.log("MainUI onDestroy");
        cc.changit.MsgMgr.remove(cc.changit.Opcode.QUICK_MATCH, this._startMatchBattle);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.RETRIEVE_MATCH_RESULT, this._updateMatchStatus);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.CANCEL_MATCH, this._cancelMatch);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.CONNECT_SOCKET_SUCCESS, this.OnConnectSocket);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.ENTER_BATTLE, this.OnEnterBattle);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.ROOM_INFO, this.OnRoomInfo);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.JOIN_ROOM, this.OnJoinRoom);
    }

});
