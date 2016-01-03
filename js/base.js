/**
 * Created by xingweiwei on 15/6/19.
 */
(function($, window) {

	'use strict'

	//默认隐藏标题，自动处理成 XXX...
	//全文自动设置为 title属性
	$.fn.extend({
		init_title: function() {
			$(this).each(function() {
				var sv = "";
				var __div = $(this);
				var max_length = __div.attr("max-length");
				if (max_length === undefined)
					max_length = 20;

				var value = __div.html();

				if (value.length > max_length) {
					var start = value.substr(0, max_length - 4);
					var end = value.substr(max_length - 1, 1)
					sv = start + "...";

					__div.html(sv);
					__div.attr('title', value);
				}

			});
		},

		//滚动距离顶部一定距离后固定在屏幕上方
		scrollFixedTools: function(offset) {
			window.onscroll = function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > offset) {
					this.attr('id', 'scrolltop_fixed');
					this.css({
						'position': 'fixed',
						'top': '0',
						'z-index': '99'
					});
					$('body').css('padding', '170px 0 0 0');
				} else {
					this.attr('id', '');
					this.css({
						'position': 'relative'
					});
					$('body').css('padding', '0');
				}
			}
		},
		//回到顶部
		scrollToTop: function(offset) {
			$('.scrolltop_item .more_btn').click(function() {
				var $this = $(this);
				if ($this.find('span').hasClass('rotateto225')) {
					$this.find('span').removeClass('rotateto225').addClass('rotatefrom225');
					$this.prev().stop().animate({
						height: '0'
					});
				} else {
					$this.find('span').removeClass('rotatefrom225').addClass('rotateto225');
					$this.prev().stop().animate({
						height: '285px'
					});
				}
			});
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.scrolltop_item').stop().fadeIn();
				} else {
					var morebtn = $('.scrolltop_item .more_btn');
					$('.scrolltop_item').stop().fadeOut();
				}
			});
			$('.scrolltop_item .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
		},
		//联系我们浮动菜单
		suspendMenu: function(offset) {
			/*var popupEl=$('.cus_popup_item');
			var popopFlag=false;
			$('.contactus_suspend_item .more_btn').click(function() {
				var $this = $(this);
				if ($this.find('span').hasClass('rotateto225')) {
					$('.cus_popup_wrapper>div').fadeOut();
					$this.find('span').removeClass('rotateto225').addClass('rotatefrom225');
					$this.prev().stop().animate({
						height: '0'
					});
				} else {
					$this.find('span').removeClass('rotatefrom225').addClass('rotateto225');
					$this.prev().stop().animate({
						height: '320px'
					});
				}
			});*/
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.gotop_btn').stop().fadeIn().css('display', 'block');
				} else {
					$('.gotop_btn').stop().fadeOut();
				}
			});
			$('.toolbar_tabs .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
			$('#suggest_btn').click(function() {
					art.dialog({
						title: '意见反馈',
						lock: true,
						content: document.querySelector('.feedback_container_float'),
						okVal: '发送',
						ok: function() {},
						cancelVal: '取消',
						cancel: function() {},
					});
				})
				/*$('.cus_tool_wrapper li').click(function(){
					var $this=$(this);
					var index=$this.index();
					var thisPopupEl=$('.cus_popup_wrapper .cus_popup_item').eq(index);
					if($('.cus_popup_wrapper .cus_popup_item').eq(index).is(':visible')){
						thisPopupEl.hide();
						popopFlag=false;
					}else{
						popupEl.hide();
						$this.find('a').addClass('active').end().siblings().find('a').removeClass('active');
						thisPopupEl.show().css('margin-top',80*index+55);
						popopFlag=true;
					}
				});
				$('.cus_suggestion_submit_wrapper>input[type=submit]').click(function(){
					$('.cus_popup_wrapper .cus_popup_item').eq(3).hide();
				});*/
		},
		//footer自动贴底效果，任意调整浏览器窗口高度都可以自动贴底，同时让页面主体内容垂直居中
		footerAlignBottom: function() {
			var $this = $(this);
			realign();
			$(window).resize(function() {
				realign();
			});

			function realign() {
				var availHeight = $(window).height();
				var thisHeight = $this.height();
				var loginMargin = availHeight - 210 - thisHeight;
				if (loginMargin > 0) {
					$this.css({
						'margin-top': loginMargin / 2,
						'margin-bottom': loginMargin / 2,
					});
					$('.footer').css('position', 'absolute');
				} else if (loginMargin < 0) {
					$this.css({
						'margin-top': 0,
						'margin-bottom': 0,
					});
				}
			}
		},
		//banner双向滑动效果
		toolsSlide: function(bsContainer, bsInner, arrowLeft, arrowRight, liPadding) {
			var $this = $(this);
			var thisLi = $this.find('li');
			var thisLiWidth = $this.find('li').width();
			var thisUl = $this.find('ul');
			var thisUlWidth = thisUl.width();
			var slideFlag = true;
			var liLength = $this.find('li').length;
			var flag = 0;
			var liCount = 0;

			var ulEl = function() {
				return $('<ul>' + thisUl.html() + '</ul>');
			}
			for (var i = 0; i < 2; i++) {
				$(bsInner).append(ulEl());
			};

			$(bsInner).find('ul').eq(0).addClass('prev');
			$(bsInner).find('ul').eq(2).addClass('next');

			sortUl();
			if (liLength > 4) {
				$(bsContainer).hover(function() {
					$(arrowLeft + ',' + arrowRight).show();
				}, function() {
					$(arrowLeft + ',' + arrowRight).hide();
				});
			} else {
				$(bsInner).css({
					width: (thisLiWidth + 50) * liLength
				});
			}
			$(arrowRight).click(function() {
				liCount++;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount >= 5) {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).prepend(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});
					}
				}
			});
			$(arrowLeft).click(function() {
				liCount--;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount <= -5) {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).append(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});

					}
				}
			});

			function sortUl() {
				var ulLength = $(bsInner).find('ul').length;
				for (var i = 0; i < ulLength; i++) {
					$this.find('ul').eq(i).css({
						'left': (thisUlWidth) * (i - 1)
					});
				}
			}
		},
		carousel: function(options) {
			var $this = $(this);
			var thisUl = $this.find('ul');
			var availWidth = $(window).width();
			var liWidth = availWidth;
			var carouselLi = $this.find('.ybindex_carousel_item');
			var liLength = $this.find('li').length;
			var liCount = 0;
			var slideFlag = true;
			var pagination = 0;
			var paginationEl = $('.carousel_pagination_wrapper div')
			var ulEl = function() {
				return $('<ul>' + thisUl.html() + '</ul>');
			}

			carouselLi.css({
				'width': liWidth
			})
			options = $.extend({
				arrowLeft: 'carousel_arrow_left',
				arrowRight: 'carousel_arrow_right',
			}, options);
			$this.css({
				'width': liWidth,
				'height': '550px',
				'position': 'relative',
				'overflow': 'hidden'
			});
			for (var i = 0; i < 2; i++) {
				$this.append(ulEl());
			};
			for (var i = liLength; i >= 0; i--) {
				$('.carousel_pagination_wrapper div').css({
					'width': 15 * (liLength * 2)
				}).append('<a href="javascript:;"><span></span></a>');
			};
			paginationEl.find('a').eq(0).addClass('active');
			sortUl();
			$this.children('a').click(function() {
				if ($(this).index() == 0 && slideFlag == true) {
					slideFlag == false;
					liCount++;
					if (liCount >= liLength) {
						$this.append($(this).find('ul').eq(0));
						sortUl();
						liCount = 0;
					}
					$this.find('ul').stop().animate({
						'left': '-=' + $(window).width()
					}, 'fast', 'swing', function() {
						slideFlag = true;
					});
					pagination = Math.abs(liCount);
					paginationEl.find('a').removeClass('active');
					paginationEl.find('a').eq(pagination - 1).addClass('active');
				} else if ($(this).index() == 1 && slideFlag == true) {
					slideFlag == false;
					liCount--;
					if (liCount <= -liLength) {
						$this.prepend($(this).find('ul').eq(2));
						sortUl();
						liCount = 0;
					}
					$this.find('ul').stop().animate({
						'left': '+=' + $(window).width()
					}, 'fast', 'swing', function() {
						slideFlag = true;
					});
					pagination = Math.abs(liLength / 3 - liCount);
					paginationEl.find('a').removeClass('active');
					paginationEl.find('a').eq(pagination - 1).addClass('active');
				}
			})


			function sortUl() {
				for (var i = 0; i < $this.find('ul').length; i++) {
					$this.find('ul').eq(i).css({
						'width': liWidth * liLength,
						'position': 'absolute',
						'left': liWidth * liLength * (i - 1)
					});
				};
				$this.find('ul').eq(0).addClass('prev');
				$this.find('ul').eq(1).addClass('active');
				$this.find('ul').eq(2).addClass('next');
			}

		},
		loading: function(options) {
			var $this = $(this);
			options = $.extend({
				autodestroy: false,
				duration: 0,
				img: 'img/dynamicloading_100_55.gif',
				text: 'loading',
				style: 'dynamicloading',
				background: '#fff',
				initiation: function() {
					var loadingHTML = $("<div class='" + options.style + "'><div><img src=" + options.img + "><label>" + options.text + "</label></div></div>");
					var thisWidth = $this.width();
					var thisHeigt = $this.height();
					$this.css('position', 'relative');
					loadingHTML.css({
						'width': thisWidth,
						'height': thisHeigt
					});
					loadingHTML.find('img').css({
						'display': 'block'
					});
					loadingHTML.find('label').css({
						'display': 'block'
					});
					if (options.style == 'dynamicloading') {
						loadingHTML.css({
							'background': options.background,
							'position': 'absolute',
							'top': '0px',
							'z-index': '99999'
						});
						loadingHTML.find('img').css({
							'margin': (thisHeigt / 2 - 45) + 'px auto 0'
						});
						loadingHTML.find('label').css({
							'margin': '30px 0 0 0',
							'text-align': 'center'
						});
					}
					$this.append(loadingHTML);
				}
			}, options);

			if (typeof(options) == 'string') {
				switch (options) {
					case 'destroy':
						$('.' + options.style).fadeOut();
						setTimeout(function() {
							$('.' + options.style).detach();
						}, 1000);
						break;
					default:
						break;
				}
			} else if (options.duration > 0) {
				options.initiation();
				setTimeout(function() {
					$('.' + options.style).fadeOut();
					setTimeout(function() {
						$('.' + options.style).detach();
					}, 1000);
				}, options.duration);
			} else {
				options.initiation();
			}
			return this;
		},
		showLoadingImg: function(options) {
			var options = {
				loadmsg: '小忆拼命加载中'
			}
			if ($('#index_loadingimg').length <= 0) {
				$(document.body).prepend('<div id="index_loadingimg" class="loadingimg" style="display: none;"><span class="loadingimg_roundborder"><img src="img/dynamicloading_100_55.gif" /><label>' + options.loadmsg + '</label></span></div>');
			}
			if ($('#index_loadinglayer').length <= 0) {
				$(document.body).prepend('<div id="index_loadinglayer" class="loadinglayer" style="display: none;"></div>');
			}
			$(this).each(function() {
				$(this).click(function() {
					$("#index_loadingimg").show();
					$("#index_loadinglayer").show();
				})
			})
		},
		loginPopupDialog: function() {
			$(this).each(function() {
				$(this).click(function() {
					$('.loginpopup_container').addClass('active');
				})
				$('.loginpopup_header_wrapper a').click(function() {
					$('.loginpopup_container').removeClass('active');
				})
			})
		},
		priceCalculator: function(options) {
			var $this=$(this),
				index=0,
				totalPriceArr=[],
				config = {
					unitprice: '',
					subtotal: '',
					totalprice:'',
					onchange: function() {}
				};
			if (options) {
				$.extend(config, options)
			};
			init($this);
			$.each($this, function(index) {
				var $this = $(this),
					index=index,
					counterEl = $this.find('input');
				$this.find('a').on('click',function(){
					var counter = counterEl.val();
					index=index;
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							break;
						case 2:
							counter++;
							break;
					}
					counterEl.val(counter);
					setter(index,counter);
					config.onchange();
					fireOnchange(counterEl);
				})
				counterEl.on('keydown keyup', function(e) {
					var $this = $(this),
						counter = 0,
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode != 37 && keycode != 39 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else if (keycode != 37 && keycode != 39) {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':
							counter = counterEl.val();
							setter(index,counter);
							config.onchange();
							fireOnchange(counterEl);
							break;
					}
				})
			});
			function getUnitprice(index){
				var unitPrice = $(config.unitprice).eq(index).text().replace("￥", '');
				return unitPrice;
			}

			function setter(index,counter) {
				var result = getUnitprice(index) * counter;
				$(config.subtotal).eq(index).html(parseFloat(result).toFixed(2));
				totalprice(index,result)
			}

			function totalprice(index, price){
				totalPriceArr[index]=price;
				var totalPrice=0;
				for (var i = totalPriceArr.length - 1; i >= 0; i--) {
					totalPrice+=totalPriceArr[i];
				};
				$(config.totalprice).html(parseFloat(totalPrice).toFixed(2));
			}

			function init(_this){
				var length=_this.length;
				$.each(_this,function(index){
					var val=_this.eq(index).find('input').val();
					setter(index,val)
				});
			}

			function fireOnchange(_this) {
				_this.trigger('onchange');
			}
		}
	});

	$.extend({
		globalhint: function() {
			$('.globalhint_close_btn').click(function() {
				$('.globalhint_wrapper').fadeOut('fast');
			});
		}
	})
	$('.manage_tab').toolsSlide('.bannerslider_container', '.manage_tab .bannerslider_inner', '.manage_tab .bs_arrowbtn_left', '.manage_tab .bs_arrowbtn_right', 40);
	$('.hide_title').init_title();

	$('.bannerslider_wrapper').toolsSlide('.bannerslider_wrapper', '.ybbanner_wrapper .bannerslider_inner', '.ybbanner_wrapper .bs_arrowbtn_left', '.ybbanner_wrapper .bs_arrowbtn_right', 40);

	// setTimeout(function(){
	// 	$('.ybbanner_wrapper').loading('destroy');
	// },5000)
	// $('.ybindex_carousel_wrapper').carousel();

})(jQuery, window);
