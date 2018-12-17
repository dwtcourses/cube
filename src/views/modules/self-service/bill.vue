<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="cycleId" label="账期">
			<Input type="text" v-model="form.cycleId" clearable></Input>
		</FormItem>
		<FormItem prop="billPayTag" label="销账标志">
			<dict-item style="width:120px" v-model="form.billPayTag" label="billPayTag"></dict-item>
		</FormItem>
		<FormItem prop="entId" label="企业名称">
			<Input type="text" v-model="form.entId" clearable></Input>
		</FormItem>
		<FormItem prop="itemId" label="账目名称">
			<Input type="text" v-model="form.itemId" clearable></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
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
				cycleId: '',
				billPayTag: '',
				entId: '',
				itemId: ''
			},
			queryForm: null,
			modalForm: {
				eparchyCode: '',
				cityCode: '',
				msisdn: '',
				iccid: '',
				billId: '',
				acctId: '',
				itemId: '',
				cycleId: '',
				createTime: '',
				canpayTag: '',
				billPayTag: '',
				payTag: '',
				versionNo: '',
				updateTime: '',
				fee: '',
				balance: '',
				printFee: ''
			},
			tmpForm: {},
			rules: {
				billId: [{
					required: true,
					message: '账单标识为必填项',
					trigger: 'blur'
				}]
			},
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				// {
				// 	title: 'MSISDN',
				// 	key: 'msisdn',
				// },
				{
					title: 'ICCID',
					key: 'iccid',
				},
				// {
				// 	title: '账单标识',
				// 	key: 'billId',
				// },
				{
					title: '账户标识',
					key: 'acctId',
				},
				{
					title: '账期',
					key: 'cycleId',
					width: 90,
					align: 'center',
				},
				{
					title: '账目名称',
					key: 'itemName',
				},
				{
					title: '企业名称',
					key: 'entName',
				},
				// {
				// 	title: '省份',
				// 	key: 'eparchyName',
				// 	width: 100,
				// 	align: 'center',
				// },
				// {
				// 	title: '城市',
				// 	key: 'cityName',
				// 	width: 100,
				// 	align: 'center',
				// },
				{
					title: '创建时间',
					key: 'createTime',
					width: 120,
					align: 'center',
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
					title: '账单类型',
					key: 'canpayTag',
					width: 100,
					align: 'center',
				},
				{
					title: '销账标志',
					key: 'billPayTag',
					width: 100,
					align: 'center',
				},
				// {
				// 	title: '更新时间',
				// 	key: 'updateTime',
				// 	width: 120,
				// 	align: 'center',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			'class': 'fn-text-overflow',
				// 			attrs: {
				// 				title: this.$filter.date(params.row.updateTime)
				// 			}
				// 		}, this.$filter.date(params.row.updateTime));
				// 	}
				// },
				{
					title: '账目金额',
					key: 'fee',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.fee), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.fee), '￥'));
					}
				},
				{
					title: '账目余额',
					key: 'balance',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.balance), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.balance), '￥'));
					}
				},
				// {
				// 	title: '打印金额',
				// 	key: 'printFee',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			'class': 'fn-text-overflow',
				// 			attrs: {
				// 				title: this.$filter.currency(this.$filter.fen2yuan(params.row.printFee), '￥')
				// 			}
				// 		}, this.$filter.currency(this.$filter.fen2yuan(params.row.printFee), '￥'));
				// 	}
				// },
			]
		}
	},
	created() {
		this.getDataList();
	},
	methods: {
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/bill/bill/qryBillListByCon', queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		getDetail(id) {
			this.API_qryInfoById('/a/bill/bill/qryBillById', id).then(d => {
				d.user.id = d.user.id ? d.user.id.id : null;
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		changePage(page) {
			console.log(page);
			this.currPage = page;
			this.getDataList();
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
<style lang="less" scoped>
	.query-form{
		margin-bottom: 10px;
	}
</style>
