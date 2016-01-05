		$.fn.extend({
		    priceCalculator: function(options) {
		        var $this = $(this),
		            index = 0,
		            totalPriceArr = [],
		            config = {
		                unitprice: '',
		                subtotal: '',
		                totalprice: '',
		                onchange: function() {}
		            };
		        if (options) {
		            $.extend(config, options)
		        };
		        init($this);
		        $.each($this, function(index) {
		            var $this = $(this),
		                index = index,
		                counterEl = $this.find('input');
		            $this.find('a').on('click', function() {
		                var counter = counterEl.val();
		                index = index;
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
		                setter(index, counter);
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
		                        setter(index, counter);
		                        config.onchange();
		                        fireOnchange(counterEl);
		                        break;
		                }
		            })
		        });

		        function getUnitprice(index) {
		            var unitPrice = $(config.unitprice).eq(index).text().replace("￥", '');
		            return unitPrice;
		        }

		        function setter(index, counter) {
		            var result = getUnitprice(index) * counter;
		            $(config.subtotal).eq(index).html(parseFloat(result).toFixed(2));
		            totalprice(index, result)
		        }

		        function totalprice(index, price) {
		            totalPriceArr[index] = price;
		            var totalPrice = 0;
		            for (var i = totalPriceArr.length - 1; i >= 0; i--) {
		                totalPrice += totalPriceArr[i];
		            };
		            $(config.totalprice).html(parseFloat(totalPrice).toFixed(2));
		        }

		        function init(_this) {
		            var length = _this.length;
		            $.each(_this, function(index) {
		                var val = _this.eq(index).find('input').val();
		                setter(index, val)
		            });
		        }

		        function fireOnchange(_this) {
		            _this.trigger('onchange');
		        }
		    }
		})
