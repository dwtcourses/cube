<!-- todo
1、数据范围详细部分的完善
-->

<template>
<div>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加角色</Button>
	</div>
	<Table class="table-fold" border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="office" label="归属机构">
				<tree-select v-model="modalForm.office" type="office" :multiple="false" placeholder="请选择归属机构"></tree-select>
			</FormItem>
			<FormItem prop="name" label="角色名称">
				<Input type="text" v-model="modalForm.name" placeholder="请输入角色名称" clearable></Input>
			</FormItem>
			<FormItem prop="enname" label="英文名称">
				<Input type="text" v-model="modalForm.enname" placeholder="请输入英文名称" clearable></Input>
			</FormItem>
			<FormItem prop="roleType" label="角色类型">
				<dict-item :transfer="true" v-model="modalForm.roleType" style="width:200px" label="activiti_role_type"></dict-item>
			</FormItem>
			<FormItem prop="sysData" label="系统数据">
				<dict-item v-model="modalForm.sysData" type="radio" label="yeno"></dict-item>
			</FormItem>
			<FormItem prop="useable" label="是否可用">
				<dict-item v-model="modalForm.useable" type="radio" label="yeno"></dict-item>
			</FormItem>
			<FormItem prop="dataScope" label="数据范围">
				<dict-item :transfer="true" v-model="modalForm.dataScope" label="sys_data_scope"></dict-item>
			</FormItem>
			<FormItem prop="officeList" label="明细设置" v-if="modalForm.dataScope=='9'">
				<office-tree v-model="modalForm.officeList" :showCheckbox="true"></office-tree>
			</FormItem>
			<FormItem  prop="menuList" label="菜单授权">
				<menu-tree ref="menuTree" v-model="menuList" :showCheckbox="true"></menu-tree>
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
</template>
<script>
import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'
import menuTree from '@/views/my-components/custom/menu-tree'
import officeTree from '@/views/my-components/custom/office-tree'
import userTree from '@/views/my-components/custom/user-tree'

import tools from '@/libs/tools.js'

import Util from '@/libs/util.js';

export default {
	components: {
		dictItem,
		treeSelect,
		menuTree,
		officeTree,
		userTree
	},
	data() {
		return {
			isObjFunc:Util.isObjFunc('Object'),
			menuList:[],
			initForm: {
				id: '',
				office: '',
				name: '',
				enname: '',
				roleType: '',
				menuList: [],
				userList:[],
				officeList:[],
				sysData: '1',
				useable: '1',
				dataScope: '',
				remarks: ''
			},
			modalForm: {
				id: '',
				office: '',
				name: '',
				enname: '',
				roleType: '',
				menuList: [],
				userList:[],
				officeList:[],
				sysData: '1',
				useable: '1',
				dataScope: '',
				remarks: ''
			},
			tmpForm: {},
			rules: {
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
					message: '名称为必填项',
					trigger: 'blur'
				}],
				enname: [{
					required: true,
					message: '英文名称为必填项',
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增角色',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			detailSpin: false,
			tableData: [],
			tableColumns: [{
					title: '角色名称',
					key: 'name',
					width: 300,
					render: (h, params) => {
						return h('a', {
							class: 'link',
							attrs: {
								id: params.row.name
							},
							on: {
								click: (e) => {
									this.modal = true;
									this.getDetail(e.target.id);
								}
							}
						}, params.row.name)
					}
				},
				{
					title: '英文名称',
					key: 'enname'
				},
				{
					title: '归属机构',
					key: 'office',
					render: (h, params) => {
						return h('span', params.row.office ? params.row.office.name : '');
					}
				},
				{
					title: '数据范围',
					key: 'dataScopeStr'
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
	watch:{
		menuList:function(n,o){
			if(this.isObjFunc(n)){
				this.menuList = n.checkedKeys;
				this.modalForm.menuList = n.checkedKeys.concat(n.halfCheckedKeys);
			}
		}
	},
	created() {
		this.getDataList();
	},
	methods: {
		add(e) {
			this.modalTitle = '新增角色';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_deleteRole(this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
			});
		},
		modalEdit() {
			delete this.modalForm['__ob__'];
			delete this.tmpForm['__ob__'];
			console.log(this.modalForm);
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						this.API_saveRole(this.modalForm).then(d => {
							console.log(d);
							setTimeout(() => {
								this.$Message.success(this.btnTxt + '成功!');
								this.btnLoading = false;
								this.modal = false;
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
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.$refs.menuTree.$refs.tree.setCheckedKeys([]);
				this.modalForm = this.initForm;
			}
		},
		getDetail(id) {
			this.detailSpin = true;
			this.API_getRoleInfo(id).then(d => {
				d.oldName = d.name;
				d.oldEnname = d.enname;
				d.officeList = d.officeIdList;
				d.menuList = d.menuIdList;
				this.menuList = d.menuIdList;
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		getDataList() {
			this.loading = true;
			this.API_getRoleList().then(d => {
				console.log(d);
				this.tableData = d;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},

	}
}
</script>
