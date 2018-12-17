<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="ratePlanName" label="资费计划名称">
			<Input type="text" v-model="form.ratePlanName" clearable></Input>
		</FormItem>
		<FormItem prop="versionId" label="版本ID">
			<Input type="text" v-model="form.versionId" clearable></Input>
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
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="120">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="ratePlanId" label="资费计划ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.ratePlanId" clearable placeholder="请输入资费计划ID"></Input>
			</FormItem>
			<FormItem prop="ratePlanName" label="资费计划名称">
				<Input :readonly="detailIng" type="text" v-model="modalForm.ratePlanName" clearable placeholder="请输入资费计划名称"></Input>
			</FormItem>
			<FormItem prop="versionId" label="版本ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.versionId" clearable placeholder="请输入版本ID"></Input>
			</FormItem>
			<FormItem prop="accountName" label="账户名称">
				<Input :readonly="detailIng" type="text" v-model="modalForm.accountName" clearable placeholder="请输入账户名称"></Input>
			</FormItem>
			<FormItem prop="perCharge" label="每个订户收费">
				<Input :readonly="detailIng" type="text" v-model="modalForm.perCharge" clearable placeholder="请输入每个订户收费"></Input>
			</FormItem>
			<FormItem prop="accountFee" label="账户费用">
				<Input :readonly="detailIng" type="text" v-model="modalForm.accountFee" clearable placeholder="请输入账户费用"></Input>
			</FormItem>
			<FormItem prop="plannedFlow" label="计划内流量(MB)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.plannedFlow" clearable placeholder="请输入计划内流量（MB）"></Input>
			</FormItem>
			<FormItem prop="useLimit" label="用量限额(MB)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.useLimit" clearable placeholder="请输入用量限额（MB）"></Input>
			</FormItem>
			<FormItem prop="defaultPlan" label="默认计划">
				<dict-item :disabled="detailIng" v-model="modalForm.defaultPlan" label="DEFAULT_PLAN" type="radio"></dict-item>
			</FormItem>
			<FormItem prop="planType" label="计划类型">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.planType" label="PLAN_TYPE"></dict-item>
			</FormItem>
			<FormItem prop="payType" label="付款方式">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.payType" label="PAY_TYPE"></dict-item>
			</FormItem>
			<FormItem prop="isShare" label="是否共享">
				<dict-item :disabled="detailIng" v-model="modalForm.isShare" label="IS_SHARE" type="radio"></dict-item>
			</FormItem>
			<FormItem prop="netType" label="网络类型">
				<dict-item :disabled="detailIng" v-model="modalForm.netType" label="NET_TYPE" type="radio"></dict-item>
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
				ratePlanName: '',
				versionId: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				ratePlanId: '',
				ratePlanName: '',
				versionId: '',
				accountName: '',
				perCharge: '',
				accountFee: '',
				plannedFlow: '',
				useLimit: '',
				defaultPlan: '',
				planType: '',
				payType: '',
				isShare: '',
				netType: '',
				dataFlowOverResourceUnit: '',
				dataFlowOverResource: '',
				dataFlowOverPriceUnit: ''
			},
			tmpForm: {},
			rules: {},
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
					title: '资费计划ID',
					key: 'ratePlanId',
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
						}, params.row.ratePlanId);
					}
				},
				{
					title: '资费计划名称',
					key: 'ratePlanName',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.ratePlanName
							}
						}, params.row.ratePlanName);
					}
				},
				{
					title: '版本ID',
					key: 'versionId',
					width: 120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.versionId
							}
						}, params.row.versionId);
					}
				},
				{
					title: '账户名称',
					key: 'accountName',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.accountName
							}
						}, params.row.accountName);
					}
				},
				{
					title: '每个订户收费',
					key: 'perCharge',
					width: 125,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.perCharge
							}
						}, params.row.perCharge);
					}
				},
				{
					title: '账户费用',
					key: 'accountFee',
					width: 100,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.accountFee
							}
						}, params.row.accountFee);
					}
				},
				{
					title: '计划内流量(MB)',
					key: 'plannedFlow',
					width: 140,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.plannedFlow
							}
						}, params.row.plannedFlow);
					}
				},
				{
					title: '用量限额(MB)',
					key: 'useLimit',
					width: 130,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.useLimit
							}
						}, params.row.useLimit);
					}
				},
				{
					title: '默认计划',
					key: 'defaultPlan',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.defaultPlanMap.value
							}
						}, params.row.defaultPlanMap.value);
					}
				},
				{
					title: '计划类型',
					key: 'planType',
					width: 130,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.planTypeMap.value
							}
						}, params.row.planTypeMap.value);
					}
				},
				{
					title: '付款方式',
					key: 'payType',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.payTypeMap.value
							}
						}, params.row.payTypeMap.value);
					}
				},
				{
					title: '是否共享',
					key: 'isShare',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.isShareMap.value
							}
						}, params.row.isShareMap.value);
					}
				},
				{
					title: '网络类型',
					key: 'netType',
					width: 100,
					align: 'center',
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
			this.API_qryList('/a/rateplanversion/tdBRatePlanVersion/qryTdBRatePlanVersionListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/rateplanversion/tdBRatePlanVersion/qryTdBRatePlanVersionById', id).then(d => {
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
			this.API_delInfo("/a/rateplanversion/tdBRatePlanVersion/deleteTdBRatePlanVersion", this.infoId).then(d => {
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
						this.API_savaInfo("/a/rateplanversion/tdBRatePlanVersion/saveTdBRatePlanVersion", this.modalForm).then(d => {
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
