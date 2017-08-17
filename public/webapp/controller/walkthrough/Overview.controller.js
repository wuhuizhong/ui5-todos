sap.ui.define([
   "webapp/controller/BaseController",
   "sap/m/MessageBox"
], function (BaseController, MessageBox) {
   "use strict";
   // 继承BaseController模块
   return BaseController.extend("webapp.controller.walkthrough.Overview", {
      onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			// Set up route handling
         // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         // this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
		},
		
      onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
		},

      // _onRoutePatternMatched: function(oEvent) {
      //  // Store current route name and view state model
      //  this._sRouteName = oEvent.mParameters.name;
      // },
   
      onhandleUserItemPressed: function(){
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sMsg = oBundle.getText("underConstruction");
         MessageBox.information(sMsg);
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
});