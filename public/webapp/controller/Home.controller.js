sap.ui.define([
  'webapp/controller/BaseController',
  'sap/ui/model/json/JSONModel'
], function(BaseController, JSONModel) {
  "use strict";

  var CController = BaseController.extend("webapp.controller.Home", {

    onInit: function() {
      // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      var oViewModel = new JSONModel({
        meteorRelease: Meteor.release.split('@')[1],
        ui5Version: sap.ui.version,
      });
      this.getView().setModel(oViewModel, "viewModel");
    },

    onPressGotoUi5: function() {
      var win = window.open('http://openui5.org/', '_blank');
      win.focus();
    },

    onPressGotoZsITGroup: function() {
      var win = window.open('/', '_blank');
      win.focus();
    },
    
    onDisplayNotFound : function (oEvent) {
			// display the "notFound" target without changing the hash
			// 点击按钮可以导航到NotFound
		  // 也可以this.getOwnerComponent().getRouter().getTargets()
		  // 或者this.getOwnerComponent().getTargets()获取router
			// 在display方法第二个参数传一个data对象，里面包含了来源target
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
			// 在NotFound controller 的init function中给此事件注册一个监听器
		},
		
		onNavToEmployees : function (oEvent){
			this.getRouter().navTo("employeeList");
		},
		onNavToEmployeeOverview : function (oEvent) {
			this.getRouter().navTo("employeeOverview");
		}


  });

  return CController;

});
