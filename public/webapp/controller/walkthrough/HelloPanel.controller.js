sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("webapp.controller.walkthrough.HelloPanel", {
      onShowHello : function () {
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("helloMsg", [sRecipient]);
         // show message
         MessageToast.show(sMsg);
      },
      
      // onOpenDialog : function () {
      //    var oView = this.getView();
      //    var oDialog = oView.byId("helloDialog");
      //    // create dialog lazily
      //    if (!oDialog) {
      //       // create dialog via fragment factory
      //       oDialog = sap.ui.xmlfragment(oView.getId(), "webapp.view.HelloDialog");
      //       oView.addDependent(oDialog);
      //    }

      //    oDialog.open();
      // },
		onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
		},
 
		onCloseDialog : function () {
			this.getView().byId("helloDialog").close();
		}
		
   });
});