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

      // _onRoutePatternMatched: function(oEvent) {
      //  // Store current route name and view state model
      //  this._sRouteName = oEvent.mParameters.name;
      // },
   
      handlePressHome: function(){
         // this._oRouter.navTo("home")
         // 使用BaseController模块的方法this.getRouter()获取router
         this.getRouter().navTo("home", {}, true /*no history*/);
      }
    
   });
});