//登录
var BaseCompont = require("BaseCompont");
function initMgr(){
    cc.vv = {};
    cc.vv.MsgMgr = require("MsgMgr");
    cc.vv.Opcode = require("Opcode");
    cc.vv.UserData = require("UserData");
    cc.vv.HttpMgr = require("HttpMgr");
    var SocketMgr = require("SocketMgr");
    cc.vv.SocketMgr = new SocketMgr(); 
    cc.vv.Utils = require("Utils");
    cc.vv.MathEx = require("MathEx");
    cc.vv.ErrorList = require("ErrorList");
    cc.vv.UIManager = require("UIManager");
    cc.vv.PopupManager = require("PopupManager");
    var Tooltip = require("Tooltip");
    cc.vv.Tooltip = new Tooltip();

    var ConfigData = require("ConfigData");
    cc.vv.ConfigData = new ConfigData();
}

var Login = cc.Class({
    extends: BaseCompont,
    properties: {
    },

    // use this for initialization
    onLoad () {
        //
        initMgr();
        //监听网络
        cc.vv.MsgMgr.register(cc.vv.Opcode.CHECK_USER, this.OnGetServer, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.GET_SERVER, this.OnShowServerPanel, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.LOGIN, this.OnLogin, this);
    },
    //LoginUI调用
    SendLogin(name, psw){
        cc.vv.HttpMgr.sendAuthRequest(cc.vv.Opcode.CHECK_USER, [name, psw]);
    },
    OnGetServer(data){
        cc.vv.HttpMgr.token = data.token;
        cc.vv.HttpMgr.uid = data.uid;

        cc.vv.HttpMgr.sendAuthRequest(cc.vv.Opcode.GET_SERVER);
    },
    //显示选服界面
    OnShowServerPanel(data) {
        cc.vv.HttpMgr.logicUrl = data.addr;
        cc.vv.HttpMgr.sendLogicRequest(cc.vv.Opcode.LOGIN);
    },
    OnLogin(data){
        cc.vv.UserData.init(data);
        cc.director.loadScene('mainScene');
    },

    onDestroy(){
        cc.vv.MsgMgr.remove(cc.vv.Opcode.CHECK_USER, this.OnGetServer);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.GET_SERVER, this.OnShowServerPanel);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.LOGIN, this.OnLogin);
    },
});
