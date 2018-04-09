//游戏角色基类

var GameRoleBase  = cc.Class({
    extends: cc.Component,

    properties: {
        _roundCount:0,
        _index:0,
    },

    ctor: function () {
        //cc.log("GameRoleBase ctor===>");
    },
    reset:function(){
        this.node.setPosition(this.orginPos);
    },

    get:function(name){
        return this[name];
    },
    set:function(name, value){
        this[name] = value;
    },

    doRound:function(round){
        this._roundCount = round;
        var roundString = "第" + this._roundCount + "回合";
        var data = {roundCount: roundString, roundOwner: this.get("name")};
        cc.changit.msgMgr.dispatch(cc.changit.opcode.ROUND, data);
    },

    setMapInfo: function(tmxMap){
        this.cellXCount = tmxMap.getMapSize().width;
        this.cellYCount = tmxMap.getMapSize().height;
        this.cellWidth = tmxMap.getTileSize().width;
        this.cellHeight = tmxMap.getTileSize().height;
        this.mapPixWidth = this.cellWidth * this.cellXCount;
        this.mapPixHeight = this.cellHeight * this.cellYCount;
    },

    moveByPath: function(paths){
        this.paths = paths
        this.pathId = 0;
        var path = paths[this.pathId];
        if(path == null){
            cc.log("path is null!=====>>>");
        }
        else{
            this._moveNextPath(path);
        }
    },
    _moveNextPath:function(nextPath){
        this.currentGid = nextPath;
        var newPos = this._getScenePos(nextPath.x, nextPath.y);   
        var moveAction = cc.moveTo(1, newPos);
        var callback = cc.callFunc(this._hasNextPath, this);
        this.node.runAction(cc.sequence(moveAction, callback));
    },
    _hasNextPath: function(){
        this.pathId += 1;
        cc.log("_hasNextPath = ", this.pathId);
        var path = this.paths[this.pathId];
        if(path == null ){
            this._doStopEvent();
        }
        else{
            this._moveNextPath(path);
        }
    },
    _doStopEvent: function(){
        cc.log("_doStopEvent");
        cc.changit.msgMgr.dispatch(cc.changit.opcode.MOVE_END, "_doStopEvent");
    },

    // cellX和cellY是tilemap中的单元格。
    _getScenePos: function(cellX, cellY){
        // cc.log("cellX =", cellX);
        // cc.log("cellY =", cellY);
        var posX = this.mapPixWidth / 2 + (cellX - cellY) * this.cellWidth / 2;
        var posY = this.mapPixHeight - (cellX + cellY) * this.cellHeight / 2;
        // cc.log("posX =", posX);
        // cc.log("posY =", posY);
        return cc.p(posX, posY-40);
    },
});
