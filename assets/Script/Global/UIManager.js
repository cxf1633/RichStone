//获取根节点
function getRootNode() {
    return cc.find("Canvas");
}

//UI管理器
var UIManager = {
    _uiPrefabTabel:[],
    loadUI: function(_path, _parent, _callback, _order, _tempUIName) {
        if(_parent === null) {
            _parent = getRootNode();
        }
        if(_parent === null) {
            cc.log(_path + "找不到UI根节点");
            return
        }

        var _tempPrefab = null;
        var self = this;

        cc.loader.loadRes(_path, cc.Prefab, function (err, prefab) {
            _tempPrefab = cc.instantiate(prefab);
            self._uiPrefabTabel[_tempUIName] = _tempPrefab;
            if(_order === null) {
                _order = 0;
            }
            _parent.addChild(_tempPrefab, _order);
            _tempPrefab.setPosition(cc.p(0, 0));

            //---------------------------------------------------------------
            if(_callback !== null && _tempPrefab !== null) {
                _callback(_tempPrefab);
            }
        });
    },

    getNode: function(_path, _parent, _callback, _order) {
        var arr = _path.split('/');
        var _tempUIName = arr[arr.length-1];
        var _tempPrefab = this._uiPrefabTabel[_tempUIName];
        if(_tempPrefab === undefined) {
            this.loadUI(_path, _parent, _callback, _order, _tempUIName)
        }
        else {
            this.showNode(_tempUIName);
            if(_callback !== null && _tempPrefab !== null) {
                _callback(_tempPrefab);
            }
        }
    },

    showNode: function(_name) {
        for (var key in this._uiPrefabTabel) {
            if(key === _name && this._uiPrefabTabel[key] !== undefined && this._uiPrefabTabel["Tooltip"].active == false) {
                cc.log("显示: " + _name + "成功")
                this._uiPrefabTabel[key].active = true;
            }
        }
    },

    hiddenNode: function(_name) {
        for (var key in this._uiPrefabTabel) {
            if(key === _name && this._uiPrefabTabel[key] !== undefined && this._uiPrefabTabel["Tooltip"].active) {
                cc.log("隐藏: " + _name + "成功")
                this._uiPrefabTabel[key].active = false;
            }
        }
    },


    destroyNode: function(_name) {
        //cc.log("销毁: " + _name)
        for (var key in this._uiPrefabTabel) {
            if(key === _name && this._uiPrefabTabel[key] !== undefined) {
                //cc.log("销毁: " + _name + "成功")
                this._uiPrefabTabel[key] = undefined;
            }
        }
    }
}

module.exports = UIManager