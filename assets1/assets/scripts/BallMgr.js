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
            cc.log("ball y=" , this.node.y);
            cc.log("other y=", other.node.y)
            cc.log("Obstacle==>>", this.currentSpeedX, this.currentSpeedY);
            this.currentSpeedX = 0 - this.currentSpeedX*this.COR;
            this.currentSpeedY = 0 - this.currentSpeedY*this.COR;
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
