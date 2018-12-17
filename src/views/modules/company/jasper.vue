<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="entId" label="企业名称">
			<ent-picker v-model="form.entId" style="width:260px"></ent-picker>
		</FormItem>
		<FormItem prop="jasperName" label="JASPER登录名">
			<Input type="text" v-model="form.jasperName" clearable></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加JASPER账户</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" :class="{'detail-ing':detailIng}" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="140">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="entId" label="企业ID" v-show="modalTitle=='新增'" >
				<ent-picker v-model="modalForm.entId"></ent-picker>
			</FormItem>
			<FormItem v-if="modalTitle!='新增'" prop="entName" label="企业名称">
				<Input :readonly="detailIng || editIng" type="text" v-model="modalForm.entName" clearable></Input>
			</FormItem>
			<FormItem prop="jasperName" label="JASPER登录名">
				<Input :readonly="detailIng" type="text" v-model="modalForm.jasperName" clearable placeholder="请输入JASPER登录名"></Input>
			</FormItem>
			<FormItem prop="jasperPwd" label="JASPER登录密码">
				<Input :readonly="detailIng" type="text" v-model="modalForm.jasperPwd" clearable placeholder="请输入JASPER登录密码"></Input>
			</FormItem>
			<FormItem prop="accountId" label="JASPER账户ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.accountId" clearable placeholder="请输入JASPER账户ID"></Input>
			</FormItem>
			<FormItem prop="accountCode" label="运营商账户ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.accountCode" clearable placeholder="请输入运营商账户ID"></Input>
			</FormItem>
			<FormItem prop="licenseKey" label="SoapKey">
				<Input :readonly="detailIng" type="text" v-model="modalForm.licenseKey" clearable placeholder="请输入SoapKey"></Input>
			</FormItem>
			<FormItem prop="restKey" label="RestKey">
				<Input :readonly="detailIng" type="text" v-model="modalForm.restKey" clearable placeholder="请输入RestKey"></Input>
			</FormItem>
			<FormItem prop="payType" label="支付方式">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.payType" label="entJasperPayType"></dict-item>
			</FormItem>
			<FormItem prop="useMonth" label="承若最低在网时长">
				<Input :readonly="detailIng" type="text" v-model="modalForm.useMonth" clearable placeholder="请输入承若最低在网时长"></Input>
			</FormItem>
			<FormItem prop="cardGraceMonth" label="宽限期">
				<Input :readonly="detailIng" type="text" v-model="modalForm.cardGraceMonth" clearable placeholder="请输入宽限期"></Input>
			</FormItem>
			<FormItem prop="remarks" label="备注">
				<Input :readonly="detailIng" v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="请输入备注"></Input>
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
import dictItem from '@/views/my-components/custom/dict-item'
import entPicker from '@/views/my-components/custom/ent-picker'

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		entPicker
	},
	data() {
		return {
			form: {
				entName: '',
				jasperName: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				entId: '',
				jasperName: '',
				jasperPwd: '',
				accountId: '',
				accountCode: '',
				licenseKey: '',
				restKey: '',
				payType: '',
				useMonth: '',
				cardGraceMonth: '',
				remarks: ''
			},
			tmpForm: {},
			rules: {
				entId: [{
					required: true,
					message: '企业ID为必填项',
					trigger: 'blur'
				}],
				jasperName: [{
					required: true,
					message: 'JASPER登录名为必填项',
					trigger: 'blur'
				}],
				jasperPwd: [{
					required: true,
					message: 'JASPER登录密码为必填项',
					trigger: 'blur'
				}],
				accountId: [{
					required: true,
					message: 'JASPER账户ID为必填项',
					trigger: 'blur'
				}],
				accountCode: [{
					required: true,
					message: '运营商账户ID为必填项',
					trigger: 'blur'
				}],
				licenseKey: [{
					required: true,
					message: 'SoapKey为必填项',
					trigger: 'blur'
				}],
				restKey: [{
					required: true,
					message: 'RestKey为必填项',
					trigger: 'blur'
				}],
				payType: [{
					required: true,
					message: '支付方式为必填项',
					trigger: 'blur'
				}],
				useMonth: [{
					required: true,
					message: '承若最低在网时长为必填项',
					trigger: 'blur'
				}],
				cardGraceMonth: [{
					required: true,
					message: '宽限期为必填项',
					trigger: 'blur'
				}],
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增单表',
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
					title: '企业名称',
					key: 'entName',
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
						}, params.row.entName);
					}
				},
				{
					title: 'JASPER登录名',
					key: 'jasperName',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.jasperName
							}
						}, params.row.jasperName);
					}
				},
				{
					title: 'JASPER账户ID',
					key: 'accountId',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.accountId
							}
						}, params.row.accountId);
					}
				},
				{
					title: '运营商账户ID',
					key: 'accountCode',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.accountCode
							}
						}, params.row.accountCode);
					}
				},
				{
					title: '支付方式',
					key: 'payType',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.payTypeMap.label
							}
						}, params.row.payTypeMap.label);
					}
				},
				{
					title: '创建时间',
					key: 'createDate',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.createTime)
							}
						}, this.$filter.date(params.row.createTime));
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
			this.API_qryList('/a/ent/jasper/qryEntJasperListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/ent/jasper/qryEntJasperById', id).then(d => {
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
			this.API_delInfo("/a/ent/jasper/deleteEntJasper", this.infoId).then(d => {
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
						this.API_savaInfo("/a/ent/jasper/saveEntJasper", this.modalForm).then(d => {
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
