/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【TreeUtils】");

QUnit.test("bulidSubNode -> 4ms*1", function(assert) {
    var list = [{ belong_id: "Category_00000000000000000002312", category_id: "Category_00000000000000000002316", name: "14寸", cdesc: "", grade: "03", image: null, key: null, alias: null, sort: "9", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002312", category_id: "Category_00000000000000000002315", name: "13寸", cdesc: "", grade: "03", image: null, key: null, alias: null, sort: "8", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002312", name: "苹果", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "7", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002314", name: "联想", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "6", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002313", name: "华硕", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "5", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002290", name: "默认分类", cdesc: "默认分类", grade: "01", image: null, key: null, alias: null, sort: "4", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002306", name: "电脑", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "3", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002307", name: "包包", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "2", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002305", name: "手机", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "1", isdisplay: "1", hunkdisplay: null }];
    var root = [];
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i]['grade'] === '01') {
            root.push(list[i]);
        }
    }
    Est.bulidSubNode(root, list);
    var list2 = [{ "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002316", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "14寸", "sort": "9" }, { "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002315", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "13寸", "sort": "8" }, { "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002312", "cates": [{ "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002316", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "14寸", "sort": "9" }, { "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002315", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "13寸", "sort": "8" }], "cdesc": "", "grade": "02", "hasChild": true, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "苹果", "sort": "7" }, { "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002314", "cates": [], "cdesc": "", "grade": "02", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "联想", "sort": "6" }, { "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002313", "cates": [], "cdesc": "", "grade": "02", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "华硕", "sort": "5" }, { "alias": null, "belong_id": "/", "category_id": "Category_00000000000000000002290", "cates": [], "cdesc": "默认分类", "grade": "01", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "默认分类", "sort": "4" }, { "alias": null, "belong_id": "/", "category_id": "Category_00000000000000000002306", "cates": [{ "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002312", "cates": [{ "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002316", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "14寸", "sort": "9" }, { "alias": null, "belong_id": "Category_00000000000000000002312", "category_id": "Category_00000000000000000002315", "cates": [], "cdesc": "", "grade": "03", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "13寸", "sort": "8" }], "cdesc": "", "grade": "02", "hasChild": true, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "苹果", "sort": "7" }, { "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002314", "cates": [], "cdesc": "", "grade": "02", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "联想", "sort": "6" }, { "alias": null, "belong_id": "Category_00000000000000000002306", "category_id": "Category_00000000000000000002313", "cates": [], "cdesc": "", "grade": "02", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "华硕", "sort": "5" }], "cdesc": "", "grade": "01", "hasChild": true, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "电脑", "sort": "3" }, { "alias": null, "belong_id": "/", "category_id": "Category_00000000000000000002307", "cates": [], "cdesc": "", "grade": "01", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "包包", "sort": "2" }, { "alias": null, "belong_id": "/", "category_id": "Category_00000000000000000002305", "cates": [], "cdesc": "", "grade": "01", "hasChild": false, "hunkdisplay": null, "image": null, "isdisplay": "1", "key": null, "name": "手机", "sort": "1" }];
    assert.deepEqual(list, list2, "passed!");

});

