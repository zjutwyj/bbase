Est.mixin({
  /**
   * @description 模块模式 - 模块定义 如果项目中存在require.js 则调用require.js
   * @method [模式] - define ( 模块定义 )
   * @param {String} name 模块名称
   * @param {Array} dependencies 依赖模块
   * @param {Function} factory 方法
   * @return {*}
   * @author wyj on 14/6/29
   * @example
   *
   */
  define: function(name, dependencies, factory) {
    if (typeof define === 'function' && define.amd) return define;
    if (!moduleMap[name]) {
      var module = {
        name: name,
        dependencies: dependencies,
        factory: factory
      };
      moduleMap[name] = module;
    }
    return moduleMap[name];
  },
  /**
   * @description 模块请求 如果项目中存在require.js 则调用require.js
   * @method [模式] - require ( 模块请求 )
   * @param {String} pathArr 文件中第
   * @param {Function} callback 回调函数
   * @author wyj on 14/6/29
   * @example
   *
   */
  require: function(pathArr, callback) {
    if (typeof define === 'function' && define.amd) return require;
    for (var i = 0; i < pathArr.length; i++) {
      var path = pathArr[i];
      if (!fileMap[path]) {
        var head = document.getElementsByTagName('head')[0];
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.async = 'true';
        node.src = path + '.js';
        node.onload = function() {
          fileMap[path] = true;
          head.removeChild(node);
          checkAllFiles();
        };
        head.appendChild(node);
      }
    }

    function checkAllFiles() {
      var allLoaded = true;
      for (var i = 0; i < pathArr.length; i++) {
        if (!fileMap[pathArr[i]]) {
          allLoaded = false;
          break;
        }
      }
      if (allLoaded) {
        callback();
      }
    }
  },
  use: function(name) {
    var module = moduleMap[name];
    if (!module.entity) {
      var args = [];
      for (var i = 0; i < module.dependencies.length; i++) {
        if (moduleMap[module.dependencies[i]].entity) {
          args.push(moduleMap[module.dependencies[i]].entity);
        } else {
          args.push(this.use(module.dependencies[i]));
        }
      }
      module.entity = module.factory.apply(noop, args);
    }
    return module.entity;
  },
  /**
   * @description 通过原型继承创建一个新对象
   * @method [模式] - inherit ( 通过原型继承创建一个新对象 )
   * @param {Object} target 继承对象
   * @param {Object} extra 额外对象
   * @return {*}
   * @example
   *      var target = {x:'dont change me'};var newObject = Est.inherit(target); =>
   *      dont change me
   */
  inherit: function(target, extra) {
    if (target == null) throw TypeError();
    if (Object.create)
      return Object.create(target);
    var type = typeof target;
    if (type !== 'object' && type !== 'function') throw TypeError();

    function fn() {};
    fn.prototype = target;
    return new fn();
  },
  /**
   * @description url 路由
   * @method [浏览器] - route ( url 路由 )
   * @param {String} path
   * @param {String} templateId
   * @param controller
   * @author wyj on 14.10.28
   * @example
   *      // HTML
   *      <ul> <li><a href="#">Home</a></li> <li><a href="#/page1">Page 1</a></li> <li><a href="#/page2">Page 2</a></li> </ul> <div id="view"></div> <script type="text/html" id="home"> <h1>Router FTW!</h1> </script> <script type="text/html" id="template1"> <h1>Page 1: {{greeting}}></h1> <p>{{moreText}}></p> </script> <script type="text/html" id="template2"> <h1>Page 2: {{heading}}></h1> <p>Lorem ipsum...</p> </script>
   *      // JAVASCRIPT
   *      route('/', 'home', function(){});
   *      route('/page1', 'template1', function () {
   *             this.greeting = 'Hello world!';
   *             this.moreText = 'Loading...';
   *             setTimeout(function () {
   *                 this.moreText = 'Bacon ipsum...';
   *             }.bind(this), 500);
   *         });
   *      route('/page2', 'template2', function () {
   *             this.heading = 'I\'m page two!';
   *         });
   *
   */
  route: function(path, templateId, controller) {
    if (typeof templateId === 'function') {
      controller = templateId;
      templateId = null;
    }
    routes[path] = {
      templateId: templateId,
      controller: controller
    };
  },
  /**
   * @description 清空该元素下面的所有子节点【大数据量时】 在数据量小的情况下可以用jQuery的empty()方法
   * parentNode必须为DOM对象，$('#selector').get(0);
   * @method [文档] - clearAllNode ( 清空所有子节点 )
   * @param parentNode
   * @return {*}
   * @author wyj on 14-04-26
   * @example
   *      Est.clearAllNode(document.getElementById("showResFilesContent"));
   */
  clearAllNode: function(parentNode) {
    while (parentNode.firstChild) {
      var oldNode = parentNode.removeChild(parentNode.firstChild);
      oldNode = null;
    }
  },

  /**
   * @description 延迟模式 - 避免在 ms 段时间内，多次执行func。常用 resize、scoll、mousemove等连续性事件中
   * @method [模式] - delay ( 延迟模式 )
   * @param {Function} func 方法
   * @param {Number} ms 缓冲时间
   * @param context
   * @return {Function}
   * @author wyj on 14/5/24
   * @example
   *     Est.delay(function(){}, 5);
   */
  delay: function(func, wait) {
    if (typeOf(func) !== 'function') {
      throw new TypeError;
    }
    return setTimeout(function() {
      func.apply(undefined, slice.call(arguments));
    }, wait);
  },

  /**
   * @description 获取每月的天数
   * @method [时间] - getDays ( 获取每月的天数 )
   * @param Year
   * @param Mon
   * @return {number}
   * @author wyj on 14.9.14
   * @example
   *      var days = Est.getDays('2014', '9'); => 31  // 这里的9表示 8月份
   */
  getDays: function(Year, Mon) {
    var days =
      (/^0$|^2$|^4$|^6$|^7$|^9$|^11$/.test(Mon)) ? 31 :
      (/^3$|^5$|^8$|^10$/.test(Mon)) ? 30 :
      (/^1$/.test(Mon)) ?
      ((!(Year % 400) || (!(Year % 4) && (Year % 100))) ? 29 : 28) : 0;
    return days;
  },

  /**
   * @description 加载样式文件
   * @method [样式] - loadCss ( 加载样式文件 )
   * @param url
   * @author wyj on 14/7/7
   * @example
   *
   */
  loadCSS: function(url) {
    var elem = document.createElement("link");
    elem.rel = "stylesheet";
    elem.type = "text/css";
    elem.href = url;
    document.body.appendChild(elem);
  },
  /**
   * @description 获取元素的标签符号 , 大写的转换成小写的
   * @method [样式] - getTagName ( 获取元素的标签符号 )
   * @param {Element} target 目标元素
   * @return {string} 返回标签符号
   * @author wyj on 14/5/6
   * @example
   *     Est.getTagName(document.getElementById('a')); ==>　'div'
   */
  getTagName: function(target) {
    return target.tagName.toLowerCase();
  },
  /**
   * @description 获取当前元素的css选择符，规则：父模块的ID值 + 当前元素的ID值 > class值
   * @method [样式] - getSelector ( 获取当前元素的css选择符 )
   * @param {Element} target 目标元素
   * @param {String} parentClass 父模块class选择符
   * @param {Object} $  jquery对象 或 其它
   * @return {string} 返回当前元素的选择符
   * @author wyj on 14/5/5
   * @example
   *     Est.getSelector($('#gird-li').get(0), 'moveChild')) => ;
   */
  getSelector: function(target, parentClass, $) {
    var selector = "";
    var isModule = $(target).hasClass(parentClass);
    var id = $(target).attr("id");
    var className = $(target).attr("class");
    if (id.length > 0) {
      selector = "#" + id;
    } else if (className.length > 0) {
      selector = "." + $.trim(className).split(" ")[0];
    } else {
      selector = getTagName(target);
      selector = getSelector(target.parentNode) + " " + selector;
    }
    return isModule ? selector : '#' + $(target).parents('.moveChild:first').attr('id') + ' ' + selector;
  },
  /**
   * @description 数据缓存
   * @method [缓存] - getCache ( 数据缓存 )
   * @param {String} uId 唯一标识符
   * @param {Object} ctx 缓存对象
   * @param {String} options.area 缓存分区
   * @param {Object} options {Function} options.getData 获取待缓存的数据
   * @return {*} 返回缓存数据
   * @author wyj on 14/5/3
   * @example
   *     Est.getCache('uId', session, {
   *          area : 'dd',
   *          getData : function(data){
   *              return cache_data;
   *          }
   *      }))
   */
  getCache: function(uId, ctx, options) {
    var opts = {
      area: 'templates',
      getData: null
    }
    Est.extend(opts, options);
    ctx.cache = ctx.cache || {};
    if (typeof ctx.cache[opts.area] === 'undefined') {
      ctx.cache[opts.area] = {};
    }
    var data = ctx.cache[opts.area][uId];
    if (!data) {
      data = ctx.cache[opts.area][uId] = opts.getData.call(null, data);
    }
    return data;
  },
  /**
   * @description 列表两端对齐，
   * @method [图片] - girdJustify ( 列表两端对齐 )
   * @param options
   * @author wyj on 14/5/11
   * @example
   *      <script type="text/javascript">
   *          var justifyCont = $("#gird");
   *          var justifylist = $("li", justifyCont);
   *          var justifyOpts = {
   *                  containerWidth: justifyCont.width(), //容器总宽度
   *                  childLength: justifylist.size(), //子元素个数
   *                  childWidth: justifylist.eq(0).width(), // 子元素宽度
   *                  childSpace: 10, //默认右边距
   *                  callback: function (i, space) { // 回调函数， 执行CSS操作， i为第几个元素， space为边距
   *                      justifylist.eq(i).css("margin-right", space);
   *                  }
   *              };
   *          Est.girdJustify(justifyOpts);
   *          $(window).bind("resize", function () {
   *              justifyOpts.containerWidth = justifyCont.width();
   *              Est.girdJustify(justifyOpts);
   *          });
   *      </script>
   */
  girdJustify: function(opts) {
    var opts = {
      ow: parseFloat(opts.containerWidth),
      cw: parseFloat(opts.childWidth),
      cl: opts.childLength,
      cm: parseFloat(opts.childSpace),
      fn: opts.callback
    };
    //每行显示的个数
    var rn = Math.floor((opts.ow - opts.cm) / (opts.cw + opts.cm));
    //间隔
    var space = Math.floor((opts.ow - opts.cw * rn) / (rn - 1));
    //总共有几行
    var rows = Math.ceil(opts.cl / rn);
    for (var i = 0; i < rows; i++) {
      for (var j = rn * i; j < rn * (i + 1); j++) {
        if (j != (rn * (i + 1) - 1)) {
          // 是否是每行的最后一个， 否则添加右边距
          opts.fn(j, space);
        } else {
          opts.fn(j, 0);
        }
      }
    }
  },

  /**
   * @description 绘制canvas图片 解决苹果屏幕模糊问题 注意：此方法将移除， 转移到Canvas.min.js中
   * @method [图片] - drawImage ( 绘制canvas图片 )
   * @param {Object} opts 详见例子
   * @author wyj on 14.9.4
   * @example
   *        Est.drawImage({
   *            context2D: context2D, // canvas.getContext("2d")
   *            canvas: canvas, // 画布
   *            image: imageObj, // image对象
   *              desx: result.marginLeft, // 开始剪切的 x 坐标位置
   *            desy: result.marginTop, // 开始剪切的 y 坐标位置
   *            desw: result.width,// 被剪切图像的宽度
   *            desh: result.height}); // 被剪切图像的高度
   */
  drawImage: function(opts) {
    if (!opts.canvas) {
      throw ("A canvas is required");
    }
    if (!opts.image) {
      throw ("Image is required");
    }
    // 获取canvas和context
    var canvas = opts.canvas,
      context = opts.context2D,
      image = opts.image,
      // now default all the dimension info
      srcx = opts.srcx || 0,
      srcy = opts.srcy || 0,
      srcw = opts.srcw || image.naturalWidth,
      srch = opts.srch || image.naturalHeight,
      desx = opts.desx || srcx,
      desy = opts.desy || srcy,
      desw = opts.desw || srcw,
      desh = opts.desh || srch,
      auto = opts.auto,
      // finally query the various pixel ratios
      devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio = context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1,
      ratio = devicePixelRatio / backingStoreRatio;
    // ensure we have a value set for auto.
    // If auto is set to false then we
    // will simply not upscale the canvas
    // and the default behaviour will be maintained
    if (typeof auto === 'undefined') {
      auto = true;
    }
    // upscale the canvas if the two ratios don't match
    if (auto && devicePixelRatio !== backingStoreRatio) {
      var oldWidth = canvas.width;
      var oldHeight = canvas.height;
      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;
      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';
      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      context.scale(ratio, ratio);
    }
    context.drawImage(opts.image, srcx, srcy, srcw, srch, desx, desy, desw, desh);
  },
  /**
   * @description 图片上传预览
   * @method [图片] - setImagePreview ( 图片上传预览 )
   * @param {Object} option option.inputFile : file input表单元素,  option.imgNode : 待显示的img元素
   * @return {boolean} 返回 true 与 false
   * @author wyj on 14/8/30
   * @example
   *       Est.imagePreview({
   *               inputFile: $("input[type=file]").get(0),
   *               imgNode: $(".img").get(0)
   *        });
   */
  imagePreview: function(option) {
    var docObj = option.inputFile; // file input表单元素
    var files = docObj.files;
    var imgObjPreview = option.imgNode; // 待显示的img元素
    var i = 0,
      file = null;
    try {
      if (files && files[0]) {
        var length = files.length;
        while (i < length) {
          file = files[i];
          if (file.type.match("image.*")) {
            var render = new FileReader();
            render.readAsDataURL(file);
            render.onloadend = function() {
              imgObjPreview.src = this.result;
            };
          }
          i++;
        }
      } else {
        docObj.select();
        var imgSrc = document.selection.createRange().text;
        var localImagId = document.getElementById("localImag");
        localImagId.style.width = "96px";
        localImagId.style.height = "96px";
        try {
          localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
          localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        } catch (e) {
          alert("您上传的图片格式不正确，请重新选择!");
          return false;
        }
        imgObjPreview.style.display = 'none';
        document.selection.empty();
      }
    } catch (e) {
      console.error(e);
    }
    return true;
  },
  /**
   * @description 获取居中图片的margin值, 若图片宽高比太大，则不剪切
   * @method [图片] - imageCrop ( 获取居中图片的margin值 )
   * @param {Number} naturalW 图片宽度
   * @param {Number} naturalH 图片高度
   * @param {Number} targetW 展示框宽度
   * @param {Number} targetH 展示框高度
   * @param {Boolean} fill 是否铺满框
   * @return {{width: *, height: *, marginTop: number, marginLeft: number}}
   * @author wyj on 14-04-24
   * @example
   *      $.each($(".imageCrop"), function(){
   *           $(this).load(function(response, status, xhr){
   *               var w = $(this).get(0).naturalWidth, h = $(this).get(0).naturalHeight;
   *               var width = $(this).attr("data-width"), height = $(this).attr("data-height");
   *               $(this).css(Est.imageCrop(w, h, width, height), 'fast');
   *               $(this).fadeIn('fast');
   *           });
   *       });
   */
  imageCrop: function(naturalW, naturalH, targetW, targetH, fill) {
    var _w = parseInt(naturalW, 10),
      _h = parseInt(naturalH, 10),
      w = parseInt(targetW, 10),
      h = parseInt(targetH, 10);
    var fill = fill || false;
    var res = {
      width: w,
      height: h,
      marginTop: 0,
      marginLeft: 0
    };
    if (_w != 0 && _h != 0) {
      var z_w = w / _w,
        z_h = h / _h;
      if (!fill && (z_w / z_h) > 1.5) {
        //若高度 远远 超出 宽度
        res = {
          width: 'auto',
          height: h,
          marginTop: 0,
          marginLeft: Math.abs((w - _w * z_h) / 2)
        };
      } else if (!fill && (z_h / z_w) > 1.5) {
        //若宽度 远远 超出 高度
        res = {
          width: w,
          height: 'auto',
          marginTop: Math.abs((h - _h * z_w) / 2),
          marginLeft: 0
        };
      } else {
        if (z_w < z_h) {
          res = {
            width: _w * z_h,
            height: h,
            marginTop: 0,
            marginLeft: -(_w * z_h - w) / 2
          };
        } else if (z_w > z_h) {
          res = {
            width: w,
            height: _h * z_w,
            marginTop: -(_h * z_w - h) / 2,
            marginLeft: 0
          };
        } else {
          res = {
            width: w,
            height: h,
            marginTop: -(_h * z_h - h) / 2,
            marginLeft: -(_w * z_h - w) / 2
          };
        }
      }
    }
    return res;
  },
  /**
   * @description  获取图片地址缩放等级
   * @method [图片] - picUrl ( 获取图片地址缩放等级 )
   * @param src
   * @param zoom
   * @return {string}
   * @author wyj on 14/7/25
   * @example
   *      Est.picUrl(src, 5);
   */
  picUrl: function(src, zoom) {
    if (!Est.isEmpty(src)) {
      var type = src.substring(src.lastIndexOf(".") + 1, src.length);
      var hasZoom = src.lastIndexOf('_') > 0 ? true : false;
      return src.substring(0, src.lastIndexOf(hasZoom ? '_' : '.')) + "_" + zoom + "." + type;
    }
  },
  /**
   * @description 字符串转化成MAP对象，以逗号隔开， 用于FORM表单
   * @method [数组] - makeMap ( 字符串转化成MAP对象 )
   * @param str
   * @return {{}}
   * @author wyj on 14/6/23
   * @example
   *      var object = Est.makeMap("a, aa, aaa"); => {"a":true, "aa": true, "aaa": true}
   */
  makeMap: function(str) {
    var obj = {},
      items = str.split(","),
      i;
    for (i = 0; i < items.length; i++)
      obj[items[i]] = true;
    return obj;
  },
  /**
   * @description 删除数组中的元素
   * @method [数组] - arrayRemove ( 删除数组中的元素 )
   * @param {Array} array 目标数组
   * @param {*} value 删除的元素
   * @return {*}
   * @author wyj on 14/6/23
   * @example
   *      var list = ['a', 'b', 'b'];
   *      var result = Est.arrayRemove(list, 'a'); => ['a', 'b']
   */
  arrayRemove: function(array, value) {
    var index = indexOf(array, value);
    if (index !== -1)
      array.splice(index, 1);
    return value;
  },
  /**
   * @description 检测数据类型2 此版本 new Number(4) new String("abc") new Boolean(true) new ReferenceError()
   * 分别生成 Number String Boolean Error
   * @method [对象] - getType ( 检测数据类型2 )
   * @param {object} value
   * @return {String}
   * @author wyj on 14/8/5
   * @example
   *      var results = [];
   *      var fn = Est.getType;
   *      results.push(fn({a: 4})); // "Object"
   *      results.push(fn([1, 2, 3])); // "Array"
   *      (function() { results.push(fn(arguments));}()); // "Argements"
   *      results.push(fn(new ReferenceError())); // "Error"
   *      results.push(fn(new Date())); // "Date"
   *      results.push(fn(/a-z/)); // "RegExp"
   *      results.push(fn(Math)); // "Math"
   *      results.push(fn(JSON)); // "JSON"
   *      results.push(fn(new Number(4))); // "Number"
   *      results.push(fn(new String("abc"))); // "String"
   *      results.push(fn(new Boolean(true))); // "Boolean"
   *      results.push(fn(null)); // "null"
   *      => [ "Object", "Array", "Arguments", "Error", "Date", "RegExp", "Math", "JSON", "Number", "String", "Boolean", "null" ]
   */
  getType: function(value) {
    if (value === null) return "null";
    var t = typeof value;
    switch (t) {
      case "function":
      case "object":
        if (value.constructor) {
          if (value.constructor.name) {
            return value.constructor.name;
          } else {
            // /^function\s+([$_a-zA-Z][_$a-zA-Z0-9]*)\s*\(/
            // /^\s*function[ \n\r\t]+\w/;
            var match = value.constructor.toString().match(/^function (.+)\(.*$/);
            if (match) return match[1];
          }
        }
        return toString.call(value).match(/^\[object (.+)\]$/)[1];
      default:
        return t;
    }
  },

  /**
   * javascript 对象转换成path路径
   * @method [对象] - objToPath ( 对象转换成path路径 )
   * @return {Object}
   * @author wyj 15.1.28
   * @example
   *        Est.objToPath({a: {b: 'c'}}); ===> {'a.b': 'c'}
   */
  objToPath: function(obj) {
    var ret = {},
      separator = '.';
    for (var key in obj) {
      var val = obj[key];
      if (val && (val.constructor === Object || val.constructor === Array) && !isEmpty(val)) {
        var obj2 = objToPath(val);
        for (var key2 in obj2) {
          var val2 = obj2[key2];
          ret[key + separator + key2] = val2;
        }
      } else {
        ret[key] = val;
      }
    }
    return ret;
  },
  /**
   * @description 返回值函数
   * @method [对象] - valueFn ( 返回值函数 )
   * @param value
   * @return {Function}
   * @author wyj on 14/6/26
   * @example
   *
   */
  valueFn: function(value) {
    return function() {
      return value;
    };
  },
  /**
   * @description 反转key value  用于forEach
   * @method [对象] - reverseParams ( 反转key value )
   * @param {Function} iteratorFn
   * @return {Function}
   * @author wyj on 14/6/26
   * @example
   */
  reverseParams: function(iteratorFn) {
    return function(value, key) {
      iteratorFn(key, value);
    };
  },
  /**
   * md5加密
   * @method [字符串] - md5 ( md5加密 )
   * @param string
   * @return {string}
   * @author wyj 15.2.28
   * @example
   *
   */
  md5: function(string) {
    function RotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x, y, z) {
      return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
      return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
      return (x ^ y ^ z);
    }

    function I(x, y, z) {
      return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }

    function WordToHex(lValue) {
      var WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22;
    var S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20;
    var S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23;
    var S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA);
      b = AddUnsigned(b, BB);
      c = AddUnsigned(c, CC);
      d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
  },
  /**
   * @description 对象路由控制
   * @method [对象] - keyRoute ( 对象路由控制 )
   * @param {Object} handle 待控制对象
   * @param {String} pathname 路由名称
   * @param {Object} response 参数
   * @author wyj on 14/8/1
   * @example
   *      var handle = {
   *        route1: function(reponse){ },
   *        route2: function(){ }
   *      }
   *      Est.keyRoute(handle, 'route1', {});
   */
  keyRoute: function(handle, pathname, response) {
    if (Est.typeOf(handle[pathname]) === 'function') {
      return handle[pathname](response);
    } else {
      console.log("No request handler found for " + pathname);
    }
  },
  /**
   * @description 二分法将一个字符串重复自身N次
   * @method [字符串] - repeat ( 字符串重复自身N次 )
   * @param {String} target 原字符串
   * @param {Number} n 重复次数
   * @return {String} 返回字符串
   * @author wyj on 14-04-23
   * @example
   *      Est.repeat('ruby', 2); => rubyruby
   */
  repeat: function(target, n) {
    var s = target,
      total = '';
    while (n > 0) {
      if (n % 2 == 1) {
        total += s;
      }
      if (n == 1) {
        break;
      }
      s += s;
      n = n >> 1;
    }
    return total;
  },
  /**
   * @description 对字符串进行截取处理，默认添加三个点号【版本一】
   * @method [字符串] - truncate ( 对字符串进行截取处理 )
   * @param target 目标字符串
   * @param length 截取长度
   * @param truncation 结尾符号
   * @return {string}
   * @author wyj on 14-04-23
   * @example
   *     Est.truncate('aaaaaa', 4, '...'); => 'aaa...'
   */
  truncate: function(target, length, truncation) {
    length = length || 30;
    truncation = truncation === void(0) ? "..." : truncation;
    return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target);
  },
  /**
   * @description 字符串反转
   * @method [字符串] - reverse ( 字符串反转 )
   * @param {String} str 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/6
   * @example
   *     Est.reverse('abc'); => 'cba'
   */
  reverse: function(str) {
    str = str.split('');
    var result = '',
      length = str.length;
    while (length--) {
      result += str[length];
    }
    return result;
  },
  /**
   * @description 根据索引值移除数组元素
   * @method [数组] - removeAt ( 根据索引值移除数组元素 )
   * @param {Array} list 原数组
   * @param {Nubmer} index 数组索引
   * @return {Boolean} 返回是否删除成功
   * @author wyj on 14/5/24
   * @example
   *      Est.removeAt(list, dx) => ;
   */
  removeAt: function(list, index) {
    return !!list.splice(index, 1).length;
  },
  /**
   * @description 获取最大页数【版本二】
   * @method [分页] - getMaxPage_2 ( 获取最大页数 )
   * @param { Number} totalCount otalCount 总条数
   * @param {Number} pageSize pageSize 每页显示的条数
   * @return {Number} 返回最大页数
   * @author wyj on 14/04/26
   * @example
   *     Est.getMaxPage(parseInt(50), parseInt(10));
   *     ==> 5
   */
  getMaxPage_2: function(totalCount, pageSize) {
    return totalCount > pageSize ? Math.ceil(totalCount / pageSize) : 1;
  },
  /**
   * Debounce a function so it only gets called after the
   * input stops arriving after the given wait period.
   *
   * @param {Function} func
   * @param {Number} wait
   * @return {Function} - the debounced function
   */

  _debounce: function(func, wait) {
    var timeout, args, context, timestamp, result;
    var later = function later() {
      var last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    };
    return function() {
      context = this;
      args = arguments;
      timestamp = Date.now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      return result;
    };
  },
  /**
   * 快速排序算法
   * @method quickSort
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  quickSort: function(arr) {
    if (arr.length <= 1) {
      return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return Est.quickSort(left).concat([pivot], Est.quickSort(right));
  },
  swap: function(arr, i, j) {
    arr[i] = [arr[j], arr[j] = arr[i]][0]
      /*var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;*/
  },
  bubbleSort: function(arr, start, end) {
    var start = start || 0;
    var end = end || arr.length;
    var exchange = true;

    if (!arr || arr.length <= 1) {
      return arr;
    }
    for (var i = 0; i < end - 1; i++) {
      for (var j = end - 1; j > i; j--) {
        if (arr[j] < arr[j - 1]) {
          Est.swap(arr, j, j - 1);
          exchange = false;
        }
      }
      if (exchange) {
        return;
      }
    }
  }
});
