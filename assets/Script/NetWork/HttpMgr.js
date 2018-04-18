//Http

var serverType = cc.Enum({
    None:0,
    Auth : 1,
    Logic : 2,
});


var HttpMgr = {
    authUrl: "192.168.199.156:80",
    logicUrl: null,
    token: null,
    uid: null,
    timeout: 5000,

    //
    sendHttpRequest(servertype, cmd, sendstr){
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
        // var dataArray = Array.prototype.slice.call(arguments, 2);
        // var sendObject = {
        //     func_name:cmd,
        //     params:dataArray
        // }
        // var sendstr = JSON.stringify(sendObject)
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
                        // cc.log("cc.changit.Http.token==>", cc.changit.HttpMgr.token);
                        cc.changit.HttpMgr.token = newToken == null ? cc.changit.HttpMgr.token : newToken;
                    }
                    if (ret.error != null){
                        //console.error(ret.error.code) //TODO 错误处理
                        cc.changit.HttpMgr.onErrCallBack(ret.error);
                    }
                    else {
                        cc.changit.MsgMgr.dispatch(ret.func_name, ret.data);
                    }
                } catch (e) {
                    console.log("err:" + e);
                }
            }
        }
    },
    //发送认证服请求
    sendAuthRequest(cmd){
        var dataArray = Array.prototype.slice.call(arguments, 1);
        var sendObject = {
            func_name:cmd,
            params:dataArray
        }
        var sendstr = JSON.stringify(sendObject)
        this.sendHttpRequest(serverType.Auth, cmd, sendstr);
    },
    //请求逻辑服请求
    sendLogicRequest (cmd){
        var dataArray = Array.prototype.slice.call(arguments, 1);
        var sendObject = {
            func_name:cmd,
            params:dataArray
        }
        var sendstr = JSON.stringify(sendObject)
        this.sendHttpRequest(serverType.Logic, cmd, sendstr);
    },
    //错误处理
    onErrCallBack(errcode){
        cc.log("onErrCallBack errcode:", errcode);
    }
};

module.exports = HttpMgr;
