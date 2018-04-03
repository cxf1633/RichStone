// TiledMap 管理器

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function(err) {
        if (err) return;
        this._tiledMap = this.node.getComponent('cc.TiledMap');

        var objectGroup = this._tiledMap.getObjectGroup("grids");
        if (!objectGroup) return;
        
        var startObj = objectGroup.getObject("1");

        var startPos = cc.p(startObj.sgNode.x, startObj.sgNode.y);
        cc.log("startPos ===>", startPos);
    },

    // update (dt) {},
});
