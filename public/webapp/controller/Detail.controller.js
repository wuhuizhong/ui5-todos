sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("webapp.controller.Detail", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
		    // oRouter.navTo() 方法不能包含/(这是一个特殊的字符)，否则提示如下错误:
			// Uncaught Error: value "Invoices/1" for segment "{invoicePath}".
			// 参考: http://www.jianshu.com/p/34a65c4bf96a
		    var sPath = decodeURIComponent(oEvent.getParameter("arguments").invoicePath);
			this.getView().bindElement({
				path: "/" + sPath,
				model: "invoice"
			});
		}
	});
});