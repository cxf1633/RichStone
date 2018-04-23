//游戏角色
var BaseCompont = require("BaseCompont");
var RoleMgr = cc.Class({
    extends: BaseCompont,

    properties: {
        // _orginPos:null,
        // _curPos:null,
        _anim:null,
        _pathId:0,
    },

    ctor() {
        //cc.log("RoleMgr  ctor===>");
    },
    start(){
        this._anim = this.node.getComponent(cc.Animation);
        this.playAniBySpeed(this._anim, "move_up")
        //this._curPos = this._orginPos;
        // var orginPos = this.get("orginPos")
        // this.set("curPos", orginPos);
    },
    initData(data){
        this.uid = data.uid;
        this.name = data.name;
        this.curPos = data.pos;
        this.orginPos = data.pos;
        this.energy = data.energy;
        this.circle = data.circle;
        this.money = data.money;
        this.figure = data.figure;
        this.camp = data.camp;
        this.dice_end = data.dice_end;
        this.branches = data.branches;
    },
    moveByPath(paths){
        this.paths = paths
        this.pathId = 0;
        var pos = paths[this.pathId];
        if(pos == null){
            cc.log("RoleMgr moveByPath path is null!=====>>>");
        }
        else{
            this._moveNextPath(pos);
        }
    },
    _moveNextPath(pos){
        var curPos = this.get("curPos");
        this.set("orginPos", curPos);
        this.set("curPos", pos);

        var moveAction = cc.moveTo(0.5, pos);
        var callback = cc.callFunc(this._hasNextPath, this);

        this.runActionBySpeed(cc.sequence(moveAction, callback));

        this._playAni();

        //待优化：数据驱动UI
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.MOVE_ONE)
    },
    _playAni(){
        var c = this.get("curPos");
        var o = this.get("orginPos");
        var dir = cc.p(c.x - o.x, c.y - o.y);
        if(dir.x > 0 && dir.y > 0){
            //cc.log("右上");
            if(this.node.name == "player0"){
                this.node.setScale(-1, 1);
            }
            else{
                this.node.setScale(1, 1);
            }
            //var animState = this._anim.play("move_up");
            this.playAniBySpeed(this._anim, "move_up")
        }
        else if(dir.x < 0 && dir.y > 0){
            //cc.log("左上");
            if(this.node.name == "player0"){
                this.node.setScale(1, 1);
            }
            else{
                this.node.setScale(-1, 1);
            }
            //var animState = this._anim.play("move_up");
            this.playAniBySpeed(this._anim, "move_up")
        }
        else if(dir.x > 0 && dir.y < 0){
            //cc.log("右下");
            this.node.setScale(1, 1);
            //var animState = this._anim.play("move_down");
            this.playAniBySpeed(this._anim, "move_down")
        }
        else if(dir.x < 0 && dir.y < 0){
            //cc.log("左上");
            this.node.setScale(-1, 1);
            //var animState = this._anim.play("move_down");
            this.playAniBySpeed(this._anim, "move_down")
        }
    },
    _hasNextPath(){
        this.pathId += 1;
        //cc.log("_hasNextPath = ", this.pathId);
        var pos = this.paths[this.pathId];
        if(pos == null ){
            this._doStopEvent();
        }
        else{
            this._moveNextPath(pos);
        }
    },
    _doStopEvent(){
        // cc.log("_doStopEvent");
        this._anim.stop();
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.EVENT_DISPOSE, "_doStopEvent");
    },

});
