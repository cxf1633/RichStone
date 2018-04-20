//用户信息
//调用方法：UserData._instance.init(data);
var UserData = {
    userId:null,
    userName:null,
    init(data){
        cc.log("UserData init data:", data);
        this.userId = data.player.id;
        this.userName = data.player.name;
    }
};

module.exports = {
    _instance:UserData
}

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
