//主城UI
var BaseCompont = require("BaseCompont");
var MainCityUI = cc.Class({
    extends: BaseCompont,

    properties: {
        owner: cc.Node,
        playerNameLab : cc.Label,
        matchBtn : cc.Button,
        closeMatchBtn :cc.Button,
        enterBattleBtn : cc.Button,
        matchTimeLab : cc.Label,

        _matchTime : 0,
    },

    start () {
        cc.log("==========Init Main UI=============");
        this.owner = this.owner.getComponent('MainCityMgr');
        this.playerNameLab.string = cc.vv.UserData.userName;
        cc.vv.Utils.addClickEvent(this.matchBtn, this.node, "MainCityUI", "OnMatchBattle");
        cc.vv.Utils.addClickEvent(this.closeMatchBtn, this.node, "MainCityUI", "OnCloseMatchBattle");

        //cc.vv.Utils.addClickEvent(this.enterBattleBtn, this.node, "MainCityUI", "OnEnterBattleScene");
    },
    // _enterBattleScene(){
    //     cc.director.loadScene('battleScene');
    // },
    //开始匹配
    OnMatchBattle(){
        this.owner.StartMatch();
    },

    //取消匹配按钮
    OnCloseMatchBattle(){
        this.owner.CloseMatch();
    },
    UpdataMatchTime(str){
        this.matchTimeLab.string = str;
    },
    onDestroy(){
        cc.log("MainUI onDestroy");
    }
});
