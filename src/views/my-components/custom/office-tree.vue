<template>
<div class="office-tree">
	<!-- <Tree :data="treeDataAll" :multiple="multiple" :render="renderContent" :show-checkbox="showCheckbox" @on-check-change="check"></Tree> -->
	<el-tree :data="treeDataAll" show-checkbox node-key="id" :default-checked-keys="value" :props="defaultProps" @check="check">
	</el-tree>
	<Spin fix v-if="treeLoading"></Spin>
</div>
</template>
<script>
export default {
	name: 'office-tree',
	props: {
		value: '',
		multiple: {
			type: Boolean,
			default: false
		},
		showCheckbox: {
			type: Boolean,
			default: false
		},
	},
	watch: {
		value: function(n, o) {
			console.log(n);

		}
	},
	data() {
		return {
			defaultProps:{
				children: 'children',
          		label: 'name'
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
		check(a,data) {
			this.$emit('input', data.checkedKeys);
		},
		getTreeData() {
			this.API_treeDataAll({
				id: 0,
				type: 'office'
			}).then(d => {
				this.cleanData(d);
				this.treeDataAll = d;
				console.log(d);
				this.treeLoading = false;
			});
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
