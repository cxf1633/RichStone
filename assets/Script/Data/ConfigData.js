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
        for (const key in alldata) {
            if (alldata.hasOwnProperty(key)) {
                this[key] = {};
                var tableData = alldata[key];
                if (tableData.length == 0 ) {
                    cc.log("表没有数据：", key);
                    continue;
                }
                if(tableData[0].id == undefined){
                    var funcName = "init_"+ key;
                    if(this[funcName]){
                        this[funcName].call(this, key, alldata)
                    }
                    else{
                        cc.log("主key不是id的表找不到初始化函数>>>>>>>：", funcName);
                    }
                }
                else{
                    this.initById(key, tableData);
                }
            }
        }
        cc.log("数据库加载完成！");
    },
    //主key是id的表
    initById(key, tableData){
        for (const data of tableData) {
            if (data.id == undefined) {
                cc.log("初始化表：", key, "失败>>>>>>>>>>>!!!");
                return;
            }
            this[key][data.id] = data;
        }
        cc.log("初始化init表：", key, "成功！");
    },
    init_global_var(key, alldata){
        for (const data of alldata[key]) {
            if (data.k == undefined) {
                cc.log("初始化表：", key, "失败>>>>>>>>>>>!!!");
                return;
            }
            this[key][data.k] = data;
        }
        cc.log("初始化表：", key, "成功！");
    },
    init_grid_lv(key, alldata){
        for (const data of alldata[key]) {
            if (data.level == undefined) {
                cc.log("初始化表：", key, "失败>>>>>>>>>>>!!!");
                return;
            }
            this[key][data.level] = data;
        }
        cc.log("初始化表：", key, "成功！");
    },

    init_map_grid(key, alldata){
        for (const data of alldata[key]) {
            if (data.map_scene_id == undefined) {
                cc.log("初始化表：", key, "失败>>>>>>>>>>>!!!");
                return;
            }
            if (this[key][data.map_scene_id] == undefined) {
                this[key][data.map_scene_id] = {};
            }
            this[key][data.map_scene_id][data.grid_id] = data;
        }
        cc.log("初始化表：", key, "成功！");
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