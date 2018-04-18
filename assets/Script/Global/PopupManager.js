 function Test() {
    var title1 = null;
    var content1 = null;
    var onConfirm1 = null;
    var onCancel1 = null;
}

//弹框管理器
var PopupManager = {
    _popList: [],
    _uiPanel: null,
    _isShow: false,

    addList: function(_testData) {
        this._popList.push(_testData);
        this.show();
    },

    show: function() {
        if(this._popList.length <= 0 || this._isShow) {
            return
        };
        var self = this;
        var selfData = this._popList.shift();
        cc.changit.UIManager.getNode("prefab/CommonPopup", null, function(go) {
            self._uiPanel = go.getComponent("CommonPopup");
            self._uiPanel.show(selfData.title1, selfData.content1, selfData.onConfirm1, selfData.onCancel1);
        }, 10);
        this._isShow = true;
    },

    clear: function() {
        this._popList.splice(0, this._popList.length);
        if(self._uiPanel !== null) {
            self._uiPanel.onEnd();
        }
    },

    updatePopUp: function() {
        this._isShow = false;
        this.show();
    },

    showPopup: function(_title, _content, _onConfirm, _onCancel) {
        var _test = new Test();
        _test.title1 = _title;
        _test.content1 = _content;
        _test.onConfirm1 = _onConfirm;
        _test.onCancel1 = _onCancel;
        this.addList(_test);
    },
}

module.exports = PopupManager