cc.Class({
    extends: cc.Component,

    properties: {
        uidLabel: {
            default: null,
            type: cc.Label
        },

        lvLabel: {
            default: null,
            type: cc.Label
        },

        tollLabel: {
            default: null,
            type: cc.Label
        },

        houseSprite: {
            default: null,
            type: cc.Sprite
        },

        newHouseSprite: {
            default: null,
            type: cc.Node
        },
    },

    start () {
        // 层级设置
        // this.houseSprite.node.zIndex = 1;
        // this.newHouseSprite.zIndex = 2;
        // this.uidLabel.node.zIndex = 3;
        // this.lvLabel.node.zIndex = 3;
    },

    get:function(name){
        return this[name];
    },

    set:function(name, value){
        this[name] = value;
        if(name === "data") {
            this.uidLabel.string = "UId: " + value["owner_id"];
            var _testLabel = value["lv"];
            if(_testLabel === -1) {
                _testLabel = "无";
            }
            this.lvLabel.string = "等级: " + _testLabel;
            //this.tollLabel.string = "过路费: 0";
        }
    },

    upgradeHouse:function(name, value) {
        var _pos = this.newHouseSprite.position;
        this.newHouseSprite.active = true;
        
        var moveAction = cc.moveTo(0.5, cc.p(0, 0));
        var callback = cc.callFunc(function() {
            this.set(name, value);
            this.newHouseSprite.active = false;
        }, this);
        this.newHouseSprite.runAction(cc.sequence(moveAction, callback));
    }
});
