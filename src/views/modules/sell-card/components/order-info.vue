<template>
<div class="order-info-main">
	<Table :disabled-hover="true" size="large" :columns="columns" :data="data"></Table>
	<div class="order-remark">
		<span>订单备注</span>
		<Input v-model="remarks" type="textarea" :rows="4" placeholder="请输入交易说明..." @input="remarksInput"></Input>
	</div>
	<div class="header">
		配送方式
	</div>
	<div class="logistics-amount">
		<div class="logistics">
			<div class="logistics-type">
				<dict-item v-model="logistics.type" type="radio-button" label="LOGISTICS_TYPE"></dict-item>
			</div>
			<Form ref="logisticsForm" :model="logisticsForm" :rules="rules" :label-width="80">
				<FormItem v-if="logistics.type==1" label="自提门店" prop="branchDisplay">
					<Input :readonly="true" @on-focus="showStoreList" v-model="logisticsForm.branchDisplay" placeholder="请选择自提门店" icon="arrow-right-c"></Input>
				</FormItem>
				<FormItem v-if="logistics.type==2" label="物流公司" prop="logisticsCompany">
					<Select v-model="logisticsForm.logisticsCompany" placeholder="请选择物流公司">
						<Option :value="item.id" v-for="item in logisticsCompanyList" :key="item.key">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem v-if="logistics.type==2" label="收货地址" prop="addressDisplay">
					<Input :readonly="true" @on-focus="showAddressList" v-model="logisticsForm.addressDisplay" placeholder="请选择收货地址" icon="arrow-right-c"></Input>
				</FormItem>
			</Form>
		</div>
		<div class="amount">
			<p>
				<span>
					<em>总</em>
					<em>卡</em>
					<em>数</em>
				</span>
				<i>{{orderInfo.tfBTradeSale.num}}</i>
			</p>
			<p>
				<span>
					<em>单</em>
					<em>价</em></span>
				<i>{{orderInfo.tfBTradeSale.price | fen2yuan | currency('￥')}}</i>
			</p>
			<p>
				<span>
					<em>应</em>
					<em>付</em></span>
				<i class="total">{{orderInfo.tfBTradeSale.totalPrice | fen2yuan | currency('￥')}}</i>
			</p>
		</div>
	</div>
	<Modal class="branches-modal" v-model="storeModal" title="请选择自提门店" width="640">
		<RadioGroup v-model="storeId" vertical @on-change="branchChange">
			<Radio :label="item.id" v-for="item in branches" :key="item.key">
				<span v-html="$filter.branchLayout(item,'html')"></span>
			</Radio>
		</RadioGroup>
		<div slot="footer"></div>
	</Modal>
	<Modal class="address-list-modal" v-model="addressListModal" title="请选择收货地址" width="640">
		<RadioGroup v-model="addressId" vertical @on-change="addressChange">
			<Radio :label="item.id" v-for="item in addressList" :key="item.key">
				<span v-html="$filter.addressLayout(item)"></span>
			</Radio>
		</RadioGroup>
		<div slot="footer" class="fn-clear">
			<Button class="fn-left add-address" type="text" icon="ios-plus-empty" @click="addAddressShow">
				新增地址
			</Button>
		</div>
	</Modal>
	<Modal class="add-address-modal" v-model="addAddressModal" title="添加收货地址" width="760" @on-visible-change="addChange">
		<Form ref="addAddressForm" :model="addressForm" :rules="addressRules" :label-width="80">
			<FormItem label="所在地区" prop="area">
				<al-selector class="region-selector" data-type="name" v-model="addressForm.area" level="3" />
			</FormItem>
			<FormItem label="收货人" prop="contactName">
				<Input v-model="addressForm.contactName" placeholder="请输入收货人姓名"></Input>
			</FormItem>
			<FormItem label="详细地址" prop="address">
				<Input v-model="addressForm.address" placeholder="请输入详细地址"></Input>
			</FormItem>
			<FormItem label="手机号码" prop="contactTel">
				<Input v-model="addressForm.contactTel" placeholder="请输入手机号码"></Input>
			</FormItem>
			<FormItem label="邮政编码" prop="zipCode">
				<Input v-model="addressForm.zipCode" placeholder="请输入邮政编码"></Input>
			</FormItem>
		</Form>
		<div slot="footer">
			<!-- <span class="error-msg"></span> -->
			<Button type="primary" @click="addAddressSure" :loading="saveLoading">确认</Button>
		</div>
	</Modal>
