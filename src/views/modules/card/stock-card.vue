<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="beginCard" label="起始卡号">
			<Input type="text" v-model="form.beginCard" clearable placeholder="请输入起始卡号" style="width:240px"></Input>
		</FormItem>
		<FormItem prop="endCard" label="结束卡号">
			<Input type="text" v-model="form.endCard" clearable placeholder="请输入结束卡号" style="width:240px"></Input>
		</FormItem>
		<FormItem prop="inTime" label="入库时间">
			<DatePicker type="date" placeholder="请选择入库时间" v-model="form.inTime"></DatePicker>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<Table ref="table" border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
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
				beginCard: '',
			    endCard: '',
			    inTime: '',
			},
			queryForm: null,
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			tableData: [],
			productList: [],
			tableColumns: [{
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
					width: 80,
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
					title: '入库时间',
					key: 'inTime',
					width: 120,
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
			this.API_qryList('/a/card/card/qryStockCard', queryParam).then(d => {
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
		query(name) {
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
	}
}
</script>
<style lang="less" scoped>
.query-form {
    margin-bottom: 10px;
}
</style>
