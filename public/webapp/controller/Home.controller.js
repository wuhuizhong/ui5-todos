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
    }


  });

  return CController;

});
