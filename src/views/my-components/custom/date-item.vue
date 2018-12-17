<template>
<date-picker v-model="currentValue" :type="type" :transfer="transfer" v-bind="$attrs" v-on="$listeners" @on-change="change" :options="options"></date-picker>
</template>
<script>
export default {
	name: 'date-item',
	props: {
		value: '',
		transfer: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: 'date'
		},
	},
	data() {
		return {
			model: '',
			currentValue: this.value ? this.value : '',
		}
	},
	watch:{
		value(n, o) {
			if (n) {
				this.currentValue = n;
			} else {
				this.currentValue = '';
			}
		}
	},
	computed: {
		options() {
			if (this.type == 'daterange') {
				return {
					shortcuts: [{
							text: '一周',
							value() {
								const end = new Date();
								const start = new Date();
								end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
								return [start, end];
							}
						},
						{
							text: '一个月',
							value() {
								const end = new Date();
								const start = new Date();
								end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
								return [start, end];
							}
						},
						{
							text: '三个月',
							value() {
								const end = new Date();
								const start = new Date();
								end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
								return [start, end];
							}
						},
						{
							text: '半年',
							value() {
								const end = new Date();
								const start = new Date();
								end.setTime(start.getTime() + 3600 * 1000 * 24 * 182);
								return [start, end];
							}
						},
						{
							text: '一年',
							value() {
								const end = new Date();
								const start = new Date();
								end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
								return [start, end];
							}
						}
					]
				}
			}
		}
	},
	created() {},
	methods: {

		change(e) {
			if (this.type != 'daterange') {
				this.currentValue = e;
				this.$emit('input', this.currentValue);
			}
		}
	}
}
</script>
