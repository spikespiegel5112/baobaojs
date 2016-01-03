!(function($) {
    'use strict';

    $._sureInput_init = {};
    $._sureInput_save = {};
    $._sureInput_cancel = {};
    $._sureInput_selectDiv = {};

    $.fn.sureInput = function (options) {

        var defaultFunc = function(){};

        var defaults = {
            type : "input",
            init : defaultFunc,
            save : defaultFunc,
            cancel : defaultFunc
        };

        var options = $.extend(defaults, options);

        var divName = this.attr('class') ||  this.attr('id');
        $._sureInput_save[divName] =  options.save;
        $._sureInput_init[divName] =  options.init;
        $._sureInput_cancel[divName] =  options.cancel;

        var _getInput = function() {
            return  "<div class='user-input-commit-tool'><div class='user-input-wapper'>"+
                "<div class='user-input-group'> <div class='input-group'>"+
                "<input type='text' class='form-control' placeholder='请输入...' aria-describedby='basic-addon-send'>"+
                "<span class='input-group-addon' id='basic-addon-send'>确定</span> </div> </div> </div> </div>";
        };

        var _getTextarea = function() {
            return "<div class='user-input-commit-tool-multi'>" +
                "<div class='user-input-textarea'>" +
            "<textarea type='text' class='form-control' id='user-input-textarea-content' placeholder='请输入...'></textarea>" +
            "<a id='user-input-textarea-save' type='button' class='btn btn-default'>确定</a>" +
            "<a id='user-input-textarea-cancel' type='button' class='btn btn-default'>取消</a>" +
            "</div>" +
            "</div>";
        };

        var setTriLeft = function(left, direction) {
        	var triangleStyle;
        	if (direction == 'up')
        		triangleStyle = "border-bottom: 1em solid #f7f7f7; top: -2em;";
        	else
        		triangleStyle = " border-top: 1em solid #f7f7f7; top: 4.5em;";
            $('head style').remove();
            $('head').append("<style>.user-input-commit-tool .user-input-group:before{left: "+ left + ";" + triangleStyle + "} </style>");
        };


        if ($('.mask').length == 0) {
            $('body').append("<div class='mask opacity'></div>");
        }

        if (options.type === "input") {
            if ($('.user-input-commit-tool').length == 0) {
                $('body').append(_getInput());

                $('#basic-addon-send').on('click', function() {
                    _close();

                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_save[selectDiv.attr('class') ||  selectDiv.attr('id')](_getVaule(), selectDiv);

                    inputDiv.val("");
                });

                $('.mask').on('click', function(){
                    _close();
                });

            }

        } else {
            if ($('.user-input-commit-tool-multi').length == 0) {
                $('body').append(_getTextarea());

                $('#user-input-textarea-save').on('click', function() {
                    _close();

                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_save[selectDiv.attr('class') ||  selectDiv.attr('id')](_getVaule(), selectDiv);
                    inputDiv.val("");
                });

                $('#user-input-textarea-cancel').on('click', function() {
                    _close();
                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_cancel[selectDiv.attr('class') ||  selectDiv.attr('id')]()
                    inputDiv.val("");
                });

                $('.mask').on('click', function(){
                    _close();
                });
            }

        }

        var showDiv = options.type === "input" ?  $('.user-input-commit-tool') : $('.user-input-commit-tool-multi');
        var inputDiv = options.type === "input" ? $('.user-input-commit-tool input') : $('.user-input-commit-tool-multi textarea') ;

        var _show = function () {
            $('.mask').show();
            showDiv.fadeIn();
        };

        var _close = function () {
            $('.mask').hide();
            showDiv.fadeOut();
        };

        var _getVaule = function() {
            return inputDiv.val();
        };

        return $(this).each(function() {

            var $this = $(this);

            $this.on('click', function () {
                divName = $this.attr('class') ||  $this.attr('id');

                if (options.type === "input") {
                	var inputChange;
                	var direction = 'up';
                    var offset = $(this).offset();

                    var tLeft = offset.left;
                    var tTop = offset.top;
                    var tWidth = $this.width();
                    var tHeight = $this.height();
                    
                    var winHeight = $(window).height();
                    var scrollTop = $(window).scrollTop();
                    if ((winHeight + scrollTop) < (tTop + tHeight + 96)) {
                    	inputChange = (tTop - 86) + 'px';
                    	direction = 'down';
                    } else {
                    	inputChange = (tTop + tHeight) + 'px';
                    	direction = 'up';
                    }

                    $('.user-input-commit-tool').css({'top':inputChange});

                    var bcWigth = document.body.clientWidth;

                    var cLeft = tLeft * 100 / bcWigth + 1;

                    setTriLeft(cLeft + '%', direction);
                }

                $._sureInput_selectDiv = $this;

                _show();

            });
        });
    };

}(jQuery));