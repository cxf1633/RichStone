var Url = "http://192.168.199.156:80"

//登录服务器ip
var authUrl = "192.168.199.156:80";

//逻辑服务器ip
var logicUrl = "192.168.199.156:80";

//战斗服务器ip
var battleUrl = "192.168.199.156:80";

var Http = {

    sendRequest(cmd, data, callBack){
        var nums = arguments.length
        if (nums == 2){
            data = []
        }
        var xhr = cc.loader.getXMLHttpRequest()
        var requestURL = Url + "/rpc" 
        xhr.open("POST", requestURL)
        xhr.setRequestHeader("Content-type","application/json")
        
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)){
                console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                    if (ret.error != null){
                        console.error(ret.error.code) //TODO 错误处理
                    }
                    else if(callBack !== null){
                        callBack(ret.func_name, ret.data);
                    }                        
                } catch (e) {
                    console.log("err:" + e);
                }
            }
        }

        data = this.enCodeJson(cmd, data)
        xhr.send(data)
        xhr.timeout = 5000
        xhr.ontimeout = function () {
            //TODO超时处理
        }
        return xhr
    },

    //{"func_name":"GuestLogin", "params":[1, "3"]}
    enCodeJson(cmd, data){
        var jsonData = {
            func_name:cmd,
            params:data
        }
        var jsonStr = JSON.stringify(jsonData)
        console.log("Send:" + jsonStr)
        return jsonStr
    },

    //请求http数据
    sendHttpRequest: function (command, onErrCallBack, onCallBack, target) {
        var xhr = cc.loader.getXMLHttpRequest();

        cc.log("Send Http Url:" +"http://"+authUrl+"/rpc");
        xhr.open("POST", "http://"+authUrl + "/rpc");
        xhr.setRequestHeader("Content-type","application/json");


        var data = Array.prototype.slice.call(arguments, 4);
        var jsonData = {
            func_name:command,
            params:data
        }
        var sendstr = JSON.stringify(jsonData);
        cc.log("Send Http data: ", sendstr);
        xhr.send(sendstr);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                cc.log("Receive Http data: ", response);
                if (onCallBack) {
                    onCallBack.call(target, response);
                }
            }
            else if(xhr.readyState ==4 && xhr.status != 200){
                xhr.abort();    
                if(onErrCallBack){
                    onErrCallBack();
                }
            }
        }
        xhr.timeout = 5000;
        xhr.ontimeout = function () {
            // if(onErrCallBack){
            //     onErrCallBack();
            // }
        };
        return xhr;
    },
};

module.exports = Http
