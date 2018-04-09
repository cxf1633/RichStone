//消息头的定义
var Opcode = {};
Opcode = {
    LOGIN : "GuestLogin",
    CHECK_USER: "CheckUser",
    GET_SERVER: "GetServer",



    ROUND: "Round",
    PLAYER_MOVE:"PlayerMove",
    MOVE_END:"MoveEnd",
};
module.exports = Opcode;