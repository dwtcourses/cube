<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="logisticId" label="物流订单id">
			<Input type="text" v-model="form.logisticId" clearable></Input>
		</FormItem>
		<FormItem prop="type" label="类型">
			<dict-item style="width:120px" v-model="form.type" label="LOGISTICS_TYPE"></dict-item>
		</FormItem>
		<FormItem prop="state" label="状态">
			<dict-item v-model="form.state" label="LOGISTICS_STATE"></dict-item>
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
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem prop="logisticId" label="物流订单号">
				<Input :readonly="detailIng" type="text" v-model="modalForm.logisticId" clearable placeholder="请输入物流订单"></Input>
			</FormItem>
			<FormItem prop="state" label="状态">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.state" label="LOGISTICS_STATE"></dict-item>
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
				logisticId: '',
				type: '',
				state: '',
			},
			queryForm: null,
			modalForm: {
				id: '',
				logisticId: '',
				state: '',
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
					title: '流水号',
					key: 'id',
				},
				{
					title: '订单号',
					key: 'tradeId',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.tradeId
							}
						}, params.row.tradeId);
					}
				},
				{
					title: '物流订单',
					key: 'logisticId',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.logisticId
							}
						}, params.row.logisticId);
					}
				},
				{
					title: '物流公司',
					key: 'logisticCompany',
					width: 100,
					align: 'center',
				},
				{
					title: '类型',
					key: 'typeLabel',
					width: 100,
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
					title: '状态',
					key: 'stateLabel',
					width: 80,
					align: 'center',
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
					title: '操作',
					key: null,
					width: 80,
					align: 'center',
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
			this.API_qryList('/a/trade/tradeLogistics/qryTradeLogisticsListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/trade/tradeLogistics/qryTradeLogisticsById', id).then(d => {
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
			this.API_delInfo("/a/trade/tradeLogistics/deleteTradeLogistics", this.infoId).then(d => {
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
						this.API_savaInfo("/a/trade/tradeLogistics/saveTradeLogistics", this.modalForm).then(d => {
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
<style lang="less" scoped>
	.query-form{
		margin-bottom: 10px;
	}
</style>
