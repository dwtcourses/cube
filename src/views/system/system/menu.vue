<!--todo
1、编辑状态的逻辑完善
-->


<template>
<div>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加菜单</Button>
	</div>
	<Table class="table-fold" border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="parent" label="上级菜单" class="hastree">
				<tree-select v-model="modalForm.parent" type="menu" :multiple="false" placeholder="请选择上级菜单"></tree-select>
			</FormItem>
			<FormItem prop="name" label="名称">
				<Input type="text" v-model="modalForm.name" placeholder="请输入名称" clearable></Input>
			</FormItem>
			<FormItem prop="href" label="链接">
				<Input type="text" v-model="modalForm.href" placeholder="请输入链接" clearable></Input>
			</FormItem>
			<FormItem prop="target" label="目标">
				<Input type="text" v-model="modalForm.target" placeholder="请输入目标" clearable></Input>
			</FormItem>
			<FormItem prop="sort" label="排序">
				<Input type="text" v-model="modalForm.sort" placeholder="请输入排序" clearable></Input>
			</FormItem>
			<FormItem prop="icon" label="图标">
				<Input type="text" v-model="modalForm.icon" placeholder="请输入图标代码" clearable @on-focus="chooseIcon"></Input>
			</FormItem>
			<FormItem prop="isShow" label="可见">
				<dict-item v-model="modalForm.isShow" type="radio" label="show_hide"></dict-item>
			</FormItem>
			<FormItem prop="permission" label="权限标识">
				<Input type="text" v-model="modalForm.permission" placeholder="请输入权限标识" clearable></Input>
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
	<Modal v-model="modalIcon" width="800" title="选择图标">
		<div class="icon-choose-container">
			<Input v-model="iconSearchParams" placeholder="输入英文关键词搜索，比如 success" style="width: 300px" clearable></Input>
			<div class="icons">
				<div :class="{'active':modalForm.icon==item.name}" class="icons-item" v-for="item in filterIcons" @click="icon(item)">
					<Icon :type="item.name"></Icon>
					<p>
						{{ item.name }}
					</p>
				</div>
			</div>
		</div>
		<div slot="footer"></div>
	</Modal>
</div>
</template>
<script>
import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'

import tools from '@/libs/tools.js'

import Icons from '@/libs/icons.js'
export default {
	components: {
		dictItem,
		treeSelect
	},
	data() {
		return {
			icons: Icons,
			modalForm: {
				id: '',
				parent: '',
				name: '',
				href: '',
				target: '',
				sort: '',
				icon: '',
				isShow: '1',
				permission: '',
				remarks: '',
			},
			tmpForm: {},
			rules: {
				parent: [{
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('上级菜单不能为空'));
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
				target: [{
					required: true,
					message: '目标为必填项',
					trigger: 'blur'
				}],
				sort: [{
					required: true,
					message: '排序为必填项',
					trigger: 'blur'
				}, {
					type: 'number',
					message: '排序必须是数字',
					trigger: 'blur',
					transform(value) {
						return Number(value);
					}
				}]
			},
			modal: false,
			modalDel: false,
			modalIcon: false,
			detailSpin:false,
			modalTitle: '新增单表',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			tableData: [],
			iconSearchParams: '',
			tableColumns: [{
					title: '名称',
					key: 'name',
					width: 300,
					render: (h, params) => {
						let level = params.row.path.split(',').length - 1;
						params.level = level;
						let close = (arr, row) => {
							if (!row) return;
							for (let item of row) {
								let index = arr.findIndex(function(value, index, arr) {
									return value.id == item.id;
								}); // 10
								if (item.children) {
									close(arr, item.children);
								};
								if (index == -1) return;
								arr.splice(index, 1);
							};
						};
						let getIcon = (l) => {
							let tpl = [];
							for (let i = 0; i < l; i++) {
								let cless = params.row.children && i == (l - 1) ? 'ivu-icon fold-icon ivu-icon-android-arrow-dropright' : 'fold-space';
								tpl.push(h('i', {
									attrs: {
										level: params.level,
										index: params.index,
										children: JSON.stringify(params.row.children)
									},
									'class': {
										'fold-on': params.row.fold == 1,
										'ivu-icon fold-icon ivu-icon-android-arrow-dropright': params.row.children && i == (l - 1) && params.row.children.length > 0,
										'fold-space': !(params.row.children && i == (l - 1))
									},
									on: {
										click: (e) => {
											if (tools.hasClass(e.target, 'fold-space')) return;
											let index = parseInt(e.target.getAttribute('index'));
											let fold = this.tableData[index].fold;
											let children = JSON.parse(e.target.getAttribute('children'));
											this.tableData[index].fold = fold ? 0 : 1;
											let tmp = [].concat(this.tableData);
											if (tools.hasClass(e.target, 'fold-on')) {
												close(tmp, params.row.children);
											} else {
												for (let i = 0; i < children.length; i++) {
													tmp.splice(index + i + 1, 0, children[i]);
												};
											}
											this.tableData = tmp;
										}
									}
								}));
							};
							return tpl;
						};
						return h('div', {
							class: 'fold-wrapper'
						}, [...getIcon(params.level),
							h('a', {
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
						]);
					}
				},
				{
					title: '链接',
					key: 'href'
				},
				{
					title: '排序',
					key: 'sort'
				},
				{
					title: '可见',
					key: 'isShow',
					render: (h, params) => {
						return h('span', params.row.isShow == '1' ? '显示' : '隐藏');
					}
				},
				{
					title: '权限标识',
					key: 'permissionStr'
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
	computed: {
		filterIcons() {
			return this.icons.filter(icon => icon.tag.indexOf(this.iconSearchParams) > -1);
		}
	},
	created() {
		this.getDataList();
	},
	methods: {
		add(e) {
			this.modalTitle = '新增菜单';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			this.API_deleteMenu(this.infoId).then(d => {
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
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						this.API_saveMenu(this.modalForm).then(d => {
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
			}
		},
		getDetail(id) {
			this.detailSpin = true;
			this.API_getMenuInfo(id).then(d => {
				d.sort = d.sort.toString();
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
				this.detailSpin = false;
			});
		},
		getDataList() {
			this.loading = true;
			this.API_getMenuList().then(d => {
				this.tableData = d;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		chooseIcon() {
			this.modalIcon = true;
			this.iconSearchParams = '';
		},
		icon(item) {
			this.modalForm.icon = item.name;
			this.modalIcon = false;
		}
	}
}
</script>
