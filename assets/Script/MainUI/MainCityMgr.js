//主城界面
var BaseCompont = require("BaseCompont");

var MainCityMgr = cc.Class({
    extends: BaseCompont,

    properties: {
        _isStartMatch : false,
        ui: cc.Node,
    },
    start(){
        this.ui = this.ui.getComponent('MainCityUI');
        cc.vv.MsgMgr.register(cc.vv.Opcode.QUICK_MATCH, this.OnStartMatch, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.RETRIEVE_MATCH_RESULT, this.OnUpdateMatchStatus, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.CANCEL_MATCH, this.OnCancelMatch, this);

        //
        cc.vv.MsgMgr.register(cc.vv.Opcode.CONNECT_SOCKET_SUCCESS, this.OnConnectSocket, this);

        cc.vv.MsgMgr.register(cc.vv.Opcode.ENTER_BATTLE, this.OnEnterBattle, this);

        cc.vv.MsgMgr.register(cc.vv.Opcode.ROOM_INFO, this.OnRoomInfo, this);

        cc.vv.MsgMgr.register(cc.vv.Opcode.JOIN_ROOM, this.OnJoinRoom, this);

        //初始主界面的时候 发送一次"RetrieveMatchResult" 获取战斗匹配状态 如果在战斗中 直接进入战斗
        cc.vv.HttpMgr.sendLogicRequest(cc.vv.Opcode.RETRIEVE_MATCH_RESULT);
    },
    StartMatch(){
        if (this._isStartMatch) return;
        cc.vv.HttpMgr.sendLogicRequest(cc.vv.Opcode.QUICK_MATCH);
    },
    //间隔一秒请求一次匹配数据
    OnStartMatch(){
        this._isStartMatch = true;
        var self =  this;
        this._matchTime = 0
        this.callback = function() {
            cc.vv.HttpMgr.sendLogicRequest(cc.vv.Opcode.RETRIEVE_MATCH_RESULT);
            self._matchTime += 1;
            this.ui.UpdataMatchTime(self._matchTime);
        }
        this.schedule(this.callback, 1);
    },
    //更新匹配状态
    OnUpdateMatchStatus(data){
        if (data.status == -1){
            this._isStartMatch = false;
            this.unschedule(this.callback);
            cc.log("匹配失败！");
        }
        else if (data.status == -2){
            cc.log("匹配中！");
        }
        else if (data.status > 0){
            this._isStartMatch = false;
            this.unschedule(this.callback);
            cc.log("匹配成功！");
            cc.vv.UserData.set("roomId", data.status);
            cc.vv.SocketMgr.connectToServer(data.addr);
        }
    },
    //webSocket 连接成功
    OnConnectSocket(){
        var roomId = cc.vv.UserData.get("roomId");
        var uid =  cc.vv.HttpMgr.uid;
        var token = cc.vv.HttpMgr.token;
        //房间数据初始化
        //cc.vv.RoomData.init();
        //发送完joinRoom会推送房间数据
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.JOIN_ROOM, [roomId, uid, token]);
    },
    OnJoinRoom(cmd){
        cc.log("OnJoinRoom =", cmd);
    },
    
    //收到房间数据就进入游戏
    OnRoomInfo(cmd){
        // cc.log("OnRoomInfo===>>>data:", cmd.func_name);
        // cc.log("OnRoomInfo===>>>data:", cmd.data);
        cc.vv.UserData.set("roomInfo", cmd.data);
        cc.director.loadScene('battleScene');
    },
    CloseMatch(){
        cc.vv.HttpMgr.sendLogicRequest(cc.vv.Opcode.CANCEL_MATCH);
    },
    //成功取消匹配
    OnCancelMatch(){
        this._isStartMatch = false;
        //this.matchTimeLab.string = "";
        this.ui.UpdataMatchTime("0");
        if (this.callback != null)
            this.unschedule(this.callback);
    },
    onDestroy(){
        cc.vv.MsgMgr.remove(cc.vv.Opcode.QUICK_MATCH, this.OnStartMatch);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.RETRIEVE_MATCH_RESULT, this.OnUpdateMatchStatus);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.CANCEL_MATCH, this.OnCancelMatch);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.CONNECT_SOCKET_SUCCESS, this.OnConnectSocket);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.ENTER_BATTLE, this.OnEnterBattle);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.ROOM_INFO, this.OnRoomInfo);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.JOIN_ROOM, this.OnJoinRoom);
    }
});
