
//登录UI
var BaseCompont = require("BaseCompont");
var LoginUI = cc.Class({
    extends: BaseCompont,
    properties: {
        owner: cc.Node,
        userInputLabel: cc.EditBox,
        passwordInputLabel: cc.EditBox,
        loginBtn: cc.Button,

        // selectServerListNode: {
        //     default: null,
        //     type: cc.Prefab,
        // },
    },

    onLoad () {
        this.owner = this.owner.getComponent('LoginMgr');
        cc.vv.Utils.addClickEvent(this.loginBtn, this.node, "LoginUI", "onLoginGame");
       //读取用户数据
       var userLoginData = JSON.parse(cc.sys.localStorage.getItem('lastUserData'));
       if(userLoginData){
           this.userInputLabel.string = userLoginData.name;
           this.passwordInputLabel.string = userLoginData.psw;
       }
    },

    onLoginGame() {
        if (this.userInputLabel.string !== "" && this.passwordInputLabel.string !== "") {
            //存储用户数据
            var userLoginData = {
                name: this.userInputLabel.string,
                psw: this.passwordInputLabel.string,
            };
            cc.sys.localStorage.setItem('lastUserData', JSON.stringify(userLoginData));
            //
            this.owner.SendLogin(this.userInputLabel.string, this.passwordInputLabel.string);
        }
        else {
            cc.vv.PopupManager.showPopup("错误", "用户名与密码不能为空", null, null);
        }
    },
});
