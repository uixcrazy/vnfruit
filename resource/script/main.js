$(document).ready(function() {
    $('.main_nav').styleMainNav();
    $('.hsa_agency').hhdHorizontalSlidingAccordion({});
    $('.accordion-slider').accordionSlider({
        "heightSlider": 450
    });
    $(window).smartresize(function() {
        common();
//        restartProductHeight();
    });
});
$(window).load(function() {
    common();
//    restartProductHeight();
});

function common() {
    var getHeightNews_top = $('.hotnews .news_top').height();
    $('.hotnews .news .news_top .content').css({'height': getHeightNews_top});
    var getHeightNews_news = $('.hotnews .news').height();
    $('.hotnews .video').css({'height': getHeightNews_news * 0.9, 'padding-top': getHeightNews_news * 0.1});
    $('.hotnews .video .video-wrap').css({'height': getHeightNews_news * 0.7, 'width': '90%', 'margin': 'auto'});

    var scrollbarWidth = $.getScrollbarWidth();
    var widthScreen = $(window).width() + scrollbarWidth;
    if (widthScreen > 768) {
        var getHeightProducts = $('.sale .products').height();
        $('.sale .use').css({'height': getHeightProducts - 36});
    } else {
        $('.sale .use').css({'height': 'auto'});
        var getHeightProducts = $('.sale .use .main-news').height();
        $('.sale .use .listmore').css({'height': getHeightProducts * 0.9, 'overflow': "hidden"});
    }
}
function restartProductHeight() {
    var maxHeight = 0;
    $('.products ul > li').each(function(i) {
        var tempHeight = $(this).find('.content').outerHeight(true);
        if (tempHeight > maxHeight) {
            maxHeight = tempHeight;
        }
    });
    var heightImg = $('.products ul > li').first().find('.img').outerHeight(true);
    console.log(maxHeight + "" + heightImg);
    $(".products ul > li .item").css({"height": maxHeight + heightImg});
}
//$(function() {
//    $.getScrollbarWidth();
//});
//var i = 0;
//$(window).resize(function(e) {
//    e.preventDefault();
//    console.log(i++);
//    styleMainNav();
//});

