export default {
	addClass: function(obj, cls) {
		if (!this.hasClass(obj, cls)) obj.setAttribute('class', cls);
	},
	hasClass: function(obj, cls) {
		let obj_class = obj.className, //获取 class 内容.
			obj_class_lst = obj_class.split(/\s+/); //通过split空字符将cls转换成数组.
		for (let x in obj_class_lst) {
			if (obj_class_lst[x] == cls) { //循环数组, 判断是否包含cls
				return true;
			}
		}
		return false;
	},
	isEqual: function(a, b) {
		//如果a和b本来就全等
		if (a === b) {
			//判断是否为0和-0
			return a !== 0 || 1 / a === 1 / b;
		}
		//判断是否为null和undefined
		if (a == null || b == null) {
			return a === b;
		}
		//接下来判断a和b的数据类型
		var classNameA = toString.call(a),
			classNameB = toString.call(b);
		//如果数据类型不相等，则返回false
		if (classNameA !== classNameB) {
			return false;
		}
		//如果数据类型相等，再根据不同数据类型分别判断
		switch (classNameA) {
			case '[object RegExp]':
			case '[object String]':
				//进行字符串转换比较
				return '' + a === '' + b;
			case '[object Number]':
				//进行数字转换比较,判断是否为NaN
				if (+a !== +a) {
					return +b !== +b;
				}
				//判断是否为0或-0
				return +a === 0 ? 1 / +a === 1 / b : +a === +b;
			case '[object Date]':
			case '[object Boolean]':
				return +a === +b;
		}
		//如果是对象类型
		if (classNameA == '[object Object]') {
			//获取a和b的属性长度
			var propsA = Object.getOwnPropertyNames(a),
				propsB = Object.getOwnPropertyNames(b);
			if (propsA.length != propsB.length) {
				return false;
			}
			for (var i = 0; i < propsA.length; i++) {
				var propName = propsA[i];
				//如果对应属性对应值不相等，则返回false
				if (a[propName] !== b[propName]) {
					return false;
				}
			}
			return true;
		}
		//如果是数组类型
		if (classNameA == '[object Array]') {
			if (a.toString() == b.toString()) {
				return true;
			}
			return false;
		}
	}
}
