//战斗UI
var BattleData = require("BattleData");
var MathEx = require("MathEx");

var BaseCompont = require("BaseCompont");
var BattleUI = cc.Class({
    extends: BaseCompont,

    properties: {
        owner:cc.Node,
        ui:cc.Node,
        roundCount: cc.Label,
        roundOwner: cc.Label,
        dicePoint: cc.Label,
        roomId: cc.Label,
        nowPlayer:cc.Label,
        playerMoney: cc.Label,
        goBtn: cc.Button,
        confirmBtn: cc.Button,
        cancelBtn:  cc.Button,
        arrowsBluePrefab: cc.Prefab,//预制体动态创建
        arrowsYellow: cc.Sprite,
        arrowsRoot: cc.Node,        //箭头根节点
        buildHouseUI: cc.Node,
        selectPlayerUI: cc.Node,

        skillCardMode:  cc.Node,
    },
    arrowsList:null,
    skillCardList:null,
    //1，第一个调用
    onLoad() {
        //cc.log("battle ui onLoad===>");
    },
    start(){
        //cc.log("battle ui start===>");

        cc.vv.Utils.addClickEvent(this.goBtn, this.node, "BattleUI", "onGo");
        cc.vv.Utils.addClickEvent(this.confirmBtn, this.node, "BattleUI", "onConfirm");
        cc.vv.Utils.addClickEvent(this.cancelBtn, this.node, "BattleUI", "onCancel");

        cc.vv.MsgMgr.register(cc.vv.Opcode.BUY_HOUSE, this.OnOpenBulidHousePanel, this);
        
        this.owner = this.owner.getComponent('BattleMgr');

        this.confirmBtn.node.active = false;
        this.cancelBtn.node.active = false;

        this.arrowPool = new cc.NodePool();
        let initCount = this.owner.MapMgr.roadObjCount;
        cc.log("initCount =", initCount);
        for (let i = 0; i < initCount; ++i) {
            let arrow = cc.instantiate(this.arrowsBluePrefab); // 创建节点
            this.arrowPool.put(arrow); // 通过 putInPool 接口放入对象池
        }
        this.arrowsList = new Array;
        this.skillAreaList = new Array;
        this.skillCardList = new Array;
        this.owner.LoadEnd();
    },
    updataRoomInfo(userData, battleData){
        this.roundOwner.string = "玩家:" + userData.userId;
        this.roundCount.string = "回合:" + battleData.roundId;
        this.nowPlayer.string = "当前:" + battleData.curActor;
        this.roomId.string = "房间：" + battleData.roomId;

        var myData = battleData.getDataByUid(userData.userId);
        this.playerMoney.string = "金钱:" + MathEx.getMoneyFormat(myData.money);
        
        var tempPosX = -350;
        var tempPosY = -290;
        for (const key in myData.skill_cards) {
            if (myData.skill_cards.hasOwnProperty(key)) {
                const skillCard = myData.skill_cards[key];
                //cc.log("card_id =", skillCard.card_id);
                var data = cc.vv.ConfigData.card[skillCard.card_id];
                var skillCardBtn = cc.instantiate(this.skillCardMode);
                cc.vv.Utils.addClickEvent(skillCardBtn, this.node, "BattleUI", "onUseCard");
                skillCardBtn.parent = this.ui;
                skillCardBtn.setPosition(cc.p(tempPosX, tempPosY));
                skillCardBtn.active = true;
                var label = skillCardBtn.getChildByName('Label').getComponent(cc.Label);
                label.string = data.name + "uid:" + skillCard.uid;
                skillCardBtn.info = {};
                skillCardBtn.info.uid = skillCard.uid;
                skillCardBtn.info.data = data;
                tempPosX = tempPosX + 120;
                this.skillCardList.push(skillCardBtn);
            }
        }
    },
    onUseCard(event){
        var skillCardInfo= event.target.info;
        //this.showGridSelect(this.owner.MapMgr._roadObjs);
        cc.log("使用卡片：", skillCardInfo.data.id);
        if(skillCardInfo.data.id == 1){
            //this.showGridSelect(this.owner.MapMgr.getAllRoadObjs());
        }
        else if(skillCardInfo.data.id == 6){
            cc.log("卡片使用范围222：", skillCardInfo.data.range);
            this.owner.isUseCard = true;
            this.owner.useCardUid = skillCardInfo.uid;
            var curGid = this.owner._myPlayer.getComponent("RoleMgr").get("curGid");
            cc.log("curGid:", curGid);
            var objects = this.owner.MapMgr.getRoadObj(curGid, skillCardInfo.data.range);
            //var objects = this.owner.MapMgr.getAreaObj(1, 2);
            this.showGridSelect(objects);
            // var gid = this.owner.getPlayerObjBoomPos();
            // cc.vv.SocketMgr.sendPackage("UseSkillCard", [skillCardInfo.uid, gid]);
        }
    },
    showGoBtn(ret){
        this.goBtn.node.active = ret;
    },
    refreshTurn(str){
        this.roundCount.string = "回合:" + str;
    },
    refreshActor(str){
        this.nowPlayer.string = "当前:" + str;
    },
    refreshDice(str) {
        this.dicePoint.string = "点数:" + str;
        this.dice = str;
    },
    refreshMoney(str, currentMoney) {
        var differenceMoney = currentMoney - str;
        var _tempLabel = "";
        if(differenceMoney === 0) {
            return
        }
        else if(differenceMoney > 0) {
            _tempLabel = " - " + MathEx.getMoneyFormat(differenceMoney);
        }
        else if(differenceMoney < 0) {
            _tempLabel = " + " + MathEx.getMoneyFormat(Math.abs(differenceMoney));
        }
        this.playerMoney.string = "金钱:" + MathEx.getMoneyFormat(currentMoney) + _tempLabel;
        var timeCallback = function (dt) {
            this.playerMoney.string = "金钱:" + MathEx.getMoneyFormat(str);
        }
        this.scheduleOnce(timeCallback, 1);
        
    },
    onGo(){
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.DICE, [1]);
        //cc.vv.SocketMgr.sendPackage("GMDice", [3]);
        this.showGoBtn(false);
    },
  
    //显示地格的选择，蓝色箭头，参数：数组
    showGridSelect(objects){
        for (const key in objects) {
            if (objects.hasOwnProperty(key)) {
                const element = objects[key];
                let arrowObj = null;
                if (this.arrowPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                    //cc.log("池中有空闲箭头对象:", this.arrowPool.size());
                    arrowObj = this.arrowPool.get();
                } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                    cc.log("创建新的箭头对象");
                    arrowObj = cc.instantiate(this.arrowsBluePrefab);
                }
                arrowObj.parent = this.arrowsRoot; 
                cc.vv.Utils.addClickEvent(arrowObj, this.node, "BattleUI", "onSelected");
                //用_id存地格编号
                arrowObj.gid = key;
                //设置箭头位置
                arrowObj.setPosition(element.pos);
                arrowObj.active = true;
                this.arrowsList.push(arrowObj);
            }
        }
    },
    showSkillCardArea(objects){
        for (const key in objects) {
            if (objects.hasOwnProperty(key)) {
                const element = objects[key];
                let arrowObj = null;
                if (this.arrowPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                    //cc.log("池中有空闲箭头对象:", this.arrowPool.size());
                    arrowObj = this.arrowPool.get();
                } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                    cc.log("创建新的箭头对象");
                    arrowObj = cc.instantiate(this.arrowsBluePrefab);
                }
                arrowObj.parent = this.arrowsRoot; 
                cc.vv.Utils.addClickEvent(arrowObj, this.node, "BattleUI", "onSelected");
                //用_id存地格编号
                arrowObj.gid = key;
                //设置箭头位置
                arrowObj.setPosition(element.pos);
                arrowObj.active = true;
                this.skillAreaList.push(arrowObj);
            }
        }
    },
    //已选择目标
    onSelected(event){
        //对象隐藏 确认按钮再把对象放回对象池
        for(var v of this.arrowsList){
            v.active = false;
        }

        this.selectObj = event.target;
        //cc.log("onSelect2:", this.selectObj._id);
        var arrowPos = this.selectObj.getPosition();
        //cc.log("onSelect pos =", arrowPos);
        this.arrowsYellow.node.setPosition(arrowPos);
        this.arrowsYellow.node.active = true;
        if(this.owner.isUseCard){
            //this.owner.MapMgr.getAreaObj();
        }

        this.confirmBtn.node.active = true;
        this.cancelBtn.node.active = true;
    },
    //确认
    onConfirm(){
        this.confirmBtn.node.active = false;
        this.cancelBtn.node.active = false;
        
        this.arrowsYellow.node.active = false;
        //对象放回池
        for(var v of this.arrowsList){
            this.arrowPool.put(v); 
        }
        this.arrowsList = [];

        if(this.owner.isUseCard){
            //对象放回池
            for(var v of this.skillAreaList){
                this.arrowPool.put(v); 
            }
            this.skillAreaList = [];
        }
        cc.log("玩家选择的地格：", this.selectObj.gid);
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.SELECT_GID, this.selectObj.gid);
    },
    //取消
    onCancel(){
        for(var v of this.arrowsList){
            v.active = true;
        }
        this.arrowsYellow.node.active = false;
        this.confirmBtn.node.active = false;
        this.cancelBtn.node.active = false;
    },

    OnOpenBulidHousePanel(_landsData) {
        if(this.buildHouseUI.active == false) {
            this.buildHouseUI.getComponent("BuildHouseUI").openAndUpdatePanel(_landsData);
        }
    },

    OnOpenSelectPlayerPanel() {
        if(this.selectPlayerUI.active == false) {
            this.selectPlayerUI.active = true;
        }
    },

    onDestroy(){
        cc.log("battleui onDestroy");
        cc.vv.MsgMgr.remove(cc.vv.Opcode.BUY_HOUSE, this.OnOpenBulidHousePanel);
    },
});
