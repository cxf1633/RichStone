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
        if(roleMgr.get("uid") != cc.vv.UserData.userId){
            cc.log("不是自己回合，跳过");
            this.BattleMgr._bInCmd = false;
            return;
        }
        //最后一格id
        var finallyLandId = roleMgr.get("finallyLandId");
        var mapGridList = cc.vv.ConfigData.getConfigData("map_grid");
        var mapGrid = mapGridList[finallyLandId - 1]; //获取配置表下标从0开始 需 -1
        if(mapGrid.grid_type != 1) {//'1=普通地块2=银行3=事件区域4=命运区域5=占卜屋6=卡牌商店',
            cc.log("不是普通地块，跳过");
            this.BattleMgr.OnMoveEnd();
            return;
        }
        //服务器下发的关联地块
        var landData =  this.BattleMgr._battleData.getlandState(mapGrid.attach_grid_id);
        if(landData.owner_id != 0 && landData.owner_id != cc.vv.UserData.userId) {
            //cc.vv.Tooltip.show("你移动到得地块是 UID:" + _landData.owner_id + " 的土地, 需要缴交过路费");
            cc.log("移动到别人地块，需要交过路费");
            this.BattleMgr.OnMoveEnd();
            return;
        }    
        //圈数不满足
        if(roleMgr.get("circle") < landData.lv) {
            cc.vv.Tooltip.show("圈数不足,不能购买");
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var gridLvList = cc.vv.ConfigData.getConfigData("grid_lv");
        var gridLv = gridLvList[landData.lv + 1];
        if(gridLv.is_landmark == 0) {
            var lvCost = gridLv.lv_cost_times * mapGrid.cost;
            if(roleMgr.get("money") >= lvCost) {
                cc.vv.MsgMgr.dispatch(cc.vv.Opcode.BUY_HOUSE, mapGrid);
            }
            else {
                cc.vv.Tooltip.show("金钱不足,不能购买");
                this.BattleMgr.OnMoveEnd();
                return;
            }
        }
    },

    onDestroy(){
        cc.vv.MsgMgr.remove(cc.vv.Opcode.EVENT_DISPOSE, this.OnEventDispose);
    }
});
