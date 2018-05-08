//战斗管理

var BallMgr = require('BallMgr');

var GameMgr = cc.Class({
    extends: cc.Component,

    properties: {
        ball:BallMgr,
        //-- 获取gameOverMenu对象
        gameOverMenu: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        D.gameMgr = this;
        // activate colliders
        cc.director.getCollisionManager().enabled = true;
        this.ball.init();
    },

    start () {

    },
    gameOver () {
        this.gameOverMenu.active = true;
    }
    // update (dt) {},
});
