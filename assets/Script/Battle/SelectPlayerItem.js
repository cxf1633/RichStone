cc.Class({
    extends: cc.Component,

    properties: {
        selectPlayerItemBtn: cc.Button,
        playerNameLabel: cc.Label,
        playerPrefabNode: cc.Node,
        selectIcon: cc.Node,
    },

    init(_owner) {
        this.owner = _owner;

        cc.vv.Utils.addClickEvent(this.selectPlayerItemBtn, this.node, "SelectPlayerItem", "onSelectPlayer");
    },

    updateItemInfo(_data) {
        this.playerNameLabel.string = _data.name;
        if(cc.vv.UserData.userId === _data.uid) {
            this.onSelectPlayer();
        }
    },

    onSelectPlayer() {
        this.owner.onSelectItem(this);
    },
});
