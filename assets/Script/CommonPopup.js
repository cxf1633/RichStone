cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            default: null,
            type: cc.Label,
        },

        contentLabel: {
            default: null,
            type: cc.Label,
        },

        confirmBtn: {
            default: null,
            type: cc.Button,
        },

        cancelBtn: {
            default: null,
            type: cc.Button,
        },

        _onConfirmCall: null,
        _onCancelCall: null,
    },

    onLoad () {
        cc.changit.Utils.addClickEvent(this.confirmBtn, this.node, "CommonPopup", "onBtnClicked");
        cc.changit.Utils.addClickEvent(this.cancelBtn, this.node, "CommonPopup", "onBtnClicked");
    },

    show: function(title, content, onConfirm, onCancel) {
        this.titleLabel.string = title;
        this.contentLabel.string = content;
        this._onConfirmCall = onConfirm;
        this._onCancelCall = onCancel;
    },

    onBtnClicked: function(event) {
        if(event.target.name == "confirmBtn") {
            if(this._onConfirmCall) {
                this._onConfirmCall();
            }
        }
        else if(event.target.name == "cancelBtn") {
            if(this._onCancelCall) {
                this._onCancelCall();
            }
        }
        this.onEnd();
    },

    onEnd: function() {
        this.node.destroy();
        this._onConfirmCall = null;
        this._onCancelCall = null;
    },

    onDestroy() {
        cc.changit.UIManager.destroyNode("CommonPopup");
    }
});