</div>
</template>
<script>
import dictItem from '@/views/my-components/custom/dict-item'
import Vue from 'vue';
import iviewArea from 'iview-area';
Vue.use(iviewArea);

export default {
	name: 'order-info',
	components: {
		dictItem
	},
	data() {
		return {
			nextLoading:false,
			canNext: false,
			productInfo: Object.assign({}, this.$store.state.app.productInfo),
			orderInfo: Object.assign({}, this.$store.state.app.orderInfo),
			branches: [],
			addressList: [],
			logisticsCompanyList: [],
			storeId: undefined,
			addressId: undefined,
			logistics: this.$store.state.app.orderInfo.tfBTradeLogistics ? this.$store.state.app.orderInfo.tfBTradeLogistics : {
				type: '2',
				logisticsCompany: undefined,
				addressId: undefined,
			},
			logisticsForm: {
				logisticsCompany: undefined,
				branchDisplay: undefined,
				addressDisplay: undefined
			},
			addressForm: {
				area: [],
				contactName: '',
				address: '',
				contactTel: '',
				zipCode: ''
			},
			addressRules: {
				area: [{
					required: true,
					type: 'array',
					min: 3,
					message: '所在地区为必填项',
					trigger: 'change'
				}],
				contactName: [{
					required: true,
					message: '请填写收货人姓名',
					trigger: 'blur'
				}],
				address: [{
					required: true,
					message: '请填写详细地址',
					trigger: 'blur'
				}],
				contactTel: [{
					pattern: /^1[3|4|5|7|8|9][0-9]{9}$/,
					required: true,
					message: '请填写手机号码',
					trigger: 'blur',
				}],
			},
			remarks: '',
			storeModal: false,
			addressListModal: false,
			addAddressModal: false,
			saveLoading: false,
			columns: [{
					title: '商品名称',
					key: 'productName'
				},
				{
					title: '卡单价',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.price), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.price), '￥'));
					}
				},
				{
					title: '销售对象',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.salesObject.value
							}
						}, params.row.salesObject.value);
					}
				},
				{
					title: '数量',
					key: 'num'
				},
				{
					title: '总价',
					key: null,
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.currency(this.$filter.fen2yuan(params.row.totalPrice), '￥')
							}
						}, this.$filter.currency(this.$filter.fen2yuan(params.row.totalPrice), '￥'));
					}
				}
			],
			data: [Object.assign({}, this.$store.state.app.productInfo)]
		}
	},
	watch: {
		addressId(n) {
			this.logistics.addressId = n;
			this.addressDisplay();
		},
		storeId(n) {
			this.logistics.addressId = n;
			this.branchDisplay();
		},
		'logistics.type': function(n) {
			this.$refs.logisticsForm.resetFields();
			if (n == '1') {
				this.logistics.addressId = this.storeId;
				this.branchDisplay();
			} else {
				this.logistics.addressId = this.addressId;
				this.addressDisplay();
			}
			this.validate(n);
		},
		logisticsForm: {
			handler: function(val) {
				this.validate(this.logistics.type);
			},
			deep: true
		}
	},
	computed: {
		rules() {
			if (this.logistics.type == 1) {
				return {
					branchDisplay: [{
						required: true,
						message: '请选择自提地点',
						trigger: 'change'
					}]
				}
			} else {
				return {
					logisticsCompany: [{
						required: true,
						message: '请选择物流公司',
						trigger: 'change'
					}],
					addressDisplay: [{
						required: true,
						message: '请选择收货地址',
						trigger: 'change'
					}],
				}
			}
		},
	},
	created() {
		console.log(this.$store.state.app.orderInfo);
		this.qryShopList();
		this.qryLogisticsCompanyList();
		this.qryAddressList();
	},
	methods: {
		showStoreList() {
			this.storeModal = true;
		},
		showAddressList() {
			this.addressListModal = true;
		},
		addAddressShow() {
			this.addressListModal = false;
			this.addAddressModal = true;
		},
		addAddressSure() {
			this.$refs.addAddressForm.validate(valid => {
				this.saveReceivingAddress();
			})
		},
		addChange(visible) {
			if (!visible) {
				this.$refs.addAddressForm.resetFields();
			}
		},
		qryShopList() {
			this.API_qryShopListByCon().then(d => {
				console.log(d);
				this.branches = d.page.list;
			})
		},
		branchChange(item) {
			this.storeModal = false;
		},
		addressChange() {
			this.addressListModal = false;
		},
		qryLogisticsCompanyList() {
			this.API_qryLogisticsCompanyList().then(d => {
				this.logisticsCompanyList = d.page.list;
			});
		},
		qryAddressList(cb) {
			this.API_qryAddressList().then(d => {
				this.addressList = d.page.list;
				cb && cb();
			});
		},
		saveReceivingAddress() {
			this.saveLoading = true;
			let addressForm = Object.assign({}, this.addressForm);
			addressForm.area = addressForm.area ? addressForm.area.join('') : '';
			this.API_saveReceivingAddress(addressForm).then(d => {
				this.$Message.success('保存成功!');
				this.qryAddressList(() => {
					this.saveLoading = false;
					this.addAddressModal = false;
					this.addressListModal = true;
				});
			});
		},
		remarksInput() {
			if (this.$store.state.app.orderInfo.tfBTradeSale) {
				this.$store.state.app.orderInfo.tfBTradeSale.remarks = this.remarks;
			}
		},
		validate(type) {
			if (type == '1') {
				if (this.storeId) {
					this.canNext = true;
				} else {
					this.canNext = false;
				}
				this.$emit('canNext', this.canNext);
			} else {
				if (this.addressId && this.logisticsForm.logisticsCompany) {
					this.canNext = true;
				} else {
					this.canNext = false;
				}
				this.$emit('canNext', this.canNext);
			}
		},
		addressDisplay() {
			for (let item of this.addressList) {
				if (item.id == this.addressId) {
					this.logisticsForm.addressDisplay = this.$filter.addressLayout(item)
				}
			}
		},
		branchDisplay() {
			for (let item of this.branches) {
				if (item.id == this.storeId) {
					this.logisticsForm.branchDisplay = this.$filter.branchLayout(item)
				}
			}
		},
		next() {
			let logistics = Object.assign({}, this.logistics);
			if (logistics.type == '2') {
				logistics.logisticsCompany = this.logisticsForm.logisticsCompany;
			}
			this.$store.state.app.orderInfo.tfBTradeLogistics = logistics;
			this.$emit('nextLoading', true);
			return new Promise((resolve,reject)=>{
				this.API_submitTradeSale(this.$store.state.app.orderInfo).then(d=>{
					this.$store.state.app.orderId = d.id;
					setTimeout(()=>{
						this.$emit('nextLoading', false);
						resolve(true);
					},500);
					this.$Message.success('下单成功!');
					this.$Notice.success({
						title: '下单成功!',
						desc: '请继续完成后续操作，完成配卡操作。'
					});
				}).catch(e=>{
					this.$emit('nextLoading', false);
					this.$Message.error('下单失败,请重试');
					this.$Notice.error({
						title: '下单失败,请重试!'
					});
					resolve(false);
				})
			});
		},
	}
}
</script>
<style lang="less">
@import "./order-info.less";
</style>
