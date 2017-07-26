import '../imports/api/tasks.js';
// Show something when UI5 is ready
sap.ui.getCore().attachInit(function () {
  // jQuery("#content").html("Hello World - UI5 is ready");
  // Create view
  const oView = sap.ui.xmlview({
      viewName: "webapp.Tasks"
  });

  // Add it to new Shell and place at content div
  new sap.m.Shell({
      app: oView
  }).placeAt("content");
});