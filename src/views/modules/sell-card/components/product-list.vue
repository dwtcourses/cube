<template>
<div class="product-list-main">
	<Form class="query-form" ref="form" :model="form" :rules="rules" inline>
		<FormItem prop="custId" label="出售对象：">
			<ent-picker v-model="form.custId" style="width:240px"></ent-picker>
		</FormItem>
		<FormItem prop="productMode" label="套餐类型：">
			<dict-item v-model="form.productMode" style="width:240px" label="PRODUCT_MODE"></dict-item>
		</FormItem>
		<FormItem prop="section" label="流量区间：">
			<Slider :tip-format="tipFormat" style="width:240px" v-model="resource" :min="0" :max="9999" show-tip="always" :step="1" range></Slider>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query()" :loading="queryLoading">查询</Button>
		</FormItem>
	</Form>
	<div class="product-container">
		<div class="product-item" :class="{active:activeProduct.id == item.id}" v-for="item in productList" :key="item.key" @click="productClick(item)">
			<i class="iconfont">&#xe60a;</i>
			<p class="name">{{item.productName}}</p>
			<p>价钱:<span>{{item.productPrice | fen2yuan | currency('￥')}}</span></p>
			<p>类型:<span>{{item.productTypeMap.value}}</span></p>
			<p>流量:<span>10.00M/月</span></p>
		</div>
	</div>
	<Page v-if="total>0" show-total :total="total" :current="currPage" @on-change="changePage"></Page>
	<p class="hint" v-if="total==0">请先查询相应的产品,然后进行下一步操作。</p>
</div>
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'
import entPicker from '@/views/my-components/custom/ent-picker'

export default {
	name: 'product-list',
	components: {
		dictItem,
		entPicker
	},
	data() {
		return {
			canNext: false,
			resource: [0, 9999],
			queryForm: null,
			queryLoading: false,
			currPage: 1,
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			productList: [],
			activeProduct: {},
			rules: {
				custId: [{
					required: true,
					message: '请选择销售对象',
					trigger: 'change'
				}]
			}
		}
	},
	computed: {
		tradeSale() {
			return {
				prodId: this.activeProduct.productId,
				salesObject: this.activeProduct.custId,
				price: this.activeProduct.productPrice
			}
		},
		form() {
			return {
				resourceStart: this.resource[0],
				resourceEnd: this.resource[1],
				custId: '',
				productMode: ''
			}
		}
	},
	created() {},
	methods: {
		query() {
			this.$refs.form.validate(valid => {
				if(valid){
					this.queryLoading = true;
					this.queryForm = this.form;
					this.currPage = 1;
					this.productList = [];
					this.total = 0;
					this.getDataList();
				}
			});
		},
		tipFormat(v) {
			return `${v}M`;
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/product/tdBProduct/qryTdBProductListBySaleCon', queryParam).then(d => {
				console.log(d);
				this.productList = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
					this.queryLoading = false;
				}, 500);
			}).catch(e => {
				this.loading = false;
				this.queryLoading = false;
			});
		},
		changePage(page) {
			this.currPage = page;
			this.getDataList();
		},
		productClick(item) {
			if (this.activeProduct.id == item.id) {
				this.activeProduct = {};
				this.canNext = false;
				this.$emit('canNext', this.canNext);
			} else {
				this.activeProduct = item;
				this.canNext = true;
				this.$emit('canNext', this.canNext);
			};
			this.$store.state.app.orderInfo.tfBTradeSale = Object.assign({}, this.tradeSale);
			this.$store.state.app.productInfo = {
				productName: item.productName,
				salesObject: item.custMap,
				price: item.productPrice
			}
			console.log(this.$store.state.app.orderInfo);
		}
	}
}
</script>
<style lang="less" scoped>
@import "./product-list.less";
</style>
