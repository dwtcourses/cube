import axios from 'axios';
import semver from 'semver';
import packjson from '../../package.json';

let util = {
	closest: (el, selector) => {
		var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
		while (el) {
			if (matchesSelector.call(el, selector)) {
				break;
			}
			el = el.parentElement;
		}
		return el;
	},
	hasClass: (elements, cName) => {
		return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
	},
	addClass: function(elements, cName){
		if (!this.hasClass(elements, cName)) {
			elements.className += " " + cName;
		};
	},
	removeClass: function(elements, cName){
		if (this.hasClass(elements, cName)) {
			elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
		};
	},
	sort: function(arr, key) {
		arr.sort((a, b) => {
			let aSort = this.isNum(a[key]) ? parseInt(a[key]) : 999;
			let bSort = this.isNum(b[key]) ? parseInt(b[key]) : 999;
			return aSort - bSort;
		});
		arr.forEach((item,index)=>{
			if(item.children&&item.children.length>0){
				this.sort(item.children,'sort');
			}
		});
	},
	isNum(n) {
		if (n == undefined || n == null || n == '') {
			return false
		} else if (typeof(parseInt(n)) == 'number') {
			return true
		}
	},
	getType: (obj) => {
		//tostring会返回对应不同的标签的构造函数
		var toString = Object.prototype.toString;
		var map = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regExp',
			'[object Undefined]': 'undefined',
			'[object Null]': 'null',
			'[object Object]': 'object'
		};
		if (obj instanceof Element) {
			return 'element';
		}
		return map[toString.call(obj)];
	},
	deepClone: function(data) {
		var type = this.getType(data);
		var obj;
		if (type === 'array') {
			obj = [];
		} else if (type === 'object') {
			obj = {};
		} else {
			//不再具有下一层次
			return data;
		}
		if (type === 'array') {
			for (let item of data) {
				obj.push(item);
			}
		} else if (type === 'object') {
			for (var key in data) {
				obj[key] = this.deepClone(data[key]);
			}
		}
		return obj;
	},
	isObjFunc:function(name) {
        let toString = Object.prototype.toString;
        return (...args) => toString.call(args[0]) === '[object ' + name + ']';
    },
    extend:function(...args) {
        let isObject = this.isObjFunc('Object'),
            isArray = this.isObjFunc('Array'),
            isBoolean = this.isObjFunc('Boolean');
        let index = 0,
            isDeep = false,
            obj,
            copy,
            destination,
            source,
            i;
        if (isBoolean(args[0])) {
            index = 1;
            isDeep = args[0];
        }
        for (i = args.length - 1; i > index; i--) {
            destination = args[i - 1];
            source = args[i];
            if (isObject(source) || isArray(source)) {
                for (var property in source) {
                    obj = source[property];
                    if (isDeep && (isObject(obj) || isArray(obj))) {
                        copy = isObject(obj) ? {} : [];
                        let extended = this.extend(isDeep, copy, obj);
                        destination[property] = extended;
                    } else {
                        destination[property] = source[property];
                    }
                }
            } else {
                destination = source;
            }
        }
        return destination;
    }
};
util.title = function(title) {
	title = title || '物联网平台';
	window.document.title = title;
};



util.inOf = function(arr, targetArr) {
	let res = true;
	arr.forEach(item => {
		if (targetArr.indexOf(item) < 0) {
			res = false;
		}
	});
	return res;
};

util.oneOf = function(ele, targetArr) {
	if (targetArr.indexOf(ele) >= 0) {
		return true;
	} else {
		return false;
	}
};

util.showThisRoute = function(itAccess, currentAccess) {
	if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
		return util.oneOf(currentAccess, itAccess);
	} else {
		return itAccess === currentAccess;
	}
};

util.getRouterObjByName = function(routers, name) {
	if (!name || !routers || !routers.length) {
		return null;
	}
	// debugger;
	let routerObj = null;
	for (let item of routers) {
		if (item.name === name) {
			return item;
		}
		routerObj = util.getRouterObjByName(item.children, name);
		if (routerObj) {
			return routerObj;
		}
	}
	return null;
};

util.handleTitle = function(vm, item) {
	if (typeof item.title === 'object') {
		return vm.$t(item.title.i18n);
	} else {
		return item.title;
	}
};

util.setCurrentPath = function(vm, name) {
	let title = '';
	let isOtherRouter = false;
	vm.$store.state.app.routers.forEach(item => {
		if (item.children.length === 1) {
			if (item.children[0].name === name) {
				title = util.handleTitle(vm, item);
				if (item.name === 'otherRouter') {
					isOtherRouter = true;
				}
			}
		} else {
			item.children.forEach(child => {
				if (child.name === name) {
					title = util.handleTitle(vm, child);
					if (item.name === 'otherRouter') {
						isOtherRouter = true;
					}
				}
			});
		}
	});
	let currentPathArr = [];
	if (name === 'home_index') {
		currentPathArr = [{
			title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
			path: '',
			name: 'home_index'
		}];
	} else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
		currentPathArr = [{
				title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
				path: '/home',
				name: 'home_index'
			},
			{
				title: title,
				path: '',
				name: name
			}
		];
	} else {
		let currentPathObj = vm.$store.state.app.routers.filter(item => {
			if (item.children.length <= 1) {
				return item.children[0].name === name;
			} else {
				let i = 0;
				let childArr = item.children;
				let len = childArr.length;
				while (i < len) {
					if (childArr[i].name === name) {
						return true;
					}
					i++;
				}
				return false;
			}
		})[0];
		if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
			currentPathArr = [{
				title: '首页',
				path: '',
				name: 'home_index'
			}];
		} else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
			currentPathArr = [{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: name
				}
			];
		} else {
			let childObj = currentPathObj.children.filter((child) => {
				return child.name === name;
			})[0];
			currentPathArr = [{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: currentPathObj.name
				},
				{
					title: childObj.title,
					path: currentPathObj.path + '/' + childObj.path,
					name: name
				}
			];
		}
	}
	vm.$store.commit('setCurrentPath', currentPathArr);

	return currentPathArr;
};

util.openNewPage = function(vm, name, argu, query) {
	let pageOpenedList = vm.$store.state.app.pageOpenedList;
	let openedPageLen = pageOpenedList.length;
	let i = 0;
	let tagHasOpened = false;
	while (i < openedPageLen) {
		if (name === pageOpenedList[i].name) { // 页面已经打开
			vm.$store.commit('pageOpenedList', {
				index: i,
				argu: argu,
				query: query
			});
			tagHasOpened = true;
			break;
		}
		i++;
	}
	if (!tagHasOpened) {
		let tag = vm.$store.state.app.tagsList.filter((item) => {
			if (item.children) {
				return name === item.children[0].name;
			} else {
				return name === item.name;
			}
		});
		tag = tag[0];
		if (tag) {
			tag = tag.children ? tag.children[0] : tag;
			if (argu) {
				tag.argu = argu;
			}
			if (query) {
				tag.query = query;
			}
			vm.$store.commit('increateTag', tag);
		}
	}
	vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function(routers, name, route, next) {
	let len = routers.length;
	let i = 0;
	let notHandle = true;
	while (i < len) {
		if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
			route.replace({
				name: routers[i].children[0].name
			});
			notHandle = false;
			next();
			break;
		}
		i++;
	}
	if (notHandle) {
		next();
	}
};

util.fullscreenEvent = function(vm) {
	vm.$store.commit('initCachepage');
	// 权限菜单过滤相关
	vm.$store.commit('updateMenulist');
	// 全屏相关
};


export default util;
