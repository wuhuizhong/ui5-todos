sap.ui.define([
   "webapp/controller/BaseController",
   "sap/m/MessageBox"
], function (BaseController, MessageBox) {
   "use strict";
   // 继承BaseController模块
   return BaseController.extend("webapp.controller.App", {
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
   
      handlePressHome: function(){
         // this._oRouter.navTo("home")
         // 使用BaseController模块的方法this.getRouter()获取router
         this.getRouter().navTo("home", {}, true /*no history*/);
      },
   
      onhandleUserItemPressed: function(){
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sMsg = oBundle.getText("underConstruction");
         MessageBox.information(sMsg);
      }
    
   });
});