//Http

var serverType = cc.Enum({
    None:0,
    Auth : 1,
    Logic : 2,
});

var MsgMgr = require("MsgMgr");

var HttpMgr = {
    authUrl: "192.168.199.156:80",
    logicUrl: null,
    token: null,
    uid: null,
    timeout: 5000,

    //
    sendHttpRequest(servertype, cmd, dataArray){
        var xhr = cc.loader.getXMLHttpRequest();
        var requestURL = null;
        if (servertype == serverType.Auth){
            requestURL = "http://" + this.authUrl + "/rpc" 
        }
        else if (servertype == serverType.Logic){
            requestURL = "http://" + this.logicUrl + "/rpc" 
        } 
        xhr.open("POST", requestURL)
        xhr.setRequestHeader("Content-type","application/json")
        if (servertype == serverType.Logic){
            xhr.setRequestHeader("token", this.token)
            xhr.setRequestHeader("uid", this.uid)
        }
        var sendObject = {
            func_name:cmd,
            params:dataArray
        }
        var sendstr = JSON.stringify(sendObject)
        cc.log("Http 发送数据>>>:\n", sendstr);
        xhr.send(sendstr);
        xhr.timeout = this.timeout;
        xhr.ontimeout = function () {
            //TODO超时处理
        }
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)){
                //console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                cc.log("Http 收到数据<<<:\n", xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                    if (servertype == serverType.Logic){
                        //更新token
                        var newToken = xhr.getResponseHeader("token")
                        // cc.log("newToken==>", newToken);
                        // cc.log("Http.token==>", HttpMgr.token);
                        HttpMgr.token = newToken == null ? HttpMgr.token : newToken;
                    }
                    if (ret.error != null){
                        //console.error(ret.error.code) //TODO 错误处理
                        HttpMgr.onErrCallBack(ret.error);
                    }
                    else {
                        MsgMgr.dispatch(ret.func_name, ret.data);
                    }
                } catch (e) {
                    console.log("err:" + e);
                }
            }
        }
    },
    //发送认证服请求
    sendAuthRequest(cmd, dataArray){
        this.sendHttpRequest(serverType.Auth, cmd, dataArray);
    },
    //请求逻辑服请求
    sendLogicRequest (cmd, dataArray){
        this.sendHttpRequest(serverType.Logic, cmd, dataArray);
    },
    //错误处理
    onErrCallBack(errcode){
        cc.log("onErrCallBack errcode:", errcode);
    }
};

// EventDispatcher.shared = function () {
//     if (_event_dispatcher_shared == null) {
//         _event_dispatcher_shared = new EventDispatcher();
//     }
//     return _event_dispatcher_shared;
// };

module.exports = HttpMgr;
