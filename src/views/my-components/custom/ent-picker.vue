<template>
<Select v-model="currentValue" filterable clearable placeholder="请输入企业名称(支持模糊搜索)" :transfer="transfer" @on-change="change" v-bind="$attrs" v-on="$listeners">
	<Option v-for="(option, index) in data" :value="option.value" :key="index">{{option.label}}</Option>
</Select>
</template>
<script>
import util from '@/libs/util'

export default {
	name: 'ent-picker',
	props: {
		value: '',
		transfer: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			currentValue: '',
			options: [],
			data: [],
		}
	},
	watch: {
		value: function(n, o) {
			if (n) {
				this.currentValue = n;
			} else {
				this.currentValue = '';
			}
		}
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			this.API_findEntAll().then(d => {
				console.log(d);
				this.data = d;
			});
		},
		getOpt(query) {
			if (query !== '') {
				this.options = this.data.filter(item => item.label.indexOf(query) > -1);
			} else {
				this.options = [];
			}
		},
		change(o){
			this.$emit('input', this.currentValue);
		}
	}
}
</script>
