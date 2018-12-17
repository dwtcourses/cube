<template>
<div class="user-tree" :class="{'multiple':multiple}">
	<!-- <Tree :data="treeDataAll" :multiple="multiple" :render="renderContent" :show-checkbox="showCheckbox" @on-check-change="check"></Tree> -->
	<el-tree v-if="multiple" :data="treeDataAll" :show-checkbox="showCheckbox" node-key="id" :default-checked-keys="value" :props="defaultProps" @check="check">
	</el-tree>
	<Tree v-if="!multiple" :multiple="multiple" :data="treeDataAll" :render="renderContent"></Tree>
	<Spin fix v-if="treeLoading"></Spin>
</div>
</template>
<script>
export default {
	name: 'user-tree',
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
		value: function(n, o) {
		},
		treeDataAll:function(n, o){
		}
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
		init(id){
			this.clearActive(this.treeDataAll,id);
		},
		check(a, data) {
			let tmp = [];
			for (let item of data.checkedNodes) {
				if (item.treeType == 'user') {
					tmp.push(item.id);
				}
			}
			this.$emit('input', tmp);
		},
		expand(expand){
			this.expandAll(this.treeDataAll,expand);
		},
		expandAll(data,expand){
			for (let item of data) {
				item.expand = expand?true:false;
				if (item.children && item.children.length > 0) {
					this.expandAll(item.children,expand);
				}
			};
		},
		change(d, n) {
			if (d.treeType == 'user') {
				this.$emit('input', d.id);
			} else {
				this.$Message.warning('请选择用户节点');
			}
		},
		getTreeData() {
			this.API_treeDataAll({
				id: 0,
				type: 'user'
			}).then(d => {
				this.cleanData(d);
				this.treeDataAll = d;
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
		clearActive(data,id) {
			for (let item of data) {
				if(id && item.id==id){
					this.$set(item, 'active', true);
				}else{
					if(item.active){
						item.active = false;
					}
				}
				if (item.children && item.children.length > 0) {
					this.clearActive(item.children,id);
				}
			};
		},
		renderContent(h, {
			root,
			node,
			data
		}) {
			return h('span', {
				'class': {
					'ivu-tree-title': true,
					'ivu-tree-title-selected': data.active
				},
				on: {
					click: (e) => {
						e.stopPropagation();
						e.preventDefault();
						if (data.treeType == 'user') {
							this.clearActive(this.treeDataAll,data.id);
							this.$emit('input', data.id);
						} else {
							this.$Message.warning('请选择用户节点');
						}
						// this.select(data);
					}
				}
			}, data.name);
		}
	}
}
</script>
