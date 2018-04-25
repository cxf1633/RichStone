//战斗UI
var BattleData = require("BattleData");

var BaseCompont = require("BaseCompont");
var BattleUI = cc.Class({
    extends: BaseCompont,

    properties: {
        owner:cc.Node,
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
    },
    arrowsList:null,
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
        let initCount = 2;
        for (let i = 0; i < initCount; ++i) {
            let arrow = cc.instantiate(this.arrowsBluePrefab); // 创建节点
            this.arrowPool.put(arrow); // 通过 putInPool 接口放入对象池
        }
        this.arrowsList = new Array;

        this.owner.LoadEnd();
    },
    updataRoomInfo(userData, battleData){
        this.roundOwner.string = "玩家:" + userData.userName;
        this.roundCount.string = "回合:" + battleData.roundId;
        this.nowPlayer.string = "当前:" + battleData.curActor;
        this.roomId.string = "房间：" + battleData.roomId;
        this.playerMoney.string = "金钱:" + battleData.getUserDataByUid(userData.userId).money;
        
        // var data = battleData.getUserDataByUid(userData.userId);
        // //没有投过骰子并且是自己回合
        // if(!data.dice_over && userData.userId == battleData.curActor){
        //     this.showGoBtn(true);
        // }
        // else{
        //     this.showGoBtn(false);
        // }
    },
    showGoBtn(ret){
        this.goBtn.node.active = ret;
    },
    //
    refreshTurn(str){
        this.roundCount.string = "回合:" + str;
    },
    //
    refreshActor(str){
        this.nowPlayer.string = "当前:" + str;
    },
    //
    refreshDice(str) {
        this.dicePoint.string = "点数:" + str;
        this.dice = str;
    },
    //
    refreshMoney(str, currentMoney) {
        var differenceMoney = currentMoney - str;
        var _tempLabel = "";
        if(differenceMoney === 0) {
            return
        }
        else if(differenceMoney > 0) {
            _tempLabel = " - " + differenceMoney;
        }
        else if(differenceMoney < 0) {
            _tempLabel = " + " + Math.abs(differenceMoney);
        }
        this.playerMoney.string = "金钱:" + currentMoney + _tempLabel;
        var timeCallback = function (dt) {
            this.playerMoney.string = "金钱:" + str;
        }
        this.scheduleOnce(timeCallback, 1);
        
    },
    onGo(){
        this.closeTouch();
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.DICE, [1]);
        this.showGoBtn(false);
    },

    showBranchUI(posList){
        for(var k in posList){
            var p = posList[k];
            let arrowObj = null;
            if (this.arrowPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                cc.log("池中有空闲箭头对象");
                arrowObj = this.arrowPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                cc.log("创建新的箭头对象");
                arrowObj = cc.instantiate(this.arrowsBluePrefab);
            }
            arrowObj.parent = this.arrowsRoot; 
            cc.vv.Utils.addClickEvent(arrowObj, this.node, "BattleUI", "onSelect");
            arrowObj.setPosition(p);
            arrowObj.active = true;
            arrowObj.getComponent("ArrowItem").init(k, p);
            this.arrowsList.push(arrowObj);
        }
        this.goBtn.node.active = false;
    },
    onSelect(event){
        this.closeTouch();
        for(var v of this.arrowsList){
            v.active = false;
        }
        this.selectObj = event.target;
        var arrowPos = this.selectObj.getPosition();
        cc.log("onSelect pos =", arrowPos);
        this.arrowsYellow.node.setPosition(arrowPos);
        this.arrowsYellow.node.active = true;
        this.confirmBtn.node.active = true;
        this.cancelBtn.node.active = true;
    },
    onConfirm(){
        this.closeTouch();
        this.confirmBtn.node.active = false;
        this.cancelBtn.node.active = false;
        this.arrowsYellow.node.active = false;
       
        var selectBranch = this.selectObj.getComponent("ArrowItem").key;
        cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.CHOOSE_BRANCH, [parseInt(selectBranch)]); 
         //对象放回池
         for(var v of this.arrowsList){
            this.arrowPool.put(v); 
        }
        this.arrowsList = [];
    },
    onCancel(){
        this.closeTouch();
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
    closeTouch(){
        //this.owner._bTouch = false;
    },
    onDestroy(){
        cc.log("battleui onDestroy");
        cc.vv.MsgMgr.remove(cc.vv.Opcode.BUY_HOUSE, this.OnOpenBulidHousePanel);
    },
});
