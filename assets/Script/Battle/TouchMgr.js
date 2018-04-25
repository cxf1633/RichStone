
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        touchLocationDisplay: cc.Label,
    },
    curPos:null,
    onLoad () {
        var self = this;
        self.isMoving = false;
        self.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {self.touchBegin.call(self,event)}, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {self.touchMove.call(self,event)}, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {self.touchEnd.call(self,event)}, self.node);
        this.BattleMgr = this.node.getComponent("BattleMgr");
    },
    touchBegin(event){
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this.isMoving = true;
       
        var touchPosX = Math.floor(touchLoc.x);
        var touchPosY = Math.floor(touchLoc.y);
        this.touchLocationDisplay.string = touchPosX + ', ' + touchPosY;

        this.BattleMgr._bTouch = true;
        var mapPos = this.BattleMgr.mapNode.getPosition();
        //cc.log("mapPos:", mapPos);
        this.curPos = cc.p(touchPosX, touchPosY);
    },
    touchMove(event){
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        var touchPosX = Math.floor(touchLoc.x);
        var touchPosY = Math.floor(touchLoc.y);
        var offseX = touchPosX - this.curPos.x;
        var offseY = touchPosY - this.curPos.y;
        if(Math.abs(offseX) < 1 && Math.abs(offseY) < 1) return;
        this.touchLocationDisplay.string = touchPosX + ', ' + touchPosY;

        var mapPos = this.BattleMgr.mapNode.getPosition();
        var pos = cc.p(mapPos.x + offseX, mapPos.y + offseY);
        this.BattleMgr.mapNode.setPosition(pos);
        //cc.log("pos:", pos);
        this.curPos = touchLoc;
    },
    touchEnd(event){
        this.isMoving = false;
        //this.BattleMgr._bTouch = false;
    }
});