(function($) {
    $.fn.styleMainNav = function() {
        return this.each(function() {
            var $this = $(this), clone = $this.clone(false);
            function init() {
                // $(window).width(); ko bao gồm scroll bar width
                var scrollbarWidth = $.getScrollbarWidth();
                var widthScreen = $(window).width() + scrollbarWidth;
                if (widthScreen <= 768) {
                    //for tongle
                    $this.children('.nav').stop().hide();
                    $this.children(".nav_toggle").children(".nav_toggle_label").click(function(e) {
//                        e.preventDefault();
                        var listNav = $this.children('.nav[style*="display: block"]');
                        if (listNav.length === 0) {
                            $this.children('.nav').stop().show('blind');
                            $(this).addClass('active');
                        } else {
                            $this.children('.nav').stop().hide('blind');
                            $(this).removeClass('active');
                        }
                    });
//                    $('.main_nav li.has_child a').unbind("click").click(function(e) {
                    $this.find('li.has_child a').unbind("click").click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        //e.stopPropagation();
                        var listBlock = $(this).parent().children('ul[style*="display: block"]');
                        if (listBlock.length === 0) {
                            var listBlockParent = [];
                            $(this).parent().parent().children('li.has_child').each(function() {
                                //listBlockParent.push.apply(listBlockParent, $(this).children('ul[style*="display: block"]'));
                                $(this).children('ul[style*="display: block"]').hide('blind');
                            });
                            $(this).parent().children("ul").show('blind');
                        }
                        else {
                            //day la TH menu da mo -> dong lai luôn
                            $(this).parent().children("ul").hide('blind');
                        }
                    });
                } else {
                    $this.children('li.has_child ul').removeAttr('style');
                    $this.children('.nav').stop().show();
                }
            }
            function update() {
                $this.replaceWith(clone);
                $this = clone;
                clone = $this.clone(false);
                init();
            }
            init();
            $(window).smartresize(function() {
                update();
            });
        });
    };
})(jQuery);
(function($) {
    $.fn.hhdHorizontalSlidingAccordion = function() {
        return this.each(function() {
            var $this = $(this);
            var $slides = $this.find("li.hsa-item");
            var totalSlider = $slides.size();
            var widthSlider_margin = $slides.outerWidth(true);//default is false
            var widthSlider_nomargin = $slides.outerWidth();
            var marginWidth = widthSlider_margin - widthSlider_nomargin;
            var widthUl = totalSlider * widthSlider_margin;
            function addNavBtn() {
                $this.append(
                        "<div class=\"hsa-nav\">" +
                        "<span class=\"nav-prev\"></span>" +
                        "<span class=\"nav-next\"></span>" +
                        "</div>"
                        );
            }
            function init() {
                var ctWidth = $this.outerWidth();
                $this.find(".hsa-list").css({
                    width: widthUl,
                    "left": 0
                });
                if (ctWidth < widthUl) {
                    $this.children(".hsa-nav").show();
                    //và có slider
                    $this.find('.nav-prev').click(function(e) {
                        e.preventDefault();
                        prevSlice();
                    });
                    $this.find('.nav-next').click(function(e) {
                        e.preventDefault();
                        nextSlice();
                    });
//                    $this.bind('mousewheel', function(e, delta) {
//                        e.preventDefault();
//                        if (delta > 0) {
//                            prevSlice();
//                        } else {
//                            nextSlice();
//                        }
//                    });
                    if (isMobile()) {
                        $this.unbind('swipeleft').bind('swipeleft', function(event) {
                            nextSlice();
                        });
                        $this.unbind('swiperight').bind("swiperight", function(event) {
                            prevSlice();
                        });
                    }
                } else {
                    $this.find(".hsa-nav").hide();
                }
                var i = 0;
                function nextSlice() {
                    if ($this.find('.hsa-list .hsa-item').is(':animated'))
                        return false;

                    var numOfShowSlide = Math.floor(ctWidth / widthSlider_margin);
                    var maxP = widthUl - ctWidth;
                    var p = parseInt($this.find('.hsa-list').css('left')) - widthSlider_margin;
                    if (Math.abs(p) < Math.abs(maxP)) {
                        $this.find('.hsa-list').stop(true).animate({
                            left: p,
                            duration: '1000',
                            easing: 'linear'
                        });
                    } else if (Math.abs(p) >= (maxP - marginWidth) && Math.abs(p) <= (maxP - marginWidth + widthSlider_margin)) {
                        $this.find('.hsa-list').stop(true).animate({
                            left: -(maxP - marginWidth),
                            duration: '1000',
                            easing: 'linear'
                        });
                    }
                }
                function prevSlice() {
                    if ($this.find('.hsa-list .hsa-item').is(':animated'))
                        return false;

                    var numOfShowSlide = Math.floor(ctWidth / widthSlider_margin);
                    var maxP = widthUl - ctWidth;
                    var p = parseInt($this.find('.hsa-list').css('left')) + widthSlider_margin;
                    if (p <= 0) {
                        $this.find('.hsa-list').stop(true).animate({
                            left: p,
                            duration: 'slow',
                            easing: 'easeInQuint'
                        });
                    } else if ((ctWidth % widthSlider_margin) !== 0 && Math.abs(p) <= widthSlider_margin) {
                        $this.find('.hsa-list').stop(true).animate({
                            left: 0,
                            duration: 'slow',
                            easing: 'easeInQuint'
                        });
                    }
                }
            }
            addNavBtn();
            init();
            //resize window
            $(window).resize(function(e) {
                e.preventDefault();
                init();
            });
        });
    };
})(jQuery);
(function($) {
    $.fn.accordionSlider = function(options) {
        var defaults = {
            "heightSlider": 500
        };
        var options = $.extend(defaults, options);
        return this.each(function() {
            var $this = $(this), clone = $this.clone(false);
            function init() {
                var widthSlider_margin = $this.outerWidth(false);//default is false
                if (widthSlider_margin >= 480) {
                    //large slider
                    $this.css({height: defaults.heightSlider});
                    $this.children('ul').removeClass('fade-slider');
                    $this.children('ul').addClass('kwicks');
                    $this.remove('.nav-controls,.nav-direction');
                    //set width caption 
                    var myInterval = 5000, minSize = 50, spacing = 0;
                    var panelMaxSize = widthSlider_margin - (spacing * 4) - (minSize * 4);
                    $('.slider-caption').css({width: panelMaxSize});
                    $this.children('.kwicks').kwicks({
                        minSize: minSize,
                        spacing: spacing,
                        behavior: 'slideshow',
                        interval: myInterval,
                        easing: 'easeInSine'
                    });
                    //set height caption
                    var maxHeight = 0;
                    $this.find('.kwicks > li').each(function(i) {
                        var tempHeight = $(this).children(".slider-caption").outerHeight(true);
                        if (tempHeight > maxHeight) {
                            maxHeight = tempHeight;
                        }
                    });
                    $(".slider-caption").css({"height": maxHeight});

                } else {
                    //small slider
                    $this.children('ul').removeClass('kwicks');
                    $this.children('ul').addClass('fade-slider');
                    $this.css({'height': $('.fade-slider > li').first().outerHeight()});
                    $this.sliderFade();
                }
            }
            function update() {
                $this.replaceWith(clone);
                $this = clone;
                clone = $this.clone(false);
                init();
            }
            init();
            //resize window
//            $(window).resize(function(e) {
//                e.preventDefault();
//                init();
//            });
            $(window).smartresize(function() {
                update();
            });
        });
    };
})(jQuery);

