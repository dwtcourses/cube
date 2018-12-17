<template>
<Select v-model="currentValue" :transfer="transfer" @on-change="change" placeholder="请选择客户经理" clearable v-bind="$attrs" v-on="$listeners">
	<Option v-for="opt in data" :key="opt.value" :value="opt.value">{{opt.label}}</Option>
</Select>
</template>
<script>
export default {
	name: 'customer-manager',
	props: {
		value: '',
		transfer: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			model: '',
			currentValue: this.value ? this.value : '',
			data: []
		}
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			this.API_getEntCustomerManager().then(d => {
				console.log(d);
				this.data = d;
			});
		},
		change(item) {
			this.$emit('input', this.currentValue);
		}
	}
}
</script>
