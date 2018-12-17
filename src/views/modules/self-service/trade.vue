<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="batchId" label="批次号">
			<Input type="text" v-model="form.batchId" clearable></Input>
		</FormItem>
		<FormItem prop="type" label="业务类型">
			<dict-item style="width:120px;" v-model="form.type" label="TRADE_TYPE"></dict-item>
		</FormItem>
		<FormItem prop="state" label="订单状态">
			<dict-item style="width:120px;" v-model="form.state" label="TRADE_STATE"></dict-item>
		</FormItem>
		<FormItem prop="payState" label="支付状态">
			<dict-item style="width:120px;" v-model="form.payState" label="TRADE_PAY_STATE"></dict-item>
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
				batchId: '',
				type: '',
				state: '',
				payState: '',
			},
			queryForm: null,
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			tableData: [],
			tableColumns: [{
					title: '流水号',
					key: 'id',
				},
				{
					title: '业务类型',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.typeMap.value
							}
						}, params.row.typeMap.value);
					}
				},
				{
					title: '订单状态',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.stateMap.value
							}
						}, params.row.stateMap.value);
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
			this.API_qryList('/a/trade/trade/qryTradeListByCon', queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
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
