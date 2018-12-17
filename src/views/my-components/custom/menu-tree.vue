<template>
<div class="menu-tree">
	<!-- <Tree :data="treeDataAll" :multiple="multiple" :render="renderContent" :show-checkbox="showCheckbox" @on-check-change="check"></Tree> -->
	<el-tree v-if="multiple" :data="treeDataAll" :show-checkbox="showCheckbox" ref="tree" node-key="id" :default-checked-keys="value" :props="defaultProps" @check="check">
	</el-tree>
	<Spin fix v-if="treeLoading"></Spin>
</div>
</template>
<script>

import Util from '@/libs/util.js';

export default {
	name: 'menu-tree',
	props: {
		multiple: {
			type: Boolean,
			default: true
		},
		showCheckbox: {
			type: Boolean,
			default: true
		},
		value: {
			default: function(){
				if (this.multiple) {
					return [];
				} else {
					return '';
				}
			}
		},
	},
	watch: {
		value: function(n, o) {}
	},
	data() {
		return {
			defaultProps: {
				children: 'children',
				label: 'name',
			},
			treeLoading: true,
			treeDataAll: [],
			activeItem: this.multiple ? [] : {}
		}
	},
	created() {
		this.getTreeData();
	},
	methods: {
		check(a, data) {
			if(this.multiple){
				let tmp = Util.extend(true,{},data);
				this.$emit('input', tmp);
			}
		},
		getTreeData() {
			this.API_treeDataAll({
				id: 0,
				type: 'menu'
			}).then(d => {
				this.cleanData(d);
				this.treeDataAll = d;
				console.log(d);
				this.treeLoading = false;
			})
		},
		cleanData(arr) {
			for (let item of arr) {
				if (item.children == null) {
					delete item.loading;
				} else {
					this.cleanData(item.children);
				}
			}
		},
		renderContent(h, {
			root,
			node,
			data
		}) {
			return h('span', {
				'class': {
					'ivu-tree-title': true,
					'ivu-tree-title-selected': data.id == this.activeItem.id
				},
				on: {
					click: (e) => {
						e.stopPropagation();
						e.preventDefault();
						// this.select(data);
					}
				}
			}, data.name);
		}
	}
}
</script>
<style scoped>
.menu-tree {
	position: relative;
}
</style>
