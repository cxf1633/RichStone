var BaseCompont = require("BaseCompont");
var SelectServerUI = cc.Class({
    extends: BaseCompont,
    properties: {
        selectServerSwitchBtn: cc.Button,
        switchBtnLabel: cc.Label,

        _isOpen: false,
    },

    onLoad () {
        cc.vv.Utils.addClickEvent(this.selectServerSwitchBtn, this.node, "SelectServerUI", "onSelectServerSwitch");

        //读取选择的服务器数据
        var selectServerData = JSON.parse(cc.sys.localStorage.getItem('selectServerSwitchState'));
        if(selectServerData !== null){
            this._isOpen = selectServerData.isOpen;
        }
        this.showLabel();
    },

    onSelectServerSwitch() {
        this._isOpen = !this._isOpen;
        var selectServerData = {
            isOpen: this._isOpen,
        };

        //保存选择的服务器数据
        cc.sys.localStorage.setItem('selectServerSwitchState', JSON.stringify(selectServerData));
        this.showLabel();
    },

    showLabel() {
        var _test = this._isOpen? "开" : "关";
        this.switchBtnLabel.string = "外挂(慎用) " + _test;
    }
});
