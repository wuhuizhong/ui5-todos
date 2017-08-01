sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
	"webapp/controller/HelloDialog"
], function (UIComponent, JSONModel, HelloDialog) {
   "use strict";
   return UIComponent.extend("webapp.Component", {
      metadata : {
		//rootView: "webapp.view.HelloWorld"
		manifest: "json"
	  },

      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
         // set data model
         var oData = {
            recipient : {
               name : "World"
            }
         };
         var oModel = new JSONModel(oData);
         this.setModel(oModel);
         
         // set dialog
			// this._helloDialog = new HelloDialog(this.getRootControl());
			this._helloDialog = new HelloDialog(this.getAggregation("rootControl"));
			
			// create the views based on the url/hash
			this.getRouter().initialize();

        //  // set i18n model
        //  var i18nModel = new ResourceModel({
        //     bundleName : "webapp.i18n.i18n"
        //  });
        //  this.setModel(i18nModel, "i18n");
	   },

		openHelloDialog : function () {
			this._helloDialog.open();
		}
		
   });
});