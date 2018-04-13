//WebSocket

var SocketMgr = cc.Class({
    properties: {
        _socket:null,
        _svr:null,
        _isconnected:false,
        _commands:[],
        _cachebuffs:"",
        
    },
    isConnected:function(){
        return this._isconnected;
    },
    connectToServer:function(serverip){
        cc.log("connectToServer serverip:", serverip);
        if(this.isConnected()){
            return;
        }
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
    nettyDidConnected:function(event){
        cc.log(cc.changit.SocketMgr._svr);
        cc.log("已连接至服务器:["+ cc.changit.SocketMgr._svr.serverip +"]:" + event);
        cc.changit.SocketMgr._isconnected = true;

        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.CONNECT_SOCKET_SUCCESS)
    },
    nettyDidRecieveData:function(event){
        var zipstr = event.data;
        cc.log("WebSocket接收数据:\n" + zipstr);
        cc.changit.SocketMgr._cachebuffs = [cc.changit.SocketMgr._cachebuffs,zipstr].join("");
        cc.changit.SocketMgr.generateCommand(zipstr);
    },
    nettyDidDisConnected:function(event){
        cc.log("已断开与服务器:["+ cc.changit.SocketMgr._svr.serverip +"]的连接:" + event);
        cc.changit.SocketMgr._isconnected = false;
        //Cache.selectedServer = null;
        if(cc.changit.SocketMgr._socket){
            cc.changit.SocketMgr._socket.close();
        }
        cc.changit.SocketMgr._socket = null;
        //EventDispatcher.shared().dispatchEvent(SVRCMD.Disconnected);
    },
    nettyDidError:function(event){
        cc.log("连接发生错误！\n" + event);
        //Game.netError();
        cc.changit.SocketMgr.disconnect();
    },

    disconnect:function(){
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

    generateCommand:function(){
        cc.log("generateCommand");
    },

    sendPackage:function(cmd, params){
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
