;
(function($) {

	// Jquery ajax请求时，用传统方式组装参数。设置此值后，参数不能传嵌套数组
	jQuery.ajaxSettings.traditional = true;

	window.BaseData = {
		path: "", // 项目的根路径
		imgUrl: "",
		curUri: null, // 当前页面请求地址
		backUri: null, // 点击返回按钮执行的请求
		tmpPath: "tmp",
		dialog_req: "DIALOG_REQ", //标记此次请求是弹出框发送的请求，controller返回callback(closeDialog(), response)格式的数据
		userId: "USER_ID",
		userMobile: "USER_MOBILE",
		nickName: "NICK_NAME",
		cityName: "CITY_NAME",
		lastOrderMobile: "LAST_ORDER_MOBILE", //上次订单的联系手机号码
		lastOrderNum: "LAST_ORDER_NUM", //上次订单的预定人数
		isNeedPromptCityName: "IS_NEED_PROMPT_CITYNAME",
		lat: "LAT",
		lng: "LNG",
		returnUrl: "RETURN_URL",
		wxAppid: "wxb5b9cbfeea81cf36",
		wxRepAppid: "wxb27de4938f158826",
		userInfo: null,
		validateObj: null, //验证框架返回的对象
		c_time: new Date(), // 客户端当前时间
		time_out: 30, // session连接超时时间（分钟）
		submit_form: false, // 登录成功后需要链式请求的form表单
		callBack: false, // ajax登录成功后需要执行的函数
		suc: "0", // 请求返回成功的标识
		init: function(init_data) {
			//初始化数据
			if (init_data) {
				if (init_data.path)
					BaseData.path = init_data.path;
				if (init_data.imgUrl)
					BaseData.imgUrl = init_data.imgUrl;
				if (utils.isString(init_data.curUri))
					BaseData.curUri = init_data.curUri;
				if (utils.isString(init_data.backUri))
					BaseData.backUri = init_data.backUri;
			}
			BaseData.c_time = new Date();
			//BaseData.submit_form = false;
			BaseData.callBack = false;
		}
	};

	window.utils = {
		extend: function(target, source) {
			for (var p in source) {
				if (source.hasOwnProperty(p)) {
					target[p] = source[p];
				}
			}
			return target;
		},
		loadJs: function(url, callback) {
			var done = false;
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.language = 'javascript';
			script.src = url;
			script.onload = script.onreadystatechange = function() {
				if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
					done = true;
					script.onload = script.onreadystatechange = null;
					if (callback) {
						callback.call(script);
					}
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		runJs: function(url, callback) {
			loadJs(url, function() {
				document.getElementsByTagName("head")[0].removeChild(this);
				if (callback) {
					callback();
				}
			});
		},
		loadCss: function(url, callback) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.media = 'screen';
			link.href = url;
			document.getElementsByTagName('head')[0].appendChild(link);
			if (callback) {
				callback.call(link);
			}
		},
		obtainEvent: function() {
			// 获取事件的对象
			var e = window.event ? window.event : null;
			if (!e) {
				var fun = utils.obtainEvent.caller;
				while (fun) {
					// Firefox 中一个隐含的对象 arguments，第一个参数为 event 对象
					var arg0 = fun.arguments[0];
					if (arg0 && ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof arg0 === "object" && arg0.preventDefault && arg0.stopPropagation))) {
						e = arg0;
						break;
					}
					fun = fun.caller;
				}
			}
			return e;
		},
		obtainEventSrc: function() {
			var e = utils.obtainEvent();
			return e ? e.srcElement ? e.srcElement : e.target : null;
		},
		isParamUrl: function(url) {
			// 判断指定的URL是否带参数
			if (url) {
				var index = url.indexOf("?");
				if (index != -1) {
					url = url.substring(index + 1);
					if (url.length > 0)
						return true;
				}
			}
			return false;
		},
		/**
		 * 获取url参数，组装成对象
		 *
		 * @param url
		 *            不传默认使用当前地址 xxx.xxx.xxx?name=wang&age=100 ==> {name:
		 *            "wang", age: "100"}
		 */
		getUrlParams: function(url) {
			url = url || window.location.href;
			var data = {},
				index = url.indexOf("?");
			if (index != -1) {
				url = url.substring(index + 1);
				var params = url.split("&");
				for (var i = 0; i < params.length; i++) {
					var obj = params[i].split("=");
					data[obj[0]] = obj[1] ? encodeURIComponent(obj[1]) : obj[1];
				}
			}
			return data;
		},

		addUrlParams: function(url, name, value) {
			if (!utils.isString(url) || !name)
				return url;
			if (url) {
				// 标示此请求为历史请求
				if (url.lastIndexOf("?") == -1)
					url += "?";
				else if (url.lastIndexOf("?") < url.length - 1)
					url += "&";
				url += name + (utils.isUndefined(value) ? "" : "=" + value);
			}
			return url;
		},
		regex: function(val, regex, mod) {
			if (!utils.isString(val)) return false;
			if (typeof regex === "string")
				return new RegExp(regex, mod || "").test(val);
			return regex.test(val);
		},
		// 获取文件类型
		fileType: function(file) {
			return file && file.substring(file.lastIndexOf(".") + 1).toLowerCase();
		},
		// 获取文件名
		fileName: function(file) {
			if (!file)
				return file;
			var t = file.replace("\\", "/"),
				start = t.lastIndexOf("/"),
				end = t
				.lastIndexOf(".");
			return t.substring(start == -1 ? 0 : start + 1, end);
		},
		clone: function(obj) {
			if (obj === null || obj === undefined || typeof obj !== "object")
				return obj;
			var o = obj.constructor === Array ? [] : {};
			for (var i in obj) {
				o[i] = typeof obj[i] === "object" ? utils.clone(obj[i]) : obj[i];
			}
			return o;
		},
		// url 需要删除或增加的规则 ad/abc_r100c100_r50c50.jpg
		// mode == add || remove rule == r100c100
		imgUrlFormat: function(url, mode, rule) {
			if (!url || (url = $.trim(url)) === "" || !rule)
				return url;
			if (mode === 'remove') {
				return url.replace(new RegExp("_" + rule, "g"), "");
			} else if (mode === 'add') {
				return url
					.replace(
						new RegExp(
							"^((https?://)?(/|\\\\)?([^/\\\\]+(/|\\\\))*?[0-9a-z]+(_[0-9a-z]+)*)(\\.[a-z]+)$",
							"g"), "$1_" + rule + "$7");
			}
		},
		// 获取图片地址的原图
		imgUrlOriginal: function(url) {
			if (!url || (url = $.trim(url)) === "")
				return url;
			return url.replace(new RegExp("_[0-9a-z]+", "g"), "");
		},
		// 获取路径倒数第二个path
		url2ndEndPath: function(url) {
			var m = new RegExp(
					"^.*?(/|\\\\)([^/\\\\]+)(/|\\\\)[^/\\\\]+(/|\\\\)?$")
				.exec(url);
			return m && m[2];
		},
		isArray: function(val) {
			return Object.prototype.toString.call(val) === '[object Array]';
		},
		isFunction: function(val) {
			return Object.prototype.toString.call(val) === '[object Function]';
		},
		isUndefined: function(val) {
			return typeof(val) === "undefined";
		},
		isString: function(val) {
			return Object.prototype.toString.call(val) === '[object String]';
		},
		isNumber: function(val) {
			return Object.prototype.toString.call(val) === '[object Number]' && !isNaN(val);
		},
		//8.00 也视为int数据
		isInt: function(val) {
			return utils.isNumber(val) && parseInt(val) === val;
		},
		isBoolean: function(val) {
			return Object.prototype.toString.call(val) === '[object Boolean]';
		},
		isObject: function(val) {
			return Object.prototype.toString.call(val) === '[object Object]';
		},
		//转换数据为int类型，NaN转为0
		parseInt: function(val, radix) {
			if (utils.isString(val) && (val = val.trim()).length > 0) {
				var c = val.charAt(val.length - 1);
				if (c === '%') {
					val = parseFloat(val) / 100;
				} else if (c === '‰') {
					val = parseFloat(val) / 1000;
				}
			}
			val = parseInt(val, radix);
			if (isNaN(val)) val = 0;
			return val;
		},
		//转换数据为float类型，NaN转为0
		parseFloat: function(val) {
			if (utils.isString(val) && (val = val.trim()).length > 0) {
				var c = val.charAt(val.length - 1);
				if (c === '%') {
					val = parseFloat(val) / 100;
				} else if (c === '‰') {
					val = parseFloat(val) / 1000;
				}
			}
			val = parseFloat(val);
			if (isNaN(val)) val = 0;
			return val;
		},
		//获取参数val的值，如果val是函数则return函数的返回值，否则直接返回val
		val: function(val, defaultVal) {
			var tmp = val;
			if (utils.isFunction(tmp))
				tmp = tmp();
			if (utils.isUndefined(tmp) || tmp === null)
				tmp = defaultVal;
			return tmp;
		},
		/**
		 * 返回字符窜，如果val不能转化成数字，则返回0的格式化。digit为小数位数
		 *
		 * @param removeZero
		 *            boolean类型，默认值false
		 * @param roundMode
		 *            格式化类型，默认是"floor"
		 *            值为"ceil"(向上舍入)，"floor"(向下舍入)，"round"(四舍五入，当值为负数中间值"-0.5"时结果和java相反，)
		 *            例子： 1. utils.fmtDecimal(1.567, 2) 2.
		 *            utils.fmtDecimal(1.567, 2, "round") 3.
		 *            utils.fmtDecimal(1.567, 2, true) 1.
		 *            utils.fmtDecimal(1.567, 2, true, "floor")
		 */
		fmtDecimal: function(val, digit, removeZero, roundMode) {
			val = utils.parseFloat(val);
			digit = digit && digit > 0 ? digit : 0;
			if (utils.isString(removeZero)) {
				roundMode = removeZero;
				removeZero = false;
			}
			roundMode = roundMode ? roundMode : "floor";
			if (digit > 0)
				val = val * Math.pow(10, digit);
			switch (roundMode) {
				case "ceil":
					val = Math.ceil(val);
					break;
				case "floor":
					val = Math.floor(val);
					break;
				case "round":
					val = Math.round(val);
					break;
			}
			if (digit > 0)
				val = val / Math.pow(10, digit);
			if (removeZero)
				return val.toString();
			else
				return val.toFixed(digit);
		},
		/**
		 * 格式化整数，小数直接切割，不会进位。digit为整数位数
		 */
		fmtNumber: function(val, digit) {
			val = utils.parseInt(val).toString();
			if (!digit)
				return val;
			if (val.length < digit) {
				return "0".repeat(digit - val.length) + val;
			} else if (val.length == digit)
				return val;
			else {
				return val.substr(-digit);
			}
		},
		/**
		 * expression 对象导航表达式   例：utils.ognl({per: {name: "wang"}}, "per.name");
		 */
		ognl: function(obj, expression) {
			if (!obj || !expression) return null;
			var token = new StringToken(expression),
				key;

			function nextKey() {
				arrayQuotKey = false;
				var c, key = "";
				HEAD:
					while ((c = token.next()) != StringToken.NULL) {

						switch (c) {

							case '\\':
								key = key.concat(c).concat(token.next());
								break;
							case '.':
								break HEAD;

							case '[':
								if (key.length > 0) {
									token.back();
									break HEAD;
								}

								var inner;
								INNER:
									while ((inner = token.next()) != NULL) {

										switch (inner) {

											case ']':
												break INNER;
											case '\\':
												key = key.concat(inner).concat(token.next());
												break;
											case '"':
											case '\'':
												var inmost;
												INMOST:
													while ((inmost = token.next()) != NULL) {
														if (inmost == inner) {
															break INMOST;
														} else if (inmost == '\\')
															key = key.concat(inmost).concat(token.next());
														else
															key = key.concat(inmost);
													}
												break;
											default:
												key = key.concat(inner);
												break;
										}
									}
								break;
							default:
								key = key.concat(c);
								break;
						}
					}
				return key.trim();
			}
			while ((key = nextKey(true)) !== "") {
				if (!obj) return null;
				obj = obj[key];
			}
			return obj;
		},
		// 添加单位（默认px）
		addUnit: function(val, unit) {
			unit = unit || 'px';
			return val && new RegExp(regex.decemal).test(val) ? val + unit : val;
		},
		// 删除单位
		removeUnit: function(val) {
			var match;
			return val && (match = /(([\+-]?)\d*\.?\d+)/.exec(val)) ? utils
				.parseFloat(match[1]) : 0;
		},
		escape: function(val) {
			return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(
				/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		unescape: function(val) {
			return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
				/&quot;/g, '"').replace(/&amp;/g, '&');
		},
		// 创建dom元素
		dom: function(domTag, id, className, css) {
			var element = document.createElement(domTag);
			if (id)
				element.id = id;
			if (css)
				element.style.cssText = css;
			if (className)
				element.className = className;
			return element;
		},
		// 创建dom元素jquery对象
		$dom: function(domTag, id, className, css) {
			return $(utils.dom(domTag, id, className, css));
		},
		//多个jq对象相加，自动处理为undefined、null的参数
		$add: function($raw, $add) {
			$raw = $raw ? $raw.jquery ? $raw : $($raw) : $raw;
			$add = $add ? $add.jquery ? $add : $($add) : $add;
			if (!$raw)
				return $add;
			else if (!$add)
				return $raw;
			else
				return $raw.add($add);
		},
		//获取html字符窜的属性值,没有指定属性返回null
		htmlAttrVal: function(html, attrKey) {
			var patt = new RegExp(attrKey + "\\s*=\\s*(('([^']*)')|(\"([^\"]*)\")|(([^'\"\\s>]*)[\\s>]))"),
				res = patt.exec(html);
			return res === null ? res :
				res[3] ? res[3] : res[5] ? res[5] : res[7] ? res[7] : "";
		},
		/**
		 * 获取指定Tag的自身tag标签代码,不包含子元素.dom可以是字符窜或dom元素
		 * excludeAttrs 需要排除的属性， 字符窜或数组
		 * addAttrs 添加的属性，当属性名是class、style时在原有属性上累加，不会替换之前的值，如果想替换需要在excludeAttrs中传入class、style。例子：{id: "1", "name": "name"}
		 */
		domShuck: function(dom, excludeAttrs, addAttrs) {
			dom = dom && dom.jquery ? dom.get(0) : dom;
			if (!dom) return;
			if (utils.isObject(excludeAttrs)) {
				addAttrs = excludeAttrs;
				excludeAttrs = null;
			} else if (!utils.isArray(excludeAttrs)) {
				excludeAttrs = [excludeAttrs];
			}
			var html = utils.isString(dom) ? dom : dom.outerHTML,
				token = new StringToken(html),
				assemble = "", //属性字符窜集合
				tag = "",
				curPropKey = "",
				curPropVal = "",
				propKeying = false, //正在解析属性名
				propValing = false, //正在解析属性值
				intactProp = false, //判断属性是否是完整的键值对
				propValEndChar = null,
				start = false,
				tagEnd = false,
				c;
			//          if(html) {
			//              //提取html最外层的tag
			//              var matchs = new RegExp("^\\s*(<\\s*(\\w+)[^>/]*(/\\s*)?>)([\\s\\S]*?(<\\s*/\\s*\\2\\s*>))?\\s*$", "i").exec(html);
			//              if(matchs && (matchs[3] || matchs[4]) && (!matchs[3] || !matchs[4])) {
			//                  tag = matchs[1] + (matchs[5] ? matchs[5] : "");
			//              }
			//          }
			//          //排除指定的属性
			//          if(tag && excludeAttrs.length > 0) {
			//              for(var i in excludeAttrs) {
			//                  if(excludeAttrs[i])
			//                      tag = tag.replace(new RegExp("\\s+" + excludeAttrs[i] + "\\s*=\\s*(('[^']*')|(\"[^\"]*\")|([^\\s'\">]*(?=\\s+\\w+=|\\s*/\\s*>)))"), " ");
			//              }
			//          }
			function operateProp() {
				var exclude = false;
				for (var i = 0; i < excludeAttrs.length; i++) {
					if (excludeAttrs[i] === curPropKey) {
						exclude = true;
						break;
					}
				}
				if (!exclude) {
					if (intactProp) {
						if (addAttrs) {
							if (curPropKey === "class" && addAttrs["class"]) {
								curPropVal += " " + addAttrs["class"];
								delete addAttrs["class"];
							} else if (curPropKey === "style" && addAttrs.style) {
								curPropVal += (curPropVal.length > 0 ? ";" : "") + addAttrs.style;
								delete addAttrs.style;
							}
						}
						propValEndChar = propValEndChar ? propValEndChar : '"';
						assemble += curPropKey + "=" + propValEndChar + curPropVal + propValEndChar + " ";
					} else {
						assemble += curPropKey + " ";
					}
				}
				intactProp = false;
				propValing = false;
				curPropVal = "";
				propValEndChar = null;
			}

			LOOP:
				while ((c = token.next()) != StringToken.NULL) {
					switch (c) {

						case '<':
							if (propValing) {
								curPropVal = curPropVal.concat(c);
							} else {
								start = true;
							}
							break;
						case '\\':
							if (propValing) {
								curPropVal = curPropVal.concat(c).concat(token.next());
							}
							break;
						case ' ':
							if (start && tag !== "") {
								if (!tagEnd) {
									tagEnd = true;
									break;
								} else if (propKeying) {
									propKeying = false;
									break;
								}
							} else {
								break;
							}
						case '>':
							//修改tagEnd标记，继续执行default代码
							tagEnd = !tagEnd && tag ? true : tagEnd;
						default:
							if (start) {
								if (tagEnd) {
									if ((!propValing || propValEndChar === ' ') && (c === "/" || c === ">")) {
										if (curPropKey) {
											operateProp();
											propKeying = false;
											curPropKey = "";
										}
										break LOOP;
									} else if (!propKeying && curPropKey === "") {
										if (c !== "=") {
											propKeying = true;
											curPropKey = curPropKey.concat(c);
										}
									} else if (propKeying) {
										if (c === "=") {
											intactProp = true;
											propKeying = false;
										} else {
											curPropKey = curPropKey.concat(c);
										}
									} else if (!propKeying && curPropKey !== "") {
										if (!intactProp) {
											if (c === "=") {
												intactProp = true;
											} else {
												operateProp();
												propKeying = true;
												curPropKey = c;
											}
										} else {
											if (!propValing && curPropVal === "") {
												propValing = true;
												if (c === '\'' || c === '"') {
													propValEndChar = c;
												} else {
													propValEndChar = ' ';
													curPropVal = curPropVal.concat(c);
												}
											} else if (propValing) {
												if (c === propValEndChar) {
													operateProp();
													propKeying = false;
													curPropKey = "";
												} else {
													curPropVal = curPropVal.concat(c);
												}
											}
										}
									}
								} else {
									tag = tag.concat(c);
								}
							}
							break;
					}
				}
			if (tag) {
				if (addAttrs) {
					for (var key in addAttrs) {
						if (addAttrs[key] === null || addAttrs[key] === undefined) {
							assemble += key + " ";
						} else {
							assemble += key + '="' + addAttrs[key] + '" ';
						}
					}
				}
				assemble = "<" + tag + " " + assemble + " ></" + tag + ">";
			}
			return assemble;
		},
		// 返回指定iframe dom对象的document对象
		iframeDoc: function(iframe) {
			return iframe.contentDocument || iframe.contentWindow.document;
		},
		// 验证指定对象是否绑定了指定类型的事件
		bindedEvent: function($obj, eventType, namespace) {
			var evts = $obj ? $obj.data("events") : null,
				binded = false;
			if (evts && evts[eventType]) {
				if (namespace) {
					for (var i = 0; i < evts[eventType].length; i++) {
						if (evts[eventType][i].namespace === namespace) {
							binded = true;
							break;
						}
					}
				} else
					binded = true;
			}
			return binded;
		},
		//防止过度频繁操作某个函数
		debounce: function(callback, delay) {
			if (!utils.isFunction(callback)) {
				return;
			}
			delay = delay || 100;
			var timeout;
			return (function() {
				if (timeout)
					clearTimeout(timeout);
				var _this = this;
				timeout = setTimeout(function() {
					callback.apply(_this, arguments);
				}, delay);
			});
		},
		lazyload: function() {
			if (!utils.bindedEvent($win, "scroll", "lazy")) {
				$win
					.bind(
						"scroll.lazy",
						function() {
							var elements = $("img[lazy!='loaded'],iframe[lazy!='loaded']");
							var scrollTop = $win.scrollTop();
							elements.each(function() {
								var element = $(this);
								if (($win.height() + scrollTop) >= $(
										this).offset().top) {
									element.attr("src", element
										.attr("lazy"));
									element.attr("lazy", "loaded");
								}
							});
						});
			}
		},
		/**
		 * @param ele
		 *            （必填参数）当window
		 *            scroll时，指定的HTML标签也跟着scroll，ele可以是dom对象或jquery对象，
		 * @param stops（可选参数）停止的相对位置（即当指定的元素到达stops对象时position改为static状态）
		 *            stops可以是dom元素、精确值(800px、800)、函数（函数返回精准值），精确值表示滑动对象的最底部到达页面上边缘的距离
		 * @param pos（可选参数）
		 *            精密调度位置例:{left: "900px", top: "10px"} 即滑动对象滑动时的位置
		 */
		scroll: function(ele, stops, pos) {
			if (!ele)
				return false;
			pos = pos || {};
			if (stops && (stops.left || stops.top)) {
				pos = stops;
				stops = null;
			}
			$(ele).each(function() {
				var $this = $(this);
				$this.data("init_pos", {
					top: $this.offset().top
				});
			});
			$win
				.bind(
					"scroll.follow",
					function() {
						var scrollTop = $win.scrollTop(),
							stopHeight;
						if (stops) {
							if (utils.isNumber(stops) || utils.isString(stops)) {
								stopHeight = utils.removeUnit(stops);
							} else if (utils.isFunction(stops)) {
								stopHeight = stops();
							} else if ($(stops).length > 0)
								stopHeight = $(stops).offset().top;
						}
						$(ele)
							.each(
								function() {
									var $this = $(this),
										init_pos = $this
										.data("init_pos");
									if (scrollTop >= init_pos.top && (!stopHeight || stopHeight > (scrollTop + $this
											.outerHeight()))) {
										$this
											.css({
												top: pos.top ? pos.top : '-' + $this
													.css("marginTop"),
												left: pos.left ? pos.left : "",
												position: "fixed"
											});
									} else if (stopHeight && stopHeight <= (scrollTop + $this
											.outerHeight())) {
										$this
											.css({
												top: stopHeight - scrollTop - $this
													.outerHeight(),
												left: pos.left ? pos.left : "",
												position: "fixed"
											});
									} else {
										$this.css({
											top: "",
											left: "",
											position: "static"
										});
									}
								});
					});
			$win.trigger("scroll.follow");
		},
		// 获取图片的宽度和高度,如果不能从url获取宽高，就只能动态加载图片，动态加载图片不能返回宽高，只能通过回调函数执行以后的操作
		imgWH: function(url, callback) {
			var match, _wh;
			if (!_wh) {
				_wh = (match = new RegExp("_[rt]([0-9]+)c([0-9]+)f\\.[a-z]+$")
					.exec(url)) ? {
					width: match[1],
					height: match[2]
				} : null;
			}
			if (!_wh) {
				_wh = (match = new RegExp(
						"_((d)|(td)|(rd)|(tb)|(rb))([0-9]+)c([0-9]+)\\.[a-z]+$")
					.exec(url)) ? {
					width: match[7],
					height: match[8]
				} : null;
			}

			if (_wh) {
				if (callback && utils.isFunction(callback))
					callback(_wh);
				return _wh;
			} else if (callback && utils.isFunction(callback)) {
				// 根据url规则获取不到宽高，且有回调函数时，会动态加载图片
				var img = new Image();
				img.src = url;
				img.onload = function() {
					callback({
						width: img.width,
						height: img.height
					});
				};
				return null;
			}
		},
		/**
		 * @param scale
		 *            指定是否等比缩放，默认是true。
		 *            scale=true时w、h出现0或非数字时则依据另一方的值，如果都为0，则返回原尺寸 scale=false
		 *            且w、h出现0或非数字时，则图片强制宽、高设置为0
		 * @param magnify
		 *            指定是否能够放大图片，默认是可以的true
		 */
		zoomImg: function(imgW, imgH, w, h, scale, magnify) {
			var zoomW, zoomH, magnify = magnify === false ? false : true,
				scale = scale === false ? false : true,
				imgW = utils.parseFloat(imgW),
				imgH = utils
				.parseFloat(imgH),
				w = utils.parseFloat(w),
				h = utils
				.parseFloat(h);
			if (scale) {
				if (!w && !h) {
					zoomW = imgW;
					zoomH = imgH;
				} else if (!w) {
					var scaleH = imgH / h;
					zoomH = h;
					zoomW = imgW / scaleH;
				} else if (!h) {
					var scaleW = imgW / w;
					zoomW = w;
					zoomH = imgH / scaleW;
				} else if (imgW <= w && imgH <= h && !magnify) {
					zoomW = imgW;
					zoomH = imgH;
				} else {
					var scaleW = imgW / w,
						scaleH = imgH / h;
					if (scaleW > scaleH) {
						zoomW = w;
						zoomH = imgH / scaleW;
					} else {
						zoomH = h;
						zoomW = imgW / scaleH;
					}
				}
			} else {
				zoomH = h;
				zoomW = w;
			}
			return {
				width: zoomW,
				height: zoomH
			};
		}
	};
	/**
	 * 正则表达式
	 */
	window.regex = {
		alpha: "^[A-Za-z]+$", // 字母
		alphanum: "^[A-Za-z0-9]+$", // 字母、数字
		alpha_u: "^[A-Z]+$", // 大写字母
		alpha_l: "^[a-z]+$", // 小写字母
		word: "^\\w+$", // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串

		num: "^\\d+$", // 只包含数字，不包含正负号

		integer: "^[\\+-]?\\d+$", // 整数（包括负数、0、正数）
		int_plus: "^\\+?[0-9]*[1-9][0-9]*$", // 正整数
		int_minus: "^-[0-9]*[1-9][0-9]*$", // 负整数
		int_no_minus: "^\\+?\\d+$", // 非负整数（正整数 + 0）
		int_no_plus: "^((-\\d+)|(0))$", // 非正整数（负整数 + 0）

		decemal: "^([\\+-]?)\\d*\\.?\\d+$", // 浮点数 或 整数(包含正负数)
		decemal_plus: "^\\+?((\\d*[1-9]\\d*\\.?\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 正小数、正整数
		decemal_minus: "^-((\\d*[1-9]\\d*\\.?\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 负小数、负整数
		decemal_no_plus: "^-\\d*\\.?\\d+$", // 非正小数、非正整数
		decemal_no_minus: "^\\+?\\d*\\.?\\d+$", // 非负小数、非负整数

		decemal_only: "^([\\+-]?)\\d*\\.\\d+$", // 只能是浮点数不能为整数(包含正负数)
		decemal_plus_only: "^\\+?((\\d*[1-9]\\d*\\.\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 正小数
		decemal_minus_only: "^-((\\d*[1-9]\\d*\\.\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 负小数
		decemal_no_plus_only: "^-\\d*\\.\\d+$", // 非正小数
		decemal_no_minus_only: "^\\+?\\d*\\.\\d+$", // 非负小数

		chinese: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
		word_zh: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D\\w\\s\\(\\)\\（\\）]+$", //中文、英文、下划线、数字、左右小括号
		mobile: "^(13[0-9]{9}|15[0-9]{9}|18[0-9]{9}|147[0-9]{8})$", // 手机
		idcard: "(^\\d{15}$)|(^\\d{17}(\\d|X)$)", // 身份证
		tel: "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
		email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", // 邮件
		color: "^[a-fA-F0-9]{6}$", // 颜色
		url: "^((https?|ftp):\\/\\/)?(\\/?[-A-Za-z0-9.:]+)(\\/[-A-Za-z0-9+&@#\\/%=~_|!:,.;]*)?(\\?[A-Za-z0-9+&@#\\/%=~_|!:,.;]*)?$", // url
		ascii: "^[\\x00-\\xFF]+$", // 仅ACSII字符
		zipcode: "^\\d{6}$", // 邮编
		ip4: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$", // ip地址
		empty: "^\\s*$", // 空白
		not_empty: "^\\S+$", // 非空
		picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
		rar: "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
		date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", // 日期
		qq: "^[1-9]*[1-9][0-9]*$", // QQ号码
		usernameEmal: "^[\\w\\.@]+$",
		bankCard: "^(\\d+)$", // 银行卡
		busInfo: "^[\\u2E80-\\u9FFF\\w]+([,，][\\u2E80-\\u9FFF\\w]+)*?$"
	};

	//为了重写jquery方法
	var $origin = {
		ajax: $.ajax,
		outerWidth: $.fn.outerWidth,
		outerHeight: $.fn.outerHeight
	};
	$.extend({
		/**
		 * code = warn/info/error
		 */
		alert: function(code, msg, fn) {
			if (utils.isFunction(fn))
				fn();
		},
		confirm: function(content, yes, no) {
			if (window.confirm) {
				if (utils.isFunction(yes))
					yes();
			} else {
				if (utils.isFunction(no))
					no();
			}
		}
	});

	$.fn.extend({
		/**
		 * 如果操作的对象很多（超过1000个），
		 * 最好的做法是想办法直接调用$obj.width(200)，避免再获取原始值;
		 */
		innerWidth: function(val) {
			if (val == undefined) {
				var elem = this[0];
				return elem ? elem.style ?
					utils.parseFloat(jQuery.css(elem, "width", "padding")) :
					this.width() :
					null;
			}
			return this.each(function() {
				var $this = $(this);
				$this.width(val - (utils.parseFloat($this.css("paddingLeft")) + utils.parseFloat($this.css("paddingRight"))));
			});
		},
		/**
		 * 如果操作的对象很多（超过1000个），最好不用此方法。
		 * 最好的做法是想办法直接调用$obj.height(200)，避免再获取原始值;
		 */
		innerHeight: function(val) {
			if (val == undefined) {
				var elem = this[0];
				return elem ? elem.style ?
					utils.parseFloat(jQuery.css(elem, "height", "padding")) :
					this.height() :
					null;
			}
			return this.each(function() {
				var $this = $(this);
				$this.height(val - (utils.parseFloat($this.css("paddingTop")) + utils.parseFloat($this.css("paddingBottom"))));
			});
		},
		/**
		 * val 不传值为取值，否则设值
		 * 如果操作的对象很多（超过1000个），最好不用此方法。因为遍历对象先获取对象的原始宽度再设置新的宽度，获取对象原始宽度很耗性能。
		 * 最好的做法是想办法直接调用$obj.width(200)，避免再获取原始值;
		 * @param margin 计算宽度是否包含margin
		 * @param val
		 * @returns
		 */
		outerWidth: function(margin, val) {
			if (margin && !utils.isBoolean(margin)) {
				val = margin;
				margin = false;
			}
			if (val == undefined) {
				if (this[0] == window) {
					return this.width() || document.body.clientWidth;
				}
				return $origin.outerWidth.call(this, margin) || 0;
			}
			return this.each(function() {
				$(this).width(val - ($origin.outerWidth.call($(this), margin) - $(this).width()));
			});
		},
		/**
		 * 如果操作的对象很多（超过1000个），最好不用此方法。因为遍历对象先获取对象的原始宽度再设置新的宽度，获取对象原始宽度很耗性能。
		 * 最好的做法是想办法直接调用$obj.height(200)，避免再获取原始值;
		 */
		outerHeight: function(margin, val) {
			if (margin && !utils.isBoolean(margin)) {
				val = margin;
				margin = false;
			}
			if (val == undefined) {
				if (this[0] == window) {
					return this.height() || document.body.clientHeight;
				}
				return $origin.outerHeight.call(this, margin) || 0;
			}
			return this.each(function() {
				$(this).height(val - ($origin.outerHeight.call($(this), margin) - $(this).height()));
			});
		},
		afterChange: function(fn) {
			this.keyup(function(e) {
				if (!e.ctrlKey && !e.altKey) {
					fn.call(this, e);
				}
			});
			this.mouseup(fn);
			return this;
		},
		textCount: function(settings) {
			//当textArea输入框文字字数变化时，自动显示字数
			settings = $.extend({}, textCountSettings, settings);
			return this.afterChange(function() {
				if (settings.func)
					settings.func.call(this);
				else {
					var len = $(this).val().replace(/\r\n|\n|\r|(\s+)/g, '').length;
					if (len > settings.totalCount) {
						var str = $(this).val().match(new RegExp("^([(\r\n)\n\r(\\s+)]*([^(\r\n)\n\r(\\s+)][(\r\n)\n\r(\\s+)]*){" + settings.totalCount + "})", "g"));
						$(this).val(str);
						$("#" + settings.countId).text(settings.totalCount);
					} else
						$("#" + settings.countId).text(len);
				}
			});
		},
		priceCalculator: function(options) {
			var counter = 0,
				subtotal = 0,
				unitPrice = ''
			options = $.extend({
				unitprice: '',
				subtotal: '',
				onchange: function() {}
			}, options);
			$(this).each(function() {
				var $this = $(this),
					counterEl = $this.find('input');
				counterEl.html('0');
				$this.find('a').click(function() {
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							counterEl.val(counter);
							getter();
							setter();
							options.onchange();
							break;
						case 2:
							counter++;
							counterEl.val(counter);
							getter();
							setter();
							options.onchange();
							break;
					}
					fireOnchange(counterEl);
				});

				counterEl.bind('keydown keyup', function(e) {
					var $this = $(this),
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':
							counter = counterEl.val();
							getter();
							setter();
							options.onchange();
							fireOnchange(counterEl);
							break;
					}
				})
			});

			function getter() {
				var unitPriceEl = $(options.unitprice).text();
				unitPrice = unitPriceEl.replace("￥", '');
			}

			function setter() {
				var result = unitPrice * counter;
				$(options.subtotal).html(parseFloat(result).toFixed(2));
			}

			function fireOnchange(_this) {
				_this.trigger('onchange');
			}
		}
	});
	var textCountSettings = {
		countId: "icer_text_count_id",
		totalCount: 500,
		process: false
	};

	/**
	 * 无论返回成功或者失败都会执行callback
	 * settings = { verifyLogin: false, //验证是否登录 loginCallback: function(){},
	 * //登录成功后的回调函数 sucMsg : "操做成功", failMsg : "操作有误", sucClose :
	 * function(data){}, //请求成功关闭alert框后执行的函数 failClose : function(data){},
	 * //请求失败关闭alert框后执行的函数 success : function(data){} //不管成功或者失败都会执行 ... };
	 */
	// 扩展post函数,用于处理返回code信息
	$.each(["get", "post"], function(i, method) {
		$[method] = function(url, data, callback, dataType, settings) {
			// shift arguments if data argument was omitted
			if (utils.isFunction(data)) {
				settings = dataType;
				dataType = callback;
				callback = data;
				data = undefined;
			}
			if (utils.isString(data) && $.ajaxSettings.accepts[data.toLowerCase()]) {
				settings = callback;
				dataType = data;
				data = undefined;
				callback = undefined;
			}
			if (utils.isString(callback) && $.ajaxSettings.accepts[callback.toLowerCase()]) {
				settings = dataType;
				dataType = callback;
				callback = undefined;
			}
			if (utils.isObject(callback)) {
				settings = callback;
				dataType = undefined;
				callback = undefined;
			}
			if (utils.isObject(dataType)) {
				settings = dataType;
				dataType = undefined;
			}
			settings = settings || {};
			$.extend(settings, {
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: dataType
			});
			return $.ajax(settings);
		};
	});
	// 扩展ajax函数,用于处理返回code信息
	$.extend({
		ajax: function(settings) {
			var s = $.extend({
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					var dataType = this.dataTypes ? this.dataTypes[1] ? this.dataTypes[1] : this.dataTypes[0] : null;
					if (dataType == "html" && utils.isString(XMLHttpRequest.responseText)) {
						this.success(
							XMLHttpRequest.responseText,
							textStatus,
							XMLHttpRequest);
					} else {
						// $.alert("error", "系统错误!");
						if (window.console) {
							console.error(this.url + "请求异常");
							console.info(errorThrown);
						}
					}
				}
			}, settings || {});
			var ajaxSuccess = s.success;
			s.success = function(data, textStatus, jqXHR) {
				var dataType = this.dataTypes ? this.dataTypes[1] ? this.dataTypes[1] : this.dataTypes[0] : null;
				if (dataType) {
					if (dataType === "script") {
						// 如果是返回类型是script，则直接跳出。因为jquery已经初始化过返回的脚本数据
						return;
					} else if (dataType === "json" && utils.isString(data)) {
						try {
							data = JSON.parse(data);
						} catch (err) {

						}
					} else if (dataType === "xml" && data.activeElement)
						data = {};
				}
				data = data || {};
				if (s.verifyLogin) {
					// 判断此用户有没有登录
					if (!utils.judgeLogin({
							data: data,
							callBack: s.loginCallback
						}))
						return;
				}
				dataProcess(data, s, ajaxSuccess);
			};

			var msgObj = {
				code: "code",
				msg: "msg",
				msgDefaults: {
					sucMsg: false,
					failMsg: false
				}
			};
			/**
			 * ajax请求返回数据的处理,例如异常处理 settings 可参考msgDefaults 设置相应的错误信息
			 * data为ajax返回的数据， return true ==> 操作成功 return false ==>操作失败
			 *  code = BaseData.suc或者为空 都会执行sucClose、ajaxSuccess函数，
			 *  当code不等于空且不等于BaseData.suc则执行failClose、ajaxSuccess函数
			 */
			var dataProcess = function(_data, settings, ajaxSuccess) {
				if (_data instanceof Object && !!_data[msgObj.code]) {
					var code = _data[msgObj.code],
						msg = _data[msgObj.msg];
					if (code == BaseData.suc) {
						msg = msg ? msg : settings.sucMsg ? settings.sucMsg : "操作成功！";
						$.alert("info", msg, function() {
							if (typeof settings.sucClose == "function")
								settings.sucClose(_data);
							if (typeof ajaxSuccess == "function")
								ajaxSuccess(_data);
						});
						return true;
					} else {
						msg = msg ? msg : settings.failMsg ? settings.failMsg : "操作失败！";
						$
							.alert(
								"error",
								msg,
								function() {
									if (typeof settings.failClose == "function")
										settings
										.failClose(_data);
									if (typeof ajaxSuccess == "function")
										ajaxSuccess(_data);
								});
						return false;
					}
				}
				if (typeof settings.sucClose == "function")
					settings.sucClose(_data);
				if (typeof ajaxSuccess == "function")
					ajaxSuccess(_data);
				return true;
			};

			$origin.ajax(s);
		},
		//移动端滚动到底部加载插件
		// collideLoading:function(options){
		// 	options=$.extend({
		// 		callback:function(){}
		// 	},options)
		// 	$(window).scroll(function(){
		// 		var availHeight=$(window).height(),
		// 			scrollTop=$(window).scrollTop(),
		// 			docHeight=$(document).height();
		// 		console.log('aaa')
		// 		if (availHeight+scrollTop>=docHeight) {
		// 			options.callback();
		// 		}
		// 	})
		// },
		collideLoading:function(options){
			options=$.extend({
				onScrollBottom:function(){
					alert('aaa')
				}
			},options)
			window.onscroll=function(){
				var clientHeight=0,
					scrollTop=document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop,
					docHeight=document.scrollHeight?document.scrollHeight:document.documentElement.scrollHeight;
					
				if (document.documentElement.clientHeight&&document.body.clientHeight) {
					clientHeight=Math.min(document.documentElement.clientHeight,document.body.clientHeight);
				}else{
					clientHeight=Math.max(document.documentElement.clientHeight,document.body.clientHeight);
				}

				if (clientHeight+scrollTop>=docHeight) {
					options.onScrollBottom()
				};
				console.log(docHeight)
			}
	});

	/**
	 * 跳转到新页面
	 */
	window.openWin = function openWin(_url) {
		window.location.href = _url;
	};

	/**
	 * StringToken 用来遍历字符窜使用
	 */
	window.StringToken = window.StringToken || function(val) {
		window.StringToken.NULL = '\000';
		this.index = -1;
		this.more = function() {
			return val && this.index < val.length - 1;
		};
		this.next = function() {
			if (this.more()) {
				return val.charAt(++this.index);
			}
			return StringToken.NULL;
		};
		this.back = function() {
			if (this.index > 0)
				this.index--;
		};
		this.setIndex = function(index) {
			this.index = index;
		};
	};

	String.prototype.toText = function() {
		return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
			'&gt;').replace(/\'/g, '&#039;').replace(/\"/g, '&quot;');
	};
	/**
	 * 格式化字符窜占位符 aaa{0}bbb{1}c{name}cc ==> aaa-bbb+ccc
	 */
	String.prototype.placeholder = function() {
		var assemble = "",
			key,
			token = new StringToken(this);

		function nextKey(isAssemble) {
			var c, holder = false,
				key = "";
			KEY:
				while ((c = token.next()) != StringToken.NULL) {

					switch (c) {

						case '\\':
							if (holder) {
								key = key.concat(c).concat(token.next());
							} else {
								if (isAssemble)
									assemble = assemble.concat(c).concat(token.next());
							}
							break;
						case '{':
							if (holder) {
								throw Error("char '{' can not nest");
							} else {
								holder = true;
							}
							break;
						case '}':
							if (holder) {
								break KEY;
							} else {
								if (isAssemble)
									assemble = assemble.concat(c);
							}
							break;
						default:
							if (holder) {
								key = key.concat(c);
							} else {
								if (isAssemble)
									assemble = assemble.concat(c);
							}
							break;
					}

				}

			return key;
		}
		while ((key = nextKey(true)) !== "") {
			var val = null;
			if (utils.regex(key, regex.num)) {
				var intKey = parseInt(key);
				val = arguments.length > intKey ? arguments[intKey] : null;
			} else {
				for (var i in arguments) {
					var arg = arguments[i];
					if (utils.isObject(arg)) {
						if (key in arg) {
							val = arg[key];
							break;
						}
					}
				}
			}
			assemble = assemble.concat(val);
		}
		return assemble;
	};

	// 格式化字符串的日期，转换成 date类型;例如：'2015-01-27 13:11:30' 转换成date格式
	String.prototype.splitDate = function() {

		var dateString = this.toString();

		var dateSplitArrary = dateString.split(' ');
		var dateArrary = dateSplitArrary[0].split('-');
		var timeArrary = dateSplitArrary[1].split(':');

		var year = dateArrary[0];
		var mo = dateArrary[1];
		var day = dateArrary[2];

		var ho = timeArrary[0];
		var min = timeArrary[1];
		var send = timeArrary[2];

		var date = new Date();
		date.setYear(year);
		date.setMonth(mo - 1);
		date.setDate(day);
		date.setHours(ho);
		date.setMinutes(min);

		if (send != undefined) {
			date.setSeconds(send);
		}

		return date;
	};

	// 截取一定字符的字符串
	String.prototype.textCut = function(remainNum, replaceSymble, escape) {
		var str = this.toString(),
			output = new Array();
		if (!str || !typeof remainNum == "number")
			return false;
		if (str.length > 0) {
			var n = 0;
			var pattern = /^[\u4E00-\u9FA5]+$/;
			for (var i = 0; i < str.length; i++) {
				var strTemp = str.substring(i, i + 1);
				if (pattern.test(strTemp)) {
					n += 2;
				} else {
					n++;
				}
				if (n > remainNum) {
					if (utils.isString(replaceSymble)) {
						output.push(replaceSymble);
					}
					break;
				}
				output.push(strTemp);
			}
		}
		if (escape) {
			return escape(output.join(""));
		}
		return output.join("");
	};
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			var str = this.toString();
			return str.replace(/^\s+/, "").replace(/\s+$/, "");
		};
	}
	if (!String.prototype.repeat) {
		String.prototype.repeat = function(num) {
			if (!utils.isNumber(num))
				num = utils.parseInt(num);
			return new Array(++num).join(this);
		};
	}

	// 格式化日期格式
	if (!Date.prototype.format) {
		Date.prototype.format = function(format) {
			format = format || "yyyy-MM-dd HH:mm:ss";
			var o = {
				"M+": this.getMonth() + 1, // month
				"d+": this.getDate(), // day
				"H+": this.getHours(), // hour
				"m+": this.getMinutes(), // minute
				"s+": this.getSeconds(), // second
				"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
				"S": this.getMilliseconds()
					// millisecond
			};
			if (/(y+)/.test(format)) {
				var year = this.getFullYear().toString(),
					year = 4 - RegExp.$1.length < 0 ? year : year.substr(4 - RegExp.$1.length);
				format = format.replace(RegExp.$1, year);
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1,
						RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
						.substr(o[k].toString().length));
				}
			}
			return format;
		};
	}

})(jQuery);


//create by fqian
function Map() {

	this.elements = new Array();

	this.size = function() {
		return this.elements.length;
	}

	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	this.clear = function() {
		this.elements = new Array();
	}

	this.put = function(_key, _value) {

		this.remove(_key);

		this.elements.push({
			key: _key,
			value: _value
		});
	}

	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}

	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}

	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}
}
