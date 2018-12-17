<template>
<div class="product-details-main">
	<div class="product-pic-wrapper">
		<product-pic></product-pic>
	</div>
	<div class="product-con-wrapper">
		<div class="main-info">
			<h1>{{productInfo.productName}}</h1>
			<div class="info-line price">
				<span class="tag">套餐价格</span>
				<i>{{productInfo.price | fen2yuan | currency('￥')}}</i>
			</div>
		</div>
		<div class="info-line">
			<span class="tag">销售对象</span>
			<i>{{productInfo.salesObject.value}}</i>
		</div>
		<div class="info-line">
			<span class="tag">卡片规格<em>*</em></span>
			<dict-item @on-change="typeChange" v-model="type" label="CARD_TYPE" type="radio-button"></dict-item>
		</div>
		<div class="info-line">
			<span class="tag">订购数量</span>
			<el-input-number :min="1" size="small" v-model="num" @change="numChange" :max="sku"></el-input-number>
			<i>库存：{{sku}}</i>
		</div>
		<div class="info-line price">
			<span class="tag">合计</span>
			<i>{{tatalPrice | fen2yuan | currency('￥')}}</i>
		</div>
		<div class="info-line">
			<a href="#">详情介绍>></a>&nbsp;&nbsp;&nbsp;&nbsp;
			<a href="#">常见问题>></a>
		</div>
	</div>
</div>
</template>
<script>
import productPic from '@/views/my-components/product-pic/product-pic.vue'
import dictItem from '@/views/my-components/custom/dict-item'

export default {
	name: 'product-details',
	components: {
		productPic,
		dictItem
	},
	data() {
		return {
			canNext: false,
			num: 1,
			type: '',
			sku: 0,
			productInfo: Object.assign({}, this.$store.state.app.productInfo)
		}
	},
	computed: {
		tatalPrice() {
			let totalPrice = this.productInfo.price * this.num
			this.$store.state.app.orderInfo.tfBTradeSale.totalPrice = totalPrice;
			this.$store.state.app.productInfo.totalPrice = totalPrice;
			return totalPrice;
		}
	},
	created() {
		this.$store.state.app.orderInfo.tfBTradeSale.num = this.num;
		this.$store.state.app.productInfo.num = this.num;
		this.getSku();
	},
	methods: {
		numChange(n) {
			this.productInfo.tatal = this.productInfo.price * n;
			this.$store.state.app.orderInfo.tfBTradeSale.num = n;
			this.$store.state.app.productInfo.num = n;
			this.$store.state.app.orderInfo.tfBTradeSale.totalPrice = this.totalPrice;
			this.$store.state.app.productInfo.totalPrice = this.totalPrice;
		},
		typeChange(v) {
			console.log(v);
			if (this.type) {
				this.canNext = true;
				this.$emit('canNext', this.canNext);
			}
			this.$store.state.app.orderInfo.tfBTradeSale.type = this.type;
		},
		getSku() {
			let queryParam = Object.assign({
				currPage: 1,
				pageSize: 10
			}, this.queryForm);
			this.API_qryList('/a/card/card/qryStockCard', queryParam).then(d => {
				this.sku = d.page.count;
			});
		},
	}
}
</script>
<style lang="less" scoped>
@import "./product-details.less";
</style>
