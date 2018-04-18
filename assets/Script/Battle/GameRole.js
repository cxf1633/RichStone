//游戏角色

var GameRole = cc.Class({
    extends: cc.Component,

    properties: {
        _orginPos:null,
        _curPos:null,
        _anim:null,
        _pathId:0,
    },

    ctor() {
        //cc.log("GameRole  ctor===>");
    },
    start(){
        this._anim = this.node.getComponent(cc.Animation);
        this._curPos = this._orginPos;
    },
    get:function(name){
        return this[name];
    },
    set:function(name, value){
        this[name] = value;
    },
    moveByPath(paths){
        //cc.log("GameRole paths =", paths);
        this.paths = paths
        this.pathId = 0;
        var pos = paths[this.pathId];
        if(pos == null){
            cc.log("GameRole moveByPath path is null!=====>>>");
        }
        else{
            this._moveNextPath(pos);
        }
    },
    _moveNextPath(pos){
        this._orginPos = this._curPos;
        this._curPos = pos;
        // cc.log("_orginPos =", this._orginPos);
        // cc.log("_curPos =", this._curPos);
        var moveAction = cc.moveTo(0.5, pos);
        var callback = cc.callFunc(this._hasNextPath, this);
        this.node.runAction(cc.sequence(moveAction, callback));

        this._playAni();

        //待优化：数据驱动UI
        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.MOVE_ONE)
    },
    _playAni(){
        var dir = cc.p(this._curPos.x, this._curPos.y);
        var p = this._orginPos;
        cc.pSubIn(dir, p);
        if(dir.x > 0 && dir.y > 0){
            this.node.setScale(1, 1);
            this._anim.play("move_up");
        }
        else if(dir.x < 0 && dir.y > 0){
            this.node.setScale(-1, 1);
            this._anim.play("move_up");
        }
        else if(dir.x > 0 && dir.y < 0){
            this.node.setScale(1, 1);
            this._anim.play("move_down");
        }
        else if(dir.x < 0 && dir.y < 0){
            this.node.setScale(-1, 1);
            this._anim.play("move_down");
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
        cc.log("_doStopEvent");
        this._anim.stop();
        cc.changit.MsgMgr.dispatch(cc.changit.Opcode.MOVE_END, "_doStopEvent");
    },

});
