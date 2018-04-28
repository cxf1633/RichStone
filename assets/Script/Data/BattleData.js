//战斗数据
var BattleData = cc.Class({
    roomId:null,    //房间id
    createTime:null,    //战斗开始时间
    battleInterval:null,    // 战斗时长达到这个数值，则战斗结束
    roundId:null,       //当前回合
    loser:null,     // 输家ID
    status:0,   //房间状态 2 战斗开始，3 战斗结束
    playerList:null,    //所有玩家信息
    curActor:null,      //当前玩家
    nextActorId:null,     //下一个行动的玩家id
    
    dicePoint:0,    //骰子点数
    circle:0,       //圈数
    initRoomData(info){
        cc.log("initRoomData====>>>");
        this.roomId = info.id;
        this.battleInterval = info.battle_interval;
        this.curActor = info.cur_actor;
        //this.nextActorId = info.cur_actor;
        this.roundId = info.turn;
        this.loser = info.loser;
        this.status = info.status;
        this.playerDatas = {};
        for (const iterator of info.members) {
            //cc.log(iterator);
            this.playerDatas[iterator.uid] = iterator;
        }
        this.lands = info.lands;
        this.triggers = info.triggers;
    },
    getData(name){
        var ret = this[name];
        if(ret == null){
            cc.log("找不到属性：", name);
        }
        return ret;
    },
    setData(name, value){
        this[name] = value;
    },
    modifyData(name, value){
        this[name] = this[name] + value;
	    return this[name];
    },
    getDataByUid(uid){
        var playerData = this.playerDatas[uid];
        if (playerData == null) {
            cc.log("getDataByUid 没有找到用户数据 uid=", uid);
        }
        return playerData;
    },

    //undefined 、null、0 三种类型
    setDataByUid(uid, name, value) {
        var playerData = this.playerDatas[uid];
        if (playerData == null) {//可以排除undefined和null
            cc.log("setDataByUid 没有找到用户数据 uid=", uid);
            return;
        }
        var data = playerData[name];
        if (data == null) {
            cc.log("没有找到属性数据 name=", name);
            return;
        }
        this.playerDatas[uid][name] = value;
    },

    getlandState(mapId) {
        if(this.lands[mapId] != null) {
            return this.lands[mapId];
        }
        return null;
    },
    setlandState(mapId, value) {
        this.lands[mapId] = value;
    },
});

//module.exports = BattleData;
