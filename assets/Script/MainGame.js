//加载JS脚本
function loadJsFile() {
    cc.changit = {};
    cc.changit.defs = require("Utils/Defs")

    var MathEx = require("Utils/MathEx")
    cc.changit.mathEx = new MathEx()

    cc.changit.utils = require("Utils/Utils")

    cc.changit.opcode = require("NetWork/Opcode") 
    var Http = require("NetWork/Http")
    cc.changit.http = new Http()

    cc.changit.msgMgr = require("Manager/MsgMgr")
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
        cc.changit.utils.addClickEvent(this._startBtn, this.node, "MainGame", "onStartGameClick");
    },

    start () {
        
        console.log('@=================Game Start================@');
    },

    onStartGameClick(){
        // cc.changit.http.sendRequest(cc.changit.opcode.LOGIN, [1, 3], function(cmd, msg){ 
        //     console.log(msg)
        //     cc.director.loadScene('battleScene') 
        // })

        cc.director.loadScene('login')
    },
    onDestroy:function(){
        cc.log("MainGame onDestroy");
    },
});
