'use strict';
/**
 * @description 域名绑定
 * @class DomainComponent
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DomainComponent', [], function(require, exports, module) {
  var DomainComponent;

  var template = `
    <div id="domain-form" class="form" style="position: relative;padding-bottom:20px;">
      <div class="control-group">
        <div class="control-label">绑定类型：</div>
        <div class="controls radio-type" bb-UiRadio="{viewId:'radio-type',cur:type,items:typeItems, onChange: typeChange}">
        </div>
      </div>
      <div class="control-group">
        <div class="control-label">*域名：</div>
        <div class="controls">
          <input type="text" bb-watch="addressError:class" class="text addressText {{#If addressError}}focus{{/If}}" bb-model="address" value="{{address}}" />
        </div>
      </div>
      <div class="control-group">
        <div class="control-label">*备案号：</div>
        <div class="controls">
          <input type="text" bb-watch="icpError:class" class="text icpText {{#If icpError}}focus{{/If}}" bb-model="icp" value="{{icp}}" />
        </div>
      </div>
      <div class="clearfix" style="height:76px;">
          提示：域名申请联系电话: 0579-87171989 ;联系QQ: 9568027, 78014325
      </div>
      <div class="mobiSettingBtns">
        <input id="submit" bb-watch="Error:class" type="button" value="确定修改" class="abutton faiButton saveButton {{#If Error}}focus{{/If}}">
      </div>
    </div>
  `;

  DomainComponent = BaseDetail.extend({
    initialize: function() {
      this._super({
        model: BaseModel.extend({
          baseUrl: CONST.API + '/domain/detail',
          fields: ['type', 'address', 'icp', 'id'],
          baseId: 'bind_id'
        }),
        template: template,
        form: '.form#submit'
      });
    },
    init: function() {
      return {
        type: 'D',
        addressError: false,
        icpError: false,
        Error: false,
        typeItems: [
          { 'text': '域名', 'value': 'D' },
          { 'text': '地址', 'value': 'A' }
        ]
      };
    },
    update: function(name) {
      if (name === 'address' || name === 'icp') {
        this._set({
          addressError: false,
          icpError: false,
          Error: false
        });
      }
    },
    typeChange: function(item) {
      this._set('type', item.value);
    },
    beforeSave: function() {
      if (Est.isEmpty(Est.trim(this._get('address')))) {
        BaseUtils.tip('请填写收货地址', {
          target: this.$('.addressText').get(0),
          align: 'top'
        });
        return false;
      } else if (Est.isEmpty(Est.trim(this._get('icp')))) {
        BaseUtils.tip('请填写icp备案号', {
          target: this.$('.icpText').get(0),
          align: 'top'
        });
        return false;
      }
    },
    afterSave: function(model, response) {
      if (response.success) {
        BaseUtils.tip('修改成功', {
          target: this.$('#submit').get(0),
          align: 'top'
        });
        if (this._options.onChange) {
          this._options.onChange.call(this, this.model.toJSON());
        }
      }
    },
    errorSave: function(response) {
      this._set(response.msgType + 'Error', true);
      setTimeout(this._bind(function() {
        BaseUtils.tip(response.msg, {
          target: this.$('.focus').get(0)
        });
      }), 10);
    }
  });

  module.exports = DomainComponent;
});
