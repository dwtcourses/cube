<template>
<div>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加行业</Button>
	</div>
	<Table class="table-fold" border :data="tableData" :columns="tableColumns" :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal :class="{'detail-ing':detailIng}" v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="120">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="parentId" label="上级行业" class="hastree">
				<tree-select v-model="modalForm.parentId" type="custom" :tableName="tableName" :multiple="false" placeholder="请选择上级行业"></tree-select>
			</FormItem>
			<FormItem prop="name" label="行业名称">
				<Input type="text" v-model="modalForm.name" placeholder="请输入区域名称" clearable></Input>
			</FormItem>
			<FormItem prop="sort" label="排序">
				<Input type="text" v-model="modalForm.sort" placeholder="请输入排序" clearable></Input>
			</FormItem>
			<Spin size="large" fix v-if="detailSpin"></Spin>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="modalEdit" :loading="btnLoading">{{btnTxt}}</Button>
		</div>
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

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		treeSelect
	},
	data() {
		return {
			tableName: 'tf_ent_industry',
			modalForm: {
				tableName: 'tf_ent_industry',
				parentId: '',
				name: '',
				sort: 10,
			},
			tmpForm: {},
			rules: {
				name: [{
					required: true,
					message: '名称为必填项',
					trigger: 'blur'
				}],
				sort: [{
					type: 'number',
					message: '排序必须是数字',
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			editIng: false,
			modalTitle: '新增行业',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			editIng: false,
			detailIng: false,
			detailSpin: false,
			treeDataAll: [],
			treeLoading: true,
			tableData: [],
			tableColumns: [{
					title: '行业名称',
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
								let cless = params.row.children && params.row.children.length > 1 && i == (l - 1) ? 'ivu-icon fold-icon ivu-icon-android-arrow-dropright' : 'fold-space';
								tpl.push(h('i', {
									attrs: {
										level: params.level,
										index: params.index,
										children: JSON.stringify(params.row.children)
									},
									'class': {
										'fold-on': params.row.fold == 1,
										'ivu-icon fold-icon ivu-icon-android-arrow-dropright': params.row.children && i == (l - 1) && params.row.children.length > 0,
										'fold-space': !(params.row.children && i == (l - 1)) || params.row.children.length == 0
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
									id: params.row.id
								},
								on: {
									click: (e) => {
										this.modal = true;
										this.detailSpin = true;
										this.detailIng = true;
										this.getDetail(e.target.id);
									}
								}
							}, params.row.name)
						]);
					}
				},
				{
					title: '排序',
					key: 'sort',
					width: 90
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
										this.detailSpin = true;
										this.editIng = true;
										this.modalTitle = '编辑区域';
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
	created() {
		this.getDataList();
	},
	methods: {
		change(e) {
			console.log(e);
		},
		getDataList() {
			this.loading = true;
			this.API_getTreeDataList({
				tableName: this.tableName,
				isGetChild: '1'
			}).then(d => {
				this.tableData = d.treeData;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		getDetail(id) {
			this.API_treeDataById({
				id,
				tableName: this.tableName
			}).then(d => {
				this.detailSpin = false;
				this.$set(d, 'parentId', d.parent);
				this.tmpForm = Object.assign({}, d);
				this.tmpForm.tableName = this.tableName;
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			this.modalTitle = '新增区域';
			this.btnTxt = '新增';
			this.modal = true;
			delete this.modalForm.parent;
		},
		del() {
			this.delLoading = true;
			this.API_treeDataDel({
				id: this.infoId,
				tableName: this.tableName
			}).then(d => {
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
			delete this.modalForm.parent;
			delete this.tmpForm.parent;
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						if (this.editIng) {
							this.API_treeDataEdit(this.modalForm).then(d => {
								setTimeout(() => {
									this.$Message.success('保存成功!');
									this.btnLoading = false;
									this.modal = false;
									this.getDataList();
								}, 500);
							}).catch(e=>{
								this.btnLoading = false;
							});
						} else {
							this.API_treeDataAdd(this.modalForm).then(d => {
								setTimeout(() => {
									this.$Message.success('保存成功!');
									this.btnLoading = false;
									this.modal = false;
									this.getDataList();
								}, 500);
							}).catch(e=>{
								this.btnLoading = false;
							});
						}
					}
				} else {
					this.$Message.error('请正确填写表单项!');
					return false;
				}
			});
		},
		modalChange(visible) {
			if (!visible) {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.editIng = false;
				this.detailIng = false;
			}
		}
	}
}
</script>
