Bbase.MODULE['BbaseTextEditor'] = 'ui/bbase/text_editor/controllers/BbaseTextEditor.js';
Bbase.DIRECTIVE['bbaseuitexteditor'] = {
  bind: function(value, selector) {
    var _this = this;
    var object = this._getObject(value, 'cur');
    object.id = object.id || BbaseEst.nextUid('texteditor');
    this._require(['BbaseTextEditor'], function(BbaseTextEditor) {
      var $el = _this.$(selector);

       // http://www.3023.com/6377/538244011376897.html

          // 用于修复初始化时图片对齐失效问题
          var BaseImageFormat = Quill.import('formats/image');
          const ImageFormatAttributesList = [
            'alt',
            'height',
            'width',
            'style'
          ];
          class ImageFormat extends BaseImageFormat {
            static formats(domNode) {
              return ImageFormatAttributesList.reduce(function(formats, attribute) {
                if (domNode.hasAttribute(attribute)) {
                  formats[attribute] = domNode.getAttribute(attribute);
                }
                return formats;
              }, {});
            }
            format(name, value) {
              if (ImageFormatAttributesList.indexOf(name) > -1) {
                if (value) {
                  this.domNode.setAttribute(name, value);
                } else {
                  this.domNode.removeAttribute(name);
                }
              } else {
                super.format(name, value);
              }
            }
          }
          Quill.register(ImageFormat, true);


          // 行高
          var Parchment = window.Quill.import('parchment');
          let LineHeightClass = {
            scope: Parchment.Scope.INLINE,
            whitelist: ['a', 'b', 'c', 'd', 'e', 'f', 'g']
          }
          let LineHeightStyle = {
            scope: Parchment.Scope.INLINE,
            whitelist: ['1', '1.5', '2', '2.5', '3', '3.5', '4']
          }
          var lineHtClass = new Parchment.Attributor.Class('lineheight', 'ql-line-height', LineHeightClass);
          var lineHtStyle = new Parchment.Attributor.Style('lineheight', 'line-height', LineHeightStyle);

          Parchment.register(lineHtClass);
          Parchment.register(lineHtStyle);


           var $toolbar = $(`
        <div id="${object.id}">
           <select title="文字大小" class="ql-size">
            <option value="small"></option>
            <!-- Note a missing, thus falsy value, is used to reset to default -->
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
           <select title="文字行高" class="ql-line-height">
            <option value="1">a</option>
            <option value="2">c</option>
            <option value="2.5">d</option>
            <option value="3">e</option>
            <option value="3.5">f</option>
          </select>
          <button title="加粗" class="ql-bold">Bold</button>
          <button title="斜体" class="ql-italic">Italic</button>
          <button title="删除线" class="ql-strike">strike</button>
          <button title="下划线" class="ql-underline">underline</button>
          <button title="超链接" class="ql-link">link</button>
          <select class="ql-align" title="文字对齐">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
          <select title="文字颜色" class="ql-color" defaultValue="rgb(0, 0, 0)">
              <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"/>
              <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"/>
              <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"/>
              <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"/>
              <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"/>
              <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"/>
              <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"/>
              <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"/>
              <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"/>
              <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"/>
              <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"/>
              <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"/>
              <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"/>
              <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"/>
              <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"/>
              <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"/>
              <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"/>
              <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"/>
              <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"/>
              <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"/>
              <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"/>
              <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"/>
              <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"/>
              <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"/>
              <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"/>
              <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"/>
              <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"/>
              <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"/>
              <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"/>
              <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"/>
              <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"/>
              <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"/>
              <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"/>
              <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"/>
        </select>
          <select title="文字背景色" class="ql-background" defaultValue="rgb(0, 0, 0)">
              <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"/>
              <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"/>
              <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"/>
              <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"/>
              <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"/>
              <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"/>
              <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"/>
              <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"/>
              <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"/>
              <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"/>
              <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"/>
              <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"/>
              <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"/>
              <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"/>
              <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"/>
              <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"/>
              <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"/>
              <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"/>
              <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"/>
              <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"/>
              <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"/>
              <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"/>
              <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"/>
              <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"/>
              <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"/>
              <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"/>
              <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"/>
              <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"/>
              <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"/>
              <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"/>
              <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"/>
              <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"/>
              <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"/>
              <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"/>
        </select>
        <button title="增加缩进" type="button" class="ql-indent" value="+1"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"></line> <line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"></line> <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"></line> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"></polyline> </svg></button>
        <button title="减少缩进" type="button" class="ql-indent" value="-1"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"></line> <line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"></line> <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"></line> <polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"></polyline> </svg></button>

        <button type="button" class="img-btn" title="添加图片">
            <svg viewBox="0 0 18 18">
                <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
            </svg>
          </button>
        <button title="清除样式" class="ql-clean">clean</button>
        </div>
      `);
      $("body").append($toolbar);

      // 表格插件：https://github.com/dost/quilljs-table
      // 图片缩放：https://github.com/kensnyder/quill-image-resize-module
      _this[object.id] = new Quill($el.get(0), {
        modules: {
          toolbar: '#' + object.id,
          imageResize: {
            // See optional "config" below
          }
        },
        placeholder: '请输入文字',
        theme: 'snow'
      });
      _this[object.id].on('editor-change', function(eventName, args) {
        if (_this[object.id].hasFocus()) {
          $('#' + object.id).css({
            'top': $el.offset().top - 50 < 0 ? 0 : $el.offset().top - 50,
            'left': $el.offset().left,
            'display': 'block'
          });
          $el.find('.ql-editor').addClass('e-editor-hover');
        } else {
          $('#' + object.id).hide();
          $el.find('.ql-editor').removeClass('e-editor-hover');
        }
      });
      _this[object.id].on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
          console.log("An API call triggered this change.");
        } else if (source == 'user') {
          console.log("A user action triggered this change.");
        }
        var html = $(_this[object.id].container).find('.ql-editor').html();

          if (object.onChange) {
            return object.onChange.apply(_this, [html]);
          }
      });

      // 处理图片上传按钮
      $toolbar.find('.img-btn').click(function() {
        _this._dialog({
          viewId: object.id,
          moduleId: 'BbasePhotoPick',
          width: 876,
          cover: true,
          height: 542,
          listApi: '/att/list',
          detailApi: null,
          uploadApi: '/upload/todo',
          systemAlbumApi: CONST.API + '/album/pclist?type=system',
          showSystem: true,
          size: 640,
          quickClose: true,
          onChange: _this._bind(function(result) {
            _this[object.id].focus();
            var range = _this[object.id].getSelection().index;
            _this[object.id].insertEmbed(range ? range.index : 0, 'image', CONST.PIC_URL + '/' + result[0].serverPath);
          })
        });
      });
    });
  },
  unbind: function(object) {
    if (this[object.id]) {
      this[object.id].destory && this[object.id].destory();
      this[object.id] = null;
    }
  }
}