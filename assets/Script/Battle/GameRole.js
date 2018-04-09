//游戏角色
var GameRoleBase = require("GameRoleBase");

var GameRole = cc.Class({
    extends: GameRoleBase,

    properties: {
 
    },

    ctor: function () {
        //cc.log("GameRole  ctor===>");
    },

    printLog: function(){
        cc.log("GameRole print function");
    },
});
