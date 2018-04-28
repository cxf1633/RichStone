cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node,
        },

        itemLabel: {
            default: null,
            type: cc.Label,
        },

        _owner: null,
    },

    start () {
        
    },

    updateItem: function(_label, _owner) {
        this._owner = _owner;
        this.itemLabel.string = _label;
        this.bg.width = this.itemLabel.node.width + 20;

        var moveAction = cc.moveTo(2, cc.p(0, 150));
        var callback = cc.callFunc(function(){
            this._owner.onCloseFrame();
        }, this);
        this.node.runAction(cc.sequence(moveAction, callback));
    },
});
