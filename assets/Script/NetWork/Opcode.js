//消息头的定义
var Opcode = {};
Opcode = {
    //与服务器交互消息头
    CHECK_USER: "CheckUser",
    GET_SERVER: "GetServer",   
    LOGIN : "Login",
    QUICK_MATCH : "QuickMatch", //快速匹配
    RETRIEVE_MATCH_RESULT: "RetrieveMatchResult",// 匹配中轮询
    CANCEL_MATCH : "CancelMatch",   //取消匹配
    JOIN_ROOM:"JoinRoom",//加入房间
    DICE: "Dice",       //骰子点数
    MOVE: "Move",   //玩家移动
    LOAD_END:"LoadingEnd",    //loading结束,请求开始游戏
    BATTLE_START:"BattleStart",     //开始游戏       
    ROOM_INFO:"RoomInfo",       //房间信息
    NEW_TURN:"NewTurn",     //新回合
    NEXT_ACTOR:"NextActor",     //回合拥有者
    CHOOSE_BRANCH:"ChooseBranch",//选择岔路
    TURN_END:"TurnEnd",   //回合结束
    

    GM_CLOSE_ROOM:"GMCloseRoom",//GMCloseRoom 参数 roomID 关闭一个战斗中的房间
    GM_SET_NOT_AUTO:"GMSetNotAuto",//参数 roomID, isNotAuto  设置是否托管 true为不托管

     
    
    //自主调用交互消息头
    ENTER_MAIN:"Enter_Main",//进入主界面
    CONNECT_SOCKET_SUCCESS:"Connetct_Socket_Success",//连接webscket成功
    INIT_DATA_OVER : "InitDataOver",//主城数据初始化完成通知
    ROUND: "Round",
    PLAYER_MOVE:"PlayerMove",
    MOVE_END:"MoveEnd",

    ENTER_BATTLE:"Enter_Battle",//进入战斗
    SHOW_BRANCH:"Show_Branch",  //显示可选路劲
    MOVE_ONE:"Move_One",
    
    TEST:"Test",
};
module.exports = Opcode;