<style lang="less">
@import "./main.less";
</style>
<template>
<div class="main" :class="{'main-hide-text': shrink}">
	<div class="main-header-con">
		<div class="main-header">
			<div class="logo-con" @click="logoClick">
				<div class="logo-title">
					<!-- <svg class="colours-icon logo-icon" aria-hidden="true">
					    <use xlink:href="#icon-mofang"></use>
					</svg> -->
					<i class="iconfont">&#xe74a;</i>
					<span>魔方平台</span>
				</div>
				<Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
					<Icon type="navicon" size="32"></Icon>
				</Button>
			</div>
			<div class="header-middle-con">
				<!-- <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div> -->
				<!-- <main-nav></main-nav> -->
			</div>
			<div class="header-avator-con">
				<full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
				<lock-screen></lock-screen>
				<message-tip v-model="mesCount"></message-tip>
				<theme-switch></theme-switch>
				<div class="user-dropdown-menu-con">
					<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
						<Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
							<a href="javascript:void(0)">
								<span class="main-user-name">{{ userName }}</span>
								<Icon type="arrow-down-b"></Icon>
							</a>
							<DropdownMenu slot="list">
								<DropdownItem name="ownSpace">个人中心</DropdownItem>
								<DropdownItem name="loginout" divided>退出登录</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						<Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
					</Row>
				</div>
			</div>
		</div>
	</div>
	<div class="main-content">
		<div class="sidebar-menu-con" :style="{width: shrink?'60px':'240px', overflow: shrink ? 'visible' : 'auto'}">
			<shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
			</shrinkable-menu>
		</div>
		<div class="single-page-con" :style="{left: shrink?'60px':'240px'}">
			<div class="tags-con">
				<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
			</div>
			<div class="single-page" :class="{full:$route.path.indexOf('sell-card')>-1}">
				<keep-alive :include="cachePage">
					<router-view></router-view>
				</keep-alive>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import tagsPageOpened from './main-components/tags-page-opened.vue';
import breadcrumbNav from './main-components/breadcrumb-nav.vue';
import fullScreen from './main-components/fullscreen.vue';
import lockScreen from './main-components/lockscreen/lockscreen.vue';
import messageTip from './main-components/message-tip.vue';
import themeSwitch from './main-components/theme-switch/theme-switch.vue';
import mainNav from './main-components/main-nav';
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

import session from '@/libs/session.js';
export default {
	components: {
		shrinkableMenu,
		tagsPageOpened,
		breadcrumbNav,
		fullScreen,
		lockScreen,
		messageTip,
		themeSwitch,
		mainNav
	},
	data() {
		return {
			shrink: false,
			userName: '',
			isFullScreen: false,
			openedSubmenuArr: this.$store.state.app.openedSubmenuArr
		};
	},
	computed: {
		menuList() {
			return this.$store.state.app.menuList;
		},
		pageTagsList() {
			return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
		},
		currentPath() {
			return this.$store.state.app.currentPath; // 当前面包屑数组
		},
		avatorPath() {
			return localStorage.avatorImgPath;
		},
		cachePage() {
			return this.$store.state.app.cachePage;
		},
		lang() {
			return this.$store.state.app.lang;
		},
		menuTheme() {
			return this.$store.state.app.menuTheme;
		},
		mesCount() {
			return this.$store.state.app.messageCount;
		}
	},
	methods: {
		init() {
			let pathArr = util.setCurrentPath(this, this.$route.name);
			this.$store.commit('updateMenulist');
			if (pathArr.length >= 2) {
				this.$store.commit('addOpenSubmenu', pathArr[1].name);
			}
			this.userName = Cookies.get('user');
			this.checkTag(this.$route.name);
		},
		toggleClick() {
			this.shrink = !this.shrink;
		},
		handleClickUserDropdown(name) {
			if (name === 'ownSpace') {
				util.openNewPage(this, 'ownspace_index');
				this.$router.push({
					name: 'ownspace_index'
				});
			} else if (name === 'loginout') {
				// 退出登录
				this.API_logout().then(d => {
					session.remove('accessList');
					this.$store.commit('clearAllTags');
					this.$store.commit('clearOpenedSubmenu');
					this.$store.commit('logout', this);
					this.$router.push({
						name: 'login'
					});
				});
			}
		},
		checkTag(name) {
			let openpageHasTag = this.pageTagsList.some(item => {
				if (item.name === name) {
					return true;
				}
			});
			if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
				util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
			}
		},
		handleSubmenuChange(val) {
			// console.log(val)
		},
		beforePush(name) {
			if (name === 'unify-login_index') {
				let href = '';
				for (let menu of this.$store.state.app.accessList) {
					if (name == menu.target) {
						href = menu.path;
					}
				};
				if (href) {
					window.open(href, '_blank');
				};
				return false;
			} else {
				return true;
			}
		},
		fullscreenChange(isFullScreen) {
			// console.log(isFullScreen);
		},
		logoClick() {
			this.$router.push({
				name: 'home_index'
			});
		},
		getMyMsgCount() {
			this.API_getMyMsgCount().then(d => {
				this.$store.commit('setMessageCount', d.msgCount ? parseInt(d.msgCount) : 0);
			});
		}
	},
	watch: {
		'$route'(to) {
			this.$store.commit('setCurrentPageName', to.name);
			let pathArr = util.setCurrentPath(this, to.name);
			if (pathArr.length > 2) {
				this.$store.commit('addOpenSubmenu', pathArr[1].name);
			}
			this.checkTag(to.name);
			localStorage.currentPageName = to.name;
		},
		lang() {
			util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
		}
	},
	mounted() {
		this.init();
	},
	created() {
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
		// this.getMyMsgCount();
	}
};
</script>
