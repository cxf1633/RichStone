cc.Class({
    extends: cc.Component,

    properties: {
        //-- 滚动的速度
        speed: 0,
    },

    update (dt) {
        var y = this.node.y;
        y -= this.speed * dt;
        if (y<= -640) {
            y = 0;
        }
        this.node.y = y;
    },
});
