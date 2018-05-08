//球管理
var BallMgr = cc.Class({
    extends: cc.Component,

    properties: {
        //-- 重力
        gravity: 0,
        //
        speedX:0,
        speedY:0,
        colliderNum:0,
        COR:0,
    },
    init () {
        this.registerInput();
    },
    startPlay () {
        this._isStart = true;
    },
    //-- 初始化
    registerInput () {
        //触屏
        this.node.parent.on(cc.Node.EventType.TOUCH_START, 
            function(event) {
                this.startPlay();
                this.jump();
            }.bind(this),
            this.node.parent);
        //按键
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.jump, this);
    },
    //-- 开始跳跃设置状态数据，播放动画
    jump () {
        if (!this._isStart) {
            return;
        }
        this.currentSpeedX = this.speedX;
        this.currentSpeedY = this.speedY;
    },
    //-- 更新
    update (dt) {
        if (!this._isStart) {
            return; 
        }
        this.node.x += dt * this.currentSpeedX;
        this.currentSpeedY -= dt * this.gravity;
        this.node.y += dt * this.currentSpeedY;
        if (this.node.y < -500) {
            this._isStart = false;
            D.gameMgr.gameOver();
        }
    },
    onCollisionEnter (other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'Obstacle') {
            // var p1 = cc.p(0, -1);//this.node.getPosition();
            // var p2 = cc.p(0, -2);//other.node.getPosition();
            this.currentSpeedX = 0 - this.currentSpeedX;
            this.currentSpeedY = 0 - this.currentSpeedY;
            //当前移动向量
            var cm = cc.p(this.currentSpeedX, this.currentSpeedY);
            var p1 = this.node.getPosition();
            var po = other.node.getPosition();
            var pa = other.node.parent.getPosition()
            var p2 = cc.pAdd(pa, po);
            var p3 = other.node.getNodeToParentTransform();
            //反弹力方向向量
            var mf = cc.pSub(p1, p2);
            var a = cc.pAngle(mf, cm);
            var b = cc.pAngleSigned(mf, cm);
            var r = Math.PI*2/360;
            var an = a/r;
            // var x = Math.sin(a) * 2;
            // var y = Math.sin(a) * 2;

            // var angle = 45;
            //var radian = angle * r;
            this.currentSpeedX= Math.sin(b)*this.currentSpeedY;
            this.currentSpeedY= Math.abs(Math.sin(b))*this.currentSpeedY;
            // this.currentSpeedX = 0 - this.currentSpeedX*this.COR;
            // this.currentSpeedY = 0 - this.currentSpeedY*this.COR;
            cc.log("NextPipe==>>");
        }
        else if (group === 'NextPipe') {
            cc.log("NextPipe==>>");
        }
    },
    onDestroy(){
        cc.log("BallMgr onDestroy");
        this.node.parent.off(cc.Node.EventType.TOUCH_START);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
    }
});