QUnit.test("bulidSelectNode -> 4ms*1", function(assert) {
    var list = [{ belong_id: "Category_00000000000000000002312", category_id: "Category_00000000000000000002316", name: "14寸", cdesc: "", grade: "03", image: null, key: null, alias: null, sort: "9", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002312", category_id: "Category_00000000000000000002315", name: "13寸", cdesc: "", grade: "03", image: null, key: null, alias: null, sort: "8", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002312", name: "苹果", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "7", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002314", name: "联想", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "6", isdisplay: "1", hunkdisplay: null }, { belong_id: "Category_00000000000000000002306", category_id: "Category_00000000000000000002313", name: "华硕", cdesc: "", grade: "02", image: null, key: null, alias: null, sort: "5", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002290", name: "默认分类", cdesc: "默认分类", grade: "01", image: null, key: null, alias: null, sort: "4", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002306", name: "电脑", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "3", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002307", name: "包包", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "2", isdisplay: "1", hunkdisplay: null }, { belong_id: "/", category_id: "Category_00000000000000000002305", name: "手机", cdesc: "", grade: "01", image: null, key: null, alias: null, sort: "1", isdisplay: "1", hunkdisplay: null }];
    var root = [];
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i]['grade'] === '01') {
            root.push(list[i]);
        }
    }
    Est.bulidSubNode(root, list);
    Est.bulidSelectNode(root, 2, {
        name: 'name'
    });
    var result = [{
        "alias": null,
        "belong_id": "/",
        "category_id": "Category_00000000000000000002290",
        "cates": [],
        "cdesc": "默认分类",
        "grade": "01",
        "hasChild": false,
        "hunkdisplay": null,
        "image": null,
        "isdisplay": "1",
        "key": null,
        "name": "|-默认分类",
        "sort": "4"
    }, {
        "alias": null,
        "belong_id": "/",
        "category_id": "Category_00000000000000000002306",
        "cates": [{
            "alias": null,
            "belong_id": "Category_00000000000000000002306",
            "category_id": "Category_00000000000000000002312",
            "cates": [{
                "alias": null,
                "belong_id": "Category_00000000000000000002312",
                "category_id": "Category_00000000000000000002316",
                "cates": [],
                "cdesc": "",
                "grade": "03",
                "hasChild": false,
                "hunkdisplay": null,
                "image": null,
                "isdisplay": "1",
                "key": null,
                "name": "　　　|-14寸",
                "sort": "9"
            }, {
                "alias": null,
                "belong_id": "Category_00000000000000000002312",
                "category_id": "Category_00000000000000000002315",
                "cates": [],
                "cdesc": "",
                "grade": "03",
                "hasChild": false,
                "hunkdisplay": null,
                "image": null,
                "isdisplay": "1",
                "key": null,
                "name": "　　　|-13寸",
                "sort": "8"
            }],
            "cdesc": "",
            "grade": "02",
            "hasChild": true,
            "hunkdisplay": null,
            "image": null,
            "isdisplay": "1",
            "key": null,
            "name": "　　|-苹果",
            "sort": "7"
        }, {
            "alias": null,
            "belong_id": "Category_00000000000000000002306",
            "category_id": "Category_00000000000000000002314",
            "cates": [],
            "cdesc": "",
            "grade": "02",
            "hasChild": false,
            "hunkdisplay": null,
            "image": null,
            "isdisplay": "1",
            "key": null,
            "name": "　　|-联想",
            "sort": "6"
        }, {
            "alias": null,
            "belong_id": "Category_00000000000000000002306",
            "category_id": "Category_00000000000000000002313",
            "cates": [],
            "cdesc": "",
            "grade": "02",
            "hasChild": false,
            "hunkdisplay": null,
            "image": null,
            "isdisplay": "1",
            "key": null,
            "name": "　　|-华硕",
            "sort": "5"
        }],
        "cdesc": "",
        "grade": "01",
        "hasChild": true,
        "hunkdisplay": null,
        "image": null,
        "isdisplay": "1",
        "key": null,
        "name": "|-电脑",
        "sort": "3"
    }, {
        "alias": null,
        "belong_id": "/",
        "category_id": "Category_00000000000000000002307",
        "cates": [],
        "cdesc": "",
        "grade": "01",
        "hasChild": false,
        "hunkdisplay": null,
        "image": null,
        "isdisplay": "1",
        "key": null,
        "name": "|-包包",
        "sort": "2"
    }, {
        "alias": null,
        "belong_id": "/",
        "category_id": "Category_00000000000000000002305",
        "cates": [],
        "cdesc": "",
        "grade": "01",
        "hasChild": false,
        "hunkdisplay": null,
        "image": null,
        "isdisplay": "1",
        "key": null,
        "name": "|-手机",
        "sort": "1"
    }];
    assert.deepEqual(root, result, "passed!");
})

