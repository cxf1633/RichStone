//加载JS脚本
function loadJsFile() {
    cc.changit = {};

    var jsFiles = require("JsFiles");
    for (var i in jsFiles) {
        var JsFile = jsFiles[i];
        cc.log("require JsFile:", JsFile);
        var md = require(JsFile);
        if(typeof md == "object"){
            cc.changit[JsFile] = md;
        }
        //Class
        else if(typeof md == "function"){
            cc.changit[JsFile] = new md();
        } 
    }
}


//游戏主入口
cc.Class({
    extends: cc.Component,

    properties: {
        _startBtn:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        loadJsFile();
        this._startBtn = this.node.getChildByName("Start");

        cc.changit.Utils.addClickEvent(this._startBtn, this.node, "MainGame", "onStartGameClick");

        cc.changit.ConfigData.init();

    },

    start () {
        console.log('@=================Game Start================@');
    },

    onStartGameClick(){
        cc.director.loadScene('login');
    },
    onDestroy:function(){
        cc.log("MainGame onDestroy");
    },
});
