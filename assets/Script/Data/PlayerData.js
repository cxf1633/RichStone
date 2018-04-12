//玩家信息

var PlayerData = {

    userName: '',
    id:null,
    exp:0,
    lv:1,
    crystal:0, //水晶货币
    shell:0, //贝壳货币

    init () {
        cc.changit.MsgMgr.register(cc.changit.Opcode.LOGIN, this.initPlayerData, this)
    },
    get:function(name){
        return this[name];
    },
    set:function(name, value){
        this[name] = value;
    },
    //初始化角色基本数据
    initPlayerData(data){
        this.userName = data.player.name
        console.log("Init Player Name " + data.player.name)
        this.id = data.player.id 
        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.ENTER_MAIN)
    },

    
    release(){
        cc.changit.MsgMgr.remove(cc.changit.Opcode.LOGIN, this.initPlayerData)
    },
    

};

module.exports = PlayerData
