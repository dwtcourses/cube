<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="productId" label="产品编码">
			<Input type="text" v-model="form.productId" clearable></Input>
		</FormItem>
		<FormItem prop="productName" label="产品名称">
			<Input type="text" v-model="form.productName" clearable></Input>
		</FormItem>
		<FormItem prop="realaseDate" label="发布时间">
			<DatePicker :editable="false" :value="form.realaseDate" format="yyyy-MM-dd" type="date" @on-change="form.realaseDate=$event" placeholder="选择发布时间日期"></DatePicker>
		</FormItem>
		<FormItem prop="productState" label="产品状态">
			<dict-item v-model="form.productState" label="PRODUCT_STATE" style="width:120px"></dict-item>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">添加产品</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal :class="{'detail-ing':detailIng}" class="half-modal" v-model="modal" :title="modalTitle" @on-visible-change="modalChange" width="800">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="100">
			<FormItem prop="id" label="id" class="fn-hide">
				<Input type="text" v-model="modalForm.id" clearable></Input>
			</FormItem>
			<FormItem class="full-row" prop="productName" label="产品名称">
				<Input :readonly="detailIng" type="text" v-model="modalForm.productName" clearable placeholder="请输入产品名称"></Input>
			</FormItem>
			<FormItem prop="productPrice" label="产品价格">
				<Input :readonly="detailIng" type="text" v-model="modalForm.productPrice" clearable placeholder="请输入产品价格"></Input>
			</FormItem>
			<FormItem prop="startDate" label="有效时间">
				<date-item :readonly="detailIng" :editable="false" :value="[modalForm.startDate,modalForm.endDate]" format="yyyy-MM-dd" type="daterange" @on-change="validDateChange" placeholder="选择生效时间"></date-item>
			</FormItem>
			<FormItem prop="prepayTag" label="付费标志">
				<dict-item :disabled="detailIng" v-model="modalForm.prepayTag" label="PREPAY_TAG"></dict-item>
			</FormItem>
			<FormItem prop="overAllow" label="是否允许超出">
				<dict-item :disabled="detailIng" v-model="modalForm.overAllow" label="OVER_ALLOW" type="radio"></dict-item>
			</FormItem>
			<FormItem prop="productType" label="产品类型">
				<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.productType" label="PRODUCT_TYPE"></dict-item>
			</FormItem>
			<FormItem prop="belongTo" label="归属渠道">
				<ent-picker :disabled="detailIng" v-model="modalForm.belongTo"></ent-picker>
			</FormItem>
			<FormItem prop="templateId" label="通信模板">
				<Select :disabled="detailIng" v-model="modalForm.templateId" :transfer="true" clearable>
					<Option v-for="opt in templateList" :key="opt.key" :value="opt.templateId">{{opt.templateName}}</Option>
				</Select>
			</FormItem>
			<FormItem prop="ratePlanId" label="资费模板">
				<Select :disabled="detailIng" v-model="modalForm.ratePlanId" :transfer="true" clearable>
					<Option v-for="opt in ratePlanVersionList" :key="opt.key" :value="opt.ratePlanId">{{opt.ratePlanName}}</Option>
				</Select>
			</FormItem>
			<FormItem prop="gracePoriod" label="宽限期">
				<Input :readonly="detailIng" type="text" v-model="modalForm.gracePoriod" clearable placeholder="请输入宽限期"></Input>
			</FormItem>
			<FormItem prop="graceUnit" label="宽限期单位">
				<dict-item :disabled="detailIng" v-model="modalForm.graceUnit" label="GRACE_UNIT"></dict-item>
			</FormItem>
			<FormItem prop="serviceId" label="服务定义">
				<Select :disabled="detailIng" v-model="modalForm.serviceId" :transfer="true" clearable>
					<Option v-for="opt in serviceList" :key="opt.key" :value="opt.serviceId">{{opt.serviceName}}</Option>
				</Select>
			</FormItem>
			<FormItem v-if="modalForm.serviceId=='21000001'">
				<Input v-model="modalForm.resource" placeholder="5" style="width: 80px"></Input>
				<Input :readonly="true" v-model="modalForm.resourceUnit" placeholder="MB" style="width: 80px"></Input>
			</FormItem>
			<FormItem prop="productExplain" label="产品说明" class="full-row" :autosize="{ minRows: 3, maxRows: 6}">
				<Input :readonly="detailIng" type="textarea" v-model="modalForm.productExplain" clearable placeholder="请输入产品说明"></Input>
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
	<Modal class="release-modal" v-model="releaseModal" title="产品发布" width="80">
		<div class="release-wrapper">
			<div class="header">
				产品概览
			</div>
			<div class="product-preview">
				<ul>
					<li>
						<span class="tag">产品名称</span>
						<span class="content text">{{releaseProduct.productName}}</span>
					</li>
					<li>
						<span class="tag">产品归属</span>
						<ent-picker class="content" :disabled="true" v-model="releaseProduct.belongTo"></ent-picker>
					</li>
					<li>
						<span class="tag">通信模板</span>
						<Select class="content" :disabled="true" v-model="releaseProduct.templateId" :transfer="true">
							<Option v-for="opt in templateList" :key="opt.key" :value="opt.templateId">{{opt.templateName}}</Option>
						</Select>
					</li>
					<li>
						<span class="tag">资费模板</span>
						<Select class="content" :disabled="true" v-model="releaseProduct.ratePlanId" :transfer="true">
							<Option v-for="opt in ratePlanVersionList" :key="opt.key" :value="opt.ratePlanId">{{opt.ratePlanName}}</Option>
						</Select>
					</li>
					<li>
						<span class="tag">生效时间</span>
						<DatePicker class="content" :readonly="true" :editable="false" :value="releaseProduct.startDate" format="yyyy-MM-dd" type="date"></DatePicker>
					</li>
					<li>
						<span class="tag">失效时间</span>
						<DatePicker class="content" :readonly="true" :editable="false" :value="releaseProduct.endDate" format="yyyy-MM-dd" type="date"></DatePicker>
					</li>
					<li>
						<span class="tag">产品类型</span>
						<dict-item class="content" :disabled="true" :transfer="true" v-model="releaseProduct.productType" label="PRODUCT_TYPE"></dict-item>
					</li>
					<li>
						<span class="tag">服务定义</span>
						<Select class="content" :disabled="true" v-model="releaseProduct.serviceId" :transfer="true">
							<Option v-for="opt in serviceList" :key="opt.key" :value="opt.serviceId">{{opt.serviceName}}</Option>
						</Select>
					</li>
					<li class="textarea">
						<span class="tag">产品说明</span>
						<Input class="content" :readonly="true" type="textarea" v-model="releaseProduct.productExplain"></Input>
					</li>
				</ul>
			</div>
			<div class="header">
				产品发布
			</div>
			<div class="date-control">
				<Form ref="dateControlForm" :model="dateControlForm" :rules="dateControlrules" :label-width="100" :show-message="false">
					<FormItem prop="startDate" label="销售日期">
						<!-- <DatePicker type="date" placeholder="请选择销售日期" v-model="dateControlForm.startDate" @on-change="startDateChange"></DatePicker> -->
						<date-item :editable="false" :value="[dateControlForm.startDate,dateControlForm.endDate]" format="yyyy-MM-dd" type="daterange" @on-change="sellDateChange" placeholder="请选择销售日期"></date-item>
					</FormItem>
				</Form>
			</div>
			<div class="header">
				客户列表
			</div>
			<Form class="customer-form" :model="customerForm" :label-width="80">
				<FormItem prop="name" label="客户名称">
					<Input type="text" v-model="customerForm.name" clearable></Input>
				</FormItem>
				<FormItem prop="contactsPeople" label="联系人">
					<Input type="text" v-model="customerForm.contactsPeople" clearable></Input>
				</FormItem>
				<FormItem prop="customerManager" label="客户经理">
					<Input type="text" v-model="form.customerManager" clearable></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="customerQuery">查询</Button>
				</FormItem>
			</Form>
			<Table class="customer-table" border :data="customerList" :columns="customerColumns" stripe :loading="customerLoading" @on-selection-change="customerChange"></Table>
			<div style="margin: 10px;overflow: hidden" v-if="customerTotal>pageSize">
				<div style="float: right;">
					<Page show-total :total="customerTotal" :current="customerCurrPage" @on-change="changePage"></Page>
				</div>
			</div>
			<div class="header">
				客户可销售列表
			</div>
			<Table class="sale-customer-table" border :data="saleCustomerList" :columns="customerColumns" @on-selection-change="saleCustomerChange" stripe></Table>
		</div>
		<div slot="footer">
			<span class="error-msg">{{errMsg}}</span>
			<Button type="primary" :loading="releaseLoading" @click="release">发布</Button>
		</div>
		<Spin size="large" fix v-if="releaseSpin"></Spin>
	</Modal>
