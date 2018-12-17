<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="id" label="ICCID">
			<Input type="text" v-model="form.id" clearable></Input>
		</FormItem>
		<FormItem prop="msisdn" label="MSISDN">
			<Input type="text" v-model="form.msisdn" clearable></Input>
		</FormItem>
		<FormItem prop="imsi" label="IMSI">
			<Input type="text" v-model="form.imsi" clearable></Input>
		</FormItem>
		<FormItem prop="state" label="卡状态">
			<dict-item v-model="form.state" style="width:120px" label="CARD_STATE"></dict-item>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<Table ref="table" @on-selection-change="selectionChange" border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div class="tool-bar">
			<div class="btns-wrapper">
				<Button type="primary" @click="stateChange">状态变更</Button>
				<Button type="success" @click="productChange" :loading="productChangeLoading">产品变更</Button>
			</div>
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="stateModal" title="状态变更" @on-visible-change="stateModalChange">
		<Form ref="stateChangeForm" :model="stateChangeForm" :label-width="80" :rules="stateChangeRules">
			<FormItem prop="state" label="卡状态">
				<dict-item v-model="stateChangeForm.state" label="CARD_STATE"></dict-item>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="stateChangeDone" :loading="stateChangeLoading">确认</Button>
		</div>
	</Modal>
	<Modal v-model="productModal" title="产品变更" @on-visible-change="productModalChange">
		<Form ref="productChangeForm" :model="productChangeForm" :label-width="80" :rules="productChangeRules">
			<FormItem prop="prodId" label="产品">
				<Select v-model="productChangeForm.prodId">
					<Option v-for="item in productList" :value="item.productId" :key="item.productId">{{item.productName}}</Option>
				</Select>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="productChangeDone" :loading="productChangeLoading">确认</Button>
		</div>
	</Modal>
</div>
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'

import tools from '@/libs/tools.js'


export default {
	components: {
		dictItem,
	},
	data() {
		return {
			form: {
				id: '',
				msisdn: '',
				imsi: '',
				state: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				msisdn: '',
				imsi: '',
				user: '',
				accountId: '',
				state: '',
				ratePlanId: '',
				commPlanId: '',
				storageId: '',
				mealState: '',
				activateTime: '',
				latestActivateTime: '',
				flowShare: '',
				impId: '',
				inTime: '',
				outTime: '',
				remarks: '',
				sourceStr: '',
				simId: '',
				type: ''
			},
			tmpForm: {},
			stateChangeRules: {
				state: [{
					required: true,
					message: '卡状态为必填项',
					trigger: 'change'
				}]
			},
			productChangeRules: {
				prodId: [{
					required: true,
					message: '产品为必填项',
					trigger: 'change'
				}]
			},
			stateChangeForm: {
				id: [],
				state: ''
			},
			productChangeForm: {
				id: [],
				prodId: ''
			},
			stateModal: false,
			productModal: false,
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			stateChangeLoading: false,
			productChangeLoading: false,
			tableData: [],
			productList: [],
			tableColumns: [{
					type: 'selection',
					width: 60,
					align: 'center'
				}, {
					title: 'ICCID',
					key: 'id',
				},
				{
					title: 'MSISDN',
					key: 'msisdn',
				},
				{
					title: 'IMSI',
					key: 'imsi',
				},
				{
					title: '卡状态',
					key: null,
					width:80,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.stateMap.value
							}
						}, params.row.stateMap.value);
					}
				},
				{
					title: '激活时间',
					key: 'activateTime',
					width:120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.activateTime)
							}
						}, this.$filter.date(params.row.activateTime));
					}
				},
				{
					title: '入库时间',
					key: 'inTime',
					width:120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.inTime)
							}
						}, this.$filter.date(params.row.inTime));
					}
				},
				{
					title: '出库时间',
					key: 'outTime',
					width:120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.outTime)
							}
						}, this.$filter.date(params.row.outTime));
					}
				},
			]
		}
	},
	created() {
		this.getDataList();
		this.qryTdProductList();
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
			this.API_qryList('/a/card/card/qryCardListByCon', queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		changePage(page) {
			this.currPage = page;
			this.getDataList();
		},
		stateModalChange(visible) {
			if (!visible) {
				this.$refs.stateChangeForm.resetFields();
			}
		},
		productModalChange(visible) {
			if (!visible) {
				this.$refs.productChangeForm.resetFields();
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
		},
		qryTdProductList() {
			let queryParam = Object.assign({
				currPage: 1,
				pageSize: 999
			});
			this.API_qryList('/a/product/tdBProduct/qryTdBProductListBySaleCon', queryParam).then(d => {
				this.productList = d.page.list;
			})
		},
		selectionChange(s) {
			let id = [];
			for (let item of s) {
				id.push(item.id);
			};
			this.stateChangeForm.id = id;
			this.productChangeForm.id = id;
		},
		stateChange() {
			if (this.stateChangeForm.id.length == 0) {
				this.$Message.warning('请至少选择一项');
			} else {
				this.stateModal = true;
			}
		},
		stateChangeDone() {
			this.$refs.stateChangeForm.validate((valid) => {
				if (valid) {
					this.stateChangeLoading = true;
					this.API_setState(this.stateChangeForm).then(d => {
						this.stateChangeLoading = false;
						this.$Message.success('状态变更成功');
						this.stateModal = false;
						this.$refs.table.selectAll(false);
					});
				}
			});

		},
		productChange() {
			if (this.productChangeForm.id.length == 0) {
				this.$Message.warning('请至少选择一项');
			} else {
				this.productModal = true;
			}
		},
		productChangeDone() {
			this.$refs.productChangeForm.validate((valid) => {
				if (valid) {
					this.productChangeLoading = true;
					this.API_setCardProd(this.productChangeForm).then(d => {
						this.productChangeLoading = false;
						this.$Message.success('产品变更成功');
						this.productModal = false;
						this.$refs.table.selectAll(false);
					});
				}
			});
		}
	}
}
</script>
<style lang="less" scoped>
.query-form {
    margin-bottom: 10px;
}
.tool-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
