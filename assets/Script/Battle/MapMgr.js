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
    init(map){
        this._tmxMap = map;

        this._cellXCount = map.getMapSize().width;
        this._cellYCount = map.getMapSize().height;
        this._cellWidth = map.getTileSize().width;
        this._cellHeight = map.getTileSize().height;
        this._mapPixWidth = this._cellWidth * this._cellXCount;
        this._mapPixHeight = this._cellHeight * this._cellYCount;

        this._tmxObjects  = map.getObjectGroup("object");
    },

    getPositionByGid(key){
        //cc.log("mapMgr getPositionByGid key =", key);
        var object = this._tmxObjects.getObject(key.toString());
        var sz = object.objectSize;
        var oz = object.offset;
        var cellX = oz.x/sz.width;
        var cellY = oz.y/sz.height;
        var posX = this._mapPixWidth / 2 + (cellX - cellY) * this._cellWidth / 2;
        var posY = this._mapPixHeight - (cellX + cellY) * this._cellHeight / 2;
        var pos = cc.p(posX, posY-40);
        //cc.log("pos = ", pos);
        return pos;
    },
});

module.exports = MapMgr;
