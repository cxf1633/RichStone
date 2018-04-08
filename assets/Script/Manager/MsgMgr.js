// 全局消息
var MsgMgr = {
    _msgMap:[],

    //注册监听消息
    register (cmd, callback, target) {
        if (this._msgMap[cmd] === undefined) {
            this._msgMap[cmd] = []
        }

        this._msgMap[cmd].push({ callback: callback, target: target })
    },

    //发送消息
    dispatch (cmd, param) {
        var array = this._msgMap[cmd]
        if (array === undefined) return
        for (var i = 0; i < array.length; i++) {
            var element = array[i]
            if (element && element.callback != undefined) 
                element.callback.call(element.target, param)
        }
    },

    //移除一条事件监听
    remove (cmd, callback) {
        var array = this._msgMap[cmd]
        if (array === undefined) return

        for (var i = 0; i < array.length; i++) {
            var element = array[i]
            if (element && element.callback === callback) {
                array[i] = undefined;
              
                break
            }
        }
    },

    //移除消息类型为cmd的所有监听 慎用！！！
    removeByCmd (cmd) {
        this._msgMap[cmd] = undefined
    },
}

module.exports = MsgMgr