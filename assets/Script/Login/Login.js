//加载所有JS脚本
function AutoRequireJs() {
    cc.changit = {};

    var jsFiles = require("JsFiles");
    for (var i in jsFiles) {
        var JsFile = jsFiles[i];
        //cc.log("require JsFile:", JsFile);
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

//登录
var Login = cc.Class({
    extends: cc.Component,
    properties: {
        loginNode: {
            default: null,
            type: cc.Node,
        },

        userInputLabel: {
            default: null,
            type: cc.EditBox,
        },

        passwordInputLabel: {
            default: null,
            type: cc.EditBox,
        },

        loginBtn: {
            default: null,
            type: cc.Button,
        },

        selectServerListNode: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad () {
        AutoRequireJs();
        cc.changit.Utils.addClickEvent(this.loginBtn, this.node, "Login", "onLoginGame");

        //监听网络
        cc.changit.MsgMgr.register(cc.changit.Opcode.CHECK_USER, this.getServer, this);
        cc.changit.MsgMgr.register(cc.changit.Opcode.GET_SERVER, this.showServerPanel, this);

        //监听进入主场景
        cc.changit.MsgMgr.register(cc.changit.Opcode.ENTER_MAIN, this.loadMainScene, this)

        //读取用户数据
        var userLoginData = JSON.parse(cc.sys.localStorage.getItem('userLoginData'));
        if(userLoginData){
            this.userInputLabel.string = userLoginData.name;
            this.passwordInputLabel.string = userLoginData.psw;
        }
    },

    onLoginGame: function() {
        if (this.userInputLabel.string !== "" && this.passwordInputLabel.string !== "") {
            //存储用户数据
            var userLoginData = {
                name: this.userInputLabel.string,
                psw: this.passwordInputLabel.string,
            };
            cc.sys.localStorage.setItem('userLoginData', JSON.stringify(userLoginData));
            //
            cc.changit.HttpMgr.sendAuthRequest(cc.changit.Opcode.CHECK_USER, this.userInputLabel.string, this.passwordInputLabel.string);
        }
        else {
            cc.changit.PopupManager.showPopup("错误", "用户名与密码不能为空", null, null);
        }
    	cc.changit.MsgMgr.printMsgCount();
    },

    getServer: function(data) {
        cc.changit.HttpMgr.token = data.token;
        cc.changit.HttpMgr.uid = data.uid;
        cc.changit.HttpMgr.sendAuthRequest(cc.changit.Opcode.GET_SERVER);
    },

    //显示选服界面
    showServerPanel: function(data) {
        cc.changit.PlayerData.init();
        cc.changit.HttpMgr.logicUrl = data.addr;
        cc.changit.HttpMgr.sendLogicRequest(cc.changit.Opcode.LOGIN);
    },

    loadMainScene(){
        cc.director.loadScene('mainScene');
    },

    onDestroy(){
        cc.changit.MsgMgr.remove(cc.changit.Opcode.CHECK_USER, this.getServer);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.GET_SERVER, this.showServerPanel);
        cc.changit.MsgMgr.remove(cc.changit.Opcode.ENTER_MAIN, this.loadMainScene);
    },

});
