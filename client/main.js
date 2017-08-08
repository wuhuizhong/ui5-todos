import '../imports/startup/client/';
// Show something when UI5 is ready
sap.ui.getCore().attachInit(function () {
  // jQuery("#content").html("Hello World - UI5 is ready");
  // Create view
  // const oView = sap.ui.xmlview({
  //   viewName: "webapp.Tasks"
  //   //viewName: "webapp.view.HelloWorld"
  // });

  // Add it to new Shell and place at content div
  // new sap.m.Shell({
  //     app: oView
  // }).placeAt("content");
  
	// Create component container for our component and mount it to the dom
	new sap.m.Shell({
      app : new sap.ui.core.ComponentContainer({
              name : "webapp",
              height : "100%"
            })
	}).placeAt("content");
  
});