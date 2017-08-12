sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'jquery.sap.global',
  'meteor-ui5-mongo/model/Model',
  'sap/ui/model/resource/ResourceModel',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/MessageBox'
], function(Controller, jQuery, MongoModel, ResourceModel, JSONModel, Filter, FilterOperator, MessageBox) {
  "use strict";

  var CController = Controller.extend("webapp.controller.todos.Tasks", {
      
      oTasks: Mongo.Collection.get("Tasks"),
    
      onInit: function() {
        // set i18n model
	      var i18nModel = new ResourceModel({
	      	bundleName : "webapp.i18n.i18n_zh_CN"
	      });
	      this.getView().setModel(i18nModel, "i18n");
        // Include our custom style sheet
        jQuery.sap.includeStyleSheet("webapp/style.css");
        //var oText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("TITLE");
        // var oModel = new JSONModel({
        //   Tasks: [{
        //     text: 'This is task 1'+oText
        //   }, {
        //     text: 'This is task 2'
        //   }, {
        //     text: 'This is task 3'
        //   }, ]
        // });
        var oModel = new MongoModel();
        this.getView().setModel(oModel);
        
        // Subscribe to tasks data.
        this._subscription = Meteor.subscribe('tasks');
        
        // Our local view state model
        var oViewState = {
          showCompleted: true
        };
        var oViewModel = new JSONModel(oViewState);
        this.getView().setModel(oViewModel, "ViewState");
      },

      onExit: function(){
        this._subscription.stop();
      },

      onAddTask: function(oEvent){
        var oInput = oEvent.getSource();
        this.oTasks.insert({
            text: oInput.getValue(),
            createdAt: new Date()
        });
        oInput.setValue();
      },

      onSelectionChange: function(oEvent){
        var oListItem = oEvent.getParameters().listItem;
        var oTaskData = oListItem.getBindingContext().getObject();
  
        // Set the checked property in the database to match the current selection
        this.oTasks.update(oTaskData._id, {
          $set: { checked: oListItem.getSelected() },
        });
      },

      getTaskTextAsHtml: function(bChecked, sText){
        if (bChecked){
          return "<span class='completedTask'>" + sText + "</span>";
        } else {
          return sText;
        }
      },
      
      onPressShowCompleted: function(){
        // Get current state of "show completed" toggle button
        var oViewState = this.getView().getModel('ViewState');
        var bShowCompleted = oViewState.getProperty('/showCompleted');
    
        // Build task filter according to current state
        var aFilters = [];
        if (!bShowCompleted){
          aFilters.push(new Filter({
              path: 'checked',
              operator: FilterOperator.NE,
              value1: true
          }));
        }
    
        // Set filter
        var oTaskList = this.byId("TaskList");
        oTaskList.getBinding('items').filter(aFilters);
      },

      onPressDeleteTask: function(oEvent){
        var oListItem = oEvent.getSource();
        var oTaskData = oListItem.getBindingContext().getObject();
      
        // Ask user to confirm delete
        var that = this;
        MessageBox.confirm("Permanently remove task?", {
          onClose: function(oAction){
            if (oAction === MessageBox.Action.OK){
              // Remove the task
              that.oTasks.remove(oTaskData._id);
            }
          }
        });
      }

  });

  return CController;

});