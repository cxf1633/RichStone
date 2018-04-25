cc.Class({
    extends: cc.Component,

    properties: {
        boxBg: {
            default: null,
            type: cc.Button
        },

        exitBtn: {
            default: null,
            type: cc.Button
        },

        buyBtn: {
            default: null,
            type: cc.Button
        },

        titleLabel: {
            default: null,
            type: cc.Label
        },

        itemParent: {
            default: null,
            type: cc.Node
        },

        houseTypeItem: {
            default: null,
            type: cc.Node
        },

        _itemTable: [],
        _selectItem: null,
        _gridLvData: null,
    },

    onLoad () {
        cc.vv.Utils.addClickEvent(this.boxBg, this.node, "BuildHouseUI", "onCloseFrame");
        cc.vv.Utils.addClickEvent(this.exitBtn, this.node, "BuildHouseUI", "onCloseFrame");
        cc.vv.Utils.addClickEvent(this.buyBtn, this.node, "BuildHouseUI", "onButHouse");

        this.getData();
    },

    getData() {
        this._gridLvData = cc.vv.ConfigData.getConfigData("grid_lv");

        this._createItem();
    },

    _createItem: function() {
        for (var v of this._gridLvData) {
            if(v.is_landmark === 0) {
                var _item = cc.instantiate(this.houseTypeItem);
                var _houseTypeItem = _item.getComponent("BuildHouseItem");
                _houseTypeItem.node.parent = this.itemParent;
                _houseTypeItem.node.active = false;
                _houseTypeItem.init(this);
                this._itemTable.push({item: _houseTypeItem, value: v});
            }
        }
    },

    openAndUpdatePanel(_landsData) {
        //更新地块数据
        cc.log("打开窗口并更新数据")
        this.node.active = true;
        this.itemParent.position = cc.p(-290, 0);
        this.titleLabel.string = "广场";
        
        for (var v of this._itemTable) {
            v.item.node.active = true;
            v.item.updateItemInfo(v.value, _landsData);
        }
    },

    onSelectHouseItem(_item) {
        if(this._selectItem != null) {
            this._selectItem.selectIcon.active = false;
        }
        this._selectItem = _item;
        this._selectItem.selectIcon.active = true;
    },

    onButHouse: function() {
        if(cc.vv.BattleData.getUserDataByUid(cc.vv.UserData.userId).circle >= this._selectItem._needCircle) {
            cc.vv.SocketMgr.sendPackage(cc.vv.Opcode.BUYHOUSE, [this._selectItem._level]);
            if(this._selectItem._level == 0) {  //临时提示 需要服务器校验
                cc.vv.Tooltip.show("你已购买当前地块,消耗金钱:" + this._selectItem._buildingExpense);
            }
            else {
                cc.vv.Tooltip.show("你已升级当前地块,消耗金钱:" + this._selectItem._buildingExpense);
            } 
            this.onCloseFrame();
        }
    },

    onCloseFrame: function() {
        cc.log("关闭窗口")
        this.node.active = false;
        cc.vv.MsgMgr.dispatch(cc.vv.Opcode.MOVE_END, "_sendTurnEnd");
    },
});
