<template>
    <div>
        <Form class="query-form" ref="form" :model="form" inline>
                  <FormItem prop="customerManager" label="客户经理">
                <Input type="text" v-model="form.customerManager"  clearable></Input>
          </FormItem>
          <FormItem prop="cycleId" label="账期标识">
                <Input type="text" v-model="form.cycleId"  clearable></Input>
          </FormItem>
          <FormItem>
               <Button type="primary" @click="query('form')">查询</Button>
          </FormItem>
        </Form>
        <div class="add-button-wrapper">
            <Button type="primary" @click="add">添加单表</Button>
        </div>
        <Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
            <div style="float: right;">
                <Page :total="total" :current="currPage" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
            <Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">

	          <FormItem prop="chnlId" label="渠道商标识">
	                <Input type="text" v-model="modalForm.chnlId"  clearable></Input>
	          </FormItem>
	          <FormItem prop="customerManager" label="客户经理">
	                <Input type="text" v-model="modalForm.customerManager"  clearable></Input>
	          </FormItem>
	          <FormItem prop="ratio" label="提成比例">
	                <Input type="text" v-model="modalForm.ratio"  clearable></Input>
	          </FormItem>
	          <FormItem prop="cycleId" label="账期标识">
	                <Input type="text" v-model="modalForm.cycleId"  clearable></Input>
	          </FormItem>
	          <FormItem prop="fee" label="销售金额">
	                <Input type="text" v-model="modalForm.fee"  clearable></Input>
	          </FormItem>
	          <FormItem prop="comFee" label="佣金">
	                <Input type="text" v-model="modalForm.comFee"  clearable></Input>
	          </FormItem>
	          <FormItem prop="crateTime" label="计算时间">
	            <DatePicker :editable="false" :value="modalForm.crateTime" type="datetime" @on-change="modalForm.crateTime=$event" placeholder="选择计算时间开始日期"></DatePicker>
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
</template>
<script>
    import treeDropdown from '@/views/my-components/tree-dropdown/tree-dropdown'
    import dictItem from '@/views/my-components/custom/dict-item'

    import tools from '@/libs/tools.js'

    export default {
        components: {
            dictItem,
            treeDropdown
        },
        data() {
            return {
                form: {
                                     customerManager: '',
                    cycleId: ''
                },
                queryForm: null,
                modalForm: {
                           chnlId: '',
                    customerManager: '',
                    ratio: '',
                    cycleId: '',
                    fee: '',
                    comFee: '',
                    crateTime: ''
                },
                tmpForm:{},
                rules: {
                },
                modal: false,
                modalDel:false,
                modalTitle: '新增单表',
                btnTxt:'新增',
                currPage: 1,
                infoId:'',
                pageSize: this.$store.state.app.pageSize,
                total: 0,
                loading: false,
                btnLoading:false,
                delLoading:false,
                tableData: [],
                tableColumns: [
             {
				title: '渠道商标识',
				key: 'chnlId',
				render: (h, params) => {
					return h('a', {
						class: 'link',
						attrs: {
							id: params.row.id
						},
						on: {
							click: (e) => {
								this.modal = true;
								this.getDetail(e.target.id);
							}
						}
					}, params.row.chnlId);
				}
			},
	       	{
				title: '客户经理',
				key: 'customerManager',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.customerManager
						}
					},params.row.customerManager);
				}
			},
	       	{
				title: '提成比例',
				key: 'ratio',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.ratio
						}
					},params.row.ratio);
				}
			},
	       	{
				title: '账期标识',
				key: 'cycleId',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.cycleId
						}
					},params.row.cycleId);
				}
			},
	       	{
				title: '销售金额',
				key: 'fee',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.fee
						}
					},params.row.fee);
				}
			},
	       	{
				title: '佣金',
				key: 'comFee',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.comFee
						}
					},params.row.comFee);
				}
			},
	       	{
				title: '计算时间',
				key: 'crateTime',
				render: (h, params) => {
					return h('span',{
						'class':'fn-text-overflow',
						attrs:{
							title:params.row.crateTime
						}
					},params.row.crateTime);
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
									this.modal = true;
									this.modalTitle = '编辑单表';
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
           ]}
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
                this.API_qryList('/a/commission/commission/qryCommissionListByCon',queryParam).then(d => {
                    console.log(d);
	                this.tableData = d.page.list;
	                this.total = d.page.count;
	                setTimeout(() => {
	                    this.loading = false;
	            	}, 500);
	            });
            },
            inDateChange(e){
                console.log(e);
            },
            getDetail(id) {
                this.API_qryInfoById('/a/commission/commission/qryCommissionById',id).then(d => {
                this.tmpForm = Object.assign({}, d);
                this.modalForm = Object.assign({}, this.tmpForm);
            });
            },
            add(e) {
                console.log(e);
                this.modalTitle = '新增单表';
                this.btnTxt = '新增';
                this.modal = true;
            },
            del(){
                this.delLoading = true;
                console.log(this.infoId);
                this.API_delInfo("/a/commission/commission/deleteCommission",this.infoId).then(d=>{
                    setTimeout(()=>{
                    this.modalDel = false;
                    this.delLoading = false;
                },500);
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
                        if(tools.isEqual(this.modalForm, this.tmpForm)){
                            this.modal = false;
                        }else{
                            this.btnLoading = true;
                            this.API_savaInfo("/a/commission/commission/saveCommission",this.modalForm).then(d => {
                                console.log(d);
	                            setTimeout(()=>{
	                                this.$Message.success('保存成功!');
		                            this.btnLoading = false;
		                            this.modal = false;
		                            this.getDataList();
		                        },500);
                        	}).catch(e=>{
								setTimeout(()=>{
									this.$Message.error('保存失败请重试!');
									this.btnLoading = false;
								},500);
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
            modalChange(visible){
                if(visible){

                }else{
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