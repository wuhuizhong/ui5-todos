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

  var CController = Controller.extend("webapp.controller.todos.TasksWithGroupId", {

      oTasks: Mongo.Collection.get("Tasks"),

      onInit: function() {
        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // Set up local model for view state
        const ViewState = {
          showCompleted: true, 
          TasksWithGroupId: {}
        };
        var oViewStateModel = new JSONModel(ViewState);
        this.getView().setModel(oViewStateModel, "ViewState");

        // Set up route handling
        this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

        // Include our custom style sheet
        jQuery.sap.includeStyleSheet("webapp/style.css");

        // Subscribe to tasks data.
        // this._subscription = Meteor.subscribe('tasks');
        this._subscription = Meteor.subscribe("tasks", () =>{
          // URL Refresh load
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
        if (this._sRouteName === "tasksWithGroupId"){
          var oArguments = oEvent.getParameters().arguments;
          this._sGroupId = oArguments.groupId;
          // TaskGroups.controller onTaskGroupSelect load
          this._loadTasksForCurrentRoute();
        }
      },

      _loadTasksForCurrentRoute() {
        // Need group
        if (!this._sGroupId){
          return;
        }

        // Get tasks
        var oTaskCursor = Mongo.Collection.get("Tasks").find({"groupId": this._sGroupId});
        // var oTask = Mongo.Collection.get("Tasks").find();
        // 命令行查资料: meteor mongo
        // db.Tasks.find({"groupId" : "n2sYSzdpwm4hAN5eo"})
        var oTask = oTaskCursor.fetch();
        console.log("this._sGroupId: ", this._sGroupId);
        console.log("oTask: ", oTaskCursor.count());
        
        if (!oTask){
          return;
        }

        // Store in view model for view property binding
        const oModel = this.getView().getModel("ViewState");
        oModel.setProperty("/TasksWithGroupId", oTask);
        console.log(oModel.getData());
        // 测试: http://localhost:3000/#/tasks/n2sYSzdpwm4hAN5eo
        
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
        var oTasksWithGroupId = this.byId("TasksWithGroupId");
        oTasksWithGroupId.getBinding('items').filter(aFilters);
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
