sap.ui.define([
   "webapp/controller/BaseController"
], function (BaseController) {
   "use strict";
   return BaseController.extend("webapp.controller.NotFound", {
      onInit: function () {
         //给notFound target的 display事件注册一个监听器
         var oRouter, oTarget;
			oRouter = this.getRouter();
			oTarget = oRouter.getTarget("notFound");
			oTarget.attachDisplay(function (oEvent) {
				this._oData = oEvent.getParameter("data"); //获取前面传入的data对象
			}, this);
      },
		// override the parent's onNavBack (inherited from BaseController)
		onNavBack : function (oEvent){
			var oHistory, sPreviousHash, oRouter;
			// in some cases we could display a certain target when the back button is pressed
			// 如果这个data对象有值，则通过display的方法来显示，并删除对象里面的值。
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}
			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
		
   });
});
