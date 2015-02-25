/**
 * Created by hWX229431 on 2015/2/12.
 */
define(['ko'], function (ko) {
    'use strict';
    ko.bindingHandlers.buttons = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor(),
                moveFlag = false,
                mouseMoveTimer,
                hideButtonsTimer;

            var BTN_WIDTH = 70, BTN_MARGIN = 10, $btnWrapper = $('.buttonWrapper'), mouseEvent, btnList;

            /**
             * buttons will be like this:
             * buttons: [{name: 'play',action: function(){}},{name: 'record',action: function(){}},{name: 'download',action: function(){}}..]
             * @type {number|t.buttons|*|ui.dialog.options.buttons|.options.buttons|{update: Function}}
             */
            var buttons = allBindings.buttons();

            if(buttons && buttons.length === 0){
                return;
            }

            var btnWrapWidth = buttons.length * (BTN_WIDTH + BTN_MARGIN) - BTN_MARGIN;
            var hideButtons = function () {
                _.each(btnList, function (item) {
                    $(item).css({
                        transition: 'all ease-in 0.2s',
                        'opacity': '0',
                        left: $(btnList[0]).css('left')
                    });
                    setTimeout(function(){
                        $(item).remove();
                    }, 200);
                });
                setTimeout(function(){
                    $btnWrapper.hide();
                },200);
            };

            var showCircleButtons = function () {
                var pageX = mouseEvent.pageX;
                var pageY = mouseEvent.pageY;
                if (!moveFlag) {
                    //when mouse don't move for 2 seconds, circle buttons will show in line
                    $btnWrapper.empty();

                    btnList = _.map(buttons, function (item, index) {
                        return $('<div class="circle_btn">').text(item.name).unbind().bind('click', function () {
                            item.action();
                            hideButtons();
                        }).hover(function(){
                            $(this).css({
                                transform: 'rotate(360deg)',
                                transition: 'transform ease-in 0.4s'
                            });
                        }, function(){
                            $(this).css({
                                transform: 'rotate(0deg)',
                                transition: 'transform ease-in 0.4s'
                            });
                        }).css({
                            position: 'absolute',
                            'transition': 'none',
                            'width': BTN_WIDTH + 'px',
                            'height': BTN_WIDTH + 'px',
                            'left': $(window).width() - pageX - btnWrapWidth < 40 ? (buttons.length - 1) * (BTN_WIDTH + BTN_MARGIN) : '0',
                            'top': '0',
                            'text-align': 'center',
                            'font-size': '18px',
                            'line-height': BTN_WIDTH + 'px',
                            'border-radius': BTN_WIDTH + 'px',
                            'background': '#ebebeb',
                            'opacity': '0',
                            'color': '#6c6c6c',
                            cursor: 'pointer'
                        }).appendTo($btnWrapper);
                    });
                    moveFlag = false;
                    var btnWrapLeft, animateTimeArray = [], btnLeftPositionArray = [];
                    if($(window).width() - pageX - btnWrapWidth < 40){
                        btnWrapLeft = pageX - btnWrapWidth - BTN_MARGIN;
                        _.each(btnList, function(btn, index){
                            animateTimeArray.push(0.1 * (btnList.length - index -1) + 0.15);
                            btnLeftPositionArray.push((btnList.length - index -1) * (BTN_WIDTH + BTN_MARGIN));
                        });
                    }else {
                        btnWrapLeft = pageX + BTN_MARGIN;
                        _.each(btnList, function(btn, index){
                            animateTimeArray.push(0.1 * index + 0.15);
                            btnLeftPositionArray.push(index * (BTN_WIDTH + BTN_MARGIN));
                        });
                    }
                    $btnWrapper.css({
                        left:  btnWrapLeft + 'px',
                        top: pageY - BTN_WIDTH - 40 + 'px',
                        width: buttons.length * (BTN_WIDTH + BTN_MARGIN) - BTN_MARGIN + 'px',
                        height: BTN_WIDTH + 'px',
                        'z-index': '9999'
                    }).unbind('mouseenter').bind('mouseenter', function () {
                        moveFlag = true;
                        clearTimeout(hideButtonsTimer);
                    }).unbind('mouseleave').bind('mouseleave', function () {
                        moveFlag = true;
                        clearTimeout(hideButtonsTimer);
                        hideButtonsTimer = setTimeout(function () {
                            hideButtons();
                        }, 1000);
                    }).show();
                    setTimeout(function () {
                        _.each(btnList, function (btn, index) {
                            $(btn).css({
                                'transition': 'all ease-in ' + animateTimeArray[index] + 's',
                                opacity: '1',
                                'left': btnLeftPositionArray[index] + 'px',
                                'top': 0
                            });
                        });
                        clearTimeout(mouseMoveTimer);
                    }, 100);
                } else {
                    moveFlag = false;
                }
                clearTimeout(mouseMoveTimer);
                mouseMoveTimer = setTimeout(function () {
                    showCircleButtons();
                }, 2000);
            };

            $(element).unbind('mouseenter').bind('mouseenter', function (e) {
                moveFlag = true;
                mouseEvent = e;
                clearTimeout(hideButtonsTimer);
                showCircleButtons();
            }).unbind('mouseleave').bind('mouseleave', function () {
                moveFlag = true;
                clearTimeout(mouseMoveTimer);
                clearTimeout(hideButtonsTimer);
                hideButtonsTimer = setTimeout(function () {
                    hideButtons();
                }, 1000);
            });

            $(element).unbind('mousemove.buttons').bind('mousemove.buttons', function (e) {
                moveFlag = true;
                mouseEvent = e;
                clearTimeout(mouseMoveTimer);
                showCircleButtons();
            });

            $(document).unbind('click.buttons').bind('click.buttons', function(){
                hideButtons();
            });
        }
    };
});
