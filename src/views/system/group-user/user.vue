<template>
<div class="main-wrap">
	<div class="left-side">
		<Tree :data="treeDataAll" :multiple="false" :render="renderContent"></Tree>
		<Spin fix v-if="treeLoading"></Spin>
	</div>
	<div class="right-side">
		<Form class="query-form" ref="form" :model="form" inline>
			<FormItem prop="company" label="归属公司">
				<tree-select v-model="form.company" type="office" :multiple="false" placeholder="请选择归属公司"></tree-select>
			</FormItem>
			<FormItem prop="office" label="归属部门">
				<tree-select v-model="form.office" type="office" :multiple="false" placeholder="请选择归属部门"></tree-select>
			</FormItem>
			<FormItem prop="loginName" label="登录名">
				<Input type="text" v-model="form.loginName" placeholder="请输入登录名" clearable></Input>
			</FormItem>
			<FormItem prop="name" label="姓名">
				<Input type="text" v-model="form.name" placeholder="请输入姓名" clearable></Input>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="query('form')">查询</Button>
			</FormItem>
		</Form>
		<div class="add-button-wrapper">
			<Button type="primary" @click="add">添加用户</Button>
		</div>
		<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
		<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
			<div style="float: right;">
				<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
			</div>
		</div>
		<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
			<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="120">
				<FormItem prop="id" label="id" class="fn-hide">
					<Input type="text" v-model="modalForm.id" clearable></Input>
				</FormItem>
				<FormItem prop="company" label="归属公司">
					<tree-select v-model="modalForm.company" type="office" :multiple="false" placeholder="请选择归属公司"></tree-select>
				</FormItem>
				<FormItem prop="office" label="归属部门">
					<tree-select v-model="modalForm.office" type="office" :multiple="false" placeholder="请选择归属部门"></tree-select>
				</FormItem>
				<FormItem prop="no" label="工号">
					<Input type="text" v-model="modalForm.no" placeholder="请输入工号" clearable></Input>
				</FormItem>
				<FormItem prop="name" label="姓名">
					<Input type="text" v-model="modalForm.name" placeholder="请输入姓名" clearable></Input>
				</FormItem>
				<FormItem prop="loginName" label="登录名">
					<Input type="text" v-model="modalForm.loginName" placeholder="请输入登录名" clearable></Input>
				</FormItem>
				<FormItem prop="newPassword" label="密码">
					<Input type="password" v-model="modalForm.newPassword" placeholder="请输入密码" clearable></Input>
				</FormItem>
				<FormItem prop="newPassword2" label="确认密码">
					<Input type="password" v-model="modalForm.newPassword2" placeholder="确认密码" clearable></Input>
				</FormItem>
				<FormItem prop="email" label="邮箱">
					<Input type="email" v-model="modalForm.email" placeholder="请输入邮箱" clearable></Input>
				</FormItem>
				<FormItem prop="phone" label="电话">
					<Input type="text" v-model="modalForm.phone" placeholder="请输入电话" clearable></Input>
				</FormItem>
				<FormItem prop="mobile" label="手机">
					<Input type="text" v-model="modalForm.mobile" placeholder="请输入手机" clearable></Input>
				</FormItem>
				<FormItem prop="loginFlag" label="是否允许登录">
					<dict-item v-model="modalForm.loginFlag" type="radio" label="yeno"></dict-item>
				</FormItem>
				<FormItem prop="userType" label="用户类型">
					<dict-item :transfer="true" v-model="modalForm.userType" style="width:200px"></dict-item>
				</FormItem>
				<FormItem prop="roleIdList" label="用户角色">
					<user-role v-model="modalForm.roleIdList"></user-role>
				</FormItem>
				<FormItem prop="remarks" label="备注">
					<Input v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="输入备注..."></Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" @click="modalEdit" :loading="btnLoading">{{btnTxt}}</Button>
			</div>
			<Spin size="large" fix v-if="detailSpin"></Spin>
		</Modal>
		<Modal v-model="modalDel" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>删除确认</span>
			</p>
			<div style="text-align:center">
				删除后讲无法恢复,是否删除？
			</div>
			<div slot="footer">
				<Button type="error" size="large" long :loading="delLoading" @click="del()">删除</Button>
			</div>
		</Modal>
	</div>
</div>
</template>
<script>
import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'
import userRole from '@/views/my-components/custom/user-role'

import tools from '@/libs/tools.js'