(function($) {
    $.fn.sliderFade = function(options) {
        return this.each(function() {
            var $this = $(this);
            var $slides = $this.find("ul li"),
                    current = 0,
                    totalSlider = $slides.size(),
                    interval = 5000;
            $this.find("ul li").first().css({'opacity': 1, "z-index": 100});
            $this.find("ul li").first().addClass("show");
            function addControlBtn() {
                if (!$this.hasClass('.nav-controls')) {
                    $this.append("<div class=\"nav-controls\"><ul></ul></div>");
                    for (var i = 0; i < totalSlider; i++) {
                        $(".nav-controls ul").append("<li><span></span></li>");
                    }
                    $(".nav-controls ul li").first().children("span").addClass("active");
                }
            }
            function addDirectionBtn() {
                if (!$this.hasClass('.nav-direction')) {
                    $this.append('<div class="nav-direction"><div class="nav-prev"></div><div class="nav-next"></div></div>');
                }
            }
            function init() {
                clearTimeout(slideshow);
                var slideshow = setTimeout(function() {
                    var current = $(".show").index();
                    if (current >= totalSlider - 1) {
                        changeSlide(current, 0);
                    } else {
                        changeSlide(current, current + 1);
                    }
                    init();
                }, interval);
            }
            function changeSlide(old_slide, new_slide) {
                $slides.eq(old_slide).removeClass("show");
                $slides.eq(old_slide).css({'opacity': 0, "z-index": 0});
                $slides.eq(new_slide).css({'opacity': 1, "z-index": 100});
                $slides.eq(new_slide).addClass("show");
                $(".nav-controls ul li span").removeClass("active");
                $(".nav-controls ul li").eq(new_slide).children("span").addClass("active");
            }
            addControlBtn();
            addDirectionBtn();
            init();
            //event for btn
            $(".nav-controls ul li").unbind("click").click(function() {
                var current = $(".show").index();
                var eqcurrent = $(this).index();
                changeSlide(current, eqcurrent);
            });
            $(".nav-direction .nav-prev").unbind("click").click(function() {
                var current = $(".show").index();
                changeSlide(current, current - 1);
            });
            $(".nav-direction .nav-next").unbind("click").click(function() {
                var current = $(".show").index();
                changeSlide(current, current + 1);
            });
        });
    };
})(jQuery);
function isMobile() {
    if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPod/i)
            ) {
        return true;
    }
}
(function($) {
    var scrollbarWidth = 0;
    $.getScrollbarWidth = function() {
        if (!scrollbarWidth) {
            if ($.browser.msie) {
                var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                        .css({position: 'absolute', top: -1000, left: -1000}).appendTo('body'),
                        $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
                        .css({position: 'absolute', top: -1000, left: -1000}).appendTo('body');
                scrollbarWidth = $textarea1.width() - $textarea2.width();
                $textarea1.add($textarea2).remove();
            } else {
                var $div = $('<div />')
                        .css({width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000})
                        .prependTo('body').append('<div />').find('div')
                        .css({width: '100%', height: 200});
                scrollbarWidth = 100 - $div.width();
                $div.parent().remove();
            }
        }
        return scrollbarWidth;
    };
})(jQuery);
(function($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function(func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }
            ;

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);//100
        };
    };
    // smartresize 
    jQuery.fn[sr] = function(fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');