QUnit.test('bulidBreakNav -> 1ms*1', function(assert) {
    var list = [
        { album_id: "Album_00000000000000000000033002", name: "默认相册", add_time: null, update_time: "2014-06-18T02:49:01.762Z", parent_id: null },
        { album_id: "Album_00000000000000000000054391", name: "企业网站案例", add_time: "2013-08-19T08:35:06.850Z", update_time: "2014-06-18T02:49:01.762Z", parent_id: null },
        { album_id: "Album_00000000000000000000059126", name: "ssss", add_time: "2014-07-09T07:16:06.408Z", update_time: "2014-07-09T07:16:06.408Z", parent_id: null },
        { album_id: "Album_00000000000000000000059127", name: "fddgdfg", add_time: "2014-07-09T07:40:18.125Z", update_time: "2014-07-09T07:40:18.125Z", parent_id: null },
        { album_id: "Album_00000000000000000000059128", name: "sdfsdf", add_time: "2014-07-09T07:55:15.251Z", update_time: "2014-07-09T07:55:15.251Z", parent_id: null },
        { album_id: "Album_00000000000000000000059129", name: "sdfsdf", add_time: "2014-07-09T07:55:45.829Z", update_time: "2014-07-09T07:55:45.829Z", parent_id: null },
        { album_id: "Album_00000000000000000000059130", name: "sdfsdf", add_time: "2014-07-09T07:56:02.911Z", update_time: "2014-07-09T07:56:02.911Z", parent_id: null },
        { album_id: "Album_00000000000000000000059131", name: "sdfsdf", add_time: "2014-07-09T07:56:36.404Z", update_time: "2014-07-09T07:56:36.404Z", parent_id: null },
        { album_id: "Album_00000000000000000000059132", name: "wwww", add_time: "2014-07-09T07:59:32.410Z", update_time: "2014-07-09T07:59:32.410Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059133", name: "fdgfdg", add_time: "2014-07-09T08:00:34.047Z", update_time: "2014-07-09T08:00:34.047Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059134", name: "vvcb", add_time: "2014-07-09T08:21:59.718Z", update_time: "2014-07-09T08:21:59.718Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059135", name: "sdfsf", add_time: "2014-07-09T08:38:29.574Z", update_time: "2014-07-09T08:38:29.574Z", parent_id: null },
        { album_id: "Album_00000000000000000000059136", name: "sdfdsf", add_time: "2014-07-09T08:39:53.980Z", update_time: "2014-07-09T08:39:53.980Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059137", name: "dfff", add_time: "2014-07-09T08:39:59.668Z", update_time: "2014-07-09T08:39:59.668Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059138", name: "dddd", add_time: "2014-07-09T08:57:35.417Z", update_time: "2014-07-09T08:57:35.417Z", parent_id: "Album_00000000000000000000059132" },
        { album_id: "Album_00000000000000000000059139", name: "企业网站案例", add_time: "2014-07-09T09:41:40.112Z", update_time: "2014-07-09T09:41:40.112Z", parent_id: null },
        { album_id: "Album_00000000000000000000059140", name: "uuu", add_time: "2014-07-09T09:57:57.177Z", update_time: "2014-07-09T09:57:57.177Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059141", name: "eee", add_time: "2014-07-09T10:18:36.331Z", update_time: "2014-07-09T10:18:36.331Z", parent_id: "Album_00000000000000000000059133" },
        { album_id: "Album_00000000000000000000059142", name: "二级分类", add_time: "2014-07-09T14:41:19.940Z", update_time: "2014-07-09T14:41:19.940Z", parent_id: "Album_00000000000000000000033002" },
        { album_id: "Album_00000000000000000000059143", name: "三级分类", add_time: "2014-07-09T14:41:29.434Z", update_time: "2014-07-09T14:41:29.434Z", parent_id: "Album_00000000000000000000059142" },
        { album_id: "Album_00000000000000000000059144", name: "四级分类", add_time: "2014-07-09T14:41:37.539Z", update_time: "2014-07-09T14:41:37.539Z", parent_id: "Album_00000000000000000000059143" }
    ];

    var result = Est.bulidBreakNav(list, 'album_id', 'Album_00000000000000000000059144', 'name', 'parent_id');
    assert.deepEqual(result, [{ "name": "默认相册", "nodeId": "Album_00000000000000000000033002" }, { "name": "二级分类", "nodeId": "Album_00000000000000000000059142" }, { "name": "三级分类", "nodeId": "Album_00000000000000000000059143" }, { "name": "四级分类", "nodeId": "Album_00000000000000000000059144" }], 'passed!');
});


