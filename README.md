#<center>魔方平台开发规范


[TOC]


###项目说明
魔方项目是基于`ivew2.11.0`的前端`vue`项目，是目前大部分项目管理台、CRM、网站后台的管理端项目的解决方案，魔方是基于前后端分离的模式基础上开发的前端项目，项目中一般的包含管理端常见的增、删、改、查功能的管理页面都是由后端程序生成的。前端开发人员只需要将后端程序生成的`.vue`文件放在项目对应的文件夹中，并在路由中添加相应的路由，启动项目后即可访问刚才生成的页面，非常简单快捷。其他一些特殊化的页面，只需要在后端生成页面的基础上做特殊化处理即可，项目中封装了很多自定义的组件，加上`iview`中自带的组件，前端开发人员可以很轻松的在短时间内开发出一个管理台项目，这就是魔方项目的初衷。
备注：项目中支持`less`和`scss`的css预处理方式，项目主要是基于`iview`，但是有的组件无法满足项目需要，加入了`element-ui`的部分组件，后面如果需要也可以单独引入其他组件；
##前端开发规范

###一、获取基础项目并安装依赖
1.  使用git命令或者其他	git软件clone以下地址的仓库：
```
http://10.1.130.18:6610/projects/cube-vue
```
2. 安装依赖
在终端里输入以下命令安装依赖，注意本项目是用`yarn`管理依赖包，如果没有`yarn`工具提自行提前安装。
```
yarn install
```
###二、启动项目
安装完成依赖以后，打开项目中`build>webpack.dev.config.js`文件查看下图内容
![Alt text](./QQ20181026-103950.png)
检查`host`和`port`是否被占用，如果被占用可以换一个端口，然后在终端里运行
`npm run dev`。然后打开可跨域的chrome浏览器，输入刚才的地址和端口查看项目即可，chrome在印象笔记中有相关文章，此处不做过多介绍。


###三、项目结构说明

|目录/文件|说明|
|:--|:--|
|build▼|webpack打包相关配置文件|
|---dev.env.js|开发环境配置文件,可修改开发环境API请求地址|
|---prod.env.js|生产环境配置文件,可修改生产环境API请求地址|
|---webpack.base.config.js|webpack基础配置文件|
|---webpack.dev.config.js|webpack开发配置文件|
|---webpack.prod.config.js|webpack生产配置文件|
|node_modules▼|项目依赖文件夹|
|src▼|项目主要文件夹|
|---images▼|项目图片文件夹|
|---libs▼|自己封装的工具类库文件夹|
|---router▼|项目路由文件夹(主要路由文件所在)|
|---store▼|项目状态管理文件夹(vuex文件所在)|
|---styles▼|项目样式及字体文件夹|
|---vendors▼|项目支持文件夹|
|---views▼|项目页面及组件所在文件夹|
|------main-components▼|项目主要组件文件夹(左侧菜单、主题切换、面包屑、标签页等)|
|------modules▼|后端生成页面所在文件夹(一级菜单可新建文件夹存放多个二级页面)|
|------my-components▼|自定义组件所在文件夹|
|---------custom▼|后端生成页面所需组件所在文件夹(基于cube项目封装的组件)|
|------login.vue|登录页面|
|------main.vue|项目主入口组件|
|.babelrc|babel插件配置文件|
|index.html|项目主页|
|package.json|项目描述及依赖描述文件|


###四、组件说明
这里主要说明一下项目中自定义组件的使用及注意事项，自定义组件所在文件夹`~/src/views/my-components/custom`
####1.**`dict-item`**
项目中所有后端字典表中类型选项的展示都使用此组件，例如有效证件类型、用户类型、角色类型、机构类型、设备状态、消息状态等等。在启动项目以后，在项目左侧菜单>系统设置>字典管理中可以查询到的所有字典项目都可以使用此组件来展示到前端使用。

