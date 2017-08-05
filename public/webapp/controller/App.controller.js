sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageBox"
], function (Controller, MessageBox) {
   "use strict";
   return Controller.extend("webapp.controller.App", {
      onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			// Set up route handling
         this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
		},
		
      onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
		},

      _onRoutePatternMatched: function(oEvent) {
        // Store current route name and view state model
        this._sRouteName = oEvent.mParameters.name;
      },
   
      handlePressHome: function(){
          this._oRouter.navTo("home")
      },
   
      onhandleUserItemPressed: function(){
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("underConstruction", [sRecipient]);
         MessageBox.information(sMsg);
      }
    
   });
});