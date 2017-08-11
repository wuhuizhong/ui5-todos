sap.ui.define([
	"webapp/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("webapp.controller.walkthrough.Resume", {
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
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
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext("employee")) {
				this.getRouter().getTargets().display("notFound");
			}
		}
	});
});