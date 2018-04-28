//数学方法

var MathEx = {
    //获取[min, max]一个随机数
    getRandom(min, max){
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*min+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(max-min+1)+min,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },

    //获取金钱格式(返回字符串)
    getMoneyFormat(_number) {
        var _newString = _number;
        var _tempNumber = Math.floor(_number / 10000);
        if(_tempNumber >= 10) {
            _newString = _tempNumber + "万";
        }
        return _newString;
    },
};

module.exports = MathEx
