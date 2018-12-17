<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="type" label="类型">
			<dict-type ref="dictType" v-model="form.type" style="width:300px"></dict-type>
		</FormItem>
		<FormItem prop="description" label="描述">
			<Input type="text" v-model="form.description" placeholder="请输入描述" clearable></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加字典</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :page-size="pageSize" :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="value" label="键值">
				<Input type="text" v-model="modalForm.value" placeholder="请输入键值" clearable></Input>
			</FormItem>
			<FormItem prop="label" label="标签">
				<Input type="text" v-model="modalForm.label" placeholder="请输入标签" clearable></Input>
			</FormItem>
			<FormItem prop="type" label="类型">
				<Input type="text" v-model="modalForm.type" placeholder="请输入类型" clearable></Input>
			</FormItem>
			<FormItem prop="description" label="描述">
				<Input type="text" v-model="modalForm.description" placeholder="请输入描述" clearable></Input>
			</FormItem>
			<FormItem prop="sort" label="排序">
				<Input type="text" v-model="modalForm.sort" placeholder="请输入排序" clearable></Input>
			</FormItem>
			<FormItem prop="remarks" label="备注">
				<Input v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="输入备注..."></Input>
			</FormItem>
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
import treeDropdown from '@/views/my-components/tree-dropdown/tree-dropdown'
import dictType from '@/views/my-components/custom/dict-type'

import tools from '@/libs/tools.js'


export default {
	components: {
		treeDropdown,
		dictType
	},
	data() {
		return {
			form: {
				type: '',
				description: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				value: '',
				label: '',
				type: '',
				description: '',
				sort: '10',
				remarks: ''
			},
			tmpForm: {},
			rules: {
				value: [{
					required: true,
					message: '键值为必填项',
					trigger: 'blur'
				}],
				label: [{
					required: true,
					message: '标签为必填项',
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: '类型为必填项',
					trigger: 'blur'
				}],
				description: [{
					required: true,
					message: '描述为必填项',
					trigger: 'blur'
				}],
				sort: [{
						required: true,
						message: '排序为必填项',
						trigger: 'blur'
					},
					{
						type: 'number',
						message: '排序必须是数字',
						trigger: 'blur',
						transform(value) {
							return Number(value);
						}
					}
				]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增字典',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			tableData: [],
			tableColumns: [{
					title: '键值',
					key: 'value'
				},
				{
					title: '标签',
					key: 'label'
				},
				{
					title: '类型',
					key: 'type'
				},
				{
					title: '描述',
					key: 'description'
				},
				{
					title: '排序',
					key: 'sort'
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
	created() {
		this.getDataList();
	},
	methods: {
		change(e) {
			console.log(e);
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryDictList(queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		inDateChange(e) {
			console.log(e);
		},
		getDetail(id) {
			this.API_getDictById(id).then(d => {
				d.sort = d.sort.toString();
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			this.modalTitle = '新增字典';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			this.API_deleteDict(this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
				this.$refs.dictType.getData();
			});
		},
		changePage(page) {
			console.log(page);
			this.currPage = page;
			this.getDataList();
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
						this.API_saveDict(this.modalForm).then(d => {
							console.log(d);
							setTimeout(() => {
								this.$Message.success(this.btnTxt + '成功!');
								this.btnLoading = false;
								this.modal = false;
								this.getDataList();
								this.$refs.dictType.getData();
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
				console.log(this.modalForm);
			} else {
				this.tmpForm = {};
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
