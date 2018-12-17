<template>
<div class="main-wrap">
	<div class="left-side">
		<Tree :data="treeDataAll" :multiple="false" :render="renderContent"></Tree>
		<Spin fix v-if="treeLoading"></Spin>
	</div>
	<div class="right-side">
		<div class="add-button-wrapper">
			<Button type="primary" @click="add">添加机构</Button>
		</div>
		<Table class="table-fold" border :data="tableData" :columns="tableColumns" :loading="loading"></Table>
		<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
			<div style="float: right;">
				<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
			</div>
		</div>
		<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
			<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="120">
				<FormItem prop="id" label="id" class="fn-hide">
					<Input type="text" v-model="modalForm.id" clearable></Input>
				</FormItem>
				<FormItem prop="parent" label="上级机构" class="hastree">
					<tree-select v-model="modalForm.parent" type="office" :multiple="false" placeholder="请选择上级区域"></tree-select>
				</FormItem>
				<FormItem prop="area" label="归属地区" class="hastree">
					<tree-select v-model="modalForm.area" type="area" :multiple="false" placeholder="请选择归属地区"></tree-select>
				</FormItem>
				<FormItem prop="name" label="机构名称">
					<Input type="text" v-model="modalForm.name" placeholder="请输入机构名称" clearable></Input>
				</FormItem>
				<FormItem prop="code" label="机构编码">
					<Input type="text" v-model="modalForm.code" placeholder="请输入机构编码" clearable></Input>
				</FormItem>
				<FormItem prop="type" label="机构类型">
					<dict-item :transfer="true" v-model="modalForm.type" style="width:200px" label="sys_office_type"></dict-item>
				</FormItem>
				<FormItem prop="grade" label="机构级别">
					<dict-item :transfer="true" v-model="modalForm.grade" style="width:200px" label="sys_office_grade"></dict-item>
				</FormItem>
				<FormItem prop="sort" label="排序">
					<Input type="text" v-model="modalForm.sort" placeholder="请输入排序" clearable></Input>
				</FormItem>
				<FormItem prop="useable" label="是否可用">
					<RadioGroup v-model="modalForm.useable">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem prop="primaryPerson" label="主负责人" class="hastree">
					<tree-select v-model="modalForm.primaryPerson" type="user" :multiple="false" placeholder="请选择主负责人"></tree-select>
				</FormItem>
				<FormItem prop="deputyPerson" label="副负责人" class="hastree">
					<tree-select v-model="modalForm.deputyPerson" type="user" :multiple="false" placeholder="请选择副负责人"></tree-select>
				</FormItem>
				<FormItem prop="address" label="联系地址">
					<Input type="text" v-model="modalForm.address" placeholder="请输入联系地址" clearable></Input>
				</FormItem>
				<FormItem prop="zipCode" label="邮政编码">
					<Input type="text" v-model="modalForm.zipCode" placeholder="请输入邮政编码" clearable></Input>
				</FormItem>
				<FormItem prop="master" label="负责人">
					<Input type="text" v-model="modalForm.master" placeholder="请输入负责人" clearable></Input>
				</FormItem>
				<FormItem prop="phone" label="电话">
					<Input type="text" v-model="modalForm.phone" placeholder="请输入电话" clearable></Input>
				</FormItem>
				<FormItem prop="fax" label="传真">
					<Input type="text" v-model="modalForm.fax" placeholder="请输入传真" clearable></Input>
				</FormItem>
				<FormItem prop="email" label="邮箱">
					<Input type="email" v-model="modalForm.email" placeholder="请输入邮箱" clearable></Input>
				</FormItem>
				<FormItem prop="remarks" label="备注">
					<Input v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="输入备注..."></Input>
				</FormItem>
				<FormItem prop="childDeptList" label="快速添加子部门">
					<CheckboxGroup v-model="modalForm.childDeptList">
						<Checkbox label="1">
							综合部
						</Checkbox>
						<Checkbox label="2">
							技术部
						</Checkbox>
						<Checkbox label="3">
							人力部
						</Checkbox>
					</CheckboxGroup>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" @click="modalEdit" :loading="btnLoading">{{btnTxt}}</Button>
			</div>
		</Modal>
		<Modal v-model="modalDel" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>删除确认</span>
			</p>
			<div style="text-align:center">
				删除后讲无法恢复,是否删除？
			</div>
			<div slot="footer">
				<Button type="error" size="large" long :loading="delLoading" @click="del()">删除</Button>
			</div>
		</Modal>
	</div>
