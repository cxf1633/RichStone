cc.Class({
    extends: cc.Component,

    properties: {
        gmBtn: cc.Button,
        panel: cc.Node,
        cmdInputLabel: cc.EditBox,
        paramInputLabel: cc.EditBox,
        executeGMBtn: cc.Button,
    },

    onLoad () {
        this.gmBtn.node.zIndex = 2;
        cc.game.addPersistRootNode(this.node);

        cc.vv.Utils.addClickEvent(this.gmBtn, this.node, "GM", "onOpenGM");
        cc.vv.Utils.addClickEvent(this.executeGMBtn, this.node, "GM", "onExecuteGM");
    },

    onOpenGM () {
        this.panel.active = !this.panel.active;
    },
    
    onExecuteGM () {
        if(this.cmdInputLabel.string !== "" && this.paramInputLabel.string !== "") {
            var _sendstr = "{\"func_name\":\"" + this.cmdInputLabel.string + "\",\"params\":" + this.paramInputLabel.string + "}"
            cc.vv.SocketMgr.sendPackageGM(_sendstr);
            
            this.onOpenGM();
        }
        else {
            cc.vv.Tooltip.show("消息名或参数不能为空");
        }
    },
});
