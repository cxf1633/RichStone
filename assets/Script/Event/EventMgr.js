var EVENT_TYPE = {
    1:"BUY_HOUSE", //买房子
}
var EVENT_FUNC = {
    BUY_HOUSE:"Event_BuyHouse",
}

var NET_EVENT_TYPE = {
    12:"GO_HOSPITAL", //去医院
}
var NET_EVENT_FUNC = {
    GO_HOSPITAL:"Event_GoHospital",
}

var EVENT_TIPS = {
    1:"加减金币数量",
    6:"改变土地等级",
    10:"获得工资",
    11:"改变土地归属",
    12:"进医院",
    13:"免交过路费",
}
var BaseCompont = require("BaseCompont");
var EventMgr = cc.Class({
    extends: BaseCompont,

    properties: {
    },
    start () {
        this.BattleMgr = this.node.getComponent("BattleMgr");

        cc.vv.MsgMgr.register(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose, this);
        cc.vv.MsgMgr.register(cc.vv.Opcode.NET_EVENT_DISPOSE, this.OnNetEventDispose, this);
    },
    OnEventDispose(){
        var roleMgr = this.BattleMgr._currentPlayer.getComponent("RoleMgr");
        //当前格子id
        var curGid = roleMgr.get("curGid");
        var mapGridVo = cc.vv.ConfigData.getConfigData("map_grid");
        var mapGrid = mapGridVo[curGid - 1]; //获取配置表下标从0开始 需 -1
        //'1=普通地块2=银行3=事件区域4=命运区域5=占卜屋6=卡牌商店',
        cc.log("执行移动结束事件：", mapGrid.grid_type);
        var eventType = EVENT_TYPE[mapGrid.grid_type];
        if(eventType == null){
            cc.log("移动结束事件类型为空", mapGrid.grid_type);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var eventName = EVENT_FUNC[eventType];
        if(eventName == null){
            cc.log("移动结束文件为空", eventType);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var event = require(eventName);
        if(!event){
            cc.log("移动结束函数为空", eventName);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        event.init(this.BattleMgr);
        event.executeEvent();
    },
    OnNetEventDispose(data){
        if(data.event_type == 12){
            let str = "玩家：" + data.effect.uid + "进医院" + data.effect.at_status.rest_turn + "回合";
            cc.vv.Tooltip.show(str);
        }
        else{
            cc.vv.Tooltip.show(EVENT_TIPS[data.event_type]);
        }

        var eventType = NET_EVENT_TYPE[data.event_type];
        if(eventType == null){
            cc.log("网络事件类型为空", data.event_type);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var eventName = NET_EVENT_FUNC[eventType];
        //这里同时等于null和undefined
        if(eventName == null){
            cc.log("网络事件文件名为空：", eventType);
            return;
        }
        var event = require(eventName);
        if(event == null){
            cc.log("网络事件函数为空：", eventName);
            return;
        }
        event.init(this.BattleMgr);
        event.executeEvent(data.effect);
    },
    onDestroy(){
        cc.vv.MsgMgr.remove(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose);
        cc.vv.MsgMgr.remove(cc.vv.Opcode.NET_EVENT_DISPOSE, this.OnNetEventDispose);
    }
});
