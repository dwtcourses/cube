<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="templateName" label="模板名称">
			<Input type="text" v-model="form.templateName" clearable></Input>
		</FormItem>
		<FormItem prop="custId" label="客户编码">
			<Input type="text" v-model="form.custId" clearable></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加模板</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="110">
			<FormItem prop="id" label="id" class="fn-hide" v-if="editIng">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="templateId" label="模板ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.templateId" clearable placeholder="请输入模板ID"></Input>
			</FormItem>
			<FormItem prop="templateName" label="模板名称">
				<Input :readonly="detailIng" type="text" v-model="modalForm.templateName" clearable placeholder="请输入模板名称"></Input>
			</FormItem>
			<FormItem prop="jasperCode" label="JASPER编码">
				<Input :readonly="detailIng" type="text" v-model="modalForm.jasperCode" clearable placeholder="请输入JASPER通讯计划编码"></Input>
			</FormItem>
			<FormItem prop="jasperId" label="JASPERID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.jasperId" clearable placeholder="请输入JASPER通讯计划ID"></Input>
			</FormItem>
			<FormItem prop="commAuthority" label="通讯权限">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.commAuthority" label="COMM_AUTHORITY"></dict-item>
			</FormItem>
			<FormItem prop="netType" label="网络类型">
				<dict-item :disabled="detailIng" v-model="modalForm.netType" label="NET_TYPE" type="radio"></dict-item>
			</FormItem>
			<FormItem prop="custId" label="客户编码">
				<Input :readonly="detailIng" type="text" v-model="modalForm.custId" clearable placeholder="请输入客户编码"></Input>
			</FormItem>
			<FormItem prop="apnCode" label="APN编码" v-if="modalForm.netType=='0'">
				<Input :readonly="detailIng" type="text" v-model="modalForm.apnCode" clearable placeholder="请输入APN编码"></Input>
			</FormItem>
			<FormItem prop="templateDescription" label="模板描述">
				<Input :readonly="detailIng" type="textarea" v-model="modalForm.templateDescription" clearable placeholder="请输入模板描述"></Input>
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

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		treeSelect
	},
	data() {
		return {
			form: {
				templateName: '',
				custId: ''
			},
			queryForm: null,
			modalForm: {
				templateId: '',
				templateName: '',
				commAuthority: '',
				netType: '',
				custId: '',
				apnCode: '',
				jasperCode: '',
				jasperId: '',
				templateDescription: ''
			},
			tmpForm: {},
			rules: {
				templateId: [{
					required: true,
					message: '模板Id为必填项',
					trigger: 'blur'
				}],
				templateName: [{
					required: true,
					message: '模板名称为必填项',
					trigger: 'blur'
				}],
				commAuthority: [{
					required: true,
					message: '通讯权限为必填项',
					trigger: 'blur'
				}],
				netType: [{
					required: true,
					message: '网络类型为必填项',
					trigger: 'blur'
				}],
				jasperCode: [{
					required: true,
					message: 'JASPER编码为必填项',
					trigger: 'blur'
				}],
				jasperId: [{
					required: true,
					message: 'JASPERID为必填项',
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增',
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
			tableData: [],
			tableColumns: [{
					title: '模板名称',
					key: 'templateName',
					render: (h, params) => {
						return h('a', {
							class: 'link',
							attrs: {
								id: params.row.id
							},
							on: {
								click: (e) => {
									this.modal = true;
									this.modalTitle = '详情';
									this.detailIng = true;
									this.detailSpin = true;
									this.getDetail(e.target.id);
								}
							}
						}, params.row.templateName);
					}
				},
				{
					title: '通讯权限',
					key: 'commAuthority',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.commAuthorityMap.value
							}
						}, params.row.commAuthorityMap.value);
					}
				},
				{
					title: '网络类型',
					key: 'netType',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.netTypeMap.value
							}
						}, params.row.netTypeMap.value);
					}
				},
				{
					title: '客户编码',
					key: 'custId',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.custId
							}
						}, params.row.custId);
					}
				},
				{
					title: '创建日期',
					key: 'startDate',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.startDate
							}
						}, params.row.startDate);
					}
				},
				{
					title: '结束日期',
					key: 'endDate',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.endDate
							}
						}, params.row.endDate);
					}
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
										this.detailSpin = true;
										this.modal = true;
										this.modalTitle = '编辑';
										this.btnTxt = '保存';
										this.editIng = true;
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
			this.API_qryList('/a/template/tdBTemplate/qryTdBTemplateListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/template/tdBTemplate/qryTdBTemplateById', id).then(d => {
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			console.log(e);
			this.modalTitle = '新增';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_delInfo("/a/template/tdBTemplate/deleteTdBTemplate", this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
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
						this.API_savaInfo("/a/template/tdBTemplate/saveTdBTemplate", this.modalForm).then(d => {
							console.log(d);
							setTimeout(() => {
								this.$Message.success('保存成功!');
								this.btnLoading = false;
								this.modal = false;
								this.getDataList();
							}, 500);
						}).catch(e => {
							setTimeout(() => {
								this.$Message.error('保存失败请重试!');
								this.btnLoading = false;
							}, 500);
						});
					}
				} else {
					this.$Message.error('请正确填写表单!');
					return false;
				}
			});
		},
		modalCancel() {

		},
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.editIng = false;
				this.detailIng = false;
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
