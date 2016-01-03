(function($) {
	'use strict';
	
	$(document).ready(function(){
		// global();
		// login();
		// album_list();
		// album_detail();
		// book_list();
		// chooesephoto();
		// uploadphoto();
	});
	function global(){
		//关于顶部菜单的滑动交互
		var touchFlag=true;
		$(document).on('touchstart',function(e) {
			touchFlag=true;
		});
		$(document).on('touchmove',function(e) {
			touchFlag=false;
			console.log(touchFlag)
			$(".album_list_tab_wapper").fadeOut();
			$(".tab_trigger_item").css('background','url(./img/inter_action/add.png) no-repeat');
			return;
		});
	}
	function uploadphoto(){
		var width=document.body.clientWidth;
		$(".uploadphoto_main_wrapper li").css("height",width/3-8);
		$(".uploadphoto_main_wrapper .closebutton_img").on("touchend",function(){
			$(this).parent("li").detach();
		});
		$(".photoqualitysetting_wrapper a").on("touchend",function(){
			$(this).parent("li").siblings("li").removeClass("active").end().addClass("active");
		});
	}
	function login(){
		var clientHeight = $(window).height();
		var bodyheight=$('body').height();
		if (window.innerHeight > clientHeight)
			clientHeight = window.innerHeight;
		$(".login-index").css({"height":bodyheight +"px"});
		if(bodyheight<clientHeight){
			$(".login-index").css({"height":clientHeight +"px"});
		}else{
			$(".login-index").css({"height":bodyheight +"px"});
		}
	}

	function album_list(){
		// $(".album_list_arrow").each(function(){
		// 	$(this).css("padding",($(this).parent("li").height()-80)/2+"px 0")});
		var clientHeight = document.body.clientHeight;
		var clientWidth = document.body.clientWidth;
		$(".album_list_desc_item a").click(function(){
			$(this).parent().parent().siblings("li").removeClass("active");
			$(this).parent().parent().addClass("active");
		});
		$(document).on('touchmove',function(){
            $('.album_list_tab_wapper').fadeOut();
            $('.tab_trigger_item').css("background","url(./img/inter_action/add.png) no-repeat")
        });
		$(".tab_trigger_item").on("touchend",function(){
			if($(".album_list_tab_wapper").is(":hidden")){
				$(this).css("background","url(./img/inter_action/cancel.png) no-repeat")
				$(".album_list_tab_wapper").fadeIn();
			}else{
				$(this).css("background","url(./img/inter_action/add.png) no-repeat")
				$(".album_list_tab_wapper").fadeOut();
			}
		});
		$(".album_list_tab_wapper").on("touchend",function(e){
			$(".album_list_tab_wapper").fadeOut();
		});
		if(clientWidth<clientHeight){
			$(".albumlist_wrapper").css({"height":clientHeight +"px"});
		}else{
			$(".albumlist_wrapper").css({"height":clientWidth +"px"});
		}
	}

	function album_detail(){
		$(".praise_wrapper .praise_button").on("touchend",function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active");
			}else{
				$(this).addClass("active");
			}
		});
		$(".praise_wrapper .comment_button, .peply_item").on("touchend",function(){
			$(".mask").fadeIn();
			$(".album_detail_comment_window").show();
		});
		$(".album_detail_comment_window input").on("touchend",function(){
			$(".album_detail_comment_window").hide();
			$(".mask").fadeOut();
		});
		$(".album_detail_comment_list_wrapper .comment_content").each(function(){
			if ($(this).height()>100) {
				var readmoreEl="<a class='comment_content_readmore' href='javascript:;'>查看更多</a>"
				$(this).css({height:10+"em"});
				$(this).parent().append(readmoreEl);
			};
		});
		$(".comment_content_readmore").on("touchend",function(){
			$(this).prev("div").css("height","auto").end().hide();
		});
	}

	function book_list(){
		var touchFlag=true;
		$(".book_list_item").on('touchstart',function(e) {
			touchFlag=true;
		});
		$(".book_list_item").on('touchmove',function(e) {
			touchFlag=false;
			
		});
		$(".book_list_item").on('touchend',function(e) {
			// console.log(touchFlag)
			if(touchFlag==true){
				$(this).siblings(".book_list_item").find(".book_item_checked").hide();
				$(this).find(".book_item_checked").show();
			}else{
				e.stopPropagation();
			}
		});
	}
	function chooesephoto(){
		var touchFlag=true;
		var availWidth=window.screen.availWidth;
		$(".choosephoto_wrapper ul, .choosecover_wrapper ul").css("height",availWidth/3-10);
		$(".choosephoto_wrapper li, .choosecover_wrapper li").on("touchstart",function(){
			touchFlag=true;
		});
		$(".choosephoto_wrapper li, .choosecover_wrapper li").on("touchmove",function(){
			touchFlag=false;
		});
		$(".choosecover_wrapper li").on("touchend",function(e){
			if(touchFlag==true){
				$(".choosecover_wrapper li").removeClass("active");
				$(this).addClass("active");
			}else{
				e.stopPropagation();
			}
		});
		$(".choosephoto_wrapper ul li").on("touchend",function(e){
			if(touchFlag==true){
				if($(this).hasClass("active")){
					$(this).removeClass("active");
				}else{
					$(this).addClass("active");
				}
			}else{
				e.stopPropagation();
			}
		});
		$(".choosephoto_container .chooseall").on("touchend",function(){
			if($(".choosephoto_wrapper .active").length==0){
				$(".choosephoto_wrapper").find("li").addClass("active");
			}else{
				$(".choosephoto_wrapper").find("li").removeClass("active");
			}
		});
	}

	/** 改变视窗 **/
	function changeViewPort() {
		var phoneWidth = parseInt(window.screen.width);
		var phoneScale = phoneWidth / 320;

		var ua = navigator.userAgent;
		if (/Android (\d+\.\d+)/.test(ua)) {
			var version = parseFloat(RegExp.$1);
			if (version > 2.3) {
				document.write('<meta name="viewport" content="width=320, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
			} else {
				document.write('<meta name="viewport" content="width=320, target-densitydpi=device-dpi">');
			}
		} else {
			document.write('<meta name="viewport" content="width=320, user-scalable=no, target-densitydpi=device-dpi">');
		}
	}
} (jQuery));

