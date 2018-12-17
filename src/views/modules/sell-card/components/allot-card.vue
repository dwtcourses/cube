<template>
<div class="allot-card-main">
	<div class="order-preview">
		<div class="info-item">
			<span class="label">
				订单号:
			</span>
			{{orderInfo.tradeId}}
		</div>
		<div class="info-item">
			<span class="label">
				产品名称:
			</span>
			{{orderInfo.prodName}}
		</div>
		<div class="info-item">
			<span class="label">
				销售对象:
			</span>
			{{orderInfo.salesObjectName}}
		</div>
		<div class="info-item">
			<span class="label">
				资费计划:
			</span>
			{{orderInfo.rateName}}
		</div>
		<div class="info-item">
			<span class="label">
				通信计划:
			</span>
			{{orderInfo.commName}}
		</div>
		<div class="info-item">
			<span class="label">
				产品类型:
			</span>
			{{orderInfo.typeMap?orderInfo.typeMap.value:''}}
		</div>
	</div>
	<div class="header">
		输入卡段
	</div>
	<Form class="allot-card-form" ref="queryCardForm" :model="queryCardForm" :label-width="106" :inline="true" :rules="rules">
		<FormItem label="开始卡号" prop="beginCard">
			<Input v-model="queryCardForm.beginCard" placeholder="请输入开始卡号"></Input>
		</FormItem>
		<FormItem label="结束卡号" prop="endCard">
			<Input v-model="queryCardForm.endCard" placeholder="请输入结束卡号"></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query" :loading="queryLoading">查询</Button>
		</FormItem>
	</Form>
	<Table :loading="queryLoading" class="card-table" :columns="columns" :data="cardData.data"></Table>
	<p class="total-num" v-if="cardData.total">总卡数:&nbsp;&nbsp;{{cardData.total}}张</p>
	<Spin size="large" fix v-if="loading"></Spin>
</div>
</template>
<script>
export default {
	name: 'allot-card',
	data() {
		return {
			orderId: this.$route.params.tradeId ? this.$route.params.tradeId : this.$store.state.app.orderId,
			orderInfo: {},
			allotCardSuccess: false,
			canNext: false,
			cardData: {},
			queryLoading: false,
			loading: false,
			rules: {
				beginCard: [{
					required: true,
					message: '开始卡号为必填项',
					trigger: 'blur'
				}],
			},
			columns: [{
					title: '卡区间',
					key: 'segment'
				},
				{
					title: '数量',
					key: 'total'
				},
			]
		}
	},
	computed: {
		queryCardForm() {
			return {
				tradeId: this.orderId,
				beginCard: '',
				endCard: ''
			}
		}
	},
	created() {
		this.qryTradeSaleById();
	},
	methods: {
		query() {
			this.$refs.queryCardForm.validate(valid => {
				// console.log(valid);
				this.queryLoading = true;
				this.campCardByTradeId();
			});
		},
		campCardByTradeId() {
			this.cardData = {};
			this.API_campCardByTradeId(this.queryCardForm).then(d => {
				console.log(d);
				this.cardData = d;
				this.queryLoading = false;
				this.canNext = true;
				this.$emit('canNext', this.canNext);
			}).catch(e => {
				this.queryLoading = false;
				this.canNext = false;
				this.$emit('canNext', this.canNext);
			});
		},
		saveTradeAllotCard() {
			if (this.canNext) {
				this.API_saveTradeAllotCard({
					id: this.orderId
				}).then(d => {
					console.log(d);
					this.allotCardSuccess = true;
				});
			}
		},
		qryTradeSaleById() {
			this.loading = true;
			this.API_qryTradeSaleById(this.orderId).then(d => {
				this.orderInfo = d;
				setTimeout(() => {
					this.loading = false
				}, 500);
			})
		}
	}
}
</script>
<style lang="less" scoped>
@import "./allot-card.less";
</style>
