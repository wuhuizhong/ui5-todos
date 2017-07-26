// Show something when UI5 is ready
  sap.ui.getCore().attachInit(function () {
     jQuery("#content").html("Hello World - UI5 is ready");
  });