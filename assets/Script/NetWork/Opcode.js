//消息头的定义
var Opcode = {};
Opcode = {
    CHECK_USER: "CheckUser",
    GET_SERVER: "GetServer",
    LOGIN : "Login",
    QUICKMATCH : "QuickMatch",
    RETRIEVEMATCHRESULT: "RetrieveMatchResult",
    CANCELMATCH : "CancelMatch",
    JOIN_ROOM:"JoinRoom",

    ENTER_MAIN:"Enter_Main",//进入主界面
    CONNECT_SOCKET_SUCCESS:"Connetct_Socket_Success",//连接webscket成功

    INITDATAOVER : "InitDataOver",//主城数据初始化完成通知
    ROUND: "Round",
    PLAYER_MOVE:"PlayerMove",
    MOVE_END:"MoveEnd",
};
module.exports = Opcode;