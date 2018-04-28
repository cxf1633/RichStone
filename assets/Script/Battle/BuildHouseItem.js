var MathEx = require("MathEx");
cc.Class({
    extends: cc.Component,

    properties: {
        houseItemBtn: {
            default: null,
            type: cc.Button
        },

        houseTypeNameLabel: {
            default: null,
            type: cc.Label
        },

        tollLabel: {
            default: null,
            type: cc.Label
        },

        costLabel: {
            default: null,
            type: cc.Label
        },

        conditionLabel: {
            default: null,
            type: cc.Label
        },

        buildingExpenseNode: {
            default: null,
            type: cc.Node
        },

        buildingExpenseLabel: {
            default: null,
            type: cc.Label
        },

        haveBoughtLabel: {
            default: null,
            type: cc.Label
        },

        houseLogo: {
            default: null,
            type: cc.Sprite
        },

        selectIcon: {
            default: null,
            type: cc.Node
        },

        _level: null,
        _buildingExpense: null,
        _needCircle: null,

        _isCanSelect: false,
    },

    init(_owner) {
        this.owner = _owner;

        cc.vv.Utils.addClickEvent(this.houseItemBtn, this.node, "BuildHouseItem", "onSelectHouseType");
    },

    updateItemInfo(_data, _landsData) {
        this._level = _data.level;

        var self = this;
        cc.loader.loadRes("Atlas/BuildHouseUIAtlas/BuildHouseUIAtlas", cc.SpriteAtlas, function (err, atlas) {
            self.houseLogo.spriteFrame = atlas.getSpriteFrame('MapPiece_' + _data.pic_id);
        });

        this.houseTypeNameLabel.string = _data.name;
        this.costLabel.string = MathEx.getMoneyFormat(_data.pass_cost_times * _landsData.cost);
        this._buildingExpense = _data.lv_cost_times * _landsData.cost;
        this.buildingExpenseLabel.string = MathEx.getMoneyFormat(this._buildingExpense);
        this._needCircle = _data.need_circle;
        this.conditionLabel.string = this._needCircle + "圈后可购买";

        var _playerData = cc.vv.BattleData.getDataByUid(cc.vv.UserData.userId);

        if(_playerData.circle >= this._needCircle) {
            if(this._needCircle > cc.vv.BattleData.getlandState(_landsData.attach_grid_id).lv) {
                this.buildingExpenseNode.active = true;
                this.conditionLabel.node.active = false;
                this.haveBoughtLabel.node.active = false;
                cc.log(_playerData.money + "    " + this._buildingExpense)
                if(_playerData.money >= this._buildingExpense) {
                    this.buildingExpenseLabel.node.color = new cc.Color(0, 0, 0);
                    this._isCanSelect = true;
                    this.onSelectHouseType();
                }
                else {
                    this.buildingExpenseLabel.node.color = new cc.Color(255, 0, 0);
                }
            }
            else {
                this.buildingExpenseNode.active = false;
                this.conditionLabel.node.active = false;
                this.haveBoughtLabel.node.active = true;
            }
            
        }
        else {
            this.conditionLabel.node.active = true;
            this.buildingExpenseNode.active = false;
            this.haveBoughtLabel.node.active = false;
        }
    },

    onSelectHouseType() {
        if(this._isCanSelect) {
            this.owner.onSelectHouseItem(this);
        }
    },
});
