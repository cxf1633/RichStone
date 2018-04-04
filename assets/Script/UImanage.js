// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        playerObj :{
            default : null,
            type :cc.Node,
        },

        mapObj : {
            default : null,
            type : cc.Node,
        },
        
        _tileSize : null,

        _startMapPoint : cc.p(5, 12),
       _time : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._randomBtn = this.node.getChildByName("button")
        cc.utils.addClickEvent(this._randomBtn, this.node, "UImanage", "randomPoint")
    },


    start() {
        this._tiledMap = this.mapObj.getComponent('cc.TiledMap');

        // var objectGroup = this._tiledMap.getObjectGroup('playerPoint');
        // if (!objectGroup) return;
        // var startObj = objectGroup.getObject('playerpoint');
        // console.log(startObj.sgNode.x + "======================" + startObj.sgNode.y)
        // console.log(startObj.sgNode.width + "======================" + startObj.sgNode.height)

        this._tileSize =  this._tiledMap.getTileSize()
        this._mapSize = this._tiledMap.getMapSize()
        this.mapPixWidth = this._tileSize.width * this._mapSize.width
        this.mapPixHeight = this._tileSize.height * this._mapSize.height

        
    },

    randomPoint () {
        var point = cc.mathEx.getRandom(1, 6)
        //var point  = cc.rand(5);
        cc.log("randomPoint:" + point);
        this.label.string = point;
        this.stepIndex = point
        //this._playerMove(point)
    },

    _playerMove(){
        // var playerPos = this.playerObj.getPosition();
        // var newPos = cc.p(this.playerObj.x, this.playerObj.y + (this._tileSize.height * step))
        var posX = this.mapPixWidth / 2 + (this._startMapPoint.x - this._startMapPoint.y) * this._tileSize.width / 2;
        var posY = this.mapPixHeight - (this._startMapPoint.x + this._startMapPoint.y) * this._tileSize.height / 2;
        var newPos = cc.p(posX - this.mapPixWidth/2, posY - this.mapPixHeight/2)
        this.playerObj.setPosition(newPos)
    },


    update (dt) {
        if (this.stepIndex > 0){
            this._time += dt 
            if (this._time >= 1) { 
                this._startMapPoint = cc.p(this._startMapPoint.x, this._startMapPoint.y - 1)
                this._playerMove()
                this._time = 0
                this.stepIndex -= 1
            }
        }
    },


    _getNextTile(){
        var tempPos = cc.p(this._startMapPoint.x, this._startMapPoint.y - 1)
        if (tempPos.y < 0 || tempPos.y >= this._mapSize.height){
            //判断X      
        }
        tempPos = cc.p(this._startMapPoint.x + 1, this._startMapPoint.y)
        if (newTile.x < 0 || newTile.x >= mapSize.width) return;
        
    }

});
