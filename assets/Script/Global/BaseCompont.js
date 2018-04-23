//继承cc.Component的基类

var BaseCompont = cc.Class({
    extends: cc.Component,

    get(name){
        //cc.log("BaseCompont get:", name);
        var ret = this[name];
        if(!ret){
            cc.log("找不到属性：", name);
        }
        return ret;
    },
    set(name, value){
        //cc.log("BaseCompont set:", name, value);
        this[name] = value;
    },
    modify(name, value){
        this[name] = this[name] + value;
	    return this[name];
    },

    runActionBySpeed(action){
        var speed = 1//cc.vv.BattleData.battleSpeed;
        cc.log("BaseCompont runActionBySpeed speed =", speed);
        var act =  cc.speed(action, speed);
        this.node.runAction(act);
    },

    playAniBySpeed(aniNode, clip){
        //var speed = cc.vv.BattleData.battleSpeed;
        //cc.log("BaseCompont playAniBySpeed speed =", speed);
        var animState = aniNode.play(clip);
        //animState.speed = speed;
    }
});

//module.exports = BaseCompont;
