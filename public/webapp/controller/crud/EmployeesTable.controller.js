sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/model/Model',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/model/Sorter',
  'webapp/model/formatter'
], function(Controller, MeteorModel, Filter, FilterOperator, Sorter, formatter) {
	"use strict";
	
	var oContext;
	var oCurrentData;
	var sCurrentPath;
	var sCurrentEmp; // cureent employee
	
	// 参考: http://www.jianshu.com/p/eac20fbd0d31

	var CController = Controller.extend("webapp.controller.crud.EmployeesTable", {

		onInit: function() {
            // Create Meteor model
            var oModel = new MeteorModel();
            this.getView().setModel(oModel);
        
            // Subscribe to Employees data.
            this._subscription = Meteor.subscribe('employees');
		},

        onExit: function(){
            this._subscription.stop();
        },

		openDialog: function() {
			var oView = this.getView();

			// Open dialog
			var oEmpDialog = oView.byId("employeeDialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"webapp.view.crud.EmployeeDialog");
				oView.addDependent(oEmpDialog);
			}

			oEmpDialog.open();

			// Attach press event for CancelButton
			var oCancelButton = oView.byId("CancelButton");
			oCancelButton.attachPress(function() {
				oEmpDialog.close();
			});
		},

		// onCreate event
		onCreate: function(oEvent) {
			var oView = this.getView();

			this.openDialog();
			var oEmployeeDialog = oView.byId("employeeDialog");
			oEmployeeDialog.setTitle("{i18n>CreateEmployee}");
			oView.byId("EmployeeID").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			// clear
			oView.byId("EmployeeID").setValue("");
			oView.byId("LastName").setValue("");
			oView.byId("FirstName").setValue("");

			// commit save
			oView.byId("SaveCreate").attachPress(function() {
			    // Commit creation operation
			    // oEmployees定义为全局时报错
			    var oEmployees = Mongo.Collection.get("Employees");
                oEmployees.insert({
                    EmployeeID: oView.byId("EmployeeID").getValue(),
                    LastName: oView.byId("LastName").getValue(),
                    FirstName: oView.byId("FirstName").getValue(),
                    createdAt: new Date()
                });

				// oModel.create("/EmployeeCollection", oNewEntry, {
				// 	success: function() {
				// 		sap.m.MessageToast.show("Created successfully.");
				// 	},
				// 	error: function(oError) {
				// 		window.console.log("Error", oError);
				// 	}
				// });

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		onEdit: function(oEvent) {
			// no employee was selected
			if (!sCurrentEmp) {
				sap.m.MessageToast.show("No Employee was selected.");
				return;
			}

			var oView = this.getView();

			this.openDialog();
			var oEmployeeDialog = oView.byId("employeeDialog");
			oEmployeeDialog.setTitle("{i18n>EditEmployee}");
			oView.byId("EmployeeID").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);

			// populate fields
			oView.byId("EmployeeID").setValue(oContext.getProperty("EmployeeID"));
			oView.byId("LastName").setValue(oContext.getProperty("LastName"));
			oView.byId("FirstName").setValue(oContext.getProperty("FirstName"));

			// Attach save event
			oView.byId("SaveEdit").attachPress(function() {
			    var oChanges = {
					"EmployeeID": "",
					"LastName": "",
					"FirstName": ""
				};

				// populate value from form
				oChanges.EmployeeID = oView.byId("EmployeeID").getValue();
				oChanges.LastName = oView.byId("LastName").getValue();
				oChanges.FirstName = oView.byId("FirstName").getValue();
				// 再次执行Edit时oChanges为null, 原因待查.
				console.log("oChanges: ", oChanges);
				
				// commit creation
				// oEmployees定义为全局时报错
				var oEmployees = Mongo.Collection.get("Employees");
                oEmployees.update(oCurrentData._id, {
                    $set: oChanges,
                });
                
				// oModel.update(sCurrentPath, oChanges, {
				// 	success: function() {
				// 		sap.m.MessageToast.show("Changes were saved successfully.");
				// 	},
				// 	error: function(oError) {
				// 		window.console.log("Error", oError);
				// 	}
				// });

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		// onDelete event
		onDelete: function() {
			var that = this;

			// no employee was selected
			if (!sCurrentEmp) {
				sap.m.MessageToast.show("No Employee was selected.");
				return;
			}
			
			var sId = oCurrentData._id;
			// oEmployees定义为全局时报错
			var oEmployees = Mongo.Collection.get("Employees");

			var oDeleteDialog = new sap.m.Dialog();
			oDeleteDialog.setTitle("{i18n>Deletion}");

			var oText = new sap.m.Label({
				text: "Are you sure to delete employee [" + sCurrentEmp + "]?"
			});
			oDeleteDialog.addContent(oText);

			oDeleteDialog.addButton(
				new sap.m.Button({
					text: "Confirm",
					press: function() {
						oEmployees.remove(sId);
						oDeleteDialog.close();
					}
				})
			);

			oDeleteDialog.open();
		},

		onItemPress: function(evt) {
			var oSource = evt.getSource();
			oContext = evt.getSource().getBindingContext();
            oCurrentData = oSource.getBindingContext().getObject();
			sCurrentPath = oContext.getPath();
			sCurrentEmp = oContext.getProperty("LastName");
            // console.log("oCurrentData._id: ", oCurrentData._id);
			// console.log("sCurrentPath: ", sCurrentPath);
			// console.log("sCurrentEmp: ", sCurrentEmp);
		}
		
	});
	
	return CController;
	
});