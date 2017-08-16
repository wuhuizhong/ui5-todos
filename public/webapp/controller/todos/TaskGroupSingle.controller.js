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

  var CController = Controller.extend("webapp.controller.todos.TaskGroupSingle", {

      oTaskGroups: Mongo.Collection.get("TaskGroups"),

      onInit: function() {
        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // Set up local model for view state
        const ViewState = {
          TaskGroup: {}
        };
        var oViewStateModel = new JSONModel(ViewState);
        this.getView().setModel(oViewStateModel, "ViewState");

        // Set up route handling
        this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

        // Subscribe to taskGroups data.
        // this._subscription = Meteor.subscribe('tasks');
        this._subscription = Meteor.subscribe("taskGroups", () =>{
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

        // Get TaskGroups
        var oTaskGroup = Mongo.Collection.get("TaskGroups").findOne(this._sGroupId);
        // 命令行查资料: meteor mongo
        // db.TaskGroups.findOne("n2sYSzdpwm4hAN5eo")
        console.log("oTaskGroup: ", this._sGroupId);
        
        if (!oTaskGroup){
          return;
        }

        // Store in view model for view property binding
        const oModel = this.getView().getModel("ViewState");
        oModel.setProperty("/TaskGroup", oTaskGroup);
        console.log(oModel.getData());
        // 测试: http://localhost:3000/#/tasks/n2sYSzdpwm4hAN5eo
        
      },

      onUpdateTaskGroup: function(oEvent){
        if (!this._sGroupId){
          return;
        }
        var oInput = oEvent.getSource();
        this.oTaskGroups.update(this._sGroupId, {
          $set: { name: oInput.getValue(), updateAt: new Date() },
        });
      },

      onPressDeleteTaskGroup: function(oEvent){
        if (!this._sGroupId){
          return;
        }
        // Ask user to confirm delete
        var that = this;
        var thatId = this._sGroupId
        MessageBox.confirm("Permanently remove task group?", {
          onClose: function(oAction){
            if (oAction === MessageBox.Action.OK){
              // Remove the task group
              that.oTaskGroups.remove(thatId);
              console.log("remove oTaskGroup: ", thatId);
            }
          }
        });
      }

  });

  return CController;

});
