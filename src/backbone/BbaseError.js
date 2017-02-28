/**
 * @description 错误信息
 * @class BbaseError - 错误信息
 * @author yongjin<zjut_wyj@163.com> 2016/1/7
 */


/**
 *  错误信息
 *  @method BbaseError
 *  @example
 *      Error: 1 ==> 当前视图无法找到选择符， 检查XxxList中的_initialize方法中是否定义render或实例化对象(new XxxList({...}))中是否存入el;或template模板是否引入， 或是否是iframe对话框中未重新实例化Application对象，或检查template模板是否存在
 *      Error: 2 ==> XxxList中的_initialize({})参数中未添加模型类，XxxList头部是否require请求引入？或检查config.js/main.js中是否配置app.addModule("XxxModel")
 *      Warm3: 3 ==> 从服务器上传回来的列表为空！检查XxxCollection中是否配置url参数
 *      Error: 4 ==> 396 服务器返回数据格式不正确 ，检查result.attributes里的data是否正在？
 *      Error: 5 ==> 分类ID错误， 检查XxxList中的_initialize({})配置中的categoryId跟api是否一致？
 *      Error: 6 ==> 父分类ID错误， 检查XxxList中的_initialize({})配置中的parentId跟api是否一致？
 *      Error: 7 ==> 页面不显示？ 点击链接是否访问正常？检查XxxList中的_initialize配置是否设置detail参数？若正常， 忽略本信息
 *      Error: 8 ==> 模型类中不存在id, 检查XxxModel中的baseId是否正确？
 *      Error: 9 ==> Application.addSession 出错
 *      Error: 10 ==> 已存在的模块
 *      Error: 11 ==> 已存在的模板
 *      Error: 12 ==> addCache添加缓存出错
 *      Error: 13 ==> 已存在的路由:
 *      Error: 14 ==> 服务器返回的数据为空， 是否返回数据？无？ 检查XxxCollection中的url参数是否配置正确？
 *      Error: 15 ==> 当前视图无法找到选择符， 检查XxxDetail中的_initialize方法中是否定义render或 实例化对象(new XxxDetail({...}))中是否存入el; 或template模板是否引入， 或是否是iframe对话框中未重新实例化Application对象， 或检查template模板是否存在
 *      Error: 16 ==> XxxDetail未找到模型类， 请检查继承BaseDetail时是否设置model参数，如XxxDetail = BaseDetail.extend({model: XxxModel, initialize: function(){..}})
 *      Error: 17 ==> 字段不匹配，检查input元素name值是否以vali-开头？
 *      Error: 18 ==>
 *      Error: 19 ==> XxxModel模型类未设置url参数！
 *      Error: 20 ==> 相关的模型类中是否正确定义baseId？ 如拼写错误、未定义等
 *      Error: 21 ==> 您当前选择的是不追加选择， 请检查XxxList的options中添加viewId?
 *      Error: 22 ==> 当前视图viewId不存在，无法完成上移操作，检查new XxxList({})options中的viewId是否定义？
 *      Error: 23 ==> 当前视图viewId不存在，无法完成下移操作，检查new XxxList({})options中的viewId是否定义？
 *      Error: 24 ==> BbaseItem._edit
 *      Error: 25 ==> 服务器返回的数据为空， 点击' + url + '是否返回数据？无？ 检查XxxModel中的baseUrl、baseId参数是否配置正确？还无？联系王进
 *      Error: 26 ==> 服务器返回的msg为空! 因此无弹出框信息。
 *      Error: 27 ==> 当前模型类未找到baseUrl, 请检查XxxModel中的baseUrl
 *      Error: 28 ==> BaseUtils.addLoading
 *      Error: 29 ==> XxxModel模型类中的baseUrl未设置
 *      Error: 30 ==> 参数不能少于2个， 且path为字符串
 *      Error: 31 ==> bindAll must be passed function names
 *      Error: 32 ==> targetList is not a array
 *      Error: 33 ==> method exchange: thisdx or targetdx is invalid !
 *      Error: 34 ==> error:595 the arguments of BbaseEst.hash must be string ==>
 *      Error: 35 ==> _wrapped is not defined
 *      Error: 36 ==>
 *      Error: 37 ==>
 *      Error: 38 ==>
 *      Error: 39 ==>
 */
var BbaseError = function () {
}