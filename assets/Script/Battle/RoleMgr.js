//游戏角色
var BaseCompont = require("BaseCompont");
var RoleMgr = cc.Class({
    extends: BaseCompont,
    properties: {
    },
    curPos:null,   //当前位置
    lastPos:null,  //上一个位置，用来算方向
    anim:null,
    pathId:0,           
    pathObjs:null,  //路径
    ctor() {
        //cc.log("RoleMgr  ctor===>");
    },
    start(){
        this.anim = this.node.getChildByName("model").getComponent(cc.Animation);
    },
    initData(data){
        this.uid = data.uid;
        this.curGid = data.pos; //地图格子
        this.figure = data.figure;



        // this.diceEnd = data.dice_end;
        // this.branches = data.branches;
        // this.name = data.name;
        // this.energy = data.energy;
        // this.camp = data.camp;
        // this.money = data.money;
        // this.circle = data.circle;

    },
    moveByPath(pathObjs){
        if(pathObjs == null || pathObjs[0] == null){
            cc.log("RoleMgr moveByPath paths = null");
            return;
        }
        this.pathObjs = pathObjs
        this.pathId = 0;
        var pathObj = pathObjs[this.pathId];
        this._moveNextPath(pathObj);
    },
    _moveNextPath(pathObj){
        var tempPos = this.get("curPos");
        this.set("lastPos", tempPos);
        this.curGid = pathObj["id"];
        this.set("curPos", pathObj["pos"]);

        var moveAction = cc.moveTo(0.5, pathObj["pos"]);
        var callback = cc.callFunc(this._hasNextPath, this);

        this.runActionBySpeed(cc.sequence(moveAction, callback));

        this._playAni();

        //待优化：数据驱动UI
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.MOVE_ONE)
    },
    _playAni(){
        var c = this.get("curPos");
        var o = this.get("lastPos");
        var dir = cc.p(c.x - o.x, c.y - o.y);
        if(dir.x > 0 && dir.y > 0){
            //cc.log("右上");
            if(this.node.name == "player0"){
                this.node.setScale(-1, 1);
            }
            else{
                this.node.setScale(1, 1);
            }
            //var animState = this.anim.play("move_up");
            this.playAniBySpeed(this.anim, "move_up")
        }
        else if(dir.x < 0 && dir.y > 0){
            //cc.log("左上");
            if(this.node.name == "player0"){
                this.node.setScale(1, 1);
            }
            else{
                this.node.setScale(-1, 1);
            }
            //var animState = this.anim.play("move_up");
            this.playAniBySpeed(this.anim, "move_up")
        }
        else if(dir.x > 0 && dir.y < 0){
            //cc.log("右下");
            this.node.setScale(1, 1);
            //var animState = this.anim.play("move_down");
            this.playAniBySpeed(this.anim, "move_down")
        }
        else if(dir.x < 0 && dir.y < 0){
            //cc.log("左上");
            this.node.setScale(-1, 1);
            //var animState = this.anim.play("move_down");
            this.playAniBySpeed(this.anim, "move_down")
        }
    },
    _hasNextPath(){
        this.pathId += 1;
        //cc.log("_hasNextPath = ", this.pathId);
        var pathObj = this.pathObjs[this.pathId];
        if(pathObj == null ){
            this._doStopEvent();
        }
        else{
            this._moveNextPath(pathObj);
        }
    },
    _doStopEvent(){
        // cc.log("_doStopEvent");
        this.anim.stop();
        this.pathObjs = null;
        this.pathId = 0;
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.EVENT_DISPOSE, "_doStopEvent");
    },

});
