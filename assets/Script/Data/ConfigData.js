//数据库配置文件

var ConfigData = {

    init:function(){
        cc.log("正在初始化游戏配置表");
        var bRet = false;
        if(bRet){
            cc.log("从网址获取数据：");
            // try{
            //     var xhr = cc.loader.getXMLHttpRequest();
            //     xhr.open("GET", "http://192.168.199.155:9043/base_data?rnd="+Math.random());
            //     xhr.send();
            //     xhr.onreadystatechange = function () {
            //         if (xhr.readyState == 4 && xhr.status == 200) {
            //             Config.responseData = Config.initData(xhr.responseText);
            //         } else if(xhr.status >= 500) {
            //             NumUnit.prompts(LANSTR.errorserverset);
            //         } else if(xhr.status >= 400) {
            //             NumUnit.prompts(LANSTR.erroraskset);
            //         } else if(xhr.status == 0){
            //             cc.log("无法读取配置表,从本地获取");
            //             cc.loader.loadTxt("res/ConfigData.json",function(err,txt){
            //                 Config.initData(txt);
            //             });
            //         }
            //     };
            // }
            // catch (e){
            // }
        }
        else{
            cc.log("从本地加载数据：ConfigData.json");
            cc.loader.loadRes("ConfigData",function(err,txt){
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                ConfigData.initData(txt);
            });
        }
    },

    initData:function(alldata){
        //var alldata = JSON.parse(txt);
        cc.log("正在读取配置表【配置表版本："+alldata["config_version"][0].version+"】");

        cc.log(alldata["achievement"][0].desc);

    }
};

module.exports = ConfigData