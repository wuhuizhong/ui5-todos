sap.ui.define([
	"webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("webapp.controller.walkthrough.Employee", {
		onInit: function () {
		    // 创建JSON Model，并通过setModel方法绑定。
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			
            // Create a json model with data from a file and make it our view model
            // var oModel = new JSONModel('/webapp/json/Employees.json');
            // this.getView().setModel(oModel);
            // 改用manifest.json文件设置model:employee
            
            // 继承 "webapp/controller/BaseController" 时的写法
			var oRouter = this.getRouter();
			// 继承 "sap/ui/core/mvc/Controller" 时的写法
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
		    // 添加url匹配的监听器(可使用attachPatternMatched)，调用onRouteMatched方法。
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
			
			// Hint: we don't want to do it this way
			/*
			oRouter.attachRouteMatched(function (oEvent){
				var sRouteName, oArgs, oView;
				sRouteName = oEvent.getParameter("name");
				if (sRouteName === "employee"){
					this._onRouteMatched(oEvent);
				}
			}, this);
			*/
			
		},
		
		// 在URL中获取 employeeId 并绑定到 Element ，ODataModel 将在后台处理数据请求. 
		// 当数据加载时, 显示busy的标记，可以在dataRequested及dataReceived事件中处理。
		_onRouteMatched : function (oEvent) {
			var oView, sPath;
			oView = this.getView();
		    // oRouter.navTo() 方法不能包含/(这是一个特殊的字符)
		    // 需使用 encodeURIComponent() 函数编码
			// 参考: http://www.jianshu.com/p/34a65c4bf96a
			sPath = decodeURIComponent(oEvent.getParameter("arguments").employeeId);

			oView.bindElement({
			    // 不能加载detail数据,原因待查...
				// path : "/Employees(" + sPath + ")",
				path: "/" + sPath,
				model: "employee",
				events : {
				    // 在change事件中，判断能否加载binding context的数据。
					// change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},
		
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}
		
	});
});