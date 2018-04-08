//消息头的定义
var Opcode = {};
Opcode = {
    LOGIN : "GuestLogin",
    ROUND: "Round",
    PLAYERMOVE:"PlayerMove",
    MOVEEND:"MoveEnd",
};
module.exports = Opcode;