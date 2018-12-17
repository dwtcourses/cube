import {
	otherRouter,
	sysRouter,
	appRouter,
	navRouter
} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
import session from '@/libs/session.js';

const app = {
	state: {
		// BASEURL: 'http://221.204.48.202:8888/',//打包地址
		// BASEURL: 'http://sxiot.sxaop.com/', //后台开发地址
		// BASEURL: 'http://134.0.133.203:8888/',//后台开发地址
		// BASEURL: 'http://134.0.133.148:8888/',//后台开发地址
		// BASEURL: 'http://10.19.9.48:81/',//打包地址
		UPLOADURL: process.env.BASEURL + 'iotserver/image/upload', //上传地址
		DOWNLOADURL: process.env.BASEURL + 'iotserver/image/view/', //下载地址
		BASEPATH: 'iotserver', //打包地址
		cachePage: [],
		lang: '',
		isFullScreen: false,
		openedSubmenuArr: [
			'workbench'
		], // 要展开的菜单数组
		menuTheme: 'light', // 主题
		themeColor: '',
		pageOpenedList: [{
			title: '首页',
			path: '',
			name: 'home_index'
		}],
		currentNav: 'dashboard',
		currentPageName: '',
		currentPath: [{
			title: '首页',
			path: '',
			name: 'home_index'
		}], // 面包屑数组
		menuList: [],
		navList: [],
		routers: [
			otherRouter,
			...appRouter,
			...sysRouter
		],
		tagsList: [...otherRouter.children],
		pageSize: 10,
		messageCount: 0,
		accessList: [],
		orderInfo: {},
		productInfo: {},
		dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
	},
	mutations: {
		setTagsList(state, list) {
			state.tagsList.push(...list);
		},
		updateMenulist(state) {
			let menuList = Util.extend(true, [], [...appRouter, ...sysRouter]);
			let accessList = session.get('accessList');
			state.accessList = accessList;
			if (!accessList) {
				return;
			};
			menuList.forEach((item, index) => {
				// item.isShow = true;
				for (let menu of accessList) {
					if (menu.target == item.name) {
						item.sort = menu.sort;
						item.title = menu.name;
						item.icon = menu.icon;
						item.isShow = menu.isShow == '1' ? true : false;
					}
				};
				if (item.children && item.children.length > 0) {
					item.children.forEach((child, i) => {
						// child.isShow = true;
						for (let menu of accessList) {
							if (menu.target == child.name) {
								child.sort = menu.sort;
								child.title = menu.name;
								child.icon = menu.icon;
								child.isShow = menu.isShow == '1' ? true : false;
							}
						};
					});
				}
			});
			menuList = menuList.filter((item) => {
				item.children = item.children.filter((child) => {
					return child.isShow;
				});
				if (item.children.length == 0) {
					return false;
				} else {
					return item.isShow;
				}
			});
			Util.sort(menuList, 'sort');
			state.menuList = menuList;
		},
		changeMenuTheme(state, theme) {
			state.menuTheme = theme;
		},
		changeMainTheme(state, mainTheme) {
			state.themeColor = mainTheme;
		},
		addOpenSubmenu(state, name) {
			let hasThisName = false;
			let isEmpty = false;
			if (name.length === 0) {
				isEmpty = true;
			}
			if (state.openedSubmenuArr.indexOf(name) > -1) {
				hasThisName = true;
			}
			if (!hasThisName && !isEmpty) {
				state.openedSubmenuArr.push(name);
			}
		},
		closePage(state, name) {
			state.cachePage.forEach((item, index) => {
				if (item === name) {
					state.cachePage.splice(index, 1);
				}
			});
		},
		initCachepage(state) {
			if (localStorage.cachePage) {
				state.cachePage = JSON.parse(localStorage.cachePage);
			}
		},
		removeTag(state, name) {
			state.pageOpenedList.map((item, index) => {
				if (item.name === name) {
					state.pageOpenedList.splice(index, 1);
				}
			});
		},
		pageOpenedList(state, get) {
			let openedPage = state.pageOpenedList[get.index];
			if (get.argu) {
				openedPage.argu = get.argu;
			}
			if (get.query) {
				openedPage.query = get.query;
			}
			state.pageOpenedList.splice(get.index, 1, openedPage);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		clearAllTags(state) {
			state.pageOpenedList.splice(1);
			state.cachePage.length = 0;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		clearOtherTags(state, vm) {
			let currentName = vm.$route.name;
			let currentIndex = 0;
			state.pageOpenedList.forEach((item, index) => {
				if (item.name === currentName) {
					currentIndex = index;
				}
			});
			if (currentIndex === 0) {
				state.pageOpenedList.splice(1);
			} else {
				state.pageOpenedList.splice(currentIndex + 1);
				state.pageOpenedList.splice(1, currentIndex - 1);
			}
			let newCachepage = state.cachePage.filter(item => {
				return item === currentName;
			});
			state.cachePage = newCachepage;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		setOpenedList(state) {
			state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
		},
		setCurrentPath(state, pathArr) {
			state.currentPath = pathArr;
		},
		setCurrentPageName(state, name) {
			state.currentPageName = name;
		},
		setAvator(state, path) {
			localStorage.avatorImgPath = path;
		},
		switchLang(state, lang) {
			state.lang = lang;
			Vue.config.lang = lang;
		},
		clearOpenedSubmenu(state) {
			state.openedSubmenuArr.length = 0;
		},
		setMessageCount(state, count) {
			state.messageCount = count;
		},
		increateTag(state, tagObj) {
			if (!Util.oneOf(tagObj.name, state.dontCache)) {
				state.cachePage.push(tagObj.name);
				localStorage.cachePage = JSON.stringify(state.cachePage);
			}
			state.pageOpenedList.push(tagObj);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		}
	}
};

export default app;
