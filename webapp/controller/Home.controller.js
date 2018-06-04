sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, JSONModel, ODataModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("Camera.controller.Home", {

		onInit: function() {

			this.getView().setModel(new JSONModel({
				photos: []
			}));
			var config = this.getOwnerComponent().getManifest();
			var sServiceUrl = config["sap.app"].dataSources.ZUPLOADIMAGE2_SRV.uri;
			var oData = new ODataModel(sServiceUrl, true);
			this._odata = oData;
			oData.refreshSecurityToken();
			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: oData.getHeaders()['x-csrf-token']
			}));
			oFileUploader.setUploadUrl("/sap/opu/odata/sap/ZUSERPHOTO_SRV/UserSet('denisgaland@gmail.com')/Photo");
			oFileUploader.setSendXHR(true);
		},

		/////////////////////////////////////////////
		//  EVENTS
		/////////////////////////////////////////////
		onSnapshot: function(oEvent) {
			// The image is inside oEvent, on the image parameter,
			// let's grab it.
			var oModel = this.getView().getModel();
			var aPhotos = oModel.getProperty("/photos");
			aPhotos.push({
				src: oEvent.getParameter("image")
			});
			oModel.setProperty("/photos", aPhotos);
			this.getView().byId("imageid").setSrc(oEvent.getParameter("image"));
			this.getView().byId("toolbarid").setVisible(true);
			this.getView().byId("preview").setVisible(true);
		},

		/**
		 * Stop the camera when the tab is not visible.
		 * @param {object} name
		 * @returns {object}
		 */
		onTabSelect: function(oEvent) {
			var oTab = oEvent.getParameter("key");
			var oCamera = this.getView().byId("idCamera");
			if (oTab !== "demo") {
				oCamera.stopCamera();
			} else {
				oCamera.rerender();
			}
		},

		reset: function() {
			this.getView().byId("imageid").setSrc("");
			this.getView().byId("toolbarid").setVisible(false);
			this.getView().byId("preview").setVisible(false);
		},

		save: function() {
			var oController = this;
			var oView = this.getView();
			MessageBox.show("Are you sure you want to send this image?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function(oAction) {
					debugger;
					if (oAction === "YES") {
						var o = oView.byId("imageid").getSrc().split(";");
						var binary = o[1].split(",")[1];
						var config = oController.getOwnerComponent().getManifest();
						var sServiceUrl = config["sap.app"].dataSources.ZUSERPHOTO_SRV.uri;
						var oData = new ODataModel(sServiceUrl, true);
						var sPath = "/PhotosSet";
						oData.create(sPath, binary);
						oView.byId("toolbarid").setVisible(false);
						oView.byId("preview").setVisible(false);
						MessageToast.show("Email Sent", {
							my: "CenterCenter",
							at: "CenterCenter"
						});
					}
				}
			});

			//oModel.refresh(true);
		},

		/*save: function() {
			var oController = this;
			var oView = this.getView();
			var sServiceUrl = "/sap/opu/odata/sap/ZUPLOADIMAGE2_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
			var sPath = "/FileSet('test.jpg')/$value";
			ODataModel.read({
					requestUri: "http://hqsfio01d.distriplus.local:8001/sap/opu/odata/sap/ZUPLOADIMAGE2_SRV/FileSet('test.jpg')",
					method: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					}
				},
				function(data, response) {
					alert("ok");*/
		/*header_xcsrf_token = response.headers['x-csrf-token'];
		csrftoken = header_xcsrf_token;*/

		//$.ajax({
		/*url: 'http://ambrifiori.am.brothergroup.net:8081/sap/opu/odata/sap/ZPVSYSTEM_SRV/PromoImagesSet/',
		//dataType: 'json',
		data: imgData,
		//data: image,
		type: 'POST',
		headers: {
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": "image/jpeg",
			"DataServiceVersion": "2.0",
			/*"Accept": "application/atom+xml,application/atomsvc+xml,application/xml",  
			"X-CSRF-Token": csrftoken,
			"slug": slug,
		},
		success: function(data) {
			debugger;
			console.log(data);
		},
		error: function(data) {
			debugger;
			console.log(data);
		}*/
		//});
		/*});
		},*/

		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				sap.ui.commons.MessageBox.show("Return Code: " + sResponse, "Response", "Response");
			}
		},

		handleUploadPress: function(oEvent) {
			this._odata.refreshSecurityToken();
			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: oFileUploader.getValue()
			}));
			oFileUploader.upload();
		}

	});
});

/*oModel.update(sPath, oView.byId("imageid").getSrc());
				oModel.attachRequestCompleted(function() {
					debugger;
					oController.getOwnerComponent().getModel().refresh();
					sap.ui.getCore().byId("_id").setValue("");
					sap.ui.getCore().byId("_name").setValue("");
					sap.ui.getCore().byId("_surname").setValue("");
					oController._fragment.unbindContext();
				});*/
/*var reader = new FileReader();
reader.onload = (function(theFile) {
		return function(evt) {
			//Locate base64 content
			var base64Index = evt.target.result.indexOf(oView.byId("imageid")) + oView.byId("imageid").length;
			var base64 = evt.target.result.substring(base64Index);
			var sAttachService = window.location.origin + "/sap/opu/odata/ZUPLOADIMAGE_SRV_01/ZUPLOADIMAGESet"
		}
	}*/
/*var sPath = "/FileSet('test.jpg')/$value";
var sServiceUrl = "/sap/opu/odata/sap/ZUPLOADIMAGE2_SRV/";
var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
var array = oView.byId("imageid").getSrc().split(',');
oModel.update(sPath, array[1], {
	success: function(response) {
		alert("ok")
	},
	error: function(error) {
		alert("nok")
	}
});*/
/*var imgData = JSON.stringify(oView.byId("imageid").getSrc());
var sServiceUrl = "/sap/opu/odata/sap/ZUPLOADIMAGE2_SRV/";
var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
var query = "/FileSet('test.jpg')/$value";
oModel.read(query, {
		requestUri: sServiceUrl,
		method: "GET",
		headers: {
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": "application/atom+xml",
			"DataServiceVersion": "2.0",
			"X-CSRF-Token": "Fetch"
		}
	},
	function(data, response) {
		debugger;
		var header_xcsrf_token = response.headers['x-csrf-token'];
		var csrftoken = header_xcsrf_token;

		$.ajax({
			url: sServiceUrl + query,
			//dataType: 'json',
			data: imgData,
			//data: image,
			type: 'POST',
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "image/jpeg",
				"DataServiceVersion": "2.0",
				"Accept": "application/atom+xml,application/atomsvc+xml,application/xml",
				"X-CSRF-Token": csrftoken,
				"slug": slug,
			},
			success: function(data2) {
				debugger;
				console.log(data2);
			},
			error: function(data3) {
				debugger;
				console.log(data3);
			}
		});
	});*/