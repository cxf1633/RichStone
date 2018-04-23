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
        this.playerList = info.members;
        this.lands = info.lands;
    },
    getData(name){
        return this[name];
    },
    setData(name, value){
        this[name] = value;
    },
    getUserDataByUid(uid){
        if(!this.playerList){
            cc.log("this.playerList is null!");
            return;
        }
        for(var v of this.playerList){
            if(v.uid == uid){
                return v;
            }
        }
        cc.log("no find uid:", uid);
    },

    setUserDataByUid(uid, changeDataName, value) {
        if(this.playerList) {
            for (var v of this.playerList) {
                if(v.uid == uid){
                    v[changeDataName] = value;
                }
            }
        }
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
