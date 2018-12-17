<template>
<div>
	<Upload class="upload-item" ref="photoFront" :action="$store.state.app.UPLOADURL" :on-success="preview" :format="['jpg','jpeg','png','bmp']" :before-upload="before">
		<Button type="ghost" icon="ios-cloud-upload-outline">上传证件照</Button>
	</Upload>
	<Spin fix v-if="uploading"></Spin>
	<img v-if="prviewUrl" :src="prviewUrl" alt="证件照">
</div>
</template>
<script>
export default {
	name: 'upload',
	props: {
		value: '',
	},
	data() {
		return {
			uploading: false,
			prviewUrl: ''
		}
	},
	watch: {
		value(v) {
			if (v != this.prviewUrl) {
				this.prviewUrl = v;
			}

		}
	},
	created() {

	},
	methods: {
		preview(r) {
			this.uploading = false;
			this.prviewUrl = r.rspData;
			this.$emit('input', r.rspData);
		},
		before() {
			this.uploading = true;
			return true;
		},
		
	}
}
</script>
<style lang="less">
.ivu-upload.upload-item {
    padding: 0;
}
</style>