**Demo**
```
<dict-item :disabled="detailIng" :transfer="true" v-model="modalForm.certType" label="COMPANY_CERT"></dict-item>
```

**API**
|props|默认|说明|
|:--|:--|
|transfer|`true`|是否将组建放置在`body`内，当组件在弹出框中时此属性为`true`|
|label|sys_user_type|组件对应后端字典表中的字段，可在字典管理列表中的'类型'获取|
|type|select|组件渲染的类型，可选'radio'、'select'、'checkbox'|
|multiple|`false`|是否多选|
|disabled|`false`|是否禁用|
|size|default|组件大小、可选值为'large'、'small'、'default'|


**`注意事项`：**
`label`字段注意大小写，最好直接从字典管理的表里复制，后端生成的页面应该会直接有，放在前端项目中时注意检查一下。`multiple`字段和`type='radio'`不能同时存在，逻辑不通。


####2.**`menu-tree/office-tree/user-tree`**
菜单树结构组件/机构树结构组件/用户树结构组件，现在项目中只有'角色管理'页面使用到了‘菜单树结构组件/机构树结构组件’，如果其他页面使用到这两个组件可参考'角色管理'页面的用法及逻辑，具体组件信息如下：

**Demo**
```
<menu-tree v-model="menuList" :showCheckbox="true"></menu-tree>
```

**API**
|props|默认|说明|
|:--|:--|
|showCheckbox|true|是否显示多选框|
|multiple|true|是否多选|

**`注意事项`：**
两个组件的单选模式还没有完善，后续持续更新中...


####3.**`tree-select`**
以上三种树结构组件是比较特殊的三种，项目中其他地方用到的树组件结构全部使用`tree-select`这个组件来实现，例如选择上级机构、上级地区、上级菜单、设备所属类型等等。

**Demo**
```
<!-- 机构树组件 -->
<tree-select v-model="modalForm.office" type="office" :multiple="false" placeholder="请选择归属机构"></tree-select>
<!-- 地区树组件 -->
<tree-select v-model="modalForm.parent" type="area" :multiple="false" placeholder="请选择上级区域"></tree-select>
<!-- 其他类型树组件 -->
<tree-select :disabled="detailIng" v-model="modalForm.industryId" type="custom" url="/a/company/tfCompanyIndustryType/treeData" :multiple="false" placeholder="请选择行业"></tree-select>

<tree-select :disabled="detailIng" v-model="modalForm.type" type="custom" url="/a/prod/tfDeviceType/treeData" :multiple="false" placeholder="请选择设备类型" />
```

**API**
|props|默认|说明|
|:--|:--|
|placeholder|请选择|选择框默认文字|
|multiple|false|是否多选|
|type|'office'|树组件类型，可选'office','area','user','menu','custom'|
|disableBranchNodes|false|根节点是否可以被选中|
|disabled|false|是否禁用组件|
|label|'name'|树结构数据中作为显示的文字字段名称,可根据后端数据的不同进行相应的调整|
|clearable|true|是否可以被清空|
|searchable|true|是否可以输入检索|
|readonly|false|是否只读状态|
|openOnFocus|true|获取焦点即展开组件|
|openOnClick|false|选择选项后是否清除搜索输入。仅在:multiple="true"时使用。对于单选模式，它总是在选择后清除输入，而不管道具值是多少。|
|closeOnSelect|true|选择完成后是否关闭组件|
|width|'100%'|组件宽度，建议不要动，在外面用样式控制即可|
|url|''|组件数据请求地址，'custom'类型下为必须，否则请求不到数据|


说明：
单选状态下，用的时候需要注意的是此组件使用`v-model`拿到的值是选中项的`id`，但是编辑状态时返回的需要是一个对象，类似下面这种格式：
```
office:{
	id: "e2d8060296524bfdb3564a99928952ab"
	isLeaf: null
	name: "某某机构"
	remarks: null
	typeName: null
}
```
如果不是这种格式，则编辑状态下无法显示被选中项目，因为组件是每一级懒加载的，选中项目有可能还没有加载出来，所以返回的数据一定要是按照上面的格式来，具体的详细格式说明后面的数据格式章节会详细说明。


