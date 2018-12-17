<template>
<div>
	<Form class="query-form" ref="form" :model="form" inline>
		<FormItem prop="name" label="名称">
			<Input type="text" v-model="form.name" placeholder="请输入名称" clearable></Input>
		</FormItem>
		<FormItem prop="user" label="用户" class="hastree">
			<tree-select v-model="form.user" type="user" :multiple="false" :disable-branch-nodes="true" placeholder="请选择用户"></tree-select>
		</FormItem>
		<FormItem prop="office" label="部门" class="hastree">
			<!-- <tree-select v-model="form.office" type="office" :multiple="false" placeholder="请选择部门"></tree-select> -->
		</FormItem>
		<FormItem prop="area" label="区域" class="hastree">
			<!-- <tree-select v-model="form.area" type="area" :multiple="false" placeholder="请选择区域"></tree-select> -->
		</FormItem>
		<FormItem prop="sex" label="性别">
			<dict-item v-model="form.sex" type="radio" label="sex"></dict-item>
		</FormItem>
		<FormItem prop="beginInDate" label="开始日期">
			<DatePicker :editable="false" :value="form.beginInDate" type="datetime" @on-change="form.beginInDate=$event" placeholder="选择开始日期"></DatePicker>
		</FormItem>
		<FormItem prop="endInDate" label="结束日期">
			<DatePicker :editable="false" :value="form.endInDate" type="datetime" @on-change="form.endInDate=$event" placeholder="选择结束日期"></DatePicker>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="query('form')">查询</Button>
		</FormItem>
	</Form>
	<div class="add-button-wrapper">
		<Button type="primary" @click="add">{{test('666')}}</Button>
	</div>
	<Table border :data="tableData" :columns="tableColumns" stripe :loading="loading"></Table>
	<div style="margin: 10px;overflow: hidden" v-if="total>pageSize">
		<div style="float: right;">
			<Page show-total :total="total" :current="currPage" @on-change="changePage"></Page>
		</div>
	</div>
	<Modal v-model="modal" :title="modalTitle" @on-ok="modalEdit" @on-cancel="modalCancel" @on-visible-change="modalChange">
		<Form class="modal-form" ref="modalForm" :model="modalForm" :rules="rules" :label-width="80">
			<FormItem prop="name" label="名称">
				<Input type="text" v-model="modalForm.name" placeholder="请输入名称" clearable></Input>
			</FormItem>
			<FormItem prop="user" label="用户">
				<Input type="text" v-model="modalForm.user" placeholder="请输入用户" clearable></Input>
			</FormItem>
			<FormItem prop="office" label="部门">
				<!-- <tree-select v-model="modalForm.office" type="office" placeholder="请选择部门"></tree-select> -->
			</FormItem>
			<FormItem prop="area" label="区域">
				<!-- <tree-select v-model="modalForm.area" type="area" placeholder="请选择区域"></tree-select> -->
			</FormItem>
			<FormItem prop="role" label="角色类型">
				<dict-item :transfer="true" v-model="modalForm.role" style="width:200px" label="activiti_role_type" type="checkbox"></dict-item>
			</FormItem>
			<FormItem prop="roleType" label="角色类型">
				<dict-item :transfer="true" v-model="modalForm.roleType" style="width:200px" label="activiti_role_type"></dict-item>
			</FormItem>
			<FormItem prop="sex" label="性别">
				<dict-item v-model="modalForm.sex" label="sex" type="radio"></dict-item>
			</FormItem>
			<FormItem prop="sex" label="是否可用">
				<dict-item v-model="modalForm.useable" type="radio" label="yeno"></dict-item>
			</FormItem>
			<FormItem prop="sex" label="是否可见">
				<dict-item v-model="modalForm.isShow" type="radio" label="show_hide"></dict-item>
			</FormItem>
			<FormItem prop="inDate" label="加入日期">
				<DatePicker :editable="false" :value="modalForm.inDate" type="datetime" placeholder="选择加入日期" @on-change="modalForm.inDate=$event"></DatePicker>
			</FormItem>
			<FormItem prop="beginInDate" label="备注">
				<Input v-model="modalForm.remarks" type="textarea" :rows="4" placeholder="输入备注..."></Input>
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

