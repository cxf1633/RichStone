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

    show: function(_aaa) {
        var self = this;
        cc.changit.UIManager.getNode("prefab/Tooltip", null, function(go) {
            self._uiPanel = go.getComponent("Tooltip");
            self._uiPanel.showFrame(_aaa);
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
        cc.changit.UIManager.destroyNode("Tooltip");
        this._tipItemList = null;
    },
});
