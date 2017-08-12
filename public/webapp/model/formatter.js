sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return resourceBundle.getText("invoiceStatusA");
				case "B":
					return resourceBundle.getText("invoiceStatusB");
				case "C":
					return resourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		},
		
		/**
		 * Convert microsoft images by removing proprietory OLE headers
    	 * per https://groups.google.com/forum/#!topic/odata4j-discuss/6amvlFgExEU
    	 * and return data url to display as Image src.
		 * @public
		 * @param {string} sValue the raw base64 encoded data (MS format)
		 * @returns {string} URL for base64 image with converted data
		 */
		dataUrlForMsImage : function (sValue) {
        	var imageData = sValue.substring(104);
        	return "data:image/bmp;base64," + imageData;
		}
		
	};
});