import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: 'Login - 登录'
	},
	component: () =>
		import('@/views/login.vue')
};

export const page404 = {
	path: '/*',
	name: 'error-404',
	meta: {
		title: '404-页面不存在'
	},
	component: () =>
		import('@/views/error-page/404.vue')
};

export const page403 = {
	path: '/403',
	meta: {
		title: '403-权限不足'
	},
	name: 'error-403',
	component: () =>
		import('@/views/error-page/403.vue')
};

export const page500 = {
	path: '/500',
	meta: {
		title: '500-服务端错误'
	},
	name: 'error-500',
	component: () =>
		import('@/views/error-page/500.vue')
};

export const locking = {
	path: '/locking',
	name: 'locking',
	component: () =>
		import('@/views/main-components/lockscreen/components/locking-page.vue')
};



// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [{
			path: 'home',
			title: {
				i18n: 'home'
			},
			name: 'home_index',
			component: () =>
				import('@/views/home/home.vue')
		},
		{
			path: 'ownspace',
			title: '个人中心',
			name: 'ownspace_index',
			component: () =>
				import('@/views/own-space/own-space.vue')
		},
		{
			path: 'message',
			title: '消息中心',
			name: 'message_index',
			component: () =>
				import('@/views/message/message.vue')
		}
	]
};



// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	{
		path: '/company',
		icon: 'person-stalker',
		name: 'company',
		nav: 'dashboard',
		title: '企业管理',
		component: Main,
		redirect: '/company/info',
		children: [
			{
				path: 'info',
				title: '企业信息',
				icon: 'person',
				name: 'company-info',
				component: () =>
					import('@/views/modules/company/info.vue')
			},
			{
				path: 'jasper',
				title: 'jasper账号管理',
				icon: 'person',
				name: 'jasper',
				component: () =>
					import('@/views/modules/company/jasper.vue')
			},
			{
				path: 'industry',
				title: '行业管理',
				icon: 'person',
				name: 'industry',
				component: () =>
					import('@/views/modules/company/industry.vue')
			},
		]
	},
	{
		path: '/sell-card',
		icon: 'person-stalker',
		name: 'sell-card',
		nav: 'dashboard',
		title: '售卡',
		component: Main,
		redirect: '/sell-card/index',
		children: [
			{
				path: 'index',
				title: '我要售卡',
				icon: 'person',
				name: 'sell-card-index',
				component: () =>
					import('@/views/modules/sell-card/index.vue')
			},
		]
	},
	{
		path: '/self-service',
		icon: 'person-stalker',
		name: 'self-service',
		nav: 'dashboard',
		title: '自助服务',
		component: Main,
		redirect: '/self-service/logistics',
		children: [
			{
				path: 'logistics',
				title: '物流订单',
				icon: 'person',
				name: 'trade-logistics',
				component: () =>
					import('@/views/modules/self-service/trade-logistics.vue')
			},
			{
				path: 'sale',
				title: '售卡订单',
				icon: 'person',
				name: 'trade-sale',
				component: () =>
					import('@/views/modules/self-service/trade-sale.vue')
			},
			{
				path: 'usage',
				title: '用量',
				icon: 'person',
				name: 'usage',
				component: () =>
					import('@/views/modules/self-service/usage.vue')
			},
			{
				path: 'bill',
				title: '账单查询',
				icon: 'person',
				name: 'bill',
				component: () =>
					import('@/views/modules/self-service/bill.vue')
			},
			{
				path: 'trade',
				title: '我的订单',
				icon: 'person',
				name: 'trade',
				component: () =>
					import('@/views/modules/self-service/trade.vue')
			},
			{
				path: 'imp-card',
				title: '一键导卡',
				icon: 'person',
				name: 'imp-card',
				component: () =>
					import('@/views/modules/self-service/imp-card.vue')
			},
			{
				path: 'amount',
				title: '账户余额',
				icon: 'person',
				name: 'amount',
				component: () =>
					import('@/views/modules/self-service/amount.vue')
			},
			{
				path: 'commission-config',
				title: '佣金计算配置',
				icon: 'person',
				name: 'commission-config',
				component: () =>
					import('@/views/modules/self-service/commission-config.vue')
			},
			{
				path: 'commission',
				title: '佣金计算报表',
				icon: 'person',
				name: 'commission',
				component: () =>
					import('@/views/modules/self-service/commission.vue')
			},
		]
	},
	{
		path: '/product',
		icon: 'person-stalker',
		name: 'product',
		nav: 'dashboard',
		title: '产品管理',
		component: Main,
		redirect: '/product/list',
		children: [
			{
				path: 'list',
				title: '产品列表',
				icon: 'person',
				name: 'product-list',
				component: () =>
					import('@/views/modules/product/list.vue')
			},
			{
				path: 'rate-plan-version',
				title: '资费模板',
				icon: 'person',
				name: 'rate-plan-version',
				component: () =>
					import('@/views/modules/product/rate-plan-version.vue')
			},
			{
				path: 'b-template',
				title: '通信模板',
				icon: 'person',
				name: 'b-template',
				component: () =>
					import('@/views/modules/product/b-template.vue')
			},
		]
	},
	{
		path: '/card',
		icon: 'person-stalker',
		name: 'card',
		nav: 'dashboard',
		title: '卡管理',
		component: Main,
		redirect: '/card/list',
		children: [
			{
				path: 'list',
				title: '卡列表',
				icon: 'person',
				name: 'card-list',
				component: () =>
					import('@/views/modules/card/list.vue')
			},
			{
				path: 'stock-card',
				title: '库存卡',
				icon: 'person',
				name: 'stock-card',
				component: () =>
					import('@/views/modules/card/stock-card.vue')
			},
			{
				path: 'storage',
				title: '库位',
				icon: 'person',
				name: 'card-storage',
				component: () =>
					import('@/views/modules/card/storage.vue')
			},
		]
	}
];

export const sysRouter = [
	{
		path: '/group-user',
		icon: 'person-stalker',
		name: 'group-user',
		nav: 'dashboard',
		title: '机构用户',
		component: Main,
		redirect: '/group-user/user',
		children: [{
				path: 'user',
				title: '用户管理',
				icon: 'person',
				name: 'group-user_user',
				component: () =>
					import('@/views/system/group-user/user.vue')
			},
			{
				path: 'group',
				title: '机构管理',
				icon: 'icon-jigou',
				name: 'group-user_group',
				component: () =>
					import('@/views/system/group-user/group.vue')
			},
			{
				path: 'area',
				title: '区域管理',
				icon: 'icon-quyu',
				name: 'group-user_area',
				component: () =>
					import('@/views/system/group-user/area.vue')
			}
		]
	},
	{
		path: '/system-setting',
		icon: 'settings',
		name: 'system-setting',
		nav: 'dashboard',
		title: '系统设置',
		component: Main,
		redirect: '/system-setting/menu',
		children: [{
				path: 'menu',
				title: '菜单管理',
				icon: 'android-menu',
				name: 'system-setting_menu',
				component: () =>
					import('@/views/system/system/menu.vue')
			},
			{
				path: 'role',
				title: '角色管理',
				icon: 'android-contact',
				name: 'system-setting_role',
				component: () =>
					import('@/views/system/system/role.vue')
			},
			{
				path: 'diction',
				title: '字典管理',
				icon: 'ios-book',
				name: 'system-setting_diction',
				component: () =>
					import('@/views/system/system/dict.vue')
			}
		]
	},
];


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	...sysRouter,
	loginRouter,
	otherRouter,
	locking,
	...appRouter,
	page500,
	page403,
	page404,
];
