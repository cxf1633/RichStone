cc.Class({
    extends: cc.Component,

    properties: {
        tooltipItem: {
            default: null,
            type: cc.Node,
        },

        grid: {
            default: null,
            type: cc.Node,
        },

        _tipItemList:[],
    },

    show: function(_label) {
        var self = this;
        cc.vv.UIManager.getNode("prefab/Tooltip", null, function(go) {
            self._uiPanel = go.getComponent("Tooltip");
            self._uiPanel.showFrame(_label);
        }, 20);
    },

    showFrame: function(_label) {
        this._createItem(_label);
    },

    _createItem: function (_label) {
        var _item = cc.instantiate(this.tooltipItem);
        var _tooltipItem = _item.getComponent("TooltipItem");
        _item.parent = this.grid;
        _item.active = true;
        _tooltipItem.updateItem(_label, this);
        this._tipItemList.push(_item);
    },

    onCloseFrame: function() {
        if(this._tipItemList.length > 0) {
            this._tipItemList.shift().destroy();
        }
        if(this._tipItemList.length <= 0) {
            this.node.destroy();
        }
    },

    onDestroy() {
        cc.vv.UIManager.destroyNode("Tooltip");
        this._tipItemList = null;
    },
});
