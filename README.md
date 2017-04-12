### 适合对性能要求不高的后台管理类软件的双向绑定框架

### 使用流程

第一步：视图定义
```js
var FlyHeader = BbaseView.extend({
  initialize: function(){
    this._super({
      template: `<div>content</div>`
    });
  }
});
```

第二步：将视图添加到DOM中
```js
BbaseApp.addRegion('FlyHeader', FlyHeader, {
   el: '#leaflet-main',
   viewId: 'FlyHeader' // 选填
});
```

### 最简视图类型(必填项)

```js
// 普通视图
var FlyHeader = BbaseView.extend({
  initialize: function(){
    this._super({
      template: `<div>content</div>`
    });
  }
});
```

```js
// 列表视图
var ProductList = BbaseList.extend({
  initialize: function(){
    this._super({
      template: `<div><ul class="list-ul"></ul></div>`,
      model: BbaseModel.extend({
        baseId: 'productId',
        baseUrl: CONST.API + '/product/detail'
      }),
      collection: BbaseCollection.extend({
        url: CONST.API + '/product/list'
      }),
      item: BbaseItem.extend({
        tagName: 'li',
        template: `<div>item</div>`
      }),
      render: '.list-ul'
    });
  }
});
```

```js
// 表单提交视图
var ProductDetail = BbaseDetail.extend({
  initialize: function(){
    this._super({
      template: `
        <div id="product-detail-form"><input type="text" class="text" value=""/><input type="button" id="submit" value="添加表单"/></div>
      `,
      model: BbaseModel.extend({
        baseId: 'productId',
        baseUrl: CONST.API + '/product/detail'
      }),
      form: '#product-detail-form:#submit'
    });
  }
})
```

### 视图详细说明
```js
// 普通视图
var FlyHeader = BbaseView.extend({
  initialize: function(){
    this._super({
      template: `<div>content</div>`,                   // 字符串模板
      toolTip: true,                                    // 是否显示title提示框   html代码： <div class="tool-tip" data-title="提示内容">内容</div>
      enter: '#submit',                                 // 当按下回车键后，系统将会点击这个按钮
      data: {}                                          // 传递给模型类的数据， 常放于new一个视图的参数里
    });
  },
  initData: function(){                                 // 初始化模型类数据
    this._setDefault('args.name', 'a');                 // 初始化数据
    return {
      message: '我是一条消息'
    }
  },
  onReady: function(){                                  // 组件初始化后回调,整个生命周期中只调用一次

  },
  beforeRender: function(){                             // 视图插入到DOM前

  },
  afterRender: function(){                              // 视图插入到DOM后

  },
  update: function(name){                               // 监听的字段改变时回调

  },
  change: fucntion(){                                   // 当模型类改变时系统会实时调用这个回调 (注：状态字段改变时也会触发此方法)

  },
  destory: function(){                                  // 组件销毁时
});
```