</div>
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'
import entPicker from '@/views/my-components/custom/ent-picker'
import dateItem from '@/views/my-components/custom/date-item'

import tools from '@/libs/tools.js'

export default {
	components: {
		dictItem,
		entPicker,
		dateItem
	},
	data() {
		return {
			form: {
				productId: '',
				productName: '',
				realaseDate: '',
				productState: ''
			},
			queryForm: null,
			modalForm: {
				id: '',
				productName: '',
				productPrice: '',
				prepayTag: '',
				productExplain: '',
				startDate: '',
				endDate: '',
				overAllow: '1',
				productType: '',
				belongTo: '',
				serviceId: '',
				productType: '',
				ratePlanId: '',
				templateId: '',
				resource: '5',
				resourceUnit: 'MB',
				gracePoriod:'',
				graceUnit:''
			},
			tmpForm: {},
			dateControlForm: {
				startDate: '',
				endDate: ''
			},
			dateControlrules: {
				startDate: [{
					required: true,
					message: '上架日期为必填项',
					trigger: 'change'
				}],
				endDate: [{
					required: true,
					message: '下架日期为必填项',
					trigger: 'change'
				}],
			},
			customerForm: {
				name: '',
				contactsPeople: '',
				customerManager: ''
			},
			releaseProduct: {},
			releaseForm: {

			},
			rules: {
				productName: [{
					required: true,
					message: '产品名称为必填项',
					trigger: 'blur'
				}],
				prepayTag: [{
					required: true,
					message: '付费标志为必填项',
					trigger: 'change'
				}],
				productExplain: [{
					required: true,
					message: '产品说明为必填项',
					trigger: 'blur'
				}],
				startDate: [{
					required: true,
					message: '生效时间为必填项',
					trigger: 'blur'
				}],
				productPrice: [{
					required: true,
					type: 'number',
					message: '请正确填写产品价格',
					trigger: 'blur',
					min: 1,
					transform(value) {
						return Number(value);
					}
				}],
				productType: [{
					required: true,
					message: '产品类型为必填项',
					trigger: 'change'
				}],
				belongTo: [{
					required: true,
					message: '归属渠道为必填项',
					trigger: 'change'
				}],
				templateId: [{
					required: true,
					message: '通信模板为必填项',
					trigger: 'change'
				}],
				ratePlanId: [{
					required: true,
					message: '通信模板为必填项',
					trigger: 'change'
				}],
				serviceId: [{
					required: true,
					message: '服务定义为必填项',
					trigger: 'change'
				}],
				gracePoriod: [{
					required: true,
					message: '宽限期为必填项',
					trigger: 'blur'
				}],
				graceUnit: [{
					required: true,
					message: '宽限期单位为必填项',
					trigger: 'change'
				}],
			},
			modal: false,
			modalDel: false,
			releaseModal: false,
			modalTitle: '新增',
			btnTxt: '新增',
			currPage: 1,
			infoId: '',
			pageSize: this.$store.state.app.pageSize,
			total: 0,
			loading: false,
			btnLoading: false,
			delLoading: false,
			releaseLoading: false,
			editIng: false,
			detailIng: false,
			detailSpin: false,
			releaseSpin: false,
			tableData: [],
			serviceList: [],
			ratePlanVersionList: [],
			templateList: [],
			customerList: [],
			saleCustomerList: [],
			customerLoading: false,
			customerTotal: 0,
			customerCurrPage: 1,
			errMsg: '',
			tableColumns: [{
					type: 'selection',
					width: 60,
					align: 'center'
				}, {
					title: '产品编码',
					key: 'productId',
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
						}, params.row.productId);
					}
				},
				{
					title: '产品名称',
					key: 'productName',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.productName
							}
						}, params.row.productName);
					}
				},
				{
					title: '产品价格',
					key: 'productPrice',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.productPrice), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.productPrice), '￥'));
					}
				},
				{
					title: '所属客户',
					key: 'belongTo',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.custMap.value
							}
						}, params.row.custMap.value);
					}
				},
				{
					title: '产品状态',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.productStateMap.value
							}
						}, params.row.productStateMap.value);
					}
				},
				{
					title: '操作',
					key: null,
					render: (h, params) => {
						let btns = [];
						if (params.row.productStateMap.key != '2') {
							btns.push(h('Button', {
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
							}, '修改'));
						};
						if (params.row.productStateMap.key == '1' || params.row.productStateMap.key == '4') {
							btns.push(h('Button', {
								props: {
									type: 'success',
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
										this.productPutaway(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '上架'));
						};
						if (params.row.productStateMap.key == '3') {
							btns.push(h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								attrs: {
									id: params.row.id,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: (e) => {
										e.stopPropagation();
										e.preventDefault();
										this.releaseModal = true;
										this.releaseSpin = true;
										this.getDetail(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '发布'));
						};
						if (params.row.productStateMap.key == '3' || params.row.productStateMap.key == '2') {
							btns.push(h('Button', {
								props: {
									type: 'warning',
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
										this.productSoldOut(e.target.localName == 'span' ? e.target.parentNode.id : e.target.id);
									}
								}
							}, '下架'));
						};
						// if (params.row.productStateMap.key == '4') {
						// 	btns.push(h('Button', {
						// 		props: {
						// 			type: 'error',
						// 			size: 'small'
						// 		},
						// 		attrs: {
						// 			id: params.row.id
						// 		},
						// 		on: {
						// 			click: (e) => {
						// 				e.stopPropagation();
						// 				e.preventDefault();
						// 				this.modalDel = true;
						// 				this.infoId = e.target.localName == 'span' ? e.target.parentNode.id : e.target.id;
						// 			}
						// 		}
						// 	}, '删除'));
						// };
						return h('div', btns);
					}
				}
			],
			customerColumns: [{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '客户名称',
					key: 'name',
				},
				{
					title: '联系人',
					key: 'contactsPeople',
				},
				{
					title: '客户地址',
					key: 'address',
				},
				{
					title: '客户经理',
					key: null,
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.customerManagerMap ? params.row.customerManagerMap.label : ''
							}
						}, params.row.customerManagerMap ? params.row.customerManagerMap.label : '');
					}
				},
			]
		}
	},
	created() {
		this.getDataList();
		this.qryTdBServiceList();
		this.qryTdBRatePlanVersionList();
		this.qryTdBTemplateList();
	},
	methods: {
		validDateChange(e) {
			[this.modalForm.startDate, this.modalForm.endDate] = e;
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_qryList('/a/product/tdBProduct/qryTdBProductListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/product/tdBProduct/qryTdBProductById', id).then(d => {
				d.productPrice = this.$filter.fen2yuan(d.productPrice);
				this.detailSpin = false;
				this.releaseSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
				this.releaseProduct = Object.assign({}, this.tmpForm);
			});
		},
		add(e) {
			console.log(e);
			this.modalTitle = '新增';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del() {
			this.delLoading = true;
			console.log(this.infoId);
			this.API_delInfo("/a/product/tdBProduct/deleteTdBProduct", this.infoId).then(d => {
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
			console.log(this.modalForm);
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if (tools.isEqual(this.modalForm, this.tmpForm)) {
						this.modal = false;
					} else {
						this.btnLoading = true;
						let data = Object.assign({}, this.modalForm);
						data.productPrice = this.$filter.yuan2fen(data.productPrice);
						this.API_savaInfo('/a/product/tdBProduct/saveTdBProduct', data).then(d => {
							console.log(d);
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
			if (!visible) {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.editIng = false;
				this.detailIng = false;
			}
		},
		query(name) {
			console.log(this.start);
			console.log(this.end);
			// this.queryForm = this.form;
			// this.currPage = 1;
			// this.$refs[name].validate((valid) => {
			// 	if (valid) {
			// 		this.getDataList();
			// 	} else {
			// 		this.$Message.error('请正确填写表单!');
			// 	}
			// })
		},
		qryTdBServiceList() {
			this.API_qryTdBServiceList().then(d => {
				this.serviceList = d;
			})
		},
		qryTdBRatePlanVersionList() {
			this.API_qryTdBRatePlanVersionList().then(d => {
				this.ratePlanVersionList = d;
			})
		},
		qryTdBTemplateList() {
			this.API_qryTdBTemplateList().then(d => {
				this.templateList = d;
			})
		},
		productPutaway(id) {
			this.API_productPutaway(id).then(d => {
				console.log(d);
				this.$Message.success('上架成功!');
				this.getDataList();
			});
		},
		productSoldOut(id) {
			this.API_productSoldOut(id).then(d => {
				console.log(d);
				this.$Message.success('下架成功!');
				this.getDataList();
			});
		},
		productRelease() {
			this.releaseLoading = true;
			let custIdArray = [];
			for (let item of this.saleCustomerList) {
				custIdArray.push(item.id);
			};
			let data = Object.assign({
				productId: this.releaseProduct.productId,
				custIdArray
			}, this.dateControlForm);
			this.API_productRelease(data).then(d => {
				this.$Message.success('发布成功!');
				this.$Notice.success({
					title: '发布成功!'
				});
				this.getDataList();
				setTimeout(() => {
					this.releaseLoading = false;
					this.releaseModal = false;
				}, 500)
			}).catch(e => {
				this.releaseLoading = false;
				this.$Message.error('发布失败!');
				this.$Notice.error({
					title: '发布失败!'
				});
			});
		},
		release() {
			this.$refs.dateControlForm.validate((valid => {
				if (valid) {
					this.errMsg = '';
					if (this.saleCustomerList.length === 0) {
						this.errMsg = '请填至少选择一个销售客户';
					} else {
						this.errMsg = '';
						this.productRelease();
					}
				} else {
					this.errMsg = '请填选择正确的上下架日期'
				}
			}));
		},
		customerQuery() {
			this.customerCurrPage = 1;
			this.getCustomerList();
		},
		getCustomerList() {
			this.customerLoading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.customerForm);
			this.API_qryList('/a/ent/info/qryInfoListByCon', queryParam).then(d => {
				this.customerList = d.page.list;
				this.customerTotal = d.page.count;
				setTimeout(() => {
					this.customerLoading = false;
				}, 500);
			});
		},
		customerChange(v) {
			let obj = undefined;
			for (let item of v) {
				obj = item;
			};
			this.saleCustomerList.push(obj);
			let i = -1;
			this.customerList.forEach((item, index) => {
				if (obj.id === item.id) {
					i = index;
				}
			});
			this.customerList.splice(i, 1);
			this.errMsg = '';
		},
		saleCustomerChange(v) {
			let obj = undefined;
			for (let item of v) {
				obj = item;
			};
			this.customerList.push(obj);
			let i = -1;
			this.saleCustomerList.forEach((item, index) => {
				if (item.id === obj.id) {
					i = index;
				}
			});
			this.saleCustomerList.splice(i, 1);
			if (this.saleCustomerList.length === 0) {
				this.errMsg = '请填至少选择一个销售客户';
			}
		},
		sellDateChange(e) {
			[this.dateControlForm.startDate, this.dateControlForm.endDate] = e;
		},
		endDateChange(d) {
			this.dateControlForm.endDate = d;
			if (this.dateControlForm.startDate && this.dateControlForm.endDate) {
				this.errMsg = '';
				if (this.$filter.dayjs(this.dateControlForm.startDate).isAfter(this.dateControlForm.endDate)) {
					this.errMsg = '下架日期必须晚于上架日期';
				} else {
					this.errMsg = '';
				}
			}
		}
	}
}
</script>
<style lang="less">
@import "./product.less";
</style>