####4.可折叠的数据表格
项目中存在一些可以折叠的表格，类似菜单>机构用户>区域管理中的数据列表，如下图：

![Alt text](./QQ20181031-160135.png)

折叠表格是在`iview`中`Table`组件的基础上修改来的，主要关键点在后端数据中的`path`字段，它表示当前行的深度，具体的数据格式会在后面的章节中详细说明。
```
path: "0,1,f4f6a7cf5b56402e8974554ca4ecca7d,"
```
如果有兴趣研究怎么实现的可以去看`~/src/views/system/group/user/area.vue`这个文件里的代码逻辑，主要是用到了自定义渲染函数`render`来实现表格的自定渲染内容。其他的表格都是使用`iview`中的`Table`组件，具体用法可以去`iview`官网查看即可，这里不做详细说明。

####5.其他组件
项目中用到的其他组件，类似`Input`、`Table`、`DatePicker`、`Cascader`等组件都是`iview`内置的组件，其中树组件使用了`element-ui`的树组件，具体的使用方法可以去`iview`和`element-ui`查看API，这里不做过多介绍。




##接口规范


###一、`dict-item`组件数据接口及字典表查询接口
项目中用到的大多数组件都是字典表中存在的字段所对应的，前端已经封装成`dict-item`组件，数据接口如下：

```
{
    "rspCode": 0,
    "rspDesc": "success",
    "rspData": {
        "list": [
            {
                "id": "eac2c067080e478ab08a6c0514846e9c",
                "remarks": null,
                "value": "assignment",
                "label": "任务分配",
                "name": "任务分配",
                "type": "activiti_role_type",
                "description": "工作流组用户组类型",
                "sort": 10,
                "parentId": "0"
            },
            {
                "id": "75a3bd47806241669abb4d1e4d01e646",
                "remarks": null,
                "value": "security-role",
                "label": "管理角色",
                "name": "管理角色",
                "type": "activiti_role_type",
                "description": "工作流组用户组类型",
                "sort": 20,
                "parentId": "0"
            },
            {
                "id": "b682095a71714289bb996fdd0252836b",
                "remarks": null,
                "value": "user",
                "label": "普通角色",
                "name": "普通角色",
                "type": "activiti_role_type",
                "description": "工作流组用户组类型",
                "sort": 30,
                "parentId": "0"
            }
        ]
    }
}
```

数据结构说明

```
{
	//数据项id
    "id": "b682095a71714289bb996fdd0252836b",
    //数据项备注
    "remarks": null,
    //数据项value(重要)，前端组件操作完成后会将此项传到后端接口中
    "value": "user",
    //数据项label，可设置成和name一样，备用
    "label": "普通角色",
    //数据项name(重要)，前端显示数据项的名称
    "name": "普通角色",
    //数据项类型
    "type": "activiti_role_type",
    //数据项描述
    "description": "工作流组用户组类型",
    //数据项排序
    "sort": 30,
    //数据项父类id
    "parentId": "0"
}
```



###二、页面查询列表接口
项目中所有页面显示的主要内容接口，主要有两种，一种是普通的列表对应普通的表格组件，另一种是可以折叠的列表对应前面介绍的可折叠的表格组件，下面先介绍一般数据列表接口的数据格式：
<span style="color:#178AFF">**1. 一般数据列表接口**</span>
```
{
    "rspCode":0,
    "rspDesc":"success",
    "rspData":{
        "page":{
            "pageNo":1,
            "pageSize":10,
            "count":1,
            "list":[
                {
                    "id":"6bfbbeacf64b44019c5e701bc0e3d88d",
                    "remarks":"测试",
                    "title":"test",
                    "content":"测试",
                    "state":"1",
                    "type":null,
                    "createTime":"2018-11-01 14:08:00.0",
                    "createUserName":"超级管理员",
                    "stateMap":{
                        "value":"草稿",
                        "key":"1"
                    },
                    "typeMap":{
                        "value":"",
                        "key":"1"
                    }
                }
            ],
            "firstResult":0,
            "maxResults":10
        }
    }
}
```

