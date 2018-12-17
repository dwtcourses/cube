<template>
<div>
	<template v-for="(item, index) in menuList">
		<div style="text-align: center;" :key="index">
			<Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index" @on-click="changeMenu">
				<Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
					<i class="iconfont" :class="item.icon" v-if="item.icon &&  item.icon.indexOf('icon')>-1"></i>
					<Icon v-else-if="item.icon && item.icon.indexOf('icon')==-1" :type="item.icon" :key="'menuicon' + item.name" :size="20" :color="iconColor"></Icon>
					<Icon v-else type="social-windows" :size="20" :color="iconColor"></Icon>
				</Button>
				<DropdownMenu style="width: 200px;" slot="list">
					<template v-for="(child, i) in item.children">
						<DropdownItem :name="child.name" :key="i">
							<i class="iconfont" :class="child.icon" v-if="child.icon && child.icon.indexOf('icon')>-1"></i>
		                    <Icon v-else-if="child.icon && child.icon.indexOf('icon')==-1" :type="child.icon" :size="20" :color="iconColor"></Icon>
							<Icon v-else type="social-windows" :size="20" :color="iconColor"></Icon>
							<span style="padding-left:10px;">{{ itemTitle(child) }}</span>
						</DropdownItem>
					</template>
				</DropdownMenu>
			</Dropdown>
			<Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
				<Button @click="changeMenu(item.children[0].name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
					<i class="iconfont" :class="item.icon" v-if="item.icon &&  item.icon.indexOf('icon')>-1"></i>
					<Icon v-else-if="item.icon && item.icon.indexOf('icon')==-1" :type="item.icon" :key="'menuicon' + item.name" :size="20" :color="iconColor"></Icon>
					<Icon v-else type="social-windows" :size="20" :color="iconColor"></Icon>
				</Button>
				<DropdownMenu style="width: 200px;" slot="list">
					<DropdownItem :name="item.children[0].name" :key="'d' + index">
						<i class="iconfont" :class="item.icon" v-if="item.icon &&  item.icon.indexOf('icon')>-1"></i>
						<Icon v-else-if="item.icon && item.icon.indexOf('icon')==-1" :type="item.icon" :key="'menuicon' + item.name" :size="20" :color="iconColor"></Icon>
						<Icon v-else type="social-windows" :size="20" :color="iconColor"></Icon>
						<span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	</template>
</div>
</template>

<script>
export default {
	name: 'sidebarMenuShrink',
	props: {
		menuList: {
			type: Array
		},
		iconColor: {
			type: String,
			default: 'white'
		},
		menuTheme: {
			type: String,
			default: 'light'
		}
	},
	methods: {
		changeMenu(active) {
			this.$emit('on-change', active);
		},
		itemTitle(item) {
			if (typeof item.title === 'object') {
				return this.$t(item.title.i18n);
			} else {
				return item.title;
			}
		}
	}
};
</script>
