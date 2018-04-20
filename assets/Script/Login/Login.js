//登录
var BaseCompont = require("BaseCompont");
var MsgMgr = require("MsgMgr");
var HttpMgr = require("HttpMgr");
var Opcode = require("Opcode");
var UserData = require("UserData");

var Login = cc.Class({
    extends: BaseCompont,
    properties: {
    },

    // use this for initialization
    onLoad () {
        //监听网络
        MsgMgr.register(Opcode.CHECK_USER, this.OnGetServer, this);
        MsgMgr.register(Opcode.GET_SERVER, this.OnShowServerPanel, this);
        MsgMgr.register(Opcode.LOGIN, this.OnLogin, this);

        //监听进入主场景
        MsgMgr.register(Opcode.ENTER_MAIN, this.OnLoadMainScene, this)
    },
    //LoginUI调用
    SendLogin(name, psw){
        cc.log("name =", name);
        cc.log("psw =", psw);
        HttpMgr.sendAuthRequest(Opcode.CHECK_USER, [name, psw]);
    },
    OnGetServer(data){
        HttpMgr.token = data.token;
        HttpMgr.uid = data.uid;

        HttpMgr.sendAuthRequest(Opcode.GET_SERVER);
    },
    //显示选服界面
    OnShowServerPanel(data) {
        // cc.changit.PlayerData.init();
        HttpMgr.logicUrl = data.addr;
        HttpMgr.sendLogicRequest(Opcode.LOGIN);
    },
    OnLogin(data){
        UserData._instance.init(data);
        cc.director.loadScene('mainScene');
    },
    OnLoadMainScene() {
        cc.director.loadScene('mainScene');
    },

    onDestroy (){
        MsgMgr.remove(Opcode.CHECK_USER, this.OnGetServer);
        MsgMgr.remove(Opcode.GET_SERVER, this.OnShowServerPanel);
        MsgMgr.remove(Opcode.LOGIN, this.OnLogin);

        MsgMgr.remove(Opcode.ENTER_MAIN, this.OnLoadMainScene);
    },
});