import treeSelect from '@/views/my-components/custom/tree-select'
import dictItem from '@/views/my-components/custom/dict-item'


export default {
	components: {
		dictItem,
		treeSelect
	},
	data() {
		return {
			form: {
				name: '',
				user: '',
				office: '',
				area: '',
				sex: '',
				beginInDate: '',
				endInDate: ''
			},
			queryForm: null,
			addForm: {
				name: '',
				user: '',
				office: '',
				area: '',
				sex: '',
				inDate: '',
				remarks: ''
			},
			modalForm: {},
			tmpForm:{},
			rules: {
				name: [{
					required: true,
					message: '名称为必填项',
					trigger: 'blur'
				}]
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
			tableColumns: [{
					title: '归属用户',
					key: 'user',
					render: (h, params) => {
						return h('span', params.row.user?params.row.user.name:'');
					}
				},
				{
					title: '归属部门',
					key: 'office',
					render: (h, params) => {
						return h('span', params.row.office?params.row.office.name:'');
					}
				},
				{
					title: '归属地区',
					key: 'area',
					render: (h, params) => {
						return h('span', params.row.area?params.row.area.name:'');
					}
				},
				{
					title: '名称',
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
									this.getDetail(e.target.id);
								}
							}
						}, params.row.name);
					}
				},
				{
					title: '性别',
					key: 'sex',
					render: (h, params) => {
						return h('span', params.row.sex&&params.row.sex=='2'?'女':'男');
					}
				},
				{
					title: '更新时间',
					key: 'inDate'
				},
				{
					title: '备注信息',
					key: 'remarks',
					render: (h, params) => {
						return h('span',{
							'class':'fn-text-overflow',
							attrs:{
								title:params.row.remarks
							}
						},params.row.remarks);
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
										this.modalTitle='编辑单表';
										this.btnTxt='保存';
										this.getDetail(e.target.localName=='span'?e.target.parentNode.id:e.target.id);
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
										this.infoId = e.target.localName=='span'?e.target.parentNode.id:e.target.id;
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
		test(txt){
			return txt;
		},
		change(e) {
			console.log(e);
		},
		getDataList() {
			this.loading = true;
			let queryParam = Object.assign({
				currPage: this.currPage,
				pageSize: this.pageSize
			}, this.queryForm);
			this.API_getDataList().then((d) => {
				console.log(d);
				this.tableData = d.page.list;
				this.total = d.page.count;
				setTimeout(() => {
					this.loading = false;
				}, 500);
			}).catch((e)=>{
				console.log(e);
			});
		},
		inDateChange(e){
			console.log(e);
		},
		getDetail(id) {
			this.API_getDetail(id, (d) => {
				let tmpForm = Object.assign({},d);
				tmpForm.area = d.area?d.area.id:null;
				tmpForm.office = d.office?d.office.id:null;
				tmpForm.user = d.user?d.user.id:null;
				this.modalForm = tmpForm;
				console.log(this.modalForm);
			});
		},
		add(e) {
			console.log(e);
			this.modalForm = this.addForm;
			this.modalTitle = '新增单表';
			this.btnTxt = '新增';
			this.modal = true;
		},
		del(){
			this.delLoading = true;
			console.log(this.infoId);
			this.API_delData(this.infoId,(d)=>{
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
			console.log(this.modalForm);
			this.$refs.modalForm.validate((valid) => {
				if (valid) {
					if(this.modalForm==this.tmpForm){
						this.modal = false;
					}else{
						this.btnLoading = true;
						this.API_savaData(this.modalForm,(d) => {
							console.log(d);
							setTimeout(()=>{
								this.$Message.success('保存成功!');
								this.btnLoading = false;
								this.modal = false;
								this.getDataList();
							},500);
						});
					}
				} else {
					this.$Message.error('名称为必填项!');
					return false;
				}
			});
		},
		modalCancel() {

		},
		modalChange(visible){
			if(visible){

			}else{
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
