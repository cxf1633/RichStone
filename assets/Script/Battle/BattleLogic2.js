
cc.Class({
    extends: cc.Component,
    properties: {

    },
    //1，第一个调用
    onLoad: function() {
    
    },
    //2，onLoad之后调用
    start: function() {
        this.mapNode = this.node.getChildByName("map");
        
        var self = this;
        //加载 Prefab
        cc.loader.loadRes("prefab/player", function (err, prefab) {
            self.player1 = cc.instantiate(prefab);
            //player1.setPosition(self._getScenePos(6, 15));
            self.player1.setPosition(cc.p(0, 0));
            self.mapNode.addChild(self.player1);
        });
    },
    // called every frame
    update: function (dt) {
        this._fixPlayerInCenter();
    },
    _fixPlayerInCenter: function(){
        if(this.player1 == null || this.mapNode == null)
            return;

        var playerPos = this.player1.getPosition(); 
        var mapPos = cc.p(0 - playerPos.x, 0 - playerPos.y);
        this.mapNode.setPosition(mapPos);
    },

});
