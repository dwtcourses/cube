<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="name" label="企业名称">
			<Input type="text" v-model="form.name" clearable></Input>
		</FormItem>
		<FormItem prop="contactsPeople" label="联系人">
			<Input type="text" v-model="form.contactsPeople" clearable></Input>
		</FormItem>
		<FormItem prop="contactsPhone" label="联系人电话">
			<Input type="text" v-model="form.contactsPhone" clearable></Input>
		</FormItem>
		<!-- <FormItem prop="customerManager" label="客户经理">
			<Input type="text" v-model="form.customerManager" clearable></Input>
		</FormItem> -->
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加企业</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal :class="{'detail-ing':detailIng}" v-model="modal" :title="modalTitle" @on-ok="modalEdit"  @on-visible-change="modalChange" width="800">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="100">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<Tabs v-model="tab">
				<TabPane label="基本资料" name="basics">
					<FormItem prop="name" label="企业名称">
						<Input :readonly="detailIng" type="text" v-model="modalForm.name" clearable placeholder="请输入企业名称"></Input>
					</FormItem>
					<FormItem prop="officeId" label="对应机构树" class="hastree" v-show="!editIng || (editIng &&modalForm.officeId)">
						<tree-select :disabled="detailIng" v-model="modalForm.officeId" type="office" :multiple="false" placeholder="请选择机构"></tree-select>
					</FormItem>
					<FormItem prop="address" label="地址">
						<Input :readonly="detailIng" type="text" v-model="modalForm.address" clearable placeholder="请输入地址"></Input>
					</FormItem>
					<FormItem prop="industryId" label="行业类型">
						<tree-select :disabled="detailIng" v-model="modalForm.industryId" type="custom" :multiple="false" placeholder="请选择机构" tableName="tf_ent_industry"></tree-select>
					</FormItem>
					<FormItem prop="type" label="企业类型">
						<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.type" label="ENT_INFO_TYPE"></dict-item>
					</FormItem>
					<FormItem prop="devolop" label="发展人">
						<Input :readonly="detailIng" type="text" v-model="modalForm.devolop" clearable placeholder="请输入发展人"></Input>
					</FormItem>
					<FormItem v-show="!detailIng" prop="customerManager" label="客户经理">
						<customer-manager :readonly="detailIng" v-model="modalForm.customerManager"></customer-manager>
					</FormItem>
					<FormItem v-if="detailIng" label="客户经理">
						<Input :readonly="detailIng" type="text" v-model="modalForm.customerManagerMap.label"></Input>
					</FormItem>
					<FormItem prop="state" label="状态" v-show="editIng">
						<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.state" label="ENT_INFO_STATE"></dict-item>
					</FormItem>
					<FormItem prop="certType" label="证件类型">
						<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.certType" label="ENT_INFO_CERT_TYPE"></dict-item>
					</FormItem>
					<FormItem prop="certCode" label="证件号码">
						<Input :readonly="detailIng" type="text" v-model="modalForm.certCode" clearable placeholder="请输入证件号码"></Input>
					</FormItem>
					<FormItem prop="photoFront" label="证件照">
						<upload v-show="!detailIng" v-model="modalForm.photoFront"></upload>
					</FormItem>
					<FormItem prop="starLevel" label="星级">
						<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.starLevel" label="ENT_INFO_STAR_LEVEL"></dict-item>
					</FormItem>
					<FormItem prop="starLevelQuota" label="星级额度">
						<Input :readonly="detailIng" type="text" v-model="modalForm.starLevelQuota" clearable placeholder="请输入星级额度"></Input>
					</FormItem>
					<FormItem prop="remarks" label="备注">
						<Input :readonly="detailIng" v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="请输入备注"></Input>
					</FormItem>
				</TabPane>
				<TabPane label="联系人法人信息" name="contacts">
					<FormItem prop="legalPeople" label="法人">
						<Input :readonly="detailIng" type="text" v-model="modalForm.legalPeople" clearable placeholder="请输入法人"></Input>
					</FormItem>
					<FormItem prop="legalPeopleCard" label="法人证件号">
						<Input :readonly="detailIng" type="text" v-model="modalForm.legalPeopleCard" clearable placeholder="请输入法人证件号"></Input>
					</FormItem>
					<FormItem prop="contactsPeople" label="联系人">
						<Input :readonly="detailIng" type="text" v-model="modalForm.contactsPeople" clearable placeholder="请输入联系人"></Input>
					</FormItem>
					<FormItem prop="contactsPhone" label="联系人电话">
						<Input :readonly="detailIng" type="text" v-model="modalForm.contactsPhone" clearable placeholder="请输入联系人电话"></Input>
					</FormItem>
				</TabPane>
			</Tabs>
		</Form>
		<div slot="footer">
			<Button v-if="!detailIng" type="primary" @click="modalEdit" :loading="btnLoading">{{btnTxt}}</Button>
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
import customerManager from '@/views/my-components/custom/customer-manager'
import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'
import upload from '@/views/my-components/custom/upload'

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		treeSelect,
		upload,
		customerManager
	},
	data() {
		return {
			form: {
				name: '',
				contactsPeople: '',
				contactsPhone: '',
				customerManager: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				name: '',
				officeId: '',
				address: '',
				industryId: '',
				legalPeople: '',
				legalPeopleCard: '',
				contactsPeople: '',
				contactsPhone: '',
				certType: '',
				certCode: '',
				devolop: '',
				customerManager: '',
				state: '',
				photoFront: '',
				starLevel: '',
				starLevelQuota: '',
				remarks: ''
			},
			tmpForm: {},
			rules: {
				name: [{
					required: true,
					message: '企业名称为必填项',
					trigger: 'blur'
				}],
				office: [{
					required: true,
					message: '对应机构树为必填项',
					trigger: 'blur'
				}],
				industryId: [{
					required: true,
					message: '行业类型为必填项',
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: '企业类型为必填项',
					trigger: 'blur'
				}],
				certType: [{
					required: true,
					message: '证件类型为必填项',
					trigger: 'blur'
				}],
				certCode: [{
					required: true,
					message: '证件号码为必填项',
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增',
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
			tab: 'basics',
			tableData: [],
			tableColumns: [{
					title: '企业名称',
					key: 'name',
					render: (h, params) => {
						return h('a', {
							class: 'link',
							attrs: {
								id: params.row.id
							},
							on: {
								click: (e) => {
									this.modal = true;
									this.modalTitle = '详情';
									this.detailIng = true;
									this.detailSpin = true;
									this.getDetail(e.target.id);
								}
							}
						}, params.row.name);
					}
				},
				{
					title: '企业类型',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.typeMap.label
							}
						}, params.row.typeMap.label);
					}
				},
				{
					title: '行业类型',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.industryMap.label
							}
						}, params.row.industryMap.label);
					}
				},
				{
					title: '联系人',
					key: 'contactsPeople',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.contactsPeople
							}
						}, params.row.contactsPeople);
					}
				},
				{
					title: '联系人电话',
					key: 'contactsPhone',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.contactsPhone
							}
						}, params.row.contactsPhone);
					}
				},
				{
					title: '客户经理',
					key: 'customerManager',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.customerManagerMap ? params.row.customerManagerMap.label : ''
							}
						}, params.row.customerManagerMap ? params.row.customerManagerMap.label : '');
					}
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
										this.detailSpin = true;
										this.modal = true;
										this.modalTitle = '编辑';
										this.btnTxt = '保存';
										this.editIng = true;
										this.getDetail(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '修改'),
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
		change(e) {
			console.log(e);
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/ent/info/qryInfoListByCon', queryParam).then(d => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			});
		},
		getDetail(id) {
			this.API_qryInfoById('/a/ent/info/qryInfoById', id).then(d => {
				d.officeId = d.office ? d.office : null;
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			this.modalTitle = '新增';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_delInfo("/a/ent/info/deleteInfo", this.infoId).then(d => {
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
						let url = this.editIng ? '/a/ent/info/entInfoEdit' : '/a/ent/info/entInfoAdd';
						this.API_savaInfo(url, this.modalForm).then(d => {
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
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.editIng = false;
				this.detailIng = false;
				this.tab = 'basics';
			}
		},
		query(name) {
			this.queryForm = this.form;
			this.currPage = 1;
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.getDataList();
				} else {
					this.$Message.error('请正确填写表单!');
				}
			})
		},
	}
}
</script>
