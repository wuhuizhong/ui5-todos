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

  var CController = Controller.extend("webapp.controller.todos.TasksWithListId", {
      
      oTasks: Mongo.Collection.get("Tasks"),
    
      onInit: function() {
        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        
        // Set up local model for view state
        const viewState = {Task: {}};
        var oViewStateModel = new JSONModel(viewState);
        this.getView().setModel(oViewStateModel, "viewState");
        
        // Set up route handling
        this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
        
        // Include our custom style sheet
        jQuery.sap.includeStyleSheet("webapp/style.css");
        
        // Subscribe to tasks data.
        // this._subscription = Meteor.subscribe('tasks');
        this._subscription = Meteor.subscribe("tasks", () =>{
          this._loadTasksForCurrentRoute();
        });
        
      },

      onExit: function(){
        this._subscription.stop();
      },

      _onRoutePatternMatched: function(oEvent) {
        // Store current route name and view state model
        this._sRouteName = oEvent.mParameters.name;
  
        // Set which view and source files to display in our view state model
        if (this._sRouteName === "tasksWithListId"){
          var oArguments = oEvent.getParameters().arguments;
          this._sListId = oArguments.listId;
          this._loadTasksForCurrentRoute();
        }
      },

      _loadTasksForCurrentRoute() {
        // Need list
        if (!this._sListId){
          return;
        }
  
        // Get tasks
        // var oTask = Mongo.Collection.get("Tasks").find({"listId": this._sListId});
        var oTask = Mongo.Collection.get("Tasks").find({"listId": this._sListId});
        // meteor mongo
        // db.Tasks.find({"listId" : "n2sYSzdpwm4hAN5eo"})
        console.log("this._sListId: " + this._sListId);
        console.log("oTask: " + oTask.count());
        if (!oTask){
          return;
        }
  
        // Store in view model for view property binding
        const oModel = this.getView().getModel("viewState");
        oModel.setProperty("/Task", oTask);
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