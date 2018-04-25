
//登录UI
var BaseCompont = require("BaseCompont");
var SelectServerUI = cc.Class({
    extends: BaseCompont,
    properties: {
        owner: cc.Node,
        userInputLabel: cc.EditBox,
        passwordInputLabel: cc.EditBox,
        selectServerInputLabel: cc.EditBox,
        selectServerLoginBtn: cc.Button,
        selectServerRemove: cc.Button,
        selectServerSwitchBtn: cc.Button,
        selectServerNode: cc.Node,
    },

    onLoad () {
        this.owner = this.owner.getComponent('LoginMgr');
        cc.vv.Utils.addClickEvent(this.selectServerSwitchBtn, this.node, "SelectServerUI", "onSelectServerSwitch");
        cc.vv.Utils.addClickEvent(this.selectServerLoginBtn, this.node, "SelectServerUI", "onLoginGame");
        cc.vv.Utils.addClickEvent(this.selectServerRemove, this.node, "SelectServerUI", "onRemoveData");
       //读取选择的服务器数据
       var selectServerData = JSON.parse(cc.sys.localStorage.getItem('selectServerUrlData'));
       if(selectServerData){
           this.selectServerInputLabel.string = selectServerData.selectServer;
       }
    },

    onLoginGame() {
        if (this.userInputLabel.string !== "" && this.passwordInputLabel.string !== "" && this.selectServerInputLabel.string !== "") {
            //存储选择的服务器数据
            var selectServerData = {
                selectServer: this.selectServerInputLabel.string,
            };
            cc.sys.localStorage.setItem('selectServerUrlData', JSON.stringify(selectServerData));
            this.owner.SendLogin(this.userInputLabel.string, this.passwordInputLabel.string);
        }
        else if(this.userInputLabel.string === "" || this.passwordInputLabel.string === "") {
            cc.vv.PopupManager.showPopup("错误", "用户名与密码不能为空", null, null);
        }
        else {
            cc.vv.PopupManager.showPopup("错误", "不知道神秘代码不要乱点!", null, null);
        }
    },

    onSelectServerSwitch() {
        this.selectServerNode.active = !this.selectServerNode.active;
    },

    onRemoveData() {
        cc.sys.localStorage.removeItem("selectServerUrlData");
        this.selectServerInputLabel.string = "";
        this.onSelectServerSwitch();
    }
});