数据结构说明：
```
"page":{
	//当前页码
    "pageNo":1,
    //每页多少条数据
    "pageSize":10,
    //总共多少条数据
    "count":1,
    //数据所在数组集合
    "list":[
        {
            "id":"6bfbbeacf64b44019c5e701bc0e3d88d",
             "remarks":"测试",
             "title":"test",
             "content":"测试",
             "state":"1",
             "type":null,
             //项目所有接口中涉及到时间的全部是后端出时间戳由前端自行转换显示
             "createTime": 1541055525000,
             "createUserName":"超级管理员",
             //类型/状态类似的字段，请参考如下的数据格式
             "stateMap":{
                 "value":"1",
                 "label":"未读"
             },
             "typeMap":{
                 "value":"1",
                 "label":"新闻"
             },
             "office":{
	            "id":"fec621a805ae49dd91fad9175ac39044",
	            "remarks":null,
	            "name":"太原分公司",
	            "isLeaf":null,
	            "typeName":null
	        },
         }
    ],
    "firstResult":0,
    "maxResults":10
}
```

<span style="color:#ff0000">**注意：**</span>

1. 类型/状态类似的字段，前端接口以'id'或者'value'传入后端的，在列表接口或者查看详情接口中请参照上方数据格式返回。
2. 时间类型的字段，后端全部返回时间戳，具体显示格式由前端自行转换，之前有些接口没有统一，后续会慢慢改掉。
3. 接口`list`中所有涉及到的数字类型，例如`stateMap.value`，全部使用字符串输出`'1'`而不是`1`。
4. 接口中如果有树结构的属性需要展示的话，返回参照上面格式中的`office`即可。


<span style="color:#178AFF">**2. 可折叠数据列表接口**</span>

```
{
    "rspCode":0,
    "rspDesc":"success",
    "rspData":{
        "treeData":[
            {
                "id":"65c4172ab7f84c1c8144874258fa41b3",
                "remarks":null,
                "name":"智能园区",
                "sort":10,
                "parentId":"0",
                "parentIds":"0,",
                "type":"1",
                "isLeaf":"0",
                "children":[
                    {
                        "id":"de84708c56ff4c608d4ff93bda072ebe",
                        "remarks":null,
                        "name":"智能办公",
                        "sort":10,
                        "parentId":"65c4172ab7f84c1c8144874258fa41b3",
                        "parentIds":"0,65c4172ab7f84c1c8144874258fa41b3,",
                        "type":"2",
                        "isLeaf":"1",
                        "children":null,
                        "parent":null
                    },
                    {
                        "id":"e664b9d0e01d47ea8522dba5e5a423bd",
                        "remarks":null,
                        "name":"智能商业",
                        "sort":20,
                        "parentId":"65c4172ab7f84c1c8144874258fa41b3",
                        "parentIds":"0,65c4172ab7f84c1c8144874258fa41b3,",
                        "type":"2",
                        "isLeaf":"1",
                        "children":null,
                        "parent":null
                    },
                    {
                        "id":"2ee943c3035b4b6e92551ce1c81602bc",
                        "remarks":null,
                        "name":"未来酒店",
                        "sort":30,
                        "parentId":"65c4172ab7f84c1c8144874258fa41b3",
                        "parentIds":"0,65c4172ab7f84c1c8144874258fa41b3,",
                        "type":"2",
                        "isLeaf":"1",
                        "children":null,
                        "parent":null
                    }
                ],
                "parent":null
            },
        ]
    }
}
```
数据结构说明：
```
{
	//数据项id
    "id":"de84708c56ff4c608d4ff93bda072ebe",
    //数据项备注
    "remarks":null,
    //数据项显示内容
    "name":"智能办公",
    //数据项排序
    "sort":10,
    //数据项父节点id
    "parentId":"65c4172ab7f84c1c8144874258fa41b3",
    //当前节点的路径，即从根节点一直到当前节点的id集合，中间使用','连接，前端用来实现折叠功能(重要)
    "path":"0,65c4172ab7f84c1c8144874258fa41b3,",
    "type":"2",
    //是否叶子结点
    "isLeaf":"1",
    //当前数据项是否含有子项目，如果含有则包含倒children属性中，使用数组包含即可。
    "children":null,
    "parent":null
}
```
<span style="color:#ff0000">**注意：**</span>
1、可折叠列表接口和普通列表接口区别在于`path`、`isLeaf`、`children`，这几个字段的共同作用下，前端实现了可折叠表格的功能。
2、`path`是当前节点到根节点的路径，前端用来控制表格中的缩进显示级不同状态下图标的显示。
3、`children`字段表示当前节点是否存在子节点，如果存在则使用数组包含所有子节点，数组项个当前节点结构一样。

