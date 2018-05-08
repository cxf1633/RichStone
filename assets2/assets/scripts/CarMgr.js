var CarMgr = cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed:1,
        turnSpeed:1,
    },
    direction:null,
    isStart:false,
    isTouch:false,

    touchPos:0,

    start () {
        this.direction = cc.p(0, 1);
        var s = this.node.x;
        this.registerInput();
    },
    //-- 初始化
    registerInput () {
        //触屏
        this.node.parent.on(cc.Node.EventType.TOUCH_START, 
            function(event) {
                this.touchStart(event);
            }.bind(this),
            this.node.parent);
        // this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, 
        //     function(event) {
        //         this.touchMove(event);
        //     }.bind(this),
        //     this.node.parent);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, 
            function(event) {
                this.touchEnd(event);
            }.bind(this),
            this.node.parent);
    },
    touchStart(event){
        cc.log("touchStart");
        this.isStart = true;
        this.isTouch = true;

        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        var touchPosX = Math.floor(touchLoc.x);
        var touchPosY = Math.floor(touchLoc.y);

        if (touchLoc.x > 480) {
            this.touchPos = 1;
            //rotation += this.turnSpeed;            
        }
        else{
            this.touchPos = -1;
            //rotation -= this.turnSpeed;        
        }
        
    },
    // touchMove(event){
    //     cc.log("touchMove");
    //     this.rotateCar(event);
    // },
    touchEnd(){
        cc.log("touchEnd");
        this.isTouch = false;
        this.touchPos = 0;
    },
    rotateCar(){
        var rotation = this.node.rotation;
        rotation += this.turnSpeed*this.touchPos;          
        this.node.rotation = rotation;
    },
    update (dt) {
        if (this.isStart != true) {
            return;
        }
        if (this.isTouch != true) {
            return;
        }
        this.rotateCar();

        var p = this.node.getPosition();
        var d = this.moveSpeed * dt;
        var pos = cc.p(this.direction.x * d , this.direction.y * d);
        var pp = cc.pAdd(p, pos);
        this.node.setPosition(pp);
    },
});
