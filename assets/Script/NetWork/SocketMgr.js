//WebSocket

var SocketMgr = cc.Class({
    properties: {
        _socket:null,
        _svr:null,
        _isconnected:false,
        _commands:[],
        _cachebuffs:"",
        
    },
    isConnected(){
        return this._isconnected;
    },
    connectToServer(serverip){
        cc.log("connectToServer serverip:", serverip);
        // if(this.isConnected()){
        //     cc.log("已经存在连接！")
        //     return;
        // }
        if(!serverip){
            cc.log("连接失败，无服务器信息");
            return;
        }
        this._svr = {};
        //this._svr.serverip =  "192.168.199.156:22018/rpc";
        this._svr.serverip = serverip;
        var addr = "ws://" + this._svr.serverip + "/rpc";
        cc.log("正在连接服务器[" + addr + "]...");
        var socket = new WebSocket(addr);

        socket.onopen = this.nettyDidConnected;
        socket.onmessage = this.nettyDidRecieveData;
        socket.onclose = this.nettyDidDisConnected;
        socket.onerror = this.nettyDidError;

        this._socket = socket;
    },
    nettyDidConnected(event){
        cc.log(cc.vv.SocketMgr._svr);
        cc.log("已连接至服务器:["+ cc.vv.SocketMgr._svr.serverip +"]:" + event);
        cc.vv.SocketMgr._isconnected = true;

        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.CONNECT_SOCKET_SUCCESS)
    },
    nettyDidRecieveData(event){
        var zipstr = event.data;
        cc.log("WebSocket接收数据:\n" + zipstr);
        var ret = JSON.parse(zipstr)
        //cc.vv.SocketMgr._cachebuffs = [cc.vv.SocketMgr._cachebuffs,zipstr].join("");

        if(ret.error){
            cc.log("WebSocket error:", ret.error);
            cc.vv.PopupManager.showPopup("错误:" + ret.error.code, cc.vv.ErrorList.errorShow(ret.error.code), null, null);
            //cc.vv.error.show(zipstr.error);
        }
        else{
            cc.vv.SocketMgr.executeCommand(ret);
        }

    },
    nettyDidDisConnected(event){
        cc.log("已断开与服务器:["+ cc.vv.SocketMgr._svr.serverip +"]的连接:" + event);
        cc.vv.SocketMgr._isconnected = false;
        //Cache.selectedServer = null;
        if(cc.vv.SocketMgr._socket){
            cc.vv.SocketMgr._socket.close();
        }
        cc.vv.SocketMgr._socket = null;
        //EventDispatcher.shared().dispatchEvent(SVRCMD.Disconnected);
    },
    nettyDidError(event){
        cc.log("连接发生错误！\n" + event);
        //Game.netError();
        cc.vv.SocketMgr.disconnect();
    },

    disconnect(){
        if(!this.isConnected()){
            return;
        }
        cc.log("正在断开与服务器的连接...");
        if(this._socket){
            this._socket.close();
        }
        this._isconnected = false;
        //Cache.selectedServer = null;
        this._socket = null;
        //EventDispatcher.shared().dispatchEvent(SVRCMD.Disconnected);
    },
    executeCommand(ret){
        cc.vv.MsgMgr.dispatch(ret.func_name, ret)
    },

    sendPackage(cmd, params){
        var self = this;
        var sendPack = function () {            
            var sendObject = {
                func_name:cmd,
                params:params
            }
            var sendstr = JSON.stringify(sendObject);
            cc.log("WebSocket发送数据:\n"+ sendstr);
            self._socket.send(sendstr);
        };

//         if(cmd!=SVRCMD.Time && !this.isConnected() && !LoginLogic._reconnecting && !LoginLogic.isAutoReconnecting){
//             Game.stopHeartBeat();
// //            this._cacheData.push({
// //                "cmd":cmd,
// //                "params":params
// //            });

//             Game.autoReconnect(sendPack);
//             return;
//         }

        if(this.isConnected()){
            sendPack();
        }
        else{
            //if(cmd==SVRCMD.Time) return;
        }
    },
});

module.exports = SocketMgr
