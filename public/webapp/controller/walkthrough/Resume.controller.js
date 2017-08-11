sap.ui.define([
	"webapp/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	// 建立aValidTabKeys数组，其值为IconTabBar中items中的Key
	var _aValidTabKeys = ["Info", "Projects", "Hobbies", "Notes"];
	return BaseController.extend("webapp.controller.walkthrough.Resume", {
		onInit: function () {
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			
			oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView, oQuery;
			var sPath = decodeURIComponent(oEvent.getParameter("arguments").employeeId);
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				// path : "/Employees(" + oArgs.employeeId + ")",
				path : "/" + sPath,
				model: "employee",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
			
			// 建立oQuery对象存储router中query对象的值
			// oQuery对象有值并且是一个有效的tab值，
			// 设置selectedTabKey为oQuery对象中的tab，否则query为第一个值。
			// URL形式如下webapp/index.html#/employees/3/resume?tab=Info
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
				oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
			} else {
				// the default query param should be visible at all time
				console.log(sPath);
				this.getRouter().navTo("employeeResume", {
					employeeId : encodeURIComponent(sPath), //oArgs.employeeId,
					query: {
						tab : _aValidTabKeys[0]
					}
				},true /*no history*/);
			}
			
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext("employee")) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onTabSelect : function (oEvent){
			// var oCtx = this.getView().getBindingContext("employee");
			var sPath = this.getView().getBindingContext("employee").getPath().substr(1);
			console.log("onTabSelect:"+sPath);
			this.getRouter().navTo("employeeResume", {
				employeeId : encodeURIComponent(sPath), //oCtx.getProperty("EmployeeID"),
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		}
		
	});
});