###三、页面详情接口
目前请求详情的接口和编辑详情的接口使用的是一个接口，后续会分开，编辑时候请求的详情接口是一个，查看详情的接口事另一个，数据结构也会不一样，具体数据结构如下：

<span style="color:#178AFF">**1. 查看详情接口**</span>
```
{
    "rspCode":0,
    "rspDesc":"success",
    "rspData":{
        "id":"6bfbbeacf64b44019c5e701bc0e3d88d",
        "title":"test",
        "content":"测试",
        "stateMap":{
            "value":"1",
            "label":"草稿"
        },
        "type":null,
        "createUserName":"超级管理员",
        "createTime":1541055525000,
        "typeMap":{
            "value": "1",
            "label": "新闻"
        },
        "remarks": "测试",
        "office": "太原分公司",
    }
}
```
接口说明：
1、接口中所有涉及到的数字类型，例如`stateMap.value`，全部使用字符串输出`'1'`而不是`1`。
2、时间类型的字段，后端全部返回时间戳，具体显示格式由前端自行转换。
3、类型/状态等字段返回以`stateMap`和`typeMap`这样的`value`和`label`来返回。`value`表示属性的值，`label`表示属性的显示名称。
4、接口中树结构对应要显示的内容直接放在对应字段中即可，不用其他信息。

<span style="color:#178AFF">**2. 编辑详情接口**</span>

```
{
    "rspCode":0,
    "rspDesc":"success",
    "rspData":{
        "id":"6bfbbeacf64b44019c5e701bc0e3d88d",
        "title":"test",
        "content":"测试",
        "state": "1",
        "type":null,
        "createUserName":"超级管理员",
        "createTime":1541055525000,
        "type": "1",
        "remarks":"测试",
        "office":{
           "id":"fec621a805ae49dd91fad9175ac39044",
            "remarks":null,
            "name":"太原分公司",
            "isLeaf":null,
            "typeName":null
        },
    }
}
```
接口说明：
1、编辑详情接口区别在于不用显示某个字段的名称，例如类型、状态等，通俗的来讲就是新增接口中前端提交到后端接口数据是什么样编辑详情接口中返回什么样子就可以，不需要处理，而且字段需要一一对应上。
2、编辑详情接口区别还在于树结构属性的字段，例如`office`作为机构字段，内容是结构的id，后端在编辑详情接口中要返回上面的数据结构，这个是和查看详情接口不一样的地方。
3、类型/状态等字段直接返回`state`和`type`这样的属性，内容就是属性对应的数据库中的值即可。前端会根据传过来的数值对应到组件中某个选中项，类似单选、多选、下拉等等。