QUnit.test('bulidTreeNode -> 9ms*2', function(assert) {
    var list = [
        { addTime: 1349424991827, grade: "02", cdesc: "原材料 > 种菜盆 > ", sort: 37, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008428", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008408", categoryId2: "8428", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "和1", key: null, state: "01", type: "10" },
        { addTime: 1331625068743, grade: "02", cdesc: "汽摩及配件 > ", sort: 36, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008398", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008408", categoryId2: "8398", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "和", key: null, state: "01", type: "10" },
        { addTime: 1331625001707, grade: "01", cdesc: "农业 > ", sort: 34, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008397", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "ins_024", categoryId2: "8397", isroot: "01", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "111", key: null, state: "01", type: "10" },
        { addTime: 1331622049432, grade: "02", cdesc: "农业 > 粮食 > 小麦 > 分类1 > ", sort: 33, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008399", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008403", categoryId2: "8399", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "分类2", key: null, state: "01", type: "10" },
        { addTime: 1331622033595, grade: "01", cdesc: "农业 > 粮食 > 小麦 > ", sort: 32, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008403", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Syscode_000000000000000000000147", categoryId2: "8403", isroot: "01", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "分类1", key: null, state: "01", type: "10" },
        { addTime: 1331191774187, grade: "02", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > 神洲 > ", sort: 31, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008413", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008411", categoryId2: "8413", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "P460", key: null, state: "01", type: "10" },
        { addTime: 1331191753359, grade: "02", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > 苹果 > ", sort: 30, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008396", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008410", categoryId2: "8396", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "IPID", key: null, state: "01", type: "10" },
        { addTime: 1331191723515, grade: "02", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", sort: 29, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008395", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008393", categoryId2: "8395", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "N470", key: null, state: "01", type: "10" },
        { addTime: 1331191712031, grade: "02", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", sort: 28, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008394", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008393", categoryId2: "8394", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "Y460", key: null, state: "01", type: "10" },
        { addTime: 1331191705390, grade: "02", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", sort: 27, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008412", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008393", categoryId2: "8412", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "Y470", key: null, state: "01", type: "10" },
        { addTime: 1331191685843, grade: "01", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > ", sort: 26, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008411", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Syscode_000000000000000000000467", categoryId2: "8411", isroot: "01", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "神洲", key: null, state: "01", type: "10" },
        { addTime: 1331191674281, grade: "01", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > ", sort: 25, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008410", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Syscode_000000000000000000000467", categoryId2: "8410", isroot: "01", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "苹果", key: null, state: "01", type: "10" },
        { addTime: 1331191661703, grade: "01", cdesc: "数码、电脑 > 笔记本 > 笔记本电脑 > ", sort: 24, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008393", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Syscode_000000000000000000000467", categoryId2: "8393", isroot: "01", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "联想", key: null, state: "01", type: "10" },
        { addTime: 1331009751484, grade: "04", cdesc: "运动、休闲 > 女包 > 时装包 > 手提包 > 女式 > 红色 > ", sort: 23, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008424", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008426", categoryId2: "8424", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "品牌", key: null, state: "01", type: "10" },
        { addTime: 1331009742781, grade: "04", cdesc: "运动、休闲 > 女包 > 时装包 > 手提包 > 女式 > 红色 > ", sort: 22, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008423", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008426", categoryId2: "8423", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "美的", key: null, state: "01", type: "10" },
        { addTime: 1331009725046, grade: "03", cdesc: "运动、休闲 > 女包 > 时装包 > 手提包 > 女式 > ", sort: 21, enterpriseId: "Enterp_0000000000000000000000039", categoryId: "Category_00000000000000000008422", sonCate: null, adduserId: "User_000000000000000000000000082", belongId: "Category_00000000000000000008417", categoryId2: "8422", isroot: "00", isdisplay: "1", hunkDisplay: null, c_url: null, alias: null, ifLeaf: false, newsList: null, image: null, image2: null, name: "黑色", key: null, state: "01", type: "10" }
    ];
    var result = Est.bulidTreeNode(list, 'isroot', '01', {
        categoryId: 'categoryId', // 分类ＩＤ
        belongId: 'belongId', // 父类ＩＤ
        childTag: 'cates', // 子分类集的字段名称
        sortBy: 'sort', // 按某个字段排序
        callback: function(item) {} // 回调函数
    });
    assert.deepEqual(result, [{ "addTime": 1331191661703, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Syscode_000000000000000000000467", "c_url": null, "categoryId": "Category_00000000000000000008393", "categoryId2": "8393", "cates": [{ "addTime": 1331191705390, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008393", "c_url": null, "categoryId": "Category_00000000000000000008412", "categoryId2": "8412", "cates": [], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "Y470", "newsList": null, "sonCate": null, "sort": 27, "state": "01", "type": "10" }, { "addTime": 1331191712031, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008393", "c_url": null, "categoryId": "Category_00000000000000000008394", "categoryId2": "8394", "cates": [], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "Y460", "newsList": null, "sonCate": null, "sort": 28, "state": "01", "type": "10" }, { "addTime": 1331191723515, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008393", "c_url": null, "categoryId": "Category_00000000000000000008395", "categoryId2": "8395", "cates": [], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > 联想 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "N470", "newsList": null, "sonCate": null, "sort": 29, "state": "01", "type": "10" }], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "01", "hasChild": true, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "01", "key": null, "name": "联想", "newsList": null, "sonCate": null, "sort": 24, "state": "01", "type": "10" }, { "addTime": 1331191674281, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Syscode_000000000000000000000467", "c_url": null, "categoryId": "Category_00000000000000000008410", "categoryId2": "8410", "cates": [{ "addTime": 1331191753359, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008410", "c_url": null, "categoryId": "Category_00000000000000000008396", "categoryId2": "8396", "cates": [], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > 苹果 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "IPID", "newsList": null, "sonCate": null, "sort": 30, "state": "01", "type": "10" }], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "01", "hasChild": true, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "01", "key": null, "name": "苹果", "newsList": null, "sonCate": null, "sort": 25, "state": "01", "type": "10" }, { "addTime": 1331191685843, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Syscode_000000000000000000000467", "c_url": null, "categoryId": "Category_00000000000000000008411", "categoryId2": "8411", "cates": [{ "addTime": 1331191774187, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008411", "c_url": null, "categoryId": "Category_00000000000000000008413", "categoryId2": "8413", "cates": [], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > 神洲 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "P460", "newsList": null, "sonCate": null, "sort": 31, "state": "01", "type": "10" }], "cdesc": "数码、电脑 > 笔记本 > 笔记本电脑 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "01", "hasChild": true, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "01", "key": null, "name": "神洲", "newsList": null, "sonCate": null, "sort": 26, "state": "01", "type": "10" }, { "addTime": 1331622033595, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Syscode_000000000000000000000147", "c_url": null, "categoryId": "Category_00000000000000000008403", "categoryId2": "8403", "cates": [{ "addTime": 1331622049432, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "Category_00000000000000000008403", "c_url": null, "categoryId": "Category_00000000000000000008399", "categoryId2": "8399", "cates": [], "cdesc": "农业 > 粮食 > 小麦 > 分类1 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "02", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "00", "key": null, "name": "分类2", "newsList": null, "sonCate": null, "sort": 33, "state": "01", "type": "10" }], "cdesc": "农业 > 粮食 > 小麦 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "01", "hasChild": true, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "01", "key": null, "name": "分类1", "newsList": null, "sonCate": null, "sort": 32, "state": "01", "type": "10" }, { "addTime": 1331625001707, "adduserId": "User_000000000000000000000000082", "alias": null, "belongId": "ins_024", "c_url": null, "categoryId": "Category_00000000000000000008397", "categoryId2": "8397", "cates": [], "cdesc": "农业 > ", "enterpriseId": "Enterp_0000000000000000000000039", "grade": "01", "hasChild": false, "hunkDisplay": null, "ifLeaf": false, "image": null, "image2": null, "isdisplay": "1", "isroot": "01", "key": null, "name": "111", "newsList": null, "sonCate": null, "sort": 34, "state": "01", "type": "10" }], 'passed');
    var list3 = [
        { addTime: null, areaId: "402881882ba8753a012ba8bf474d001c", updateTime: null, name: "北京", path: "402881882ba8753a012ba8bf474d001c", level: 0, belongId: null },
        { addTime: null, areaId: "402881882ba8753a012ba8bfacfd001d", updateTime: null, name: "东城区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8bfacfd001d", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8bff6f6001e", updateTime: null, name: "西城区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8bff6f6001e", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c02f9a001f", updateTime: null, name: "崇文区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c02f9a001f", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c061970020", updateTime: null, name: "宣武区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c061970020", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c088690021", updateTime: null, name: "朝阳区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c088690021", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c0ade20022", updateTime: null, name: "丰台区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c0ade20022", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c0d34c0023", updateTime: null, name: "石景山区", path: "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c0d34c0023", level: 1, belongId: '402881882ba8753a012ba8bf474d001c' },
        { addTime: null, areaId: "402881882ba8753a012ba8c389a2002f", updateTime: null, name: "天津", path: "402881882ba8753a012ba8c389a2002f", level: 0, belongId: null },
        { addTime: null, areaId: "402881882ba8753a012ba8c3bcc80030", updateTime: null, name: "和平区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c3bcc80030", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c3e4460031", updateTime: null, name: "河东区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c3e4460031", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c409df0032", updateTime: null, name: "河西区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c409df0032", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c42e5e0033", updateTime: null, name: "南开区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c42e5e0033", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c454450034", updateTime: null, name: "河北区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c454450034", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c479040035", updateTime: null, name: "红桥区", path: "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c479040035", level: 1, belongId: '402881882ba8753a012ba8c389a2002f' },
        { addTime: null, areaId: "402881882ba8753a012ba8c689d30042", updateTime: null, name: "河北省", path: "402881882ba8753a012ba8c689d30042", level: 0, belongId: null },
        { addTime: null, areaId: "402881882ba8753a012ba8c6da830043", updateTime: null, name: "石家庄市", path: "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c6da830043", level: 1, belongId: '402881882ba8753a012ba8c689d30042' },
        { addTime: null, areaId: "402881882ba8753a012ba8c7122d0044", updateTime: null, name: "唐山市", path: "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c7122d0044", level: 1, belongId: '402881882ba8753a012ba8c689d30042' },
        { addTime: null, areaId: "402881882ba8753a012ba8c73d920045", updateTime: null, name: "秦皇岛市", path: "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c73d920045", level: 1, belongId: '402881882ba8753a012ba8c689d30042' },
        { addTime: null, areaId: "402881882ba8753a012ba8c7656d0046", updateTime: null, name: "邯郸市", path: "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c7656d0046", level: 1, belongId: '402881882ba8753a012ba8c689d30042' }
    ];
    var result = Est.bulidTreeNode(list3, 'level', 0, {
        categoryId: 'areaId', // 分类ＩＤ
        belongId: 'belongId', // 父类ＩＤ
        childTag: 'cates', // 子分类集的字段名称
        callback: function(item) {} // 回调函数
    });
    assert.deepEqual(result, [{ "addTime": null, "areaId": "402881882ba8753a012ba8bf474d001c", "belongId": null, "cates": [{ "addTime": null, "areaId": "402881882ba8753a012ba8bfacfd001d", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "东城区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8bfacfd001d", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8bff6f6001e", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "西城区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8bff6f6001e", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c02f9a001f", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "崇文区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c02f9a001f", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c061970020", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "宣武区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c061970020", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c088690021", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "朝阳区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c088690021", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c0ade20022", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "丰台区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c0ade20022", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c0d34c0023", "belongId": "402881882ba8753a012ba8bf474d001c", "cates": [], "hasChild": false, "level": 1, "name": "石景山区", "path": "402881882ba8753a012ba8bf474d001c,402881882ba8753a012ba8c0d34c0023", "updateTime": null }], "hasChild": true, "level": 0, "name": "北京", "path": "402881882ba8753a012ba8bf474d001c", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c389a2002f", "belongId": null, "cates": [{ "addTime": null, "areaId": "402881882ba8753a012ba8c3bcc80030", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "和平区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c3bcc80030", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c3e4460031", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "河东区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c3e4460031", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c409df0032", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "河西区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c409df0032", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c42e5e0033", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "南开区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c42e5e0033", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c454450034", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "河北区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c454450034", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c479040035", "belongId": "402881882ba8753a012ba8c389a2002f", "cates": [], "hasChild": false, "level": 1, "name": "红桥区", "path": "402881882ba8753a012ba8c389a2002f,402881882ba8753a012ba8c479040035", "updateTime": null }], "hasChild": true, "level": 0, "name": "天津", "path": "402881882ba8753a012ba8c389a2002f", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c689d30042", "belongId": null, "cates": [{ "addTime": null, "areaId": "402881882ba8753a012ba8c6da830043", "belongId": "402881882ba8753a012ba8c689d30042", "cates": [], "hasChild": false, "level": 1, "name": "石家庄市", "path": "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c6da830043", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c7122d0044", "belongId": "402881882ba8753a012ba8c689d30042", "cates": [], "hasChild": false, "level": 1, "name": "唐山市", "path": "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c7122d0044", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c73d920045", "belongId": "402881882ba8753a012ba8c689d30042", "cates": [], "hasChild": false, "level": 1, "name": "秦皇岛市", "path": "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c73d920045", "updateTime": null }, { "addTime": null, "areaId": "402881882ba8753a012ba8c7656d0046", "belongId": "402881882ba8753a012ba8c689d30042", "cates": [], "hasChild": false, "level": 1, "name": "邯郸市", "path": "402881882ba8753a012ba8c689d30042,402881882ba8753a012ba8c7656d0046", "updateTime": null }], "hasChild": true, "level": 0, "name": "河北省", "path": "402881882ba8753a012ba8c689d30042", "updateTime": null }], 'passed');
});
