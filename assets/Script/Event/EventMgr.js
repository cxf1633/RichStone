var EVENT_TYPE = {
    1:"BUY_HOUSE", //买房子
}
var EVENT_FUNC = {
    BUY_HOUSE:"Event_BuyHouse",
}
var BaseCompont = require("BaseCompont");
var EventMgr = cc.Class({
    extends: BaseCompont,

    properties: {
    },
    start () {
        this.BattleMgr = this.node.getComponent("BattleMgr");

        cc.vv.MsgMgr.register(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose, this);
    },
    OnEventDispose(){
        var roleMgr = this.BattleMgr._currentPlayer.getComponent("RoleMgr");
        //当前格子id
        var curGid = roleMgr.get("curGid");
        var mapGridVo = cc.vv.ConfigData.getConfigData("map_grid");
        var mapGrid = mapGridVo[curGid - 1]; //获取配置表下标从0开始 需 -1
        //'1=普通地块2=银行3=事件区域4=命运区域5=占卜屋6=卡牌商店',
        cc.log("mapGrid.grid_type==", mapGrid.grid_type);
        var eventType = EVENT_TYPE[mapGrid.grid_type];
        if(!eventType){
            cc.log("eventType =", eventType);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var eventName = EVENT_FUNC[eventType];
        if(!eventName){
            cc.log("eventName =", eventName);
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var event = require(eventName);
        if(!event){
            cc.log("event = null");
            this.BattleMgr.OnMoveEnd();
            return;
        }
        event.init(this.BattleMgr);
        event.executeEvent();
    },

    onDestroy(){
        cc.vv.MsgMgr.remove(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose);
    }
});
