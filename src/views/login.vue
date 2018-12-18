<style lang="less">
@import './login.less';
</style>

<template>
<div class="login-wrapper" id="login-wrapper">
	<div class="login" @keydown.enter="handleSubmit">
		<vue-particles color="#fff" :particleOpacity="0.3" :particlesNumber="60" :particleSize="10" hoverMode="repulse" class="bg-particles" ></vue-particles>
		<div class="login-content">
			<div class="logo">
				<div class="logo-content">
					<!-- <svg class="colours-icon logo-icon" aria-hidden="true">
					    <use xlink:href="#icon-mofang"></use>
					</svg> -->
					<i class="iconfont">&#xe74a;</i>
					<span>物联网平台</span>
				</div>
			</div>
			<div class="login-con">
				<Card :bordered="false">
					<p slot="title">
						用户登录222
					</p>
					<div class="form-con">
						<Form ref="loginForm" :model="form" :rules="rules">
							<FormItem prop="username">
								<Input v-model="form.username" placeholder="请输入用户名">
								<Icon slot="prepend" :size="24" type="person"></Icon>
								</Input>
							</FormItem>
							<FormItem prop="password">
								<Input type="password" v-model="form.password" placeholder="请输入密码">
								<Icon slot="prepend" :size="22" type="locked"></Icon>
								</Input>
							</FormItem>
							<FormItem>
								<Button @click="handleSubmit" shape="circle" long :loading="loading" :icon="icon">登录</Button>
							</FormItem>
						</Form>
						<p class="sign-in"><a href="http://sxiot.sxaop.com/register/index.html">企业注册</a></p>
					</div>
				</Card>
			</div>
		</div>
		<footer>
			物联网平台 版权所有
		</footer>
	</div>
</div>
</template>

<script>
import Cookies from 'js-cookie';

import session from '@/libs/session.js';


export default {
	data() {
		return {
			loading: false,
			icon: '',
			form: {
				username: 'admin',
				password: ''
			},
			rules: {
				username: [{
					required: true,
					message: '账号不能为空!',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '密码不能为空!',
					trigger: 'blur'
				}]
			}
		};
	},
	created() {
		session.remove('accessList');
	},
	methods: {
		handleSubmit() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					this.API_login(this.form).then(d => {
						session.add('accessList',d.menuList);
						Cookies.set('user', d.realname);
						Cookies.set('userName', d.username);
						Cookies.set('userId', d.userId);
						if (d.username === 'admin') {
							Cookies.set('access', 0);
						} else {
							Cookies.set('access', 1);
						};
						this.icon = 'android-done';
						this.loading = false;
						this.$router.push({
							name: 'home_index'
						});
					}, e => {
						this.loading = false;
					});
				}
			});
		}
	}
};
</script>
