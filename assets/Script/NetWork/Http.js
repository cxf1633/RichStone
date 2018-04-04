var Url = "http://192.168.199.114:80"

var Http = cc.Class({
    extends: cc.Component, 

    sendRequest(cmd, data, callBack){
        var nums = arguments.length
        if (nums == 2){
            data = ""
        }
        var xhr = cc.loader.getXMLHttpRequest()
        var requestURL = Url + "/auth" 
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


});