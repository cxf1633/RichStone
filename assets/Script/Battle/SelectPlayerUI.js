cc.Class({
    extends: cc.Component,

    properties: {
        boxBg: cc.Button,
        exitBtn: cc.Button,
        selectBtn: cc.Button,

        titileLabel: cc.Label,
        itemParent: cc.Node,
        selectPlayerItem: cc.Node,

        _selectItem: null,
    },

    onLoad () {
        cc.vv.Utils.addClickEvent(this.boxBg, this.node, "SelectPlayerUI", "onCloseFrame");
        cc.vv.Utils.addClickEvent(this.exitBtn, this.node, "SelectPlayerUI", "onCloseFrame");
        cc.vv.Utils.addClickEvent(this.selectBtn, this.node, "SelectPlayerUI", "onSelectPlayer");

        this.getData();
    },

    getData() {
        this._playerDatas = cc.vv.BattleData.playerDatas;
        this._createItem();
    },

    _createItem: function() {
        for (var k in this._playerDatas) {
            var _item = cc.instantiate(this.selectPlayerItem);
            var _selelctPlayerItem = _item.getComponent("SelectPlayerItem");
            _selelctPlayerItem.node.parent = this.itemParent;
            _selelctPlayerItem.node.active = true;
            _selelctPlayerItem.init(this);
            _selelctPlayerItem.updateItemInfo(this._playerDatas[k])
        }
    },

    onSelectItem(_item) {
        if(this._selectItem != null) {
            this._selectItem.selectIcon.active = false;
        }
        this._selectItem = _item;
        this._selectItem.selectIcon.active = true;
    },

    onSelectPlayer() {
        //发送所选的玩家操作
    },
    
    onCloseFrame() {
        cc.log("关闭窗口")
        this.node.active = false;
        // cc.vv.MsgMgr.dispatch(cc.vv.Opcode.MOVE_END, "_sendTurnEnd");
    }
});
