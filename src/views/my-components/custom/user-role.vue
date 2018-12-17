<template>
	<CheckboxGroup v-model="currentValue" @on-change="change">
        <Checkbox v-for="opt in data.list" :key="opt.id" :label="opt.id">{{opt.name}}</Checkbox>
    </CheckboxGroup>
</template>
<script>
export default {
	name: 'user-role',
	props: {
		value:'',
		transfer:{
			type:Boolean,
			default:true
		}
	},
	data() {
		return {
			model:'',
			currentValue: this.value?this.value:'',
			data:[]
		}
	},
	watch: {
		value: function(n, o) {
			if(n){
				this.currentValue = n;
			}else{
				this.currentValue = '';
			}
		}
	},
	created(){
		this.getData();
	},
	methods: {
		getData(){
			this.API_getUserRole().then(d=>{
				this.data = d;
			});
		},
		change(item){
			this.$emit('input', this.currentValue);
		}
	}
}
</script>
