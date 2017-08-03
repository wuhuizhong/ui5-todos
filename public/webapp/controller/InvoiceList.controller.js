sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"webapp/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("webapp.controller.InvoiceList", {
	    formatter: formatter,
		onInit : function () {
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},
		
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo() 方法不能包含/(这是一个特殊的字符)，否则提示如下错误:
			// Uncaught Error: value "Invoices/1" for segment "{invoicePath}".
			// 参考: http://www.jianshu.com/p/34a65c4bf96a
			var sPath = oItem.getBindingContext("invoice").getPath().substr(1);
			oRouter.navTo("detail", {
				invoicePath: encodeURIComponent(sPath)
			});
		}

	});
});