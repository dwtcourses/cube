// TODO: ajax请求完成失败后回调方法

export default {
	data() {
		return {

		}
	},
	methods: {
		API_login(data) {
			return this.$post('/a/login', data);
		},
		API_logout() {
			return this.$get('/a/logout');
		},
		API_qryList(path, data) {
			return this.$post(path, data);
		},
		API_modifyPwd(data) {
			return this.$post('/a/sys/user/modifyPwd', data);
		},
		API_qryInfoById(path, id) {
			return this.$post(path, {
				id: id
			})
		},
		API_savaInfo(path, data) {
			return this.$post(path, data)
		},
		API_delInfo(path, id) {
			return this.$post(path, {
				id: id
			})
		},
		API_getDataList(data) {
			return this.$post('/a/test/testData/qryTestDataListByCon', data);
		},
		API_getDetail(id) {
			return this.$post('/a/test/testData/qryTestDataById', {
				id: id
			})
		},
		API_savaData(data) {
			return this.$post('/a/test/testData/saveTestData', data)
		},
		API_delData(id) {
			return this.$post('/a/test/testData/deleteTestData', {
				id: id
			})
		},
		API_treeData(data) {
			let param = {
				id: data.id
			};
			return this.$post('/a/sys/' + data.type + '/treeData', param)
		},
		API_treeDataAll(data) {
			let param = {
				id: data.id
			};
			return this.$post('/a/sys/' + data.type + '/treeDataAll', param);
		},
		API_customTreeData(data) {
			return this.$post('/a/subgroup/tree/treeData', data)
		},
		API_customTreeDataAll(data) {
			let param = {
				id: data.id
			};
			return this.$post(data.url, param)
		},
		API_selectData(type) {
			return this.$post('/a/sys/dict/getDictList', {
				type: type
			});
		},
		API_qryDictTypeList() {
			return this.$post('/a/sys/dict/qryDictTypeList');
		},
		API_qryDictList(data) {
			return this.$post('/a/sys/dict/qryDictList', data);
		},
		API_saveDict(data) {
			return this.$post('/a/sys/dict/saveDict', data);
		},
		API_deleteDict(id) {
			this.$post('/a/sys/dict/deleteDict', {
				id: id
			});
		},
		API_getDictById(id) {
			return this.$post('/a/sys/dict/getDictById', {
				id: id
			});
		},
		API_getMenuList() {
			return this.$post('/a/sys/menu/list', {});
		},
		API_getMenuInfo(id) {
			return this.$post('/a/sys/menu/info', {
				id: id
			});
		},
		API_saveMenu(data) {
			return this.$post('/a/sys/menu/save', data);
		},
		API_deleteMenu(id) {
			return this.$post('/a/sys/menu/delete', {
				id: id
			});
		},
		API_getUserList(data) {
			return this.$post('/a/sys/user/qryUserList', data);
		},
		API_getUserById(id) {
			return this.$post('/a/sys/user/getUserById', {
				id: id
			});
		},
		API_deleteUser(id) {
			return this.$post('/a/sys/user/deleteUser', {
				id: id
			});
		},
		API_saveUser(data) {
			return this.$post('/a/sys/user/saveUser', data);
		},
		API_getRoleList() {
			return this.$post('/a/sys/role/list', {});
		},
		API_getRoleInfo(id) {
			return this.$post('/a/sys/role/info', {
				id: id
			});
		},
		API_saveRole(data) {
			return this.$post('/a/sys/role/save', data);
		},
		API_deleteRole(id) {
			return this.$post('/a/sys/role/delete', {
				id: id
			});
		},
		API_getUserRole() {
			return this.$post('/a/sys/user/qryUserAllRoleList');
		},
		API_officeList(id) {
			return this.$post('/a/sys/office/list', {
				parentId: id
			});
		},
		API_officeInfo(id) {
			return this.$post('/a/sys/office/info', {
				id: id
			});
		},
		API_officeSave(data) {
			return this.$post('/a/sys/office/save', data);
		},
		API_officeDelete(id) {
			return this.$post('/a/sys/office/delete', {
				id: id
			});
		},
		API_areaList(id) {
			return this.$post('/a/sys/area/list', {
				parentId: id
			});
		},
		API_areaInfo(id) {
			return this.$post('/a/sys/area/info', {
				id: id
			});
		},
		API_areaSave(data) {
			return this.$post('/a/sys/area/save', data);
		},
		API_areaDelete(id) {
			return this.$post('/a/sys/area/delete', {
				id: id
			});
		},
		//获取树结构数据列表
		API_getTreeDataList(data) {
			return this.$post('/a/subgroup/tree/treeDataList', data)
		},
		//获取树结构数据详情
		API_treeDataById(data) {
			return this.$post('/a/subgroup/tree/treeDataById', data)
		},
		//新增树结构数据
		API_treeDataAdd(data) {
			return this.$post('/a/subgroup/tree/treeDataAdd', data)
		},
		//修改树结构数据
		API_treeDataEdit(data) {
			return this.$post('/a/subgroup/tree/treeDataEdit', data)
		},
		//删除树结构数据
		API_treeDataDel(data) {
			return this.$post('/a/subgroup/tree/treeDataDel', data)
		},



		//业务API
		API_qryTdBServiceList() {
			return this.$post('/a/product/tdBService/qryTdBServiceList')
		},
		API_qryTdBRatePlanVersionList() {
			return this.$post('/a/rateplanversion/tdBRatePlanVersion/qryTdBRatePlanVersionList')
		},
		API_qryTdBTemplateList() {
			return this.$post('/a/template/tdBTemplate/qryTdBTemplateList')
		},
		//获取所有企业信息
		API_findEntAll() {
			return this.$post('/a/ent/info/findEntInfoAll')
		},
		//获取所有门店信息
		API_qryShopListByCon() {
			return this.$post('/a/logistics/shop/qryShopListByCon', {
				currPage: 1,
				pageSize: 400
			})
		},
		//获取所有地址信息
		API_qryAddressList() {
			return this.$post('/a/logistics/receivingAddress/qryReceivingAddressListByCon', {
				currPage: 1,
				pageSize: 400
			})
		},
		//获取所有物流公司信息
		API_qryLogisticsCompanyList() {
			return this.$post('/a/logistics/logisticsCompany/qryLogisticsCompanyListByCon', {
				currPage: 1,
				pageSize: 400
			})
		},
		//保存收货地址
		API_saveReceivingAddress(data) {
			return this.$post('/a/logistics/receivingAddress/saveReceivingAddress', data)
		},
		//预占卡号
		API_campCardByTradeId(data) {
			return this.$post('/a/card/card/campCardByTradeId', data)
		},
		//提交配卡订单
		API_saveTradeAllotCard(data){
			return this.$post('/a/trade/tradeAllotCard/saveTradeAllotCard', data)
		},
		//商品上架
		API_productPutaway(id){
			return this.$post('/a/product/tdBProduct/updateTdBProductPutaway', {
				id
			})
		},
		//商品下架
		API_productSoldOut(id){
			return this.$post('/a/product/tdBProduct/updateTdBProductSoldOut', {
				id
			})
		},
		//商品发布
		API_productRelease(data){
			return this.$post('/a/product/tdBProductRelease/saveTdBProductRelease', data)
		},
		//更改卡状态
		API_setState(data){
			return this.$post('/a/card/card/setState', data)
		},
		//更改卡产品
		API_setCardProd(data){
			return this.$post('/a/card/cardProd/setCardProd', data)
		},
		//提交售卡订单
		API_submitTradeSale(data){
			return this.$post('/a/trade/tradeSale/submitTradeSale', data)
		},
		//查询当前账户余额
		API_accountBalance(){
			return this.$post('/a/account/accountBalance')
		},
		//账户充值
		API_accountRecharge(data){
			return this.$post('/a/account/accountRecharge',data)
		},
		//订单详情
		API_qryTradeSaleById(id){
			return this.$post('/a/trade/tradeSale/qryTradeSaleById',{
				id
			})
		},
		//查询企业客户经理
		API_getEntCustomerManager(){
			return this.$post('/a/ent/info/getEntCustomerManager')
		},
	}
}
