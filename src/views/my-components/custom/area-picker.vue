<template>
	<Cascader :data="data" v-model="value" :transfer="transfer" v-bind="$attrs" v-on="$listeners"></Cascader>
</template>
<script>
export default {
	name: 'area-picker',
	props: {
		value: [],
		transfer: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			currentValue: [],
			data: []
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
			this.API_areaData().then(d => {
				console.log(d);
			});
		},

	}
}
</script>
