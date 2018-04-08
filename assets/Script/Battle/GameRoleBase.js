//游戏角色基类

var GameRoleBase  = cc.Class({
    extends: cc.Component,

    properties: {
        _roundCount:0,
    },

    ctor: function () {
        //cc.log("GameRoleBase ctor===>");
    },
    reset:function(){
        this.node.setPosition(this.orginPos);
    },

    setName:function(name){
        this._name = name
    },

    setCurrentGid: function(gid){
        this.currentGid = gid;
        cc.log("player gid:", gid);
        var pos = this._getScenePos(gid.x, gid.y);
        //cc.log("pos +++", pos);
        this.orginPos = this.node.getPosition();
        //cc.log("player orgin pos:", this.orginPos);
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
        cc.changit.msgMgr.dispatch(cc.changit.opcode.MOVEEND, data);
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