</div>
</template>
<script>
import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		treeSelect
	},
	data() {
		return {
			modalForm: {
				id: '',
				parent: '',
				area: '',
				name: '',
				code: '',
				type: '',
				grade: '',
				useable: '1',
				primaryPerson: '',
				deputyPerson: '',
				address: '',
				zipCode: '',
				master: '',
				sort: '10',
				phone: '',
				fax: '',
				email: '',
				remarks: '',
				childDeptList: []
			},
			tmpForm: {},
			rules: {
				// parent: [{
				// 	validator: (rule, value, callback) => {
				// 		if (!value) {
				// 			return callback(new Error('上级机构不能为空'));
				// 		} else {
				// 			callback();
				// 		}
				// 	},
				// 	required: true,
				// 	trigger: 'change'
				// }],
				area: [{
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('归属地区不能为空'));
						} else {
							callback();
						}
					},
					required: true,
					trigger: 'change'
				}],
				name: [{
					required: true,
					message: '名称为必填项',
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: '类型为必填项',
					trigger: 'blur'
				}],
				sort: [{
					required: true,
					message: '排序为必填项',
					trigger: 'blur'
				}, {
					type: 'number',
					message: '排序必须是数字',
					trigger: 'blur',
					transform(value) {
						return Number(value);
					}
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增结构',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			treeDataAll: [],
			treeLoading: true,
			parentId: undefined,
			tableData: [],
			tableColumns: [{
					title: '机构名称',
					key: 'name',
					width: 300,
					render: (h, params) => {
						let level = params.row.path.split(',').length - 1;
						params.level = level;
						let close = (arr, row) => {
							if (!row) return;
							for (let item of row) {
								let index = arr.findIndex(function(value, index, arr) {
									return value.id == item.id;
								}); // 10
								if (item.children) {
									close(arr, item.children);
								};
								if (index == -1) return;
								arr.splice(index, 1);
							};
						};
						let getIcon = (l) => {
							let tpl = [];
							for (let i = 0; i < l; i++) {
								let cless = params.row.children && i == (l - 1) ? 'ivu-icon fold-icon ivu-icon-android-arrow-dropright' : 'fold-space';
								tpl.push(h('i', {
									attrs: {
										level: params.level,
										index: params.index,
										children: JSON.stringify(params.row.children)
									},
									'class': {
										'fold-on': params.row.fold == 1,
										'ivu-icon fold-icon ivu-icon-android-arrow-dropright': params.row.children && i == (l - 1) && params.row.children.length>0,
										'fold-space': !(params.row.children && i == (l - 1))
									},
									on: {
										click: (e) => {
											if (tools.hasClass(e.target, 'fold-space')) return;
											let index = parseInt(e.target.getAttribute('index'));
											let fold = this.tableData[index].fold;
											let children = JSON.parse(e.target.getAttribute('children'));
											this.tableData[index].fold = fold ? 0 : 1;
											let tmp = [].concat(this.tableData);
											if (tools.hasClass(e.target, 'fold-on')) {
												close(tmp, params.row.children);
											} else {
												for (let i = 0; i < children.length; i++) {
													tmp.splice(index + i + 1, 0, children[i]);
												};
											}
											this.tableData = tmp;
										}
									}
								}));
							};
							return tpl;
						};
						return h('div', {
							class: 'fold-wrapper'
						}, [...getIcon(params.level),
							h('a', {
								class: 'link',
								attrs: {
									id: params.row.id
								},
								on: {
									click: (e) => {
										this.getDetail(e.target.id);
										this.modal = true;
									}
								}
							}, params.row.name)
						]);
					}
				},
				{
					title: '归属地区',
					key: 'areaName',
					width: 140
				}, {
					title: '机构代码',
					key: 'code',
					width: 140
				},
				{
					title: '机构类型',
					key: 'typeName',
					width: 140
				},
				{
					title: '备注',
					key: 'remarks'
				},
				{
					title: '操作',
					key: null,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									size: 'small'
								},
								attrs: {
									id: params.row.id
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.modal = true;
										this.modalTitle = '编辑机构';
										this.btnTxt = '保存';
										this.getDetail(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '修改'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								attrs: {
									id: params.row.id
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.modalDel = true;
										this.infoId = e.target.localName == 'span' ? e.target.parentNode.id : e.target.id;
									}
								}
							}, '删除')
						]);
					}
				}
			]
		}
	},
	created() {
		this.getTreeDataAll();
		this.getDataList();
	},
	methods: {
		change(e) {
			console.log(e);
		},
		getTreeDataAll() {
			this.API_treeDataAll({
				id: 0,
				type: 'office'
			}).then(d => {
				this.cleanData(d);
				this.treeDataAll = d;
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
					'ivu-tree-title-selected': data.id == this.parentId
				},
				on: {
					click: (e) => {
						this.parentId = tools.hasClass(e.target, 'ivu-tree-title-selected') ? '' : data.id;
						this.getDataList();
					}
				}
			}, data.name);
		},
		getDataList() {
			this.loading = true;
			this.API_officeList(this.parentId).then(d => {
				this.tableData = d;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		inDateChange(e) {
			console.log(e);
		},
		getDetail(id) {
			this.API_officeInfo(id).then(d => {
				console.log(d);
				d.sort = d.sort.toString();
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			this.modalTitle = '新增机构';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_officeDelete(this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
				this.getTreeDataAll();
			});
		},
		changePage() {

		},
		modalEdit() {
			console.log(this.modalForm);
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (this.modalForm == this.tmpForm) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						this.API_officeSave(this.modalForm).then(d => {
							console.log(d);
							setTimeout(() => {
								this.$Message.success('保存成功!');
								this.btnLoading = false;
								this.modal = false;
								this.getDataList();
								this.getTreeDataAll();
							}, 500);
						});
					}
				} else {
					this.$Message.error('请正确填写表单项!');
					return false;
				}
			});
		},
		modalCancel() {

		},
		modalChange(visible) {
			if (!visible) {
				this.$refs.modalForm.resetFields();
			}
		}
	}
}
</script>
