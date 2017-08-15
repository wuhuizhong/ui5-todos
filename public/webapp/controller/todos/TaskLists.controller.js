sap.ui.define([
  'webapp/controller/BaseController',
  'jquery.sap.global',
  'meteor-ui5-mongo/model/Model',
  'sap/ui/model/resource/ResourceModel',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/MessageBox'
], function(BaseController, jQuery, MongoModel, ResourceModel, JSONModel, Filter, FilterOperator, MessageBox) {
  "use strict";

  var CController = BaseController.extend("webapp.controller.todos.TaskLists", {
      
      oTaskLists: Mongo.Collection.get("TaskLists"),
    
      onInit: function() {
        // Set up local model for view state
        const viewState = {};
        var oViewStateModel = new JSONModel(viewState);
        this.getView().setModel(oViewStateModel, "viewState");
      
        // Create Meteor model
        var oModel = new MongoModel();
        this.getView().setModel(oModel);
        
        // Subscribe to task lists data.
        this._subscription = Meteor.subscribe('taskLists');
      },

      onExit: function(){
        this._subscription.stop();
      },

      onTaskListSelect: function(oEvent) {
        // Get taskList data for selected item
        var oList = oEvent.getSource();
        var oListItem = oList.getSelectedItem();
        // view 需设置List mode="SingleSelectMaster", 
        // 否则报错:Cannot read property 'getBindingContext' of null
        var oItemData = oListItem.getBindingContext().getObject();
        var oModel = this.getView().getModel("viewState");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // console.log("viewState: ", oModel.getData());
        console.log("oItemData._id: ", oItemData._id);
  
        // Nav to TaskList selected, preserving query parameters
        // TODO adjust route replace to be conditional when adding phone support
        // this._oRouter.navTo("tasksWithListId", {
        oRouter.navTo("tasksWithListId", {
          listId: oItemData._id
        }, true);
        
      },

      onAddTaskList: function(oEvent){
        var oInput = oEvent.getSource();
        this.oTaskLists.insert({
            name: oInput.getValue(),
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