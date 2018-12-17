<template>
<div>
	<div class="account-info">账户余额:<span class="amount"><i>{{balance | fen2yuan | currency('￥')}}</i>元</span><Button type="success" @click="charge">充值</Button></div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" title="充值">
		<Form ref="chargeForm" :model="chargeForm" :rules="rules" :label-width="80">
			<FormItem prop="entId" label="充值企业">
				<ent-picker v-model="chargeForm.entId"></ent-picker>
			</FormItem>
			<FormItem prop="fee" label="充值金额">
				<Input type="text" v-model="chargeForm.fee" placeholder="请输入充值金额">
				<Icon type="social-yen" slot="prepend"></Icon>
				</Input>
			</FormItem>
			<FormItem prop="remarks" label="充值备注">
				<Input type="textarea" v-model="chargeForm.remarks" placeholder="请输入充值备注" :autosize="{minRows: 3,maxRows: 5}"></Input>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="chargeDone" :loading="chargeLoading">确认</Button>
		</div>
	</Modal>
</div>
</template>
<script>
import tools from '@/libs/tools.js'
import entPicker from '@/views/my-components/custom/ent-picker'

export default {
	components: {
		entPicker
	},
	data() {
		return {
			chargeForm: {
				entId: undefined,
				fee: undefined,
				remarks: undefined
			},
			rules: {
				entId: [{
					required: true,
					message: '企业为必填项',
					trigger: 'blur'
				}],
				fee: [{
					required: true,
					type: 'number',
					message: '请正确填写充值金额',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
			},
			modal: false,
			currPage: 1,
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			chargeLoading: false,
			tableData: [],
			balance: 0,
			tableColumns: [{
					title: '交易流水',
					key: 'id',
				}, {
					title: '交易对象',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.targetEntMap.label
							}
						}, params.row.targetEntMap.label);
					}
				},
				{
					title: '交易类型',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.payTypeMap.label
							}
						}, params.row.payTypeMap.label);
					}
				},
				{
					title: '交易时间',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.date(params.row.createTime, 'YYYY-MM-DD HH:mm:ss')
							}
						}, this.$filter.date(params.row.createTime, 'YYYY-MM-DD HH:mm:ss'));
					}
				},
				{
					title: '交易金额',
					key: 'fee',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.fee), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.fee), '￥'));
					}
				},
				{
					title: '上次余额',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.beformBalance), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.beformBalance), '￥'));
					}
				},
				{
					title: '账户余额',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.lastBalance), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.lastBalance), '￥'));
					}
				},
				{
					title: '备注',
					key: 'remarks',
				},
			]
		}
	},
	created() {
		this.getDataList();
		this.getAccountBalance();
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
			this.API_qryList('/a/account/accountStreamList', queryParam).then(d => {
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		charge(e) {
			this.modal = true;
		},
		changePage(page) {
			console.log(page);
			this.currPage = page;
			this.getDataList();
		},
		chargeDone() {
			this.$refs.chargeForm.validate((valid) => {
				if (valid) {
					this.chargeLoading = true;
					let data = Object.assign({}, this.chargeForm);
					data.fee = this.$filter.yuan2fen(data.fee);
					this.API_accountRecharge(data).then(d => {
						this.getAccountBalance();
						this.getDataList();
						this.$Message.success('充值成功!');
						this.$Notice.success({
							title: '充值成功!'
						});
						setTimeout(() => {
							this.chargeLoading = false;
							this.modal = false;
						}, 500);
					}).catch(e => {
						this.$Message.error('充值失败,请重试');
						this.$Notice.error({
							title: '充值成功,请重试'
						});
						this.chargeLoading = false;
					});
				}
			});

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
		getAccountBalance() {
			this.API_accountBalance().then(d => {
				console.log(d);
				this.balance = d;
			});
		}
	}
}
</script>
<style lang="less" scoped>
.query-form {
    margin-bottom: 10px;
}
.account-info {
    height: 80px;
    font-size: 18px;
    display: flex;
    line-height: 1;
    align-items: center;
    .amount {
        i {
            font-size: 32px;
            color: #ed3f14;
        };
        margin: 0 10px;
    }
}
</style>