```js
// 列表视图
var ProductList = BbaseList.extend({
  initialize: function(){
    this._super({
      template: `<div><ul class="list-ul"></ul></div>`, // 字符串模板
      model: BbaseModel.extend({
        baseId: 'productId',                            // 映射数据库主键字段
        baseUrl: CONST.API + '/product/detail',         // 对应RESTFUL地址
        fields: ['name'],                               // 最终要获取的字段,即提交到服务器上的字段
      }),
      collection: BbaseCollection.extend({
        url: CONST.API + '/product/list'                // 对应RESTFUL地址
      }),
      item: BbaseItem.extend({
        tagName: 'li',                                  // 定义单视图包裹层DOM元素类型
        template: `<div>item</div>`,                    // 单视图模板
        className: 'item-li'                            // 在li标签上定义class选择符
        filter: function(model){ return false;},        // 当返回false时 该单视图不在列表中显示出来
      }),
      render: '.list-ul',                               // 列表渲染到哪个DOM元素上
      empty: false,                                     // 是否清空列表内的html代码，默认为true
      toolTip: true,                                    // 是否显示title提示框   html代码： <div class="tool-tip" data-title="提示内容">内容</div>
      enter: '#submit',                                 // 当按下回车键后，系统将会点击这个按钮
      items: [],                                        // 手动定义列表模型集合，此时collection中的url将失效，即静态分页效果
      page: 1,                                          // 定义当前分页中的第几页
      pageSize: 20,                                     // 定义每页显示多少条数据
      diff: true,                                       // 最小渲染单元，此时item那里需添加bb-watch来监听数据变化
      data: {}                                          // 传递给模型类的数据， 常放于new一个视图的参数里
      append: false,                                    // 是否是追加内容， 默认为替换， 常用于“加载更多”场景中, 默认为false
      empty: false,                                     // 追加单视图时， 默认会清空掉render元素内的所有dom,为false时， 不清空， 只是追加，默认为true
      pagination: true/selector,                        // 是否显示分页 view视图中相应加入<div id="pagination-container"></div>; pagination可为元素选择符
      max: 5,                                           // 限制显示个数
      sortField: 'sort',                                // 上移下移字段名称， 默认为sort
      cache: true,                                      // 数据缓存到内存中
      session: true,                                    // 数据缓存到浏览器中，下次打开浏览器，请求的数据直接从浏览器缓存中读取

      // 以下为树型列表时 需要的参数
      subRender: '.node-tree',                          // 下级分类的容器选择符
      collapse: '.node-collapse'                        // 展开/收缩元素选择符
      parentId: 'belongId',                             // 分类 的父类ID
      categoryId: 'categoryId',                         // 分类 的当前ID
      rootId: 'isroot',                                 // 一级分类字段名称
      rootValue: '00'                                   // 一级分类字段值  可为数组[null, 'Syscode_']   数组里的选项可为方法， 返回true与false
      extend: true                                      // false收缩 true为展开
    });
  },
  initData: function(){                                 // 初始化模型类数据
    this._setDefault('args.name', 'a');                 // 初始化数据
    return {
      message: '我是一条消息'
    }
  },
  onReady: function(){                                  // 组件初始化后回调,整个生命周期中只调用一次

  },
  beforeRender: function(){                             // 视图插入到DOM前

  },
  afterRender: function(){                              // 视图插入到DOM后

  },
  beforeLoad: function(){                               // 从服务器获取数据前回调

  },
  afterLoad: function(){                                // 从服务器获取数据后回调

  },
  errorFetch: fucntion(response){                       // 从服务器获取列表失败回调

  },
  update: function(name){                               // 监听的字段改变时回调

  },
  change: fucntion(){                                   // 当模型类改变时系统会实时调用这个回调 (注：状态字段改变时也会触发此方法)

  },
  destory: function(){                                  // 组件销毁时

  },
  filter: function(){                                   // 过滤操作

  },
});
```

```js
// 表单提交视图
var ProductDetail = BbaseDetail.extend({
  initialize: function(){
    this._super({
      template: `
        <div id="product-detail-form"><input type="text" class="text" value=""/><input type="button" id="submit" value="添加表单"/></div>
      `,
      model: BbaseModel.extend({
        baseId: 'productId',                            // 映射数据库主键字段
        baseUrl: CONST.API + '/product/detail',         // 对应RESTFUL地址
        fields: ['name']                                // 最终要获取的字段,即提交到服务器上的字段
      }),
      form: '#product-detail-form:#submit' ,            // 定义表单提交作用域及提交按钮，中间以冒号分隔
      toolTip: true,                                    // 是否显示title提示框   html代码： <div class="tool-tip" data-title="提示内容">内容</div>
      enter: '#submit',                                 // 当按下回车键后，系统将会点击这个按钮
      data: {}                                          // 传递给模型类的数据， 常放于new一个视图的参数里
    });
  },
  initData: function(response){                         // 初始化模型类数据, response 为服务器返回的数据
    this._setDefault('args.name', 'a');                 // 初始化数据
    return {
      message: '我是一条消息'
    }
  },
  onReady: function(){                                  // 组件初始化后回调,整个生命周期中只调用一次

  },
  beforeRender: function(){                             // 视图插入到DOM前

  },
  afterRender: function(){                              // 视图插入到DOM后

  },
  beforeSave: function(){                               // 模型类保存前

  },
  afterSave: fucntion(model, response){                 // 模型类保存后

  },
  beforeLoad: function(){                               // 从服务器获取数据前回调

  },
  afterLoad: function(){                                // 从服务器获取数据后回调

  },
  errorSave: function(response){                        // 模型类保存失败后回调

  },
  errorFetch: fucntion(response){                       // 载入模型类失败回调

  },
  update: function(name){                               // 监听的字段改变时回调

  },
  change: fucntion(){                                   // 当模型类改变时系统会实时调用这个回调 (注：状态字段改变时也会触发此方法)

  },
  destory: function(){                                  // 组件销毁时

  }
});

// 视图调用
new ProductDetail({
  id: 1,                                                // 如果传入ID参数， 则系统会自动从服务端请求详细表单内容
  data: {},                                             // 传递给模型类的数据， 常放于new一个视图的参数里
  onChange: fucntion(){},                               // 手动调用，内可加逻辑代码
  onUpdate: function(){},                               // 当模型类改变时系统会实时调用这个回调
  onReady: fucntion(){},                                // 组件渲染完毕
});
```

