/**
 * @description 全局常量
 * @namespace const
 * @author yongjin<zjut_wyj@163.com> 2014/12/18
 */
/**
 * 全局常量
 * */
var CONST = {
  APP_VERSION: '1.5.5_1', // 版本号
  HOST: 'http://www.bbase.com/manage', // HOST
  API: 'http://www.bbase.com/rest', // 后端API地址，需登录验证
  PUBLIC_API: 'http://www.bbase.com/rest', // 无登录验证
  DOMAIN: 'http://www.bbase.com', // 域名
  STATIC_URL: 'http://www.bbase.com/html/', // 静态页面存放地址
  DOMAIN_TAIL: 'bbase.com', // 去http://
  PIC_URL: 'http://img.jihui88.com/wcd', // 图片服务器地址
  CDN: 'http://img.jihui88.com/wcd/cnd/manage', // 修改后记得改gulpfile里的cdn_root
  MUSIC_URL: 'http://f.bbase.com', // 音乐服务器地址
  SEP: '/', // 地址分隔符
  PIC_NONE: '/manage/images/nopic.jpg?v=001', // 无图片时的替换图片
  BG_NONE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==', // 空白背景图片
  DELIVERY_URL: 'http://api.ickd.cn/?id=108377&secret=1d323e291b7778da812664d0386f7b11&type=json&ord=desc&encode=utf8&ver=2', // 物流查询地址
  ENTER_KEY: 13, // 回车键值
  COLLAPSE_SPEED: 50, // 展开收缩速率
  SUBMIT_TIP: '提交中', // 表单提交时显示的文字
  AJAX_TIMEOUT: 10000, // 请求超时时间
  HEIGHT_WINDOW: typeof $ === 'undefined' ? 0 : $(window).height(), // 窗口高度
  LIB_FORDER: 'lib',
  SCREEN_SIZE: 1280, // 设置屏幕宽度， 若DEBUG_CONSOLE为false时， 不限定宽度
  DEBUG_SEAJS: false,
  DEBUG_LOCALSERVICE: false,
  ON_BEFORE_UNLOAD: true, // 是否退出浏览器显示提示
  EXPERIENCE: false, // 实验室，比如会员XX等级以上可以优先体验新功能
  DEBUG_CONSOLE: false, // 是否打印调试或错误信息
  APP_UPDATE: null,
  APP_TIP: '20160926', // 推送消息
  APP_TIPMSG: null, // 版本改变时，用户首次进入页面时的提示
  LANG: { // 语言配置
    NOT_LOGIN: '未登录', // 后台返回“未登录”
    SUBMIT: '提交中..',
    COMMIT: '提交',
    SAVE: '保存',
    EDIT: '修改',
    CONFIRM: '确定',
    CLOSE: '关闭',
    ADD: '添加',
    ADD_CONTINUE: '继续添加',
    TIP: '提示',
    SUCCESS: '操作成功',
    WARM_TIP: '温馨提示',
    DEL_TIP: '该分类下还有子分类， 请先删除！ 提示：当存在与之相关联的产品、新闻等等，也无法删除',
    DEL_CONFIRM: '是否删除?',
    AUTH_FAILED: '权限验证失败', // 后台返回
    AUTH_LIMIT: '权限不够',
    LOAD_ALL: '已全部加载',
    NO_RESULT: '暂无数据',
    SELECT_ONE: '请至少选择一项',
    DEL_SUCCESS: '删除成功',
    REQUIRE_FAILED: '数据异常, 稍后请重试！',
    SELECT_DEFAULT: '请选择',
    UPLOAD_OPTION_REQUIRE: '图片上传配置不能为空',
    UPLOAD_IMG: '上传图片',
    INSERT_CONTACT: '插入联系方式',
    SELECT_MAP: '选择Google/Baidu地圖',
    SELECT_TPL: '选择模版',
    BUILD_QRCODE: '生成二维码',
    SELECT_IMG: '选择图片',
    SELECT_FLASH: '选择flash',
    SELECT_QQ: '选择QQ/MSN/Skype/阿里旺旺/淘宝旺旺',
    VIEW: '浏览',
    DIALOG_TIP: '对话框',
    WIN_TIP: '窗口',
    INFO_TIP: '提示信息：',
    CANCEL: '取消',
    JSON_TIP: '您的浏览器版本过低， 请升级到IE9及以上或下载谷歌浏览器(https://www.google.com/intl/zh-CN/chrome/browser/desktop/index.html)！'
  }
};
window.CONST = CONST;
