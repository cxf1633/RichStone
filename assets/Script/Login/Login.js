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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.changit.Utils.addClickEvent(this.loginBtn, this.node, "Login", "onLoginGame");
    },

    start () {

    },

    onLoginGame: function() {

        if (this.userInputLabel.string !== "" && this.passwordInputLabel.string !== "") {
            cc.changit.Http.sendHttpRequest(cc.changit.Opcode.CHECK_USER, this.onErrCallBack, this._getServer, this, this.userInputLabel.string, this.passwordInputLabel.string);
    
        }
    },

    onErrCallBack:function(){

    },
    _getServer: function() {
        //cc.log("_getServer");
        cc.changit.Http.sendHttpRequest(cc.changit.Opcode.GET_SERVER, this.onErrCallBack, this._setPanelShow);
    },

    //显示选服界面
    _setPanelShow: function() {
        //cc.log("_setPanelShow");
        cc.director.loadScene('battleScene');
    },

});
