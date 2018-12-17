<!-- TODO
1、选择父节点导致树结构无法展开
2、悬浮状态下树结构有问题
3、多选状态下未完善
4、用户树结构有待完成 -->

<template>
<Dropdown class="tree-dropdown" :transfer="transfer" ref="hastree" placement="bottom-start" trigger="custom" :visible="visible" :class="{'multiple':multiple}">
	<Input ref="input" v-if="multiple" type="text" :readonly="true" @on-focus="focus" :placeholder="placeholder">
	<div class="tree-tag-wrapper" slot="prepend" ref="tagWrapper">
		<Tag class="tree-tag" closable @on-close="handleClose" v-for="(item,index) in activeItem" :key="item.id" :name="index">{{item.name}}</Tag>
	</div>
	<Button slot="append" icon="ios-search-strong" size="small" class="serach-icon" @click="focus"></Button>
	</Input>
	<Input v-if="!multiple" type="text" :readonly="true" @on-focus="focus" v-model="model" :placeholder="placeholder" clearable @on-change="change">
	<Button slot="append" icon="ios-search-strong" size="small" class="serach-icon" @click="focus"></Button>
	</Input>
	<DropdownMenu slot="list">
		<Tree v-if="isAsync" :data="treeData" :show-checkbox="showCheckbox" :load-data="loadData" @on-select-change="select" @on-check-change="check" :multiple="multiple" :render="renderContent"></Tree>
		<Tree v-if="!isAsync" :data="treeData" :show-checkbox="showCheckbox" @on-select-change="select" @on-check-change="check" :multiple="multiple" :render="renderContent"></Tree>
	</DropdownMenu>
</Dropdown>
</template>
<script>
export default {
	name: 'tree-dropdown',
	props: {
		value: '',
		placeholder: {
			type: String,
			default: '请选择'
		},
		transfer: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		selectParent: {
			type: Boolean,
			default: false
		},
		showCheckbox: {
			type: Boolean,
			default: false
		},
		isAsync: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'office'
		},
	},
	data() {
		return {
			visible: false,
			model: '',
			currentTreeId: 0,
			treeData: [],
			activeItem: this.multiple ? [] : {},
			model: ''
		}
	},
	watch: {
		activeItem: function(n, o) {
			if (!this.multiple) return;
			if (n.length > 0) {
				this.$refs.tagWrapper.style.backgroundColor = '#fff';
			}
			setTimeout(() => {
				this.fixHeight();
			}, 0);
		},
		value: function(n, o) {
			console.log(n);
			if (n) {
				this.model = n.name;
			} else {
				this.model = '';
				this.activeItem = '';
			}
		}
	},
	created() {
		document.addEventListener('click', (e) => {
			if (!this.$el.contains(e.target)) {
				this.visible = false;
			}
		});
		if (this.type == 'user') {
			console.log(this.isAsync);
		}
		this.getTreeData();
	},
	methods: {
		focus() {
			this.visible = true;
		},
		change() {
			if (this.model == '') {
				this.activeItem = '';
			}
			console.log(this.activeItem);
			this.$emit('input', this.activeItem); //触发 input 事件，并传入新值
		},
		check(item) {
			if (!this.showCheckbox) return;
			if (this.multiple) {

			} else {
				this.$emit('input', item[0]); //触发 input 事件，并传入新值
			}
		},
		fixHeight() {
			let wrapperHeight = this.$refs.tagWrapper.offsetHeight < 26 ? 26 : this.$refs.tagWrapper.offsetHeight;
			this.$refs.hastree.$el.style.height = (wrapperHeight + 6) + 'px';
			this.$refs.input.$el.children[2].style.height = (wrapperHeight + 6) + 'px';
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
						this.select(data);
					}
				}
			}, data.name);
		},
		select(item) {
			if (this.showCheckbox || !item) return;
			console.log(item);
			if (this.multiple) {
				this.activeItem = [];
				let tpm = [];
				let re = false;
				for (let obj of item) {
					if (obj.children != null && !this.selectParent) {
						this.$Message.error('不能选择父节点');
						re = true;
					} else {
						tpm.push(obj.id);
						this.activeItem.push(obj);
					}
				};
				item = this.activeItem;
				if (re) return;
				this.$emit('input', tpm); //触发 input 事件，并传入新值
			} else {
				if (item.children != null && !this.selectParent) {
					this.$Message.error('不能选择父节点');
					return false;
				};
				this.activeItem = item;
				this.model = item.name;
				this.change();
				this.visible = false;
			}
		},
		handleClose(e, i) {
			console.log(i);
			this.activeItem.splice(i, 1);
		},
		getTreeData() {
			this.API_treeData({
				id: this.currentTreeId,
				type: this.type
			}).then(d => {
				if (d.length == 0) return;
				for (let item of d) {
					if (item.children == null) {
						delete item.loading;
					}
				};
				this.treeData = d;
			});
		},
		loadData(item, callback) {
			this.API_treeData({
				id: item.id,
				type: this.type
			}).then(d => {
				if (d.length == 0) return;
				for (let item of d) {
					if (item.children == null) {
						delete item.loading;
					}
				};
				console.log(d);
				callback(d);
			});
		},
		getOfficeData() {
			this.API_treeData(this.currentTreeId, 'office').then(d => {
				if (d.length == 0) return;
				for (let item of d) {
					if (item.children == null) {
						delete item.loading;
					}
				};
				this.treeData = d;
			});
		}
	}
}
</script>
<style lang="less">
.serach-icon {}
.tree-dropdown {
    .ivu-input-group-prepend {
        padding: 2px 1px 2px 4px;
        position: absolute;
        background-color: transparent;
        left: 0;
        top: 0;
        right: 32px;
        bottom: 0;
        width: calc(~"100% - 32px");
        border: none;
        z-index: 99;
    }
    .tree-tag-wrapper {
        display: flex;
        flex-wrap: wrap;
    }
    .ivu-input-group-append {
        .serach-icon {
            border-color: transparent;
            padding-top: 6px;
            height: 32px;
            box-shadow: none;
        }
    }
    .ivu-input-icon-clear {
        right: 32px;
    }
}
</style>
