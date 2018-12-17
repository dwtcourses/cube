<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="prodId" label="订单号">
			<Input type="text" v-model="form.tradeId" clearable></Input>
		</FormItem>
		<!-- <FormItem prop="createDate" label="创建时间">
			<DatePicker :editable="false" :value="form.createDate" format="yyyy-MM-dd" type="date" @on-change="form.createDate=$event" placeholder="选择创建时间日期"></DatePicker>
		</FormItem> -->
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
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="tradeId" label="主表ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.tradeId" clearable placeholder="请输入主表ID"></Input>
			</FormItem>
			<FormItem prop="prodId" label="产品ID">
				<Input :readonly="detailIng" type="text" v-model="modalForm.prodId" clearable placeholder="请输入产品ID"></Input>
			</FormItem>
			<FormItem prop="salesObject" label="销售对象">
				<Input :readonly="detailIng" type="text" v-model="modalForm.salesObject" clearable placeholder="请输入销售对象"></Input>
			</FormItem>
			<FormItem prop="type" label="规格">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.type" label="CARD_TYPE"></dict-item>
			</FormItem>
			<FormItem prop="price" label="单价">
				<Input :readonly="detailIng" type="text" v-model="modalForm.price" clearable placeholder="请输入单价"></Input>
			</FormItem>
			<FormItem prop="num" label="数量">
				<Input :readonly="detailIng" type="text" v-model="modalForm.num" clearable placeholder="请输入数量"></Input>
			</FormItem>
			<FormItem prop="totalPrice" label="总价">
				<Input :readonly="detailIng" type="text" v-model="modalForm.totalPrice" clearable placeholder="请输入总价"></Input>
			</FormItem>
			<FormItem prop="beginTime" label="开始时间">
				<DatePicker :readonly="detailIng" :editable="false" :value="modalForm.beginTime" format="yyyy-MM-dd" type="date" @on-change="modalForm.beginTime=$event" placeholder="选择开始时间开始日期"></DatePicker>
			</FormItem>
			<FormItem prop="endTime" label="结束时间">
				<DatePicker :readonly="detailIng" :editable="false" :value="modalForm.endTime" format="yyyy-MM-dd" type="date" @on-change="modalForm.endTime=$event" placeholder="选择结束时间开始日期"></DatePicker>
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
				tradeId: '',
			},
			queryForm: null,
			modalForm: {
				id: '',
				tradeId: '',
				prodId: '',
				salesObject: '',
				type: '',
				price: '',
				num: '',
				totalPrice: '',
				beginTime: '',
				endTime: '',
				remarks: ''
			},
			tmpForm: {},
			rules: {},
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
					title: '订单号',
					key: 'tradeId',
				},
				{
					title: '产品',
					key: 'prodName',
				},
				{
					title: '销售对象',
					key: 'salesObjectName',
					width: 160,
					align: 'center',
				},
				{
					title: '规格',
					width: 120,
					align: 'center',
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
					title: '单价',
					key: 'price',
					width: 160,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.price), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.price), '￥'));
					}
				},
				{
					title: '数量',
					key: null,
					width: 80,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.num
							}
						}, params.row.num);
					}
				},
				{
					title: '总价',
					width: 160,
					align: 'center',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.totalPrice), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.totalPrice), '￥'));
					}
				},
				{
					title: '状态',
					width: 100,
					align: 'center',
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
					title: '配卡状态',
					width: 100,
					align: 'center',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.allotStateMap.value
							}
						}, params.row.allotStateMap.value);
					}
				},
				{
					title: '配卡状态',
					width: 100,
					align: 'center',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.allotStateMap.value
							}
						}, params.row.allotStateMap.value);
					}
				},
				{
					title: '操作',
					width: 100,
					align: 'center',
					key: null,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'success',
									size: 'small'
								},
								attrs: {
									id: params.row.tradeId
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.goAllotCard(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '配卡'),
						])
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
			this.API_qryList('/a/trade/tradeSale/qryTradeSaleListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/trade/tradeSale/qryTradeSaleById', id).then(d => {
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			console.log(e);
			this.modalTitle = '新增单表';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_delInfo("/a/trade/tradeSale/deleteTradeSale", this.infoId).then(d => {
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
						this.API_savaInfo("/a/trade/tradeSale/saveTradeSale", this.modalForm).then(d => {
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
		goAllotCard(id) {
			this.$router.push({
				name: 'sell-card-index',
				params: {
					tradeId: id
				}
			})
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
<style lang="less" scoped>
.query-form {
    margin-bottom: 10px;
}
</style>