export default {
	components: {
		treeSelect,
		dictItem,
		userRole
	},
	data() {
		return {
			form: {
				company: '',
				office: '',
				loginName: '',
				name: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				company: '',
				office: '',
				no: '',
				name: '',
				loginName: '',
				newPassword: '',
				newPassword2: '',
				email: '',
				phone: '',
				mobile: '',
				loginFlag: '1',
				userType: '',
				roleIdList: [],
				remarks: ''
			},
			roleList: [{
					name: '系统管理员',
					id: '1'
				},
				{
					name: '普通人员',
					id: '2'
				},
				{
					name: '查阅人员',
					id: '3'
				}
			],
			tmpForm: {},
			rules: {
				company: [{
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('归属公司不能为空'));
						} else {
							callback();
						}
					},
					required: true,
					trigger: 'change'
				}],
				office: [{
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('归属部门不能为空'));
						} else {
							callback();
						}
					},
					required: true,
					trigger: 'change'
				}],
				name: [{
					required: true,
					message: '姓名为必填项',
					trigger: 'blur'
				}],
				no: [{
					required: true,
					message: '工号为必填项',
					trigger: 'blur'
				}],
				loginName: [{
					required: true,
					message: '登录名为必填项',
					trigger: 'blur'
				}],
				newPassword: [{
						required: true,
						message: '密码为必填项',
						trigger: 'blur'
					},
					{
						type: 'string',
						min: 6,
						message: '密码最少6位',
						trigger: 'blur'
					}
				],
				newPassword2: [{
					required: true,
					message: '确认密码为必填项',
					trigger: 'blur'
				}, {
					validator: this.passwordvalidate,
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增用户',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			editing:false,
			detailSpin:false,
			tableData: [],
			treeDataAll: [],
			treeLoading: true,
			tableColumns: [{
					title: '归属公司',
					key: 'company',
					width: 100,
					render: (h, params) => {
						return h('span', params.row.company ? params.row.company.name : '');
					}
				},
				{
					title: '归属部门',
					key: 'office',
					render: (h, params) => {
						return h('span', params.row.office ? params.row.office.name : '');
					}
				},
				{
					title: '登录名',
					key: 'loginName'
				},
				{
					title: '姓名',
					key: 'name'
				},
				{
					title: '电话',
					key: 'phone'
				},
				{
					title: '手机',
					key: 'mobile'
				},
				{
					title: '操作',
					key: null,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									size: 'small'
								},
								attrs: {
									id: params.row.id
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.modal = true;
										this.modalTitle = '编辑单表';
										this.btnTxt = '保存';
										this.editing = true;
										this.detailSpin = true;
										this.getDetail(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '修改'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								attrs: {
									id: params.row.id
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.modalDel = true;
										this.infoId = e.target.localName == 'span' ? e.target.parentNode.id : e.target.id;
									}
								}
							}, '删除')
						]);
					}
				}
			]
		}
	},
	created() {
		this.getTreeDataAll();
		this.getDataList();
	},
	methods: {
		getTreeDataAll() {
			this.API_treeDataAll({
				id: 0,
				type: 'office'
			}).then(d => {
				this.cleanData(d);
				this.treeDataAll = d;
				console.log(d);
				this.treeLoading = false;
			});
		},
		renderContent(h, {
			root,
			node,
			data
		}) {
			return h('span', {
				'class': {
					'ivu-tree-title': true,
					'ivu-tree-title-selected': data.id == this.form.office
				},
				on: {
					click: (e) => {
						this.form.office = tools.hasClass(e.target, 'ivu-tree-title-selected') ? '' : data.id;
						this.query('form');
					}
				}
			}, data.name);
		},
		cleanData(arr) {
			for (let item of arr) {
				if (item.children == null) {
					delete item.loading;
				} else {
					this.cleanData(item.children);
				}
			}
		},
		treeClick(val) {
			console.log(val);
			this.form.office = val;
			this.query('form');
		},
		passwordvalidate(rule, value, callback) {
			if (!value) {
				return callback(new Error('确认密码不能为空'));
			} else if (value != this.modalForm.newPassword) {
				return callback(new Error('两次输入密码不同'));
			} else {
				callback();
			}
		},
		change(e) {
			console.log(e);
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.form);
			this.API_getUserList(queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		getDetail(id) {
			this.API_getUserById(id).then(d => {
				d.password2 = d.password;
				d.oldLoginName = d.loginName;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
				this.detailSpin = false;
			});
		},
		add(e) {
			console.log(this.modalForm);
			this.modalTitle = '新增单表';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_deleteUser(this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
			});
		},
		changePage(page) {
			this.currPage = page;
			this.getDataList();
		},
		modalEdit() {
			console.log(this.modalForm);
			delete this.modalForm['__ob__'];
			delete this.tmpForm['__ob__'];
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						this.API_saveUser(this.modalForm).then(d => {
							console.log(d);
							setTimeout(() => {
								this.$Message.success('保存成功!');
								this.btnLoading = false;
								this.modal = false;
								this.currPage = 1;
								this.getDataList();
							}, 500);
						});
					}
				} else {
					this.$Message.error('请正确填写表单项!');
					return false;
				}
			});
		},
		modalCancel() {

		},
		modalChange(visible) {
			if (visible) {

			} else {
				this.editing = false;
				this.btnLoading = false;
				this.$refs.modalForm.resetFields();
			}
		},
		query(name) {
			console.log(this.form);
			this.queryForm = this.form;
			this.currPage = 1;
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.getDataList();
				} else {
					this.$Message.error('请正确填写表单!');
				}
			})
		}
	}
}
</script>
