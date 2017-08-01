sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",
	"webapp/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, ODataModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("webapp.controller.InvoiceOData", {
	    formatter: formatter,
		onInit : function () {
    		// Set up Odata model for Employees - will be populated via Northwind
    		// odata service.  We use a proxy due to CORS issues with service being
    		// at different URL.  Calls to URL '/oDataProxy' are redirected to
    		// http://services.odata.org/V2/Northwind/Northwind.svc
    		var oModel = new ODataModel('/oDataProxy');
    		this.getView().setModel(oModel);
      
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
		}

	});
});