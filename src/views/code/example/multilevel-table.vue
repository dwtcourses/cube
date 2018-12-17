<template>
	<div>
		<div class="add-button-wrapper">
			<Button type="primary" size="large">添加单表</Button>
		</div>
		<Form class="query-form" ref="form" :model="form" :rules="rules" inline>
	        <FormItem prop="name" label="名称">
	            <Input type="text" v-model="form.name" placeholder="请输入名称" clearable></Input>
	        </FormItem>
			<FormItem prop="userId" label="用户">
	            <Input type="text" v-model="form.userId" placeholder="请输入用户" clearable></Input>
	        </FormItem>
			<FormItem prop="officeId" label="部门">
	            <Input type="text" v-model="form.officeId" placeholder="请输入部门" clearable></Input>
	        </FormItem>
			<FormItem prop="areaId" label="区域">
	            <Input type="text" v-model="form.areaId" placeholder="请输入区域" clearable></Input>
	        </FormItem>
			<FormItem prop="sex" label="性别">
				<RadioGroup v-model="form.sex">
			        <Radio label="male">
			            <Icon type="male"></Icon>
			            <span>男</span>
			        </Radio>
			        <Radio label="female">
			            <Icon type="female"></Icon>
			            <span>女</span>
			        </Radio>
			    </RadioGroup>
	        </FormItem>
			<FormItem prop="beginInDate" label="开始日期">
	            <DatePicker v-model="form.beginInDate" type="date" placeholder="选择开始日期"></DatePicker>
	        </FormItem>
			<FormItem prop="endInDate" label="结束日期">
	            <DatePicker v-model="form.endInDate" type="date" @on-change="form.endInDate=$event" placeholder="选择结束日期"></DatePicker>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="query('form')">查询</Button>
	        </FormItem>
	    </Form>
	    <Table border :data="tableData1" :columns="tableColumns1" stripe></Table>
	    <div style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page show-total :total="100" :current="1" @on-change="changePage"></Page>
	        </div>
	    </div>
	</div>
</template>
<script>
    export default {
        data () {
            return {
				form: {
					name:'',
					userId:'',
					officeId:'',
					areaId:'',
					sex:'male'
				},
                rules: {
                    name: [
                        { required: true, message: '名称为必填项', trigger: 'blur' }
                    ],
					userId: [
                        { required: true, message: '用户为必填项', trigger: 'blur' }
                    ],
					officeId: [
                        { required: true, message: '部门为必填项', trigger: 'blur' }
                    ],
					areaId: [
                        { required: true, message: '区域为必填项', trigger: 'blur' }
                    ],
					sex: [
                        { required: true, message: '性别为必填项', trigger: 'change' }
                    ],
					beginInDate: [
                        { required: true, message: '开始日期为必填项', trigger: 'change' }
                    ],
					endInDate: [
                        { required: true, message: '结束日期为必填项', trigger: 'change' }
                    ]
                },
                tableData1: this.mockTableData1(),
                tableColumns1: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Status',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red';
                            const text = row.status === 1 ? 'Working' : row.status === 2 ? 'Success' : 'Fail';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: 'Portrayal',
                        key: 'portrayal',
                        render: (h, params) => {
                            return h('Poptip', {
                                props: {
                                    trigger: 'hover',
                                    title: params.row.portrayal.length + 'portrayals',
                                    placement: 'bottom'
                                }
                            }, [
                                h('Tag', params.row.portrayal.length),
                                h('div', {
                                    slot: 'content'
                                }, [
                                    h('ul', this.tableData1[params.index].portrayal.map(item => {
                                        return h('li', {
                                            style: {
                                                textAlign: 'center',
                                                padding: '4px'
                                            }
                                        }, item)
                                    }))
                                ])
                            ]);
                        }
                    },
                    {
                        title: 'People',
                        key: 'people',
                        render: (h, params) => {
                            return h('Poptip', {
                                props: {
                                    trigger: 'hover',
                                    title: params.row.people.length + 'customers',
                                    placement: 'bottom'
                                }
                            }, [
                                h('Tag', params.row.people.length),
                                h('div', {
                                    slot: 'content'
                                }, [
                                    h('ul', this.tableData1[params.index].people.map(item => {
                                        return h('li', {
                                            style: {
                                                textAlign: 'center',
                                                padding: '4px'
                                            }
                                        }, item.n + '：' + item.c + 'People')
                                    }))
                                ])
                            ]);
                        }
                    },
                    {
                        title: 'Sampling Time',
                        key: 'time',
                        render: (h, params) => {
                            return h('div', 'Almost' + params.row.time + 'days');
                        }
                    },
                    {
                        title: 'Updated Time',
                        key: 'update',
                        render: (h, params) => {
                            return h('div', this.formatDate(this.tableData1[params.index].update));
                        }
                    }
                ]
            }
        },
        methods: {
			change(e){
				console.log(e);
			},
            mockTableData1 () {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push({
                        name: 'Business' + Math.floor(Math.random () * 100 + 1),
                        status: Math.floor(Math.random () * 3 + 1),
                        portrayal: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
                        people: [
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            },
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            },
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            }
                        ],
                        time: Math.floor(Math.random () * 7 + 1),
                        update: new Date()
                    })
                }
                return data;
            },
            formatDate (date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            changePage () {
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
                this.tableData1 = this.mockTableData1();
            },
			query(name){
				console.log(this.form);
				this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
			}
        }
    }
</script>
