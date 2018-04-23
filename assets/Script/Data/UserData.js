//用户信息
//调用方法：UserData._instance.init(data);
var UserData = {
    userId:null,
    userName:null,
    mProperty:{},
    init(data){
        cc.log("UserData init data:", data);
        this.userId = data.player.id;
        this.userName = data.player.name;
    },
    get(name){
        //cc.log("BaseCompont get:", name);
        var ret = this.mProperty[name];
        return ret;
    },
    set(name, value){
        //cc.log("BaseCompont set:", name, value);
        this.mProperty[name] = value;
    },
    modify(name, value){
        this.mProperty[name] = this.mProperty[name] + value;
	    return this.mProperty[name];
    },
};

module.exports = UserData;

// module.exports = {
//     _instance:UserData
// }

//=============>>>cc.Class也是可以的
// //用户信息
// 调用方法：UserData.instance().init(data);
// var _ins = null;
// var UserData = cc.Class({
//     userId:null,
//     userName:null,
//     init(data){
//         cc.log("UserData init data:", data);
//         this.userId = data.player.id;
//         this.userName = data.player.name;
//     }
// });

// UserData.instance = function () {
//     if (_ins == null) {
//         _ins = new UserData();
//     }
//     return _ins;
// }

// module.exports = {
//     instance:UserData.instance
// }
