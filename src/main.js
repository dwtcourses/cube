import Vue from 'vue';
import iView from 'iview';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import BaiduMap from 'vue-baidu-map';
import {
	Tree,
	Icon,
	InputNumber
} from 'element-ui';
import {
	router
} from './router/index';
import {
	appRouter
} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import ajax from './libs/ajax';
import appApi from './libs/appApi';
import filter from './libs/filter';
import directive from './libs/directive';
import Vue2Filters from './libs/filters/index'

import 'echarts/lib/component/title';
import VeGauge from 'v-charts/lib/gauge';
import VePie from 'v-charts/lib/pie';
import VueParticles from 'vue-particles'

import './styles/app.scss'

if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
	const WX = require('./libs/weixin');
	console.log(WX);
	Vue.mixin({
		methods: {
			$wx: require('./libs/weixin')
		}
	});
}
Vue.use(Vue2Filters);
Vue.use(VueAwesomeSwiper);
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(InputNumber);
Vue.use(VueParticles);
Vue.use(BaiduMap, {
	ak: 'VwLCdiW2xlLcVh0Wnt8CVKUnLh8SrcMU'
})


Object.keys(filter).forEach(key => {
	Vue.filter(key, filter[key])
});

Object.keys(directive).forEach(key => {
	Vue.directive(key, directive[key])
});

Vue.prototype.$filter = Object.assign(filter,Vue.prototype.$filter);
Vue.mixin(ajax);
Vue.mixin(appApi);

Vue.component(VeGauge.name, VeGauge);
Vue.component(VePie.name, VePie);

new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => h(App),
	data: {
		currentPageName: ''
	},
	mounted() {
		this.currentPageName = this.$route.name;
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
		this.$store.commit('initCachepage');
		// 权限菜单过滤相关
		// this.$store.commit('updateMenulist');
	},
	created() {
		let tagsList = [];
		appRouter.map((item) => {
			if (item.children.length <= 1) {
				tagsList.push(item.children[0]);
			} else {
				tagsList.push(...item.children);
			}
		});
		this.$store.commit('setTagsList', tagsList);
	}
});
