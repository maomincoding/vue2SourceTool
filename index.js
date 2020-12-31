/*立即执行函数*/
// 页面加载完成后只执行一次的设置函数。
(function (a, b) {
  console.log(a, b); // 1,2
})(1, 2);
// 通常，全局变量被作为一个参数传递给立即执行参数，这样它在函数内部不使用window也可以被访问到。
(function (global) {
  console.log(global); // Window对象
})(this);

/*多层嵌套三目运算符*/
// 三目运算符嵌套的写法，使得代码可读性差，简单业务场景下可以试着使用。
var a = 1;
var b = 0;
a == 1 ? (b == 2 ? (b = 3) : (b = 1)) : "";
console.log(b); // 1

/*冻结对象*/
// 不可对指定对象增删改。
var emptyObject = Object.freeze({
  key: "1",
});
emptyObject.name = "maomin";
delete emptyObject.key;
emptyObject.key = "2";
console.log(emptyObject);

/*密封对象*/
// 只能对指定对象进行更改，不可进行增加删除操作。
var sealObject = Object.seal({
  key: 3,
});
sealObject.name = "maomin";
delete sealObject.key;
sealObject.key = 4;
console.log(sealObject); // 4

/*检查是否是原始值*/
function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    // $flow-disable-line
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}

/*快速检测是否是对象*/
// 当我们知道原始值时，它主要用于将对象与原始值区分开来。
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
console.log(isObject(true)); //false

/*检测目标类型*/
var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}
console.log(toRawType([])); // Array

/*检查目标是否是有效的数组索引*/
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

/*检测是否是Promise对象*/
function isDef(v) {
  return v !== undefined && v !== null;
}
function isPromise(val) {
  return (
    isDef(val) &&
    typeof val.then === "function" &&
    typeof val.catch === "function"
  );
}
var promiseObj = new Promise(function (resolve, reject) {
  // 一段耗时的异步操作
  resolve("成功"); // 数据处理完成
  // reject('失败') // 数据处理出错
}).then(
  (res) => {
    console.log(res);
  }, // 成功
  (err) => {
    console.log(err);
  } // 失败
);
console.log(isPromise(promiseObj)); // true

/*目标转换为字符串*/
var _toString = Object.prototype.toString;
function isPlainObject(obj) {
  return _toString.call(obj) === "[object Object]";
}
function toString(val) {
  return val == null
    ? ""
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val);
}
console.log(toString({ name: 1 })); // {"name": 1}

/*转化为数字*/
// 将输入值转换为数字以便持久化。如果转换失败，则返回原始字符串。
function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/*检测key是否在创建的Map对象内*/
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(",");
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) {
        return map[val.toLowerCase()];
      }
    : function (val) {
        return map[val];
      };
}
var isBuiltInTag = makeMap("slot,component", true);
console.log(isBuiltInTag("component")); // true

// 删除简单数组中某一项
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
console.log(remove([1, 2], 1)); // [1]

/*检测对象中是否有指定key*/
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
console.log(hasOwn({ name: 1 }, "name")); //true

/*将类数组对象转化为真实数组*/
function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}
console.log(toArray({ 0: 42, 1: 52, 2: 63, length: 3 })); // [42, 52, 63]

/*将属性混合到目标对象中*/
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}
console.log(extend({ name: 1 }, { name1: 2 })); // {name:1,name1:2}

/*将对象数组合并为单个对象*/
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
console.log(toObject([{ name: 1 }, { name: 1 }, { name: 2 }, { name1: 3 }])); // {name: 2, name1: 3}

/*检测指定项在数组（简单数组、数组对象）中的索引*/
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
function looseEqual(a, b) {
  if (a === b) {
    return true;
  }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return (
          a.length === b.length &&
          a.every(function (e, i) {
            return looseEqual(e, b[i]);
          })
        );
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return (
          keysA.length === keysB.length &&
          keysA.every(function (key) {
            return looseEqual(a[key], b[key]);
          })
        );
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}
console.log(looseIndexOf([{ name: 1 }, { name: 2 }], 4)); // -1
console.log(looseIndexOf([{ name: 1 }, { name: 2 }], { name: 1 })); // 0

/*确保函数只调用一次*/
function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}
var callOnce = once(function () {
  console.log("javascript");
});
callOnce(); // javascript
callOnce();

/*定义对象属性*/
//如果你想禁止一个对象添加新属性并且保留已有属性，就可以使用Object.preventExtensions(obj)
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val, // 对象定义属性
    enumerable: !!enumerable, // 描述属性是否会出现在for in 或者 Object.keys()的遍历中
    writable: true, // 是否可写
    configurable: true, // 是否重新定义或者删除
  });
}
var obj = {
  name: 1,
};
def(obj, "name1", 2, true);
obj.name1 = 3;
console.log(obj); // {name: 1, name1: 3}

/*浏览器环境嗅探*/
var inBrowser = typeof window !== "undefined";
var inWeex = typeof WXEnvironment !== "undefined" && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();

var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
var isEdge = UA && UA.indexOf("edge/") > 0;
var isAndroid = (UA && UA.indexOf("android") > 0) || weexPlatform === "android";
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === "ios";
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

/*JS构造函数内的方法与构造函数prototype属性上方法的对比*/
// 定义在构造函数内部的方法，会在它的每一个实例上都克隆这个方法；定义在构造函数的 prototype 属性上的方法会让它的所有示例都共享这个方法，
// 但是不会在每个实例的内部重新定义这个方法。如果我们的应用需要创建很多新的对象，并且这些对象还有许多的方法，为了节省内存，我们建议把这些方法都定义在构造函数的 prototype 属性上。
// 当然，在某些情况下，我们需要将某些方法定义在构造函数中，这种情况一般是因为我们需要访问构造函数内部的私有变量。
function A() {
  this.say = function () {
    console.log(1);
  };
}
var a = new A();
a.say();
function B() {}
B.prototype.say = function () {
  console.log(2);
};
var b = new B();
b.say();
var c = new B();
c.say();

/* 获取标签内容（包含标签）*/
function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    var container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}
/*字符串hash值*/
function hash(str) {
  var hash = 5381;
  var i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}
console.log(hash("222sd"));
