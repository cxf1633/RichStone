cc.Class({
    extends: cc.Component,

    properties: {
        tollLabel: cc.Label,
        campFrameSprite: cc.Sprite,
        houseSprite: cc.Sprite,
        newHouseSprite: cc.Sprite,

        _gridLvData: null, //grid_lv表数据
    },

    start () {
        if(this._gridLvData === null) {
            this._gridLvData = cc.vv.ConfigData.getConfigData("grid_lv");
        }
    },

    get:function(name){
        return this[name];
    },

    set:function(name, value){
        var self = this;
        this[name] = value;
        if(name === "data") {
            if(value.camp === 0) {
                this.campFrameSprite.node.active = false;
            }
            else {
                if(!this.campFrameSprite.node.active) {
                    this.campFrameSprite.node.active = true;
                }
                cc.loader.loadRes("Atlas/BuildHouseUIAtlas/BuildHouseUIAtlas", cc.SpriteAtlas, function (err, atlas) {
                    self.campFrameSprite.spriteFrame = atlas.getSpriteFrame("battle_campFrame_" + value.camp);
                });
            }
            
            // this.tollLabel.string = "过路费: 0";

            cc.loader.loadRes("Atlas/BuildHouseUIAtlas/BuildHouseUIAtlas", cc.SpriteAtlas, function (err, atlas) {
                var _spriteName = "MapPiece_0";
                if(value.lv >= 0) {
                    _spriteName = "MapPiece_" + self._gridLvData[value.lv].pic_id;
                }
                self.houseSprite.spriteFrame = atlas.getSpriteFrame(_spriteName);
            });
        }
    },

    upgradeHouse:function(name, value) {
        var _pos = this.newHouseSprite.node.position;
        this.newHouseSprite.node.active = true;

        var self = this;
        cc.loader.loadRes("Atlas/BuildHouseUIAtlas/BuildHouseUIAtlas", cc.SpriteAtlas, function (err, atlas) {
            var _testName = 'MapPiece_' + self._gridLvData[value.lv].pic_id;
            var frame = atlas.getSpriteFrame(_testName);
            self.newHouseSprite.spriteFrame = frame;

            var moveAction = cc.moveTo(0.5, cc.p(0, 0));
            var callback = cc.callFunc(function() {
                self.set(name, value);
                self.newHouseSprite.node.active = false;
                self.houseSprite.spriteFrame = frame;
                self.newHouseSprite.node.position = _pos;
            }, self);
            self.newHouseSprite.node.runAction(cc.sequence(moveAction, callback));
        });
    },
});
