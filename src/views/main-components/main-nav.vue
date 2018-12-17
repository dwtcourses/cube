<template>
	<Menu class="main-nav" mode="horizontal" theme="light" @on-select="navClick" :active-name="$store.state.app.currentNav">
        <MenuItem :name="nav.name" v-for="nav in navList" :key="nav.key">
            {{nav.title}}
        </MenuItem>
	</Menu>
</template>

<script>
export default {
    name: 'mainNav',
	data() {
		return {
			navList:this.$store.state.app.navList,
			currentNav: this.$store.state.app.currentNav
		}
	},
	created(){
		console.log(this.currentNav);
	},
    methods: {
		navClick(name){
			// console.log(this.$store.state.app);
			this.$store.state.app.currentNav = name;
			this.currentNav = name;
			this.$store.commit('updateMenulist');
			this.$router.push({
				name: name
			});
		}
	}
}
</script>
<style scoped lang="less">
	.main-nav.ivu-menu-horizontal.ivu-menu-light:after{
		display: none;
	}
</style>