### 其它说明
```js
var Module = BbaseView.extend({

  // 组件初始化
  initialize: fucntion  (){
    this._super({
      // BbaseList 部分
      checkAppend: false, // 鼠标点击checkbox， checkbox是否追加  需在BbaseItem事件中添加 'click .toggle': '_check',
      checkToggle: true,// 是否选中切换

      page: parseInt(BbaseEst.cookie('orderList_page')) || 1, //设置起始页 所有的分页数据都会保存到cookie中， 以viewId + '_page'格式存储， 注意cookie取的是字符串， 要转化成int
      pageSize: parseInt(BbaseEst.cookie('orderList_pageSize')) || 16, // 设置每页显示个数
    );
  },

  // 数据监听(推荐写到html页面中，详见下面的绑定规则)
  onWatch: fucntion(){
    this._watch(['args.name'], '.result:style', function(name){
      console.log('改变的字段为：' + name);
    });
  },
});
```

### 视图ID
```js
this.viewId                                             // 指定ID， 可以用this._view(this.viewId)获取
this.cid                                                // 唯一标识符， 由系统生成
```

### 视图重渲染
```js
this._region('imagePickerConfig', ImagePickerConfig, {
  el: '.image-picker-config',
  data: this.model.toJSON(),      // 将当前视图的模型类传入ImagePickerConfig中
  diff: true,                     // 开启diff， 默认是重新渲染
  onChange: this._bind(this._set) // 组件模型类改变回调
});
```

### 数据绑定
```html
<div bb-watch="args.name:style" bb-change="handleChange" style="display: {{#compare args.name '===' 'show'}}block;{{else}}none;{{/compare}}"></div>
```

>bb-watch:  监听的字段，多个字段以逗号隔开(当只要渲染当前元素时， 可以使用bb-watch="args.name:style"简写,多个字段以逗号隔开，错误写法bb-watch="args.name,args.color:style:html",正确写法：bb-watch="args.name:style,args.color:html")<br>【提示:】 使用:html时， 确保子元素没有使用指令，否则指令将失效
bb-change: 事件函数(其中参数为改变的字段名称)<br>

### 表单元素双向绑定
```html
<input bb-model="name:keyup" type="text" class="text" />
```
```js
bb-model: 模型类字段  后面的:keyup表示按下某个键弹起时触发，默认为:change (注：建议添加value="{{name}}",懒执行，提高性能)
```

### 表单验证
详见：example/DomainComponent.js

### 事件绑定
```html
<input bb-click="handleAdd" type="button" value="添加表单" class="abutton faiButton faiButton-hover" />
```
```js
bb-click="addOne": 事件类型，支持jquery所有的事件
bb-keyup="addOne:enter$arg1";   当按下回车时触发  $arg1 表示传递给方法的参数，后面可以加多个参数(注：event永远在最后)
bb-keyup="addOne:enter('arg1', name)"; // 当不加单引号时，表示从模型类里取值
bb-keyup="addOne:13";// 当e.keyCode = 13时，调用方法addOne  常用keyCode表:http://www.cambiaresearch.com/articles/15/javascript-key-codes
```

### 视图自带属性
```js
bb-checked="checked": 是否选中
bb-checked="checked_all": 是否全部选中
bb-checked="result_none": 列表是否为空
```

### 视图自带事件
```js
// BbaseItem
bb-click="_moveUp": 上移
bb-click="_moveDown": 下移
bb-click="_del": 删除，有提示
bb-click="_remove": 直接删除，无提示
bb-click="_check": 选中与未选中切换

// BbaseList
bb-click="_reload": 列表刷新
bb-click="_empty": 清空列表
bb-click="_checkAll": 全选中
bb-click="_clearChecked": 全不选中  当参数为true时， 忽略diff
bb-click="_remove(1,5)"; 删除元素

// BbaseDetail
bb-click="_reset": 初始化表单
bb-click="_save": 保存表单(当需要实时保存且不需要提示“保存成功”时使用)
```

### 视图自带指令
```js
bb-checked="checked";      checkbox选中
bb-show="models.length";   显示、隐藏   models为BbaseList中的this.collection.models
bb-disabled="models.length"
bb-src=""
```

