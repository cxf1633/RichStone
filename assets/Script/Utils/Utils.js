var Utils = {
    //注册按钮事件 
    //@param node 按钮节点 target 调用节点 component handler 方法所属脚本名字 handler 方法
    addClickEvent: function(node,target,component,handler){
        //cc.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
};
module.exports = Utils;