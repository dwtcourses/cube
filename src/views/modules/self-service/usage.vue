<template>
<div>
	<Form class="query-form" ref="form" :model="queryForm" inline>
		<FormItem prop="cycleId" label="账期">
			<monthly-picker :monthLabels="locale" :min="null" :max="null" v-model="queryForm.cycleId">
			</monthly-picker>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>

</div>
</template>
<script>
import monthlyPicker from '@/views/my-components/custom/mouth-picker'

import tools from '@/libs/tools.js'

export default {
	components: {
		monthlyPicker
	},
	data() {
		return {
			locale: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			queryForm: {
				cycleId: '2018/11'
			},
			modalForm: {
				iccid: '',
				accountCode: '',
				imsi: '',
				msisdn: '',
				createTime: '',
				updateTime: '',
				cycleId: '',
				dataUsage: '',
				smsUsage: '',
				voiceUsage: '',
				addTime: '',
				useTag: ''
			},
			tmpForm: {},
			rules: {
				iccid: [{
					required: true,
					message: 'iccid为必填项',
					trigger: 'blur'
				}],
				cycleId: [{
					required: true,
					message: 'cycle_id为必填项',
					trigger: 'blur'
				}]
			},
			modal: false,
			modalDel: false,
			modalTitle: '新增单表',
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
			tableColumns: [{
					title: 'ICCID',
					key: 'iccid',
				},
				{
					title: '账户编码',
					key: 'accountCode',
					render: (h, params) => {
						return h('span', {
							attrs: {
								title: params.row.accountCode
							}
						}, params.row.accountCode);
					}
				},
				// {
				// 	title: 'IMSI',
				// 	key: 'imsi',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			attrs: {
				// 				title: params.row.imsi
				// 			}
				// 		}, params.row.imsi);
				// 	}
				// },
				// {
				// 	title: 'MSISDN',
				// 	key: 'msisdn',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			attrs: {
				// 				title: params.row.msisdn
				// 			}
				// 		}, params.row.msisdn);
				// 	}
				// },
				// {
				// 	title: '产品模式',
				// 	key: 'productMode',
				// 	width: 96,
				// 	align: 'center',
				// },
				// {
				// 	title: '产品名称',
				// 	key: 'productName',
				// },
				// {
				// 	title: '付费方式',
				// 	key: 'prepayTag',
				// 	width: 96,
				// 	align: 'center',
				// },
				// {
				// 	title: '创建时间',
				// 	key: 'createTime',
				// 	width: 120,
				// 	align: 'center',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			'class': 'fn-text-overflow',
				// 			attrs: {
				// 				title: this.$filter.date(params.row.createTime)
				// 			}
				// 		}, this.$filter.date(params.row.createTime));
				// 	}
				// },
				{
					title: '更新时间',
					key: 'updateTime',
					width: 120,
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: this.$filter.date(params.row.updateTime)
							}
						}, this.$filter.date(params.row.updateTime));
					}
				},
				// {
				// 	title: '账期',
				// 	key: 'cycleId',
				// 	width: 90,
				// 	align: 'center',
				// },
				{
					title: '数据总量',
					key: 'dataResouce',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.dataResource+'KB'
							}
						}, params.row.dataResource+'KB');
					}
				},
				{
					title: '数据用量',
					key: 'dataUsage',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.dataUsage+'KB'
							}
						}, params.row.dataUsage+'KB');
					}
				},
				{
					title: '短信总量',
					key: 'smsResource',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.smsResource +'条'
							}
						}, params.row.smsResource +'条');
					}
				},
				{
					title: '短信用量',
					key: 'smsUsage',
					render: (h, params) => {
						return h('span', {
							'class': 'fn-text-overflow',
							attrs: {
								title: params.row.smsUsage +'条'
							}
						}, params.row.smsUsage +'条');
					}
				},
				// {
				// 	title: '语音总量',
				// 	key: 'voiceResource',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			'class': 'fn-text-overflow',
				// 			attrs: {
				// 				title: params.row.voiceResource +'分'
				// 			}
				// 		}, params.row.voiceResource +'分');
				// 	}
				// },
				// {
				// 	title: '语音用量',
				// 	key: 'voiceUsage',
				// 	render: (h, params) => {
				// 		return h('span', {
				// 			'class': 'fn-text-overflow',
				// 			attrs: {
				// 				title: params.row.voiceUsage +'分'
				// 			}
				// 		}, params.row.voiceUsage +'分');
				// 	}
				// },
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
			queryParam.cycleId = queryParam.cycleId.replace(/\//g, '');
			this.API_qryList('/a/card/monthUsage/qryMonthUsageListByCon', queryParam).then(d => {
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
			this.API_qryInfoById('/a/card/monthUsage/qryMonthUsageById', id).then(d => {
				this.detailSpin = false;
				this.tmpForm = Object.assign({}, d);
				this.modalForm = Object.assign({}, this.tmpForm);
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
			this.API_delInfo("/a/card/monthUsage/deleteMonthUsage", this.infoId).then(d => {
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
						this.API_savaInfo("/a/card/monthUsage/saveMonthUsage", this.modalForm).then(d => {
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
		modalCancel() {

		},
		modalChange(visible) {
			if (visible) {

			} else {
				this.tmpForm = {};
				this.$refs.modalForm.resetFields();
				this.editIng = false;
				this.detailIng = false;
			}
		},
		query(name) {
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
<style lang="less" scoped>
	.query-form{
		margin-bottom: 10px;
	}
</style>