### 视图通用方法
```js
this._super(type); // 引用父类，当参数type为view时返回上级视图 model时返回上级模型类，data上级模型类数据,options返回上级参数,"_init" 执行上级方法,为对象时调用父级的_initialize()方法 (注：BbaseItem中调用BbaseList中的方法，尽量用this._super('superFn', args))

this._view('viewId');// 获取视图(注：默认带this.cid)  注：如果是从路由那边注册的， 那么获取是用app.getView('viewId') 来引用
this._region('name', ProductList, {}); // 添加视图区域,当一个参数时则为获取视图(注：默认带this.cid)

this._service('productList').then(function(result){}); // 数据请求服务
this._navigate('#/home', true); // 导航

this._stringifyJSON(['args', 'laymodList']); // 序列化成字符串
this._parseJSON(['args', 'laymodList']); // 反序列化

this._setOption('itemId', '111'); // 设置组件参数
this._getOption('itemId');// 获取组件参数
this._getTpl(); // 获取模板字符串

this._getTarget(e); // 获取鼠标点击时的那个元素
this._getEventTarget(e); // 获取添加事件的那个元素

this._one(['ProductList'], function(ProductList){}); // 只执行单次，当第一个参数为数组时，则为require这个模块
this._require(['ProductList'], function(ProductList){}); // 请求模块

this._delay(function(){}, 5000); // 延迟执行
this._bind(function(){}); // 绑定上下文

this._dialog({}); // 模块对话框
this._close(); // 关闭对话框
this._initToolTip(parentNode, className); // 添加提示

this._set('name', 'aaa'); // 设置模型类，可传对象，类似jquery
this._get('name'); // 获取值

this._watch('color', '.render:style', function(fieldName){}); // 数据监听
this._getPath(this._get('args.color'), 'args.'); // 获取路径(第二个参数为前缀)
this._getField('remaining!== models.length'); => 'remaining'// 获取表达式字段
this._getBoolean('true');   // 获取boolean值，'true' '1' 'str' 均为true, 'false', '0', '' 均为false
this._getObject('{name: 'aa', value: 'getValue'}'); // 获取对象

this._setParam('name', 'value');    // 设置请求参数
this._getParam('name');             // 获取请求参数
```

### 模型类操作
```js
// 重置模型类
this._reset();
this._reset({name: 'aaa'}); // 重置模型类并设置name为aaa

// 设置模型类值
this._set('args.color', '#999');
this._set({
  "color": '#999',
  "args.color": '#999'
});

// 获取模型类值
this._get('args.color'); ==> #999

// 设置模型类值，不触发change事件
this._setAttr('args.color', '#999'); //
this._setAttr({
  "color": '#999',
  "args.color": '#999'
});

this._setDefault('args.color', '#999'); // 设置默认值 #999
this._getDefault('args.color', '#999'); // 获取args.color值，若不存在则初始化为#999并返回
```

### BbaseItem操作
```js
this._getPage(); //获取当前列表第几页
```

### 列表操作
```js
this._push(model, dx); // model可为object对象或new model()对象， dx为插入的索引值，不填默认插入到尾部
this._remove(start, end); // 移除元素
this._insertOrder(evt.oldIndex, evt.newIndex, function(list) {}); //插序排序

this._getItems(); // 获取全部列表
this._getItem(index); // 获取第index项
this._getCheckedItems(isPluck); // 获取选中的列表项 isPluck为true时自动转化为model.toJSON()对象
this._getCheckedIds(); // 获取选中项的ids数组

this._getPage(); // 获取当前第几页
this._setPage(5);// 设置当前第几页
this._getPageSize();// 获取每页个数
this._setPageSize(16);// 设置每页个数
this._getCount();// 获取总个数
this._setCount(5);// 设置总个数
this._getTotalPage();// 获取总页数
this._getLength(); // 获取列表长度

this._reload();         // 刷新列表

this._batch({  // 批量操作
    url: CONST.API + '/message/batch/del',
    tip: '删除成功'
});
this._batchDel({
    url: CONST.API + '/message/batch/del',
    field: 'id'
});
```

### 集合操作
```js
this.collection._set([{},{}])或this._setModels([{},{}]); // 重置列表(常用于过滤数据，排序等)
this.collection.each(function(model){
  model._set('name', 'aaa'); // 设置模型类
  model._get('name'); // 获取值
});
```

### 组件指令 (具体使用详见app/scripts/directives/directive.js)
```js
// js
BbaseApp.addDirective('disabled', {
  bind: function(value, selector) {
    // 获取表达式对象
    var object = this._getObject(value);
    // 获取boolean
    var boolean = this._getBoolean(value)

    // 获取字段并添加监视
    this._watch([this._getField(value)], selector + ':disabled');
    this.$(selector).prop('disabled', boolean);

    return {
      compile: BbaseEst.compile('{{' + value + '}}')
    }
  },
  update: function(name, node, selector, result) {
    node.prop('disabled', this._getBoolean(result));
  },
  unbind: function(object){
    // object里的参数为bind方法里返回的数据
    ...
  }
});
// html
bb-UiRadio="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
```

