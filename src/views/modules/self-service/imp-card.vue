<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="state" label="状态">
			<dict-item style="width:120px" v-model="form.state" label="IMP_STATE"></dict-item>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">一键导卡</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" title="一键导卡" @on-ok="modalEdit" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="storageId" label="库位">
				<Select v-model="modalForm.storageId">
					<Option v-for="item in storageList" :value="item.id" :key="item.value">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem prop="type" label="卡类型">
				<dict-item :transfer="true" v-model="modalForm.type" label="CARD_TYPE"></dict-item>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="modalEdit" :loading="btnLoading">确认导卡</Button>
		</div>
	</Modal>
</div>
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'

export default {
	components: {
		dictItem,
	},
	data() {
		return {
			form: {
				state: '',
			},
			queryForm: null,
			modalForm: {
				storageId: '',
				type: '',
			},
			tmpForm: {},
			modal: false,
			rules: {
				storageId: [{
					required: true,
					message: '库位为必填项',
					trigger: 'change'
				}],
				type: [{
					required: true,
					message: '卡类型为必填项',
					trigger: 'change'
				}]
			},
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			storageList: [],
			tableData: [],
			tableColumns: [{
					title: '流水号',
					key: 'id',
				},
				{
					title: '账户ID',
					key: 'accountId',
				},
				{
					title: '状态',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.stateMap.value
							}
						}, params.row.stateMap.value);
					}
				},
				{
					title: '导入数量',
					key: 'num',
				},
				{
					title: '开始时间',
					key: 'beginTime',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.beginTime)
							}
						}, this.$filter.date(params.row.beginTime));
					}
				},
				{
					title: '完成时间',
					key: 'finishTime',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.finishTime)
							}
						}, this.$filter.date(params.row.finishTime));
					}
				},
			]
		}
	},
	created() {
		this.getDataList();
		this.qryStorageList();
	},
	methods: {
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/trade/impCard/qryImpCardListByCon', queryParam).then(d => {
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		add(e) {
			this.modal = true;
		},
		changePage(page) {
			this.currPage = page;
			this.getDataList();
		},
		modalEdit() {
			delete this.modalForm['__ob__'];
			delete this.tmpForm['__ob__'];
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					this.API_savaInfo("/a/trade/impCard/saveImpCard", this.modalForm).then(d => {
						setTimeout(() => {
							this.$Message.success('导卡成功!');
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
				} else {
					this.$Message.error('请正确填写表单!');
					return false;
				}
			});
		},
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
			}
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
		qryStorageList() {
			this.API_qryList('/a/card/storage/qryStorageListByCon', {
				currPage: 1,
				pageSize: 100
			}).then(d => {
				this.storageList = d.page.list;
			})
		}

	}
}
</script>
