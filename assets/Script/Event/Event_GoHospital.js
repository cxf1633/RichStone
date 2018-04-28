//去医院
var Event_GoHospital = {
    
    init(battleMgr){
        this.BattleMgr = battleMgr;
    },
    executeEvent(data){
        cc.log("执行去医院")
        var playerObj = this.BattleMgr.getPlayerObjByUid(data.uid);
        var pos = this.BattleMgr.MapMgr.getPositionByGid(data.after_pos);
        playerObj.setPosition(pos);
        playerObj.getComponent("RoleMgr").set("curPos", pos);
    }
}


module.exports = Event_GoHospital;