### 模板指令
```html
// 判断指令
{{#compare ../page '!==' this}}danaiPageNum{{else}}active{{/compare}}  // 比较
{{#contains ../element this}}checked="checked"{{/contains}} //是否包含
{{#if isTrue}}true{{/if}} // 简单判断
{{#If age===28&&name==='jhon2'}}age=28{{else}}age!=28{{/If}} // 复杂判断
{{#isEmpty image}}<img src='...'/>{{/isEmpty}} // 判断是否为空

// 输出指令
{{pipe 'Math.floor(age);age+1;plus(age, 1);plus(age, age);'}} // 管道过滤指令, 以分号为间隔
{{get 'args.color'}} // 取值
{{dateFormat addTime 'yyyy-MM-dd mm:hh:ss'}} // 日期格式化
{{replace module.type '\d*$' ''}} // 替换
{{default module.type 'aa'}} // 取默认值

{{plus 1 2}} => 3 // 相加
{{minus 10 5}} => 5 // 相减

{{cutByte name 5 end='...'}} // 字符串截取
{{parseInt 01}} // 转化为数字
{{CONST 'HOST'}} // 获取常量值(具体内容详见app/scripts/const/const.js)
{{PIC pic}} // 获取图片地址   {{PIC pic 120}} // 获取宽度为120图片，目前只能取120与640两种尺寸大小的图片
{{encodeUrl url}} // 编码地址
{{json 'invite.title'}} // parse json对象
{{version}} // 获取版本号
{{stripScripts '<scripts></scripts>'}} //去除script标签

{{keyMap module.type 'aa'}} // key value 映射
{{fontSize value}} // 状态映射(更多详见app/scripts/status/status.js)
```

### 过滤器 (具体使用详见app/scripts/filter/filter.js)
```js
// js
BbaseApp.addFilter('myFilter',function(arg1,arg2,arg3){
  debug(this.name);   // this指向模型类对象
  return arg1 + arg2 + arg3;
});
// html
{{pipe 'myFilter(name, age, weight)'}}
```

### BbaseService数据请求服务(具体使用详见/app/scripts/service/Service.js)
```js
new BbaseService().factory({
    url: '', // 请求地址
    data: {},// 表单参数

    session: true, // 永久记录，除非软件版本号更新
    cache: true // 暂时缓存， 浏览器刷新后需重新请求

    select: true, // 是否构建下拉框
    tree: true, // 是否构建树
    extend: true, // 是否全部展开
    defaults： false, // 是否添加默认选项
    defaultValue: '/', // 默认为 /

    // 如果tree为true时， 表示需要构建树， 则需补充以下字段
    rootKey: 'isroot', // 构建树时的父级字段名称
    rootValue: '01', // 父级字段值
    categoryId: 'categoryId', //分类 Id
    belongId: 'belongId', // 父类ID
    childTag: 'cates', // 子集字段名称
    sortBy: 'sort', // 根据某个字段排序

    // 如果select为true时 ，表示需要构建下拉框， 则下面的text与value必填
    text: 'name', // 下拉框名称
    value: 'categoryId', // 下拉框值
}).done(function(result){
    console.dir(result);
});
```
### 兼容性
兼容所有浏览器(包括IE6789)

### 更新记录
>2017.04.12
新增组件生命周期onReady

>2016.11.06<br>
添加_getParam与_setParam 请求参数获取与设置方法

>2016.08.28<br>
添加errorSave方法
修改afterSave参数

>2016.07.19<br>
新增onReady约定<br>

>2016.06.28<br>
新增bb-src指令<br>

>2016.06.01<br>
bb-click支持括号传参<br>
bb-keyup="addOne:13" 支持keyCode<br>
新增组件生命周期filter<br>
新增复杂判断指令If<br>
新增管道指令pipe<br>
新增过滤器addFilter

>2016.05.18<br>
修复并优化bb-show,bb-model指令

>2016.05.04<br>
新增this._super “options”参数类型

>2016.05.03<br>
新增列表方法 this._getPage与this._setPage<br>
this._getCount,this._setCount<br>
this._getPageSize,this._setPageSize<br>
this._getTotalPage

>2016.05.02<br>
新增指令 bb-disabled<br>
新增指令系统<br>
新增组件通用方法 this._getField
新增组件通用方法 this._getBoolean

>2016.05.01<br>
新增指令 bb-show
