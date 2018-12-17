<template>
<Select v-model="currentValue" :transfer="transfer" @on-change="change" clearable>
		<Option v-for="opt in data.typeList" :key="opt" :value="opt">{{opt}}</Option>
	</Select>
</template>
<script>
export default {
	name: 'dict-type',
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
			this.API_qryDictTypeList().then(d => {
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
