sap.ui.define([
    "webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("webapp.controller.walkthrough.EmployeeList", {
	    onInit: function() {
            // Create a json model with data from a file and make it our view model
            // var oModel = new JSONModel('/webapp/json/Employees.json');
            // this.getView().setModel(oModel);
            // 改用manifest.json文件设置model:employee
        },
        
        // 给item加上press事件，带参数employeeId导航到employee
        onListItemPressed : function(oEvent){
			var oItem, sPath;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oItem = oEvent.getSource();
			// getProperty("EmployeeID")不能加载detail数据,原因待查...
			// sPath = oItem.getBindingContext("employee").getProperty("EmployeeID");
			sPath = oItem.getBindingContext("employee").getPath().substr(1);

			// oRouter.navTo() 方法不能包含/(这是一个特殊的字符)
			// 需使用 encodeURIComponent() 函数编码
			// 参考: http://www.jianshu.com/p/34a65c4bf96a
			// this.getRouter().navTo("employee",{
			oRouter.navTo("employee", {
				employeeId : encodeURIComponent(sPath)
			});
		}
		
	});
});