<template>
<div class="sell-card-main">
	<div class="step-wrapper">
		<Steps :current="current.index">
			<Step v-for="step in steps" :key="step.key" :title="step.name"></Step>
		</Steps>
	</div>
	<div class="step-container">
		<div class="step-item">
			<div class="item-wrapper" :class="{'no-border':current.index ==(steps.length-1)}">
				<div class="header" v-if="current.index<(steps.length-1)">
					{{current.name}}
				</div>
				<div class="item-con" :class="{'full':current.index>=2}">
					<component :is="stepComponent" ref="pages" @canNext="next" @nextLoading="loading" />
					<Button :disabled="!canNext" v-if="current.index<(steps.length-1)" class="next-step" type="primary" @click="nextStep" :loading="nextLoading">下一步</Button>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import productList from './components/product-list'
import productDetails from './components/product-details'
import orderInfo from './components/order-info'
import allotCard from './components/allot-card'
import done from './components/done'




export default {
	name: 'sell-card',
	data() {
		return {
			canNext: false,
			nextLoading: false,
			current:{
				index: this.$route.params.tradeId ? 3 : 0,
				name: '',
				component: ''
			},
			steps: [{
					name: '选产品',
					component: productList
				},
				{
					name: '下订单',
					component: productDetails
				},
				{
					name: '选配送',
					component: orderInfo
				},
				{
					name: '配卡',
					component: allotCard
				},
				{
					name: '完成',
					component: done
				},
			]
		}
	},
	created() {
		this.getCurrentStep();
	},
	computed: {
		stepComponent() {
			return this.current.component;
		},
		tradeId() {
			return this.$route.params.tradeId;
		},
	},
	methods: {
		getCurrentStep() {
			let index = this.current.index;
			let obj = this.steps[index];
			this.current = {
				index,
				name: obj.name,
				component: obj.component
			};
		},
		nextStep() {
			if (this.current.index == 3) {
				// console.log(this.$refs.pages);
				this.$refs.pages.saveTradeAllotCard();
			} else if (this.current.index == 2) {
				this.$refs.pages.next().then(d => {
					if (d) {
						this.current.index++;
						this.getCurrentStep();
					}
				});
			} else {
				if (this.current.index < (this.steps.length - 1)) {
					this.current.index++;
					this.getCurrentStep();
				}
			};
			this.$nextTick(() => {
				this.canNext = this.$refs.pages.canNext;
			});
		},
		next(v) {
			this.canNext = v;
		},
		loading(l) {
			this.nextLoading = l;
		}
	}
}
</script>
<style lang="less" scoped>
@import "./sell-card.less";
</style>
<style lang="less">
.main .single-page-con .single-page .step-container .query-form {
    padding: 24px 0 0;
    border-bottom: 1px dashed #ddd;
    .ivu-form-item {
        margin-right: 50px;
        .ivu-slider-wrap {
            height: 8px;
            margin: 12px 0;
            .ivu-slider-bar {
                height: 8px;
            }
            .ivu-slider-button {
                width: 16px;
                height: 16px;
            }
        }
    }
}
</style>
