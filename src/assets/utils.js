// 检测是否为纯粹的对象
export const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

// 处理最大宽度
// 因为使用了两个插件来转换px为rem以及设置基准值，所以我们要在这两个插件执行后修改font-size和width，否则会被覆盖不生效
// 这里的函数在main.js中导入
// 这里设置app的宽度是因为，在App.vue里设置750会转换成rem，当37.5的font-size时转换成了20rem
// 我们再改变页面大小，会用此时的font-size*20，这样结果就不是750px了，所以要写在这里
export const handleMaxWidth = function handleMaxWidth() {
    let HTML = document.documentElement,
        app = document.querySelector('#app'),
        size = parseFloat(HTML.style.fontSize);
    if (size > 75) {
        HTML.style.fontSize = '75px';
        app.style.width = '750px';
        return;
    }
    app.style.width = '100%';
    app.style.minHeight = HTML.clientHeight + 'px';
};

// 日期格式化
export const formatTime = function formatTime(time, template) {
    // 如果time没传或者传的不是字符串，则用当前时间转换
    if (typeof time !== "string") {
        time = new Date().toLocaleString('zh-CN', { hour12: false });
    }
    // 如果template没传或者传的不是字符串，则设置一个默认模版
    if (typeof template !== "string") {
        template = "{0}年{1}月{2}日 {3}:{4}:{5}";
    }
    // 解析出年月日等信息
    let arr = []; 
    if (/^\d{8}$/.test(time)) {     // 判断必须是8位数字，2021921这种不知道到底哪个是月哪个是日，必须填充0
        let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);  // 获取exec函数得到的数组中的第1，2，3个值，分别为年月日
        arr.push($1, $2, $3);
    } else {
        arr = time.match(/\d+/g);   // 不是纯数字，则做一个筛选把字符串中所有数字拿到
    }
    // 把获取的数据放入替换模板，{1}-{2}替换的是{1}和{2}的值
    return template.replace(/\{(\d+)\}/g, (_, $1) => {
        let item = arr[$1] || "00";
        if (item.length < 2) item = "0" + item;
        return item;
    });
};