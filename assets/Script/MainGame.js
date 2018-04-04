//加载JS脚本
function loadJsFile() {
    cc.defs = require("Utils/Defs")

    var MathEx = require("Utils/MathEx")
    cc.mathEx = new MathEx()

    var Utils = require("Utils/Utils")
    cc.utils = new Utils() 

    cc.opcode = require("Net/Opcode") 
    var Http = require("Net/Http")
    cc.http = new Http()
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
        this._startBtn = this.node.getChildByName("Start")
        cc.utils.addClickEvent(this._startBtn, this.node, "MainGame", "onStartGameClick")
    },

    start () {
        
        console.log('@=================Game Start================@');
    },

    onStartGameClick(){
        cc.http.sendRequest(cc.opcode.LOGIN, [1, 3], function(cmd, msg){ 
            console.log(msg)
            cc.director.loadScene('battleScene') 
        })
        
    }

    // update (dt) {},
});
