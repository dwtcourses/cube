<template>
<div class="product-pic-main">
	<div class="pic-preview">
		<img :src="picUrl" alt="产品图片预览">
	</div>
	<div class="thumb-list">
		<swiper :options="swiperOption" ref="thumbSwiper" @click="slideClick">
			<!-- slides -->
			<swiper-slide :data-index="index" :class="{'active':active==index}" v-for="(silde,index) in sildes" :key="silde.key">
				<img :src="silde" alt="">
			</swiper-slide>
			<!-- Optional controls -->
			<div class="swiper-button-prev" slot="button-prev" @click="prev">
				<i class="iconfont">&#xe6c0;</i>
			</div>
			<div class="swiper-button-next" slot="button-next" @click="next">
				<i class="iconfont">&#xe6bf;</i>
			</div>
		</swiper>
	</div>
</div>
</template>
<script>
import util from '@/libs/util';

export default {
	name: 'product-pic',
	data() {
		return {
			sildes: [
				'//134.0.133.148:8889/iotserver/image/view/5c05f8ed028a80079422c604',
				'//134.0.133.148:8889/iotserver/image/view/5c05f903028a80079422c605',
				'//134.0.133.148:8889/iotserver/image/view/5c05f911028a80079422c607',
				'//134.0.133.148:8889/iotserver/image/view/5c05f920028a80079422c608',
				'//134.0.133.148:8889/iotserver/image/view/5c05f92c028a80079422c609',
				'//134.0.133.148:8889/iotserver/image/view/5c05f93b028a80079422c60a'
			],
			active: 0,
			swiperOption: {
				spaceBetween: 10,
				slidesPerView: 5,
				freeMode: true,
				freeModeSticky: true,
			},
		}
	},
	created() {

	},
	computed: {
		thumbSwiper() {
			return this.$refs.thumbSwiper.swiper
		},
		picUrl(){
			return this.sildes[this.active]
		}
	},
	methods: {
		prev() {
			if (this.active >= 1) {
				this.active--;
				this.thumbSwiper.slideTo(this.active, 200, false);
			}
		},
		next() {
			if (this.active < (this.sildes.length - 1)) {
				this.active++;
				this.thumbSwiper.slideTo(this.active, 200, false);
			}
		},
		slideClick(e) {
			let slide = util.closest(e.target,'.swiper-slide');
			if(!slide) return;
			let index = slide.dataset.index;
			this.active = index;
		},
		getPic(){

		}
	}
}
</script>
<style lang="less" scoped>
@import "./product-pic.less";
</style>
