sap.ui.define([
    "webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("webapp.controller.walkthrough.EmployeeList", {
	    onInit: function() {
        // Create a json model with data from a file and make it our view model
        var oModel = new JSONModel('/webapp/json/Employees.json');
        this.getView().setModel(oModel);
    }
	});
});