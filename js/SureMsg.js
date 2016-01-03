/**
 * Copyright 2015, Wuxi SOUL.
 * 
 */
!(function($, window){
	'use strict';

	var __Msg = {
			showLoadingImg : function(){
				if ($('#index_loadingimg').length <= 0) {
					$(document.body).prepend('<div id="index_loadingimg" class="loadingimg" style="display: none;"><img src="img/loading5.gif" /></div>');
				}
				if ($('#index_loadinglayer').length <= 0) {
					$(document.body).prepend('<div id="index_loadinglayer" class="loadinglayer" style="display: none;"></div>');
				}
				$("#index_loadingimg").show();
				$("#index_loadinglayer").show();
			},
			
			hideLoadingImg : function (){
				if ($('#index_loadingimg').length > 0){
					$("#index_loadingimg").hide();
				}
				if ($('#index_loadinglayer').length >0) {
					$("#index_loadinglayer").hide();
				}
			},
	
			showLoadBar : function(msg){
				$.SureMsg.showLoadingImg();
			},
			
			hideLoadBar : function() {	
				$.SureMsg.hideLoadingImg();
			},


			confirm : function(msg, ok, can) {
				art.dialog({
				    content: msg,
				    ok: ok,
				    cancelVal: '取消',
				    cancel: can //为true等价于function(){}
				});
			},

			alert : function(msg, callbackFn) {
				art.dialog({
				    content: msg,
				    lock : true,
				    ok: callbackFn
				});
			},

			info : function(title, msg, callbackFn) {
				art.dialog({
					title : title || "",
					content : msg,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			showErrorInfo : function(title, msg, callbackFn) {
				art.dialog({
					title : title,
					content : msg,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			showNormalInfo : function(title, msg, callbackFn) {
				var args = "String.format(msg,";
				for ( var i = 2; i < arguments.length; i++) {
					if (i == arguments.length - 1)
						args += 'arguments[' + i + ']';
					else
						args += 'arguments[' + i + '],';
				}
				args += ")";
				var showStr = '';
				try {
					showStr = eval(args);
				} catch (error) {
					showStr = msg;
				}
				art.dialog({
					title : title,
					content : showStr,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			parseResponse : function(response, callbackFn) {
				var me = this,errorJson = null;
				var errorMsg = response.responseText;
				if (response.hasOwnProperty("responseJSON")){
					errorJson = response.responseJSON;
				}else{
					try{
						errorJson = eval("(" + errorMsg + ")");
					}catch(error){
						if(window.console){
							console.log(error);
						}
					}
				}
				if (errorJson != null) {
					me.showErrorInfo("错误", SureError.parseErrorMsg(errorJson), callbackFn);
				} else if (errorMsg.length > 0) {
					me.showErrorInfo("错误", errorMsg, callbackFn);
				} else if (errorMsg.length == 0) {
					me.showErrorInfo(response.status, response.statusText, callbackFn);
				}
			},

			showWarningInfo : function(msg, ok, can) {
				art.dialog({
				    content: msg,
				    lock : true,
				    ok: ok,
				    cancelVal: '取消',
				    cancel: can //为true等价于function(){}
				});
			}

	};

	window.SureMsg = __Msg;
}(jQuery, window));

