<template>
<div>
	<Select v-model="currentValue" :transfer="transfer" @on-change="change" clearable v-if="type=='select'" :multiple="multiple" :disabled="disabled" :size="size" v-bind="$attrs" v-on="$listeners">
		<Option v-for="opt in data.list" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
	</Select>
	<RadioGroup :size="size" v-model="currentValue" v-if="type=='radio'&&label!='yeno'" @on-change="change" v-bind="$attrs" v-on="$listeners">
		<Radio :disabled="disabled" v-for="opt in data.list" :key="opt.value" :label="opt.value">{{opt.name}}</Radio>
	</RadioGroup>
	<RadioGroup :size="size" v-model="currentValue" v-if="type=='radio-button'&&label!='yeno'" @on-change="change" :disabled="disabled" type="button" v-bind="$attrs" v-on="$listeners">
		<Radio :disabled="disabled" v-for="opt in data.list" :key="opt.value" :label="opt.value">{{opt.name}}</Radio>
	</RadioGroup>
	<CheckboxGroup :size="size" v-model="currentValue" v-if="type=='checkbox'" @on-change="change" v-bind="$attrs" v-on="$listeners">
		<Checkbox :disabled="disabled" v-for="opt in data.list" :key="opt.value" :label="opt.value">{{opt.name}}</Checkbox>
	</CheckboxGroup>
	<RadioGroup :size="size" v-model="currentValue" v-if="type=='radio'&&label=='yeno'" @on-change="change" :disabled="disabled" v-bind="$attrs" v-on="$listeners">
		<Radio :disabled="disabled" label="1">是</Radio>
		<Radio :disabled="disabled" label="0">否</Radio>
	</RadioGroup>
</div>
</template>
<script>
export default {
	name: 'dict-item',
	props: {
		value: '',
		transfer: {
			type: Boolean,
			default: true
		},
		label: {
			type: String,
			default: 'sys_user_type'
		},
		type: {
			type: String,
			default: 'select'
		},
		multiple:{
			type: Boolean,
			default: false
		},
		disabled:{
			type: Boolean,
			default: false
		},
		size:{
			type: String,
			default: 'default'
		}
	},
	data() {
		return {
			model: '',
			currentValue: this.value ? this.value : this.type == 'checkbox' ? [] : '',
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
		if (this.label != 'yeno') {
			this.getData();
		}
	},
	methods: {
		getData() {
			this.API_selectData(this.label).then(d => {
				this.data = d;
			});
		},
		change(item) {
			this.$emit('input', this.currentValue);
		}
	}
}
</script>
