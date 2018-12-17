<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="name" label="计划名称">
			<Input type="text" v-model="form.name" clearable placeholder="请输入计划名称"></Input>
		</FormItem>
		<FormItem prop="validTag" label="有效标志">
			<dict-item placeholder="请选择有效标志" v-model="form.validTag" style="width:120px" label="commistion_valid_tag"></dict-item>
		</FormItem>
		<FormItem prop="startTime" label="开始时间">
			<DatePicker :editable="false" :value="form.startTime" type="date" @on-change="form.startTime=$event" placeholder="选择开始时间开始日期"></DatePicker>
		</FormItem>
		<FormItem prop="endTime" label="结束时间">
			<DatePicker :editable="false" :value="form.endTime" type="date" @on-change="form.endTime=$event" placeholder="选择结束时间开始日期"></DatePicker>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加配置</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal class="half-modal" v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-visible-change="modalChange" width="800">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="100">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem class="full-row" prop="name" label="计划名称">
				<Input :readonly="detailIng" type="text" v-model="modalForm.name" clearable placeholder="请输入计划名称"></Input>
			</FormItem>
			<FormItem prop="validTag" label="有效标志">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.validTag" label="commistion_valid_tag" placeholder="请选择有效标志"></dict-item>
			</FormItem>
			<FormItem prop="type" label="计算类型">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.type" label="commistion_type" placeholder="请选择计算类型"></dict-item>
			</FormItem>
			<FormItem prop="fee1" label="金额1(&lt;=)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.fee1" clearable placeholder="请输入金额1"></Input>
			</FormItem>
			<FormItem prop="ratio1" label="比例1(%)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.ratio1" clearable placeholder="请输入比例1"></Input>
			</FormItem>
			<FormItem prop="fee2" label="金额2(&lt;=)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.fee2" clearable placeholder="请输入金额2"></Input>
			</FormItem>
			<FormItem prop="ratio2" label="比例2(%)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.ratio2" clearable placeholder="请输入比例2"></Input>
			</FormItem>
			<FormItem prop="fee3" label="金额3(&gt;)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.fee3" clearable placeholder="请输入金额3"></Input>
			</FormItem>
			<FormItem prop="ratio3" label="比例3(%)">
				<Input :readonly="detailIng" type="text" v-model="modalForm.ratio3" clearable placeholder="请输入比例3"></Input>
			</FormItem>
			<FormItem prop="startTime" label="开始时间">
				<DatePicker :disabled="detailIng" :editable="false" :value="modalForm.startTime" type="date" @on-change="modalForm.startTime=$event" placeholder="选择开始时间开始日期"></DatePicker>
			</FormItem>
			<FormItem prop="endTime" label="结束时间">
				<DatePicker :disabled="detailIng" :editable="false" :value="modalForm.endTime" type="date" @on-change="modalForm.endTime=$event" placeholder="选择结束时间开始日期"></DatePicker>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="primary" @click="modalEdit" :loading="btnLoading">{{btnTxt}}</Button>
		</div>
		<Spin size="large" fix v-if="detailSpin"></Spin>
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
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
	},
	data() {
		return {
			form: {
				name: '',
				validTag: '',
				startTime: '',
				endTime: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				name: '',
				validTag: '',
				type: '',
				fee1: '',
				ratio1: '',
				fee2: '',
				ratio2: '',
				fee3: '',
				ratio3: '',
				startTime: '',
				endTime: ''
			},
			tmpForm: {},
			rules: {},
			modal: false,
			modalDel: false,
			modalTitle: '新增配置',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			editIng: false,
			detailIng: false,
			detailSpin: false,
			tableData: [],
			rules: {
				name: [{
					required: true,
					message: '计划名称为必填项',
					trigger: 'blur'
				}],
				validTag: [{
					required: true,
					message: '有效标志为必填项',
					trigger: 'change'
				}],
				type: [{
					required: true,
					message: '计算类型为必填项',
					trigger: 'change'
				}],
				fee1: [{
					required: true,
					trigger: 'blur',
					transform(value) {
						return Number(value);
					},
					validator: (rule, value, callback) => {
						if (!value) {
							return callback(new Error('金额1不能为空'));
						} else {
							if (typeof value != 'number') {
								callback(new Error('金额1必须为数字'));
							} else if (value <= 0) {
								callback(new Error('金额1必须大于0'));
							} else if (value >= this.modalForm.fee2) {
								callback(new Error('金额1必须小于金额2'));
							}else{
								callback();
							}
						}
					},
				}],
				ratio1: [{
					required: true,
					type: 'number',
					message: '请正确填写比例1',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
				fee2: [{
					required: true,
					type: 'number',
					message: '请正确填写金额2',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					},

				}],
				ratio2: [{
					required: true,
					type: 'number',
					message: '请正确填比例2',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
				fee3: [{
					required: true,
					type: 'number',
					message: '请正确填写金额3',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
				ratio3: [{
					required: true,
					type: 'number',
					message: '请正确填比例3',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
				startTime: [{
					required: true,
					message: '开始时间为必填项',
					trigger: 'change'
				}],
				endTime: [{
					required: true,
					message: '结束时间为必填项',
					trigger: 'change'
				}]
			},
			tableColumns: [{
					title: '主键标识',
					key: 'id',
					render: (h, params) => {
						return h('a', {
							class: 'link',
							attrs: {
								id: params.row.id
							},
							on: {
								click: (e) => {
									this.modalTitle = '详情';
									this.modal = true;
									this.detailIng = true;
									this.detailSpin = true;
									this.getDetail(e.target.id);
								}
							}
						}, params.row.id);
					}
				},
				{
					title: '有效标识',
					key: 'validTagName',
				},
				{
					title: '计划名称',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.name
							}
						}, params.row.name);
					}
				},
				{
					title: '金额1(<=)',
					key: 'fee1',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.fee1), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.fee1), '￥'));
					}
				},
				{
					title: '比例1(%)',
					key: 'ratio1',
					width: 100,
					align: 'center',
				},
				{
					title: '金额2(<=)',
					key: 'fee2',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.fee2), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.fee1), '￥'));
					}
				},
				{
					title: '比例2(%)',
					key: 'ratio2',
					width: 100,
					align: 'center',
				},
				{
					title: '金额3(>)',
					key: 'fee3',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.fee3), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.fee3), '￥'));
					}
				},
				{
					title: '比例3(%)',
					key: 'ratio3',
					width: 100,
					align: 'center',
				},
				{
					title: '开始时间',
					key: 'startTime',
					width: 120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.startTime)
							}
						}, this.$filter.date(params.row.startTime));
					}
				},
				{
					title: '结束时间',
					key: 'endTime',
					width: 120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.endTime)
							}
						}, this.$filter.date(params.row.endTime));
					}
				},
				{
					title: '操作',
					key: null,
					width: 130,
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
										this.detailSpin = true;
										this.modal = true;
										this.modalTitle = '编辑';
										this.btnTxt = '保存';
										this.editIng = true;
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
		this.getDataList();
	},
	methods: {
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/commission/commissionConfig/qryCommissionConfigListByCon', queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		inDateChange(e) {
			console.log(e);
		},
		getDetail(id) {
			this.API_qryInfoById('/a/commission/commissionConfig/qryCommissionConfigById', id).then(d => {
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			this.modalTitle = '新增配置';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			this.API_delInfo("/a/commission/commissionConfig/deleteCommissionConfig", this.infoId).then(d => {
				setTimeout(() => {
					this.modalDel = false;
					this.delLoading = false;
				}, 500);
				this.getDataList();
			});
		},
		changePage(page) {
			console.log(page);
			this.currPage = page;
			this.getDataList();
		},
		modalEdit() {
			delete this.modalForm['__ob__'];
			delete this.tmpForm['__ob__'];
			this.$refs.modalForm.validate((valid) => {
				if (valid) {

					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						let data = Object.assign({}, this.modalForm);
						data.fee1 = this.$filter.yuan2fen(data.fee1);
						data.fee2 = this.$filter.yuan2fen(data.fee2);
						data.fee3 = this.$filter.yuan2fen(data.fee3);
						this.API_savaInfo("/a/commission/commissionConfig/saveCommissionConfig", data).then(d => {
							setTimeout(() => {
								this.$Message.success('保存成功!');
								this.btnLoading = false;
								this.modal = false;
								this.getDataList();
							}, 500);
						}).catch(e => {
							setTimeout(() => {
								this.$Message.error('保存失败请重试!');
								this.btnLoading = false;
							}, 500);
						});
					}
				} else {
					this.$Message.error('请正确填写表单!');
					return false;
				}
			});
		},
		modalCancel() {

		},
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
			}
		},
		query(name) {
			console.log(this.form);
			this.queryForm = this.form;
			this.currPage = 1;
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.getDataList();
				} else {
					this.$Message.error('请正确填写表单!');
				}
			})
		}
	}
}
</script>
