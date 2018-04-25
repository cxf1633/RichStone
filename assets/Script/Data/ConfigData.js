//数据库配置文件

var ConfigData = cc.Class({
    allData:null,

    ctor(){
        cc.log("正在初始化游戏配置表");
        var bRet = true;
        var self = this;
        if(bRet){
            cc.log("从网址获取数据：http://192.168.199.156:9511/base_data");
            try{
                var xhr = cc.loader.getXMLHttpRequest();
                xhr.open("GET", "http://192.168.199.156:9511/base_data");
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var alldataObj = JSON.parse(xhr.responseText);
                        self.initData(alldataObj);
                    } else if(xhr.status >= 500) {
                        //NumUnit.prompts(LANSTR.errorserverset);
                    } else if(xhr.status >= 400) {
                        //NumUnit.prompts(LANSTR.erroraskset);
                    } else if(xhr.status == 0){
                        cc.log("无法读取配置表,从本地获取");
                        cc.loader.loadRes("ConfigData",function(err,txt){
                            if (err) {
                                cc.error(err.message || err);
                                return;
                            }
                            self.initData(txt);
                        });
                    }
                };
            }
            catch (e){
            }
        }
        else{
            cc.log("从本地加载数据：ConfigData.json");
            cc.loader.loadRes("ConfigData",function(err,txt){
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                self.initData(txt);
            });
        }
    },

    initData(alldata){
        this.allData = alldata;
        //var alldata = JSON.parse(txt);
        // cc.log("正在读取配置表【配置表版本："+alldata["config_version"][0].version+"】");

        // cc.log(alldata["achievement"][0].desc);

    },

    getConfigData(_tableName, _key, _fieldName) {
        if(_tableName !== undefined && _key !== undefined && _fieldName !== undefined) {
            return this.allData[_tableName][_key][_fieldName];
        }
        else if(_tableName !== undefined && _key !== undefined) {
            return this.allData[_tableName][_key];
        }
        else if(_tableName !== undefined) {
            return this.allData[_tableName];
        }
        return null;
    },
});

module.exports = ConfigData