###四、页面新增接口/编辑接口
项目中使用新增和编辑状态使用的是一个弹框，所以一般的通用页面新增和编辑使用的是同一个接口，一般是`**/**/save`或者是`**/**/save**`。因为新增和编辑接口参数除了一个没有有`id`另一个有`id`意外，其他参数全部一样，所以如果没有特殊功能尽量使用一个接口完成逻辑，接口数据格式如下：
```json
{
    "reqHead":{
        "userName":"admin"
    },
    "reqBody":{
        "id":"",
        "office":"1",
        "name":"测试",
        "enname":"test",
        "roleType":"assignment",
        "menuList":[
            "8ff1dcbb76184401b9355b85bfc182db",
            "8a829d18b1ed4d16ab9114873769c317",
            "9ec87e5fb2d548848088fd92d478f7f4",
            "e0a9e6964f8741d2acab9ed26a03a184",
        ],
        "userList":[

        ],
        "officeList":[
            "1",
            "e5a97b8504e54933843e311ee91a66ca",
            "472d80b494a746079e229c8dbd253b83",
            "119322f607c5468ea7f1a3324cf6e9fd",
            "a81ea40e50594d91989b4927828b0a85",
        ],
        "sysData":"1",
        "useable":"1",
        "dataScope":"9",
        "abelDate":"2018-11-02",
        "remarks":"测试备注"
    }
}
```
数据结构说明：
```javascript
//id属性再新增状态下是空的,在编辑状态下是后端编辑详情接口传到前端的id
 "id":"",
 //树结构属性前端只会传到后端选中项的'id'
"office":"1",
//一般的文本输入框对应的字段都是字符型，用户是输入什么字段内容就是什么，需要验证的话请看下面的接口说明中详细介绍
"name":"测试",
"enname":"test",
"roleType":"assignment",
//menuList/officeList这种多选框或者是树组件的多选所对应的属性，前端传到后端的数据格式是数组中包着所选项的'id'
"menuList":[
    "8ff1dcbb76184401b9355b85bfc182db",
    "8a829d18b1ed4d16ab9114873769c317",
    "9ec87e5fb2d548848088fd92d478f7f4",
    "e0a9e6964f8741d2acab9ed26a03a184",
],
"officeList":[
    "1",
    "e5a97b8504e54933843e311ee91a66ca",
    "472d80b494a746079e229c8dbd253b83",
    "119322f607c5468ea7f1a3324cf6e9fd",
    "a81ea40e50594d91989b4927828b0a85",
],
//拉下菜单或者单选项组件对应的属性，前端传到后端的是对应选项的'id'，数据格式是String类型。
"sysData":"1",
"useable":"1",
"dataScope":"9",
//时间组件对应的属性，前端传到后端的结果是`yyyy-MM-dd HH:ss`,这样的格式，如果需要格式自定义的话后端可在生成页面时在后端控制。
"abelDate":"2018-11-02",
"remarks":"测试备注"
```
<span style="color:#ff0000">**注意：**</span>
1、新增个编辑接口区别在于id字段是否为空。
2、树结构组件对应的属性注意字段名，如果是`office`的话，详情接口返回也是`office`而不是`officeId`。
3、日期组件详细可参考[Datepicker](http://v2.iviewui.com/components/date-picker)，如果需要时间的话则添加属性`type="datetime"`,`format`属性来控制日期组件的取值格式，具体取值可参考上述网址。
4、如果需要文本域输入框的话请使用如下：
```
<Input v-model="value" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
```
5、新增及编辑接口需要表单验证的话，在`form`标签的`rules`属性中添加相应的规则即可，规则格式如下：
```json
{
    "name":[
        {
		    //非空验证
            "required":true,
            //如果当前项为空时的错误提示
            "message":"姓名不可为空",
            //触发验证的条件,一般是'blur'或者'change',即输入焦点或者是表单项改变时验证。文本框等输入的表单项一般使用'blur'验证，下拉等选择类表单项使用'change'验证。
            "trigger":"blur"
        }
    ],
    "mobile":[
	    {
		    //可以是用'pattern'属性来进行正则表达式的验证，可以填写任何的正则表达式，后面的'message'来提示没有通过正则验证的错误提示
            "pattern":/^1[3|4|5|7|8][0-9]{9}$/,
            "message":"请输入正确格式的手机号码",
            "trigger":"blur"
        },
    ],
    "mail":[
        {
            "required":true,
            "message":"邮箱不可为空",
            "trigger":"blur"
        },
        {
	        //当前表单项必须的类型，支持类型见下图
            "type":"email",
            "message":"无效邮箱格式",
            "trigger":"blur"
        }
    ],
    "interest":[
	    //多选状态下，数据类型是数组，可以用'min'和'max'配合来实现至少选择多少项和最多选择多少项的限制
        {
            "required":true,
            "type":"array",
            "min":1,
            "message":"请至少选择一项",
            "trigger":"change"
        },
        {
            "type":"array",
            "max":3,
            "message":"最多选择3项",
            "trigger":"change"
        }
    ],
    "date":[
        {
            "required":true,
            //日期类型限制
            "type":"date",
            "message":"请选择日期",
            "trigger":"change"
        }
    ],
    "desc":[
        {
            "required":true,
            "message":"请输入描述",
            "trigger":"blur"
        },
        {
	        //输入框可使用'min'和'max'来控制最多和最少输入多少字
            "type":"string",
            "min":20,
            "message":"最多输入20个字,
            "trigger":"blur"
        }
    ]
}
```
验证规则中的字段名称要和接口中的字段名一一对应，如果需要表单验证的字段包含在`rules`中即可。

###五、页面删除接口
页面删除接口现在都是单个删除的接口，后续如果可以的话，删除接口可以同时支持单个项目删除和多个项目删除。单个项目删除前端会传单个项目`id`到后端，数据类型是`String`字符型。多个项目删除时前端会传多个项目的`id`集合到后端，数据类型是`Array[String]`数组类型。


##ToDoList
1. 后端上传图片及下载图片接口优化，上传完成之后即返回图片地址。项目中所有涉及到图片的接口，接口中图片字段直接返回图片地址，前端可直接拿过来显示即可，不需要做其他处理。在此功能的基础上，前端封装上传图片插件，上传加入loading动画，上传完成后显示图片预览，可以删除图片重新上传，可以批量上传等功能。

2. 项目中所有用到的树结构数据`treeData`、`treeDataAll`目前都是在不同文件路径下。这样的话如果某些目录下有权限某些目录下没有权限，会造成类似新建企业时候，需要加载行业信息，然而行业模块当前用户没有权限，结果行业选择的表单项没有数据的尴尬场景。最好的解决方案是把所有的树结构数据都放在统一的一个接口中，然后前端会传不同的`type`来获取不同类型的树结构数据，后端代码也方便管理，前端也可以实现树组件的更好封装性。

3. 项目中现在权限管理只控制到了左侧菜单及子菜单的级别，后续想控制到按钮级别。大概的方案是后端在登录接口返回的`menuList`字段中的数据项中添加一个属性，对应每个菜单中有一个`accessList`的属性。值是一个数组，数组中包含的是当前用户对这个菜单对应的页面里有哪些权限，例如`accessList:['add','delete','edit','query']`。数组中`add`表示新增权限，`delete`表示删除权限，`edit`表示编辑权限，`query`表示查询权限，如果需要的话查看详情也可以单独配置一个权限。其他的特殊页面，类似新闻列表页面，需要审核新闻，某些用户可以审核，这时候就需要后端在`accessList`中再添加一项。比如是`check`，这样前端会特殊处理，根据`accessList`中是否有`check`来去做前端是否显示审核按钮。
