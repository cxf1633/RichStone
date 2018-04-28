//买房子
var Event_BuyHouse = {
    
    init(battleMgr){
        this.BattleMgr = battleMgr;
    },
    executeEvent(){
        cc.log("Event_BuyHouse:", this.BattleMgr._currentPlayer.name);
        var roleMgr = this.BattleMgr._currentPlayer.getComponent("RoleMgr");
        if(roleMgr.get("uid") != cc.vv.UserData.userId){
            cc.log("不是自己回合，跳过");
            this.BattleMgr._bInCmd = false;
            return;
        }
        //当前格子id
        var curGid = roleMgr.get("curGid");
        var mapGridList = cc.vv.ConfigData.getConfigData("map_grid");
        var mapGrid = mapGridList[curGid - 1]; //获取配置表下标从0开始 需 -1
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
        //cc.log("要求等级：",  landData.lv);
        var playerData = cc.vv.BattleData.getDataByUid(cc.vv.UserData.userId);
        //cc.log("玩家圈数：",  playerData.circle, playerData.name);
        if(playerData.circle < landData.lv) {
            cc.vv.Tooltip.show("圈数不足,不能购买");
            this.BattleMgr.OnMoveEnd();
            return;
        }
        var gridLvList = cc.vv.ConfigData.getConfigData("grid_lv");
        var gridLv = gridLvList[landData.lv + 1];
        if(gridLv.is_landmark == 0) {
            var lvCost = gridLv.lv_cost_times * mapGrid.cost;
            // cc.log("要求金钱：", lvCost);
            // cc.log("玩家金钱：",  playerData.money, playerData.name);
            if(playerData.money >= lvCost) {
                cc.vv.MsgMgr.dispatch(cc.vv.Opcode.BUY_HOUSE, mapGrid);
            }
            else {
                cc.vv.Tooltip.show("金钱不足,不能购买");
                this.BattleMgr.OnMoveEnd();
                return;
            }
        }
    },
}

module.exports = Event_BuyHouse;
