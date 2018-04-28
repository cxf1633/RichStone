//地图管理
var MapMgr = cc.Class({
    _tmxMap:null,
    _cellXCount:null,
    _cellYCount:null,
    _cellWidth:null,
    _cellHeight:null,
    _mapPixWidth:null,
    _mapPixHeight:null,
    _tmxObjects:null,

    allObjects:null,        //所有的对象格子
    allObjectsCount:0,  //所有对象数量
    allRoadObjs:null,    //获取所有的路
    roadObjCount:0,     //所有路的数量
    
    init(map){
        this._tmxMap = map;

        this._cellXCount = map.getMapSize().width;
        this._cellYCount = map.getMapSize().height;
        this._cellWidth = map.getTileSize().width;
        this._cellHeight = map.getTileSize().height;
        this._mapPixWidth = this._cellWidth * this._cellXCount;
        this._mapPixHeight = this._cellHeight * this._cellYCount;

        this.allObjects = {};
        this.allObjectsCount = 0;
        this.allRoadObjs = {};
        this.roadObjCount = 0;
        //获取所有
        this._tmxObjects  = map.getObjectGroup("object");
        var objects = this._tmxObjects.getObjects();
        for (const key in objects) {
            if (objects.hasOwnProperty(key)) {
                const element = objects[key];
                var properties = element.getProperties();
                var p = this._calcPositon(properties);
                var obj = {
                    gid:properties.name,
                    x:properties.x,
                    y:properties.y,
                    pos:p
                }
                this.allObjects[properties.name] = obj;
                this.allObjectsCount = this.allObjectsCount + 1;
                //路径存另存
                if (properties.IsWalk === "1") {
                    this.allRoadObjs[properties.name] = obj;
                    this.roadObjCount = this.roadObjCount + 1;
                }
            }
        }
        cc.log("初始化地图成功");
    },
    //初始化计算坐标
    _calcPositon(properties){
        var h = properties.height;
        var w = properties.width;
        var x = properties.x;
        var y = properties.y;
        var cellX = x / w;
        var cellY = y / h;
        var posX = this._mapPixWidth / 2 + (cellX - cellY) * this._cellWidth / 2;
        var posY = this._mapPixHeight - (cellX + cellY) * this._cellHeight / 2;
        var pos = cc.p(posX, posY-this._cellHeight/2);
        //cc.log("pos = ", pos);
        return pos;
    },
    //通过格子获取坐标
    getPositionByGid(gid){
        var obj = this.allObjects[gid];
        return obj.pos;
    },
 
    getAllRoadObjs(){
        return this.allRoadObjs;
    },
    addRoadObjs(p, roadObjs){
        for (const key in this.allRoadObjs) {
            if (this.allRoadObjs.hasOwnProperty(key)) {
                const element = this.allRoadObjs[key];
                if (element.x == p.x && element.y == p.y) {
                    roadObjs[element.gid] = element;
                    return;
                }
            }
        }
    },
    getRoadObj(gid, range){
        var w = 80;
        var h = 80;
        let obj = this.allObjects[gid];
        var roadObjs = {};
        var count = 0;
        for (let i = 0-range; i <= range ; i++) {
            for (let j = 0-range; j <= range; j++) {
                var pos = cc.p(i*w+obj.x, j*h+obj.y);
                this.addRoadObjs(pos, roadObjs);
            }
        }
        return roadObjs;
    },
    getAreaObj(gid, range){
        var w = 80;
        var h = 80;
        let obj = this.allObjects[gid];
        var roadObjs = {};
        var count = 0;
        for (let i = 0-range; i <= range ; i++) {
            for (let j = 0-range; j <= range; j++) {
                var pos = cc.p(i*w+obj.x, j*h+obj.y);
                count = count + 1;
                roadObjs[count] = pos;
            }
        }
        return roadObjs;
    }
});

module.exports = MapMgr;
