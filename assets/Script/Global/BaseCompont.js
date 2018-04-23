//继承cc.Component的基类

var BaseCompont = cc.Class({
    extends: cc.Component,
    mProperty:null,
    ctor(){
        this.mProperty = {};
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
    printProperty(){
        cc.log("BaseCompont printProperty");
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
