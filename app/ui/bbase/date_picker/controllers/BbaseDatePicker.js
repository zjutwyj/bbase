'use strict';
/**
 * @description 模块功能说明
 * @class BbaseDatePicker
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 *
 */
define('BbaseDatePicker', [], function(require, exports, module) {
  var BbaseDatePicker, deg, move, i,ul,fx;

  // 样式 1 [http://down.admin5.com/demo/code_pop/24/82/]
  jQuery.easing._dd_easing = function(d, a, i, s, e) { return -s * ((a = a / e - 1) * a * a * a - 1) + i },
    function(d) { d.fn.dateDrop = function(a) { return d(this).each(function() { if (d(this).is("input") && "text" == d(this).attr("type")) { var i, s, e, r, t = (new Date).getFullYear(),
              n = (new Date).getDate(),
              o = (new Date).getMonth(),
              l = d(".dd-w").length,
              u = '<div class="dd-w dd-init" id="dd-w-' + l + '"><div class="dd-o"></div><div class="dd-c"><div class="dd-w-c"><div class="dd-b dd-m"><div class="dd-ul"><a class="dd-n dd-n-left"><i class="dd-icon-left" ></i></a><a class="dd-n dd-n-right"><i class="dd-icon-right" ></i></a><ul></ul></div></div><div class="dd-b dd-d"><div class="dd-ul"><a class="dd-n dd-n-left"><i class="dd-icon-left" ></i></a><a class="dd-n dd-n-right"><i class="dd-icon-right" ></i></a><ul></ul></div></div><div class="dd-b dd-y"><div class="dd-ul"><a class="dd-n dd-n-left"><i class="dd-icon-left" ></i></a><a class="dd-n dd-n-right"><i class="dd-icon-right" ></i></a><ul></ul></div></div><div class="dd-s-b dd-s-b-m dd-trans"><div class="dd-s-b-ul"><ul></ul></div></div><div class="dd-s-b dd-s-b-d dd-trans"><div class="dd-s-b-ul"><ul></ul></div></div><div class="dd-s-b dd-s-b-y dd-trans"><div class="dd-s-b-ul"><ul></ul></div></div><div class="dd-s-b dd-s-b-s-y dd-trans"><div class="dd-s-b-ul"><ul></ul></div></div><div class="dd-s-b-s"><i class="dd-icon-close" ></i></div><div class="dd-b dd-sub-y"><div class="dd-ul"><a class="dd-n dd-n-left"><i class="dd-icon-left" ></i></a><a class="dd-n dd-n-right"><i class="dd-icon-right" ></i></a><ul></ul></div></div><div class="dd-s"><a><i class="dd-icon-check" ></i></a></div></div></div></div>';
              var picker_default_date = $(this).data('default-date');
               if(picker_default_date) {
                var regex = /\d+/g;
                var string = picker_default_date;
                var matches = string.match(regex);

                $.each(matches, function( index, value ) {
                  matches[index] = parseInt(value);
                });

                t= (matches[0]) ? matches[0] : t;
                o = (matches[1]&&matches[1]<=12) ? matches[1] -1 :o;
                n = (matches[2]&&matches[2]<=31) ? matches[2] : n;
              }
            d("body").append(u); var c = d(this),
              f = d("#dd-w-" + l),
              b = function(d) { return !(d % 4 || !(d % 100) && d % 400) },
              m = function(d) { return 10 > d ? "0" + d : d },
              p = d.extend({ animate: !0, init_animation: "fadein", format: "Y-m-d", lang: "en", lock: !1, maxYear: t, minYear: 1970, yearsRange: 10, dropPrimaryColor: "#01CEFF", dropTextColor: "#333333", dropBackgroundColor: "#FFFFFF", dropBorder: "1px solid #08C", dropBorderRadius: 8, dropShadow: "0 0 10px 0 rgba(0, 136, 204, 0.45)", dropWidth: 124, dropTextWeight: "bold" }, a),
              h = null,
              v = !1,
              g = function(d, a) { var i = !1; "#" == d[0] && (d = d.slice(1), i = !0); var s = parseInt(d, 16),
                  e = (s >> 16) + a;
                e > 255 ? e = 255 : 0 > e && (e = 0); var r = (s >> 8 & 255) + a;
                r > 255 ? r = 255 : 0 > r && (r = 0); var t = (255 & s) + a; return t > 255 ? t = 255 : 0 > t && (t = 0), (i ? "#" : "") + (t | r << 8 | e << 16).toString(16) }; switch (d("<style></style>").appendTo("head"), p.lang) {
              case "ens":
                var y = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  k = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; break;
              default:
                var y = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                  k = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] } var w = function() { f.find(".dd-d li,.dd-s-b li").show(), b(e) && 2 == i ? (f.find(".dd-d ul").width(29 * p.dropWidth), (30 == s || 31 == s) && (s = 29), f.find("li[data-id=30],li[data-id=31]").hide()) : b(e) || 2 != i ? 4 == i || 6 == i || 9 == i || 11 == i ? (f.find(".dd-d ul").width(30 * p.dropWidth), 31 == s && (s = 30), f.find("li[data-id=31]").hide()) : f.find(".dd-d ul").width(31 * p.dropWidth) : (f.find(".dd-d ul").width(28 * p.dropWidth), (29 == s || 30 == s || 31 == s) && (s = 28), f.find("li[data-id=29],li[data-id=30],li[data-id=31]").hide()), f.find(".dd-d li").each(function(a, s) { var r = d(this).attr("data-id"),
                    r = new Date(i + "/" + r + "/" + e),
                    r = r.getDay();
                  0 == r || 6 == r ? d(this).addClass("dd-sun") : d(this).removeClass("dd-sun"), d(this).find("span").html(k[r]) }), f.find(".dd-s-b-d li").each(function(a, s) { var r = d(this).attr("data-id"),
                    r = new Date(i + "/" + r + "/" + e),
                    r = r.getDay();
                  0 == r || 6 == r ? d(this).addClass("dd-sun") : d(this).removeClass("dd-sun"), d(this).find("span").html(k[r].substr(0, 3)) }), f.find(".dd-s-b li").removeClass("dd-on"), f.find('.dd-s-b-d li[data-id="' + s + '"],.dd-s-b-m li[data-id="' + i + '"],.dd-s-b-s-y li[data-id="' + e + '"],.dd-s-b-y li[data-id="' + r + '"]').addClass("dd-on"), p.animate ? f.hasClass("dd-init") ? (f.find(".dd-m .dd-ul").animate({ scrollLeft: f.find('.dd-m li[data-id="' + i + '"]').index() * p.dropWidth }, 1200, "swing"), setTimeout(function() { f.find(".dd-d .dd-ul").animate({ scrollLeft: f.find('.dd-d li[data-id="' + s + '"]').index() * p.dropWidth }, 1200, "swing"), setTimeout(function() { f.find(".dd-y .dd-ul").animate({ scrollLeft: f.find('.dd-y li[data-id="' + e + '"]').index() * p.dropWidth }, 1200, "swing", function() { v = !0, f.removeClass("dd-init") }) }, 200) }, 400)) : (f.find(".dd-d .dd-ul").stop().animate({ scrollLeft: f.find('.dd-d li[data-id="' + s + '"]').index() * p.dropWidth }, 260), f.find(".dd-m .dd-ul").stop().animate({ scrollLeft: f.find('.dd-m li[data-id="' + i + '"]').index() * p.dropWidth }, 260), f.find(".dd-y .dd-ul").stop().animate({ scrollLeft: f.find('.dd-y li[data-id="' + e + '"]').index() * p.dropWidth }, 260), f.find(".dd-sub-y .dd-ul").stop().animate({ scrollLeft: f.find('.dd-sub-y li[data-id="' + r + '"]').index() * p.dropWidth }, 260)) : (setTimeout(function() { f.find(".dd-d .dd-ul").scrollLeft(f.find('.dd-d li[data-id="' + s + '"]').index() * p.dropWidth), f.find(".dd-m .dd-ul").scrollLeft(f.find('.dd-m li[data-id="' + i + '"]').index() * p.dropWidth), f.find(".dd-y .dd-ul").scrollLeft(f.find('.dd-y li[data-id="' + e + '"]').index() * p.dropWidth), f.find(".dd-sub-y .dd-ul").scrollLeft(f.find('.dd-sub-y li[data-id="' + r + '"]').index() * p.dropWidth) }, 1), f.hasClass("dd-init") && (f.removeClass("dd-init"), v = !0)), D(r) },
              C = function() { f.addClass("dd-bottom"), f.find(".dd-c").css({ top: c.offset().top + c.innerHeight() - 6, left: c.offset().left + (c.innerWidth() / 2 - p.dropWidth / 2) }).addClass("dd-" + p.init_animation) },
              M = function() { f.find(".dd-c").addClass("dd-alert").removeClass("dd-" + p.init_animation), setTimeout(function() { f.find(".dd-c").removeClass("dd-alert") }, 500) },
              x = function() { if (p.lock) { var d = Date.parse(t + "-" + (o + 1) + "-" + n) / 1e3,
                    a = Date.parse(e + "-" + i + "-" + s) / 1e3; if ("from" == p.lock) { if (d > a) return M(), !1 } else if (a > d) return M(), !1 } var r = new Date(i + "/" + s + "/" + e),
                  r = r.getDay(),
                  l = p.format.replace(/\b(d)\b/g, m(s)).replace(/\b(m)\b/g, m(i)).replace(/\b(Y)\b/g, e).replace(/\b(D)\b/g, k[r].substr(0, 3)).replace(/\b(l)\b/g, k[r]).replace(/\b(F)\b/g, y[i - 1]).replace(/\b(M)\b/g, y[i - 1].substr(0, 3)).replace(/\b(n)\b/g, i).replace(/\b(j)\b/g, s);
                c.val(l), f.find(".dd-c").addClass("dd-fadeout").removeClass("dd-" + p.init_animation), h = setTimeout(function() { f.hide(), f.find(".dd-c").removeClass("dd-fadeout") }, 400), c.change() },
              D = function(a) { f.find(".dd-s-b-s-y ul").empty(); var i = parseInt(a),
                  s = i + (p.yearsRange - 1);
                s > p.maxYear && (s = p.maxYear); for (var t = i; s >= t; t++) { if (t % p.yearsRange == 0) var n = t;
                  f.find(".dd-s-b-s-y ul").append('<li data-id="' + t + '" data-filter="' + n + '">' + t + "</li>") } f.find(".dd-s-b-s-y ul").append('<div class="dd-clear"></div>'), r = parseInt(a), f.find(".dd-sub-y .dd-ul").scrollLeft(f.find('.dd-sub-y li[data-id="' + r + '"]').index() * p.dropWidth), f.find(".dd-s-b-s-y li").each(function(a, i) { d(this).click(function() { f.find(".dd-s-b-s-y li").removeClass("dd-on"), d(this).addClass("dd-on"), e = parseInt(d(this).attr("data-id")), f.find(".dd-s-b-y,.dd-s-b-s-y").removeClass("dd-show"), f.find(".dd-s-b-s,.dd-sub-y").hide(), w() }) }) },
              j = function() { f.find(".dd-s-b").each(function(a, e) { var r = d(this),
                    t = 0; if (r.hasClass("dd-s-b-m") || r.hasClass("dd-s-b-d")) { if (r.hasClass("dd-s-b-m"))
                      for (var n = 12, o = t; n > o; o++) r.find("ul").append('<li data-id="' + (o + 1) + '">' + y[o].substr(0, 3) + "<span>" + m(o + 1) + "</span></li>"); if (r.hasClass("dd-s-b-d"))
                      for (var n = 31, o = t; n > o; o++) r.find("ul").append('<li data-id="' + (o + 1) + '">' + m(o + 1) + "<span></span></li>") } if (r.hasClass("dd-s-b-y"))
                    for (var o = p.minYear; o <= p.maxYear; o++) o % p.yearsRange == 0 && r.find("ul").append('<li data-id="' + o + '">' + o + "</li>");
                  r.find("ul").append('<div class="dd-clear"></div>'), r.find("ul li").click(function() {
                    (r.hasClass("dd-s-b-m") || r.hasClass("dd-s-b-d")) && (r.hasClass("dd-s-b-m") && (i = parseInt(d(this).attr("data-id"))), r.hasClass("dd-s-b-d") && (s = parseInt(d(this).attr("data-id"))), w(), r.removeClass("dd-show"), f.find(".dd-s-b-s").hide()), r.hasClass("dd-s-b-y") && (f.find(".dd-sub-y").show(), D(d(this).attr("data-id")), f.find(".dd-s-b-s-y").addClass("dd-show")) }); var l = 0,
                    u = !1;
                  r.on("mousewheel DOMMouseScroll", function(d) { u = !0, (d.originalEvent.wheelDeltaY < 0 || d.originalEvent.detail > 0) && (l = r.scrollTop() + 100), (d.originalEvent.wheelDeltaY > 0 || d.originalEvent.detail < 0) && (l = r.scrollTop() - 100), r.stop().animate({ scrollTop: l }, 600, "_dd_easing", function() { u = !1 }) }).on("scroll", function() { u || (l = r.scrollTop()) }) }), f.find(".dd-b").each(function(a, t) { var n, o = d(this),
                    l = 0; if (o.hasClass("dd-m")) { for (var u = 0; 12 > u; u++) o.find("ul").append('<li data-id="' + (u + 1) + '">' + y[u].substr(0, 3) + "</li>");
                    o.find("li").click(function() { return "m" == p.format || "n" == p.format || "F" == p.format || "M" == p.format ? !1 : void f.find(".dd-s-b-m").addClass("dd-show") }) } if (o.hasClass("dd-d")) { for (var u = 1; 31 >= u; u++) o.find("ul").append('<li data-id="' + u + '"><strong>' + m(u) + "</strong><br><span></span></li>");
                    o.find("li").click(function() { f.find(".dd-s-b-d").addClass("dd-show") }) } if (o.hasClass("dd-y")) { for (var u = p.minYear; u <= p.maxYear; u++) { var c;
                      u % p.yearsRange == 0 && (c = 'data-filter="' + u + '"'), o.find("ul").append('<li data-id="' + u + '" ' + c + ">" + u + "</li>") } o.find("li").click(function() { return "Y" == p.format ? !1 : void f.find(".dd-s-b-y").addClass("dd-show") }) } if (o.hasClass("dd-sub-y"))
                    for (var u = p.minYear; u <= p.maxYear; u++) u % p.yearsRange == 0 && o.find("ul").append('<li data-id="' + u + '">' + u + "</li>");
                  o.find("ul").width(o.find("li").length * p.dropWidth), o.find(".dd-n").click(function() { clearInterval(n); var a, t, l;
                    o.hasClass("dd-y") && (t = e), o.hasClass("dd-m") && (t = i), o.hasClass("dd-d") && (t = s), o.hasClass("dd-sub-y") && (t = r), d(this).hasClass("dd-n-left") ? (a = o.find('li[data-id="' + t + '"]').prev("li"), l = a.length && a.is(":visible") ? parseInt(a.attr("data-id")) : parseInt(o.find("li:visible:last").attr("data-id"))) : (a = o.find('li[data-id="' + t + '"]').next("li"), l = a.length && a.is(":visible") ? parseInt(a.attr("data-id")) : parseInt(o.find("li:first").attr("data-id"))), o.hasClass("dd-y") && (e = l), o.hasClass("dd-m") && (i = l), o.hasClass("dd-d") && (s = l), o.hasClass("dd-sub-y") && (r = l), w() }); var b = function() { if (v) { l = Math.round(o.find(".dd-ul").scrollLeft() / p.dropWidth); var d = parseInt(o.find("li").eq(l).attr("data-id"));
                      o.hasClass("dd-y") && (e = d), o.hasClass("dd-m") && (i = d), o.hasClass("dd-d") && (s = d), o.hasClass("dd-sub-y") && (r = d) } };
                  o.find(".dd-ul").on("scroll", function() { b() }); var h = !1;
                  o.find(".dd-ul").on("mousedown touchstart", function() { h || (h = !0), clearInterval(n), d(window).on("mouseup touchend touchmove", function() { h && (clearInterval(n), n = setTimeout(function() { w(), h = !1 }, 780)) }) }), "Y" == p.format && f.find(".dd-m,.dd-d").hide(), ("m" == p.format || "n" == p.format || "F" == p.format || "M" == p.format) && f.find(".dd-y,.dd-d").hide() }), f.find(".dd-b li").click(function() { return "m" == p.format || "n" == p.format || "F" == p.format || "M" == p.format || "Y" == p.format ? !1 : void f.find(".dd-s-b-s").show() }), f.find(".dd-s-b-s").click(function() { f.find(".dd-s-b").removeClass("dd-show"), f.find(".dd-s-b-s").hide() }), f.find(".dd-s").click(function() { x() }), f.find(".dd-o").click(function() { f.find(".dd-c").addClass("dd-fadeout").removeClass("dd-" + p.init_animation), h = setTimeout(function() { f.hide(), f.find(".dd-c").removeClass("dd-fadeout") }, 400) }), w() },
              z = function() { clearInterval(h), f.hasClass("dd-init") && (c.attr({ readonly: "readonly" }).blur(), i = o + 1, s = n, e = t, parseInt(c.attr("data-d")) && parseInt(c.attr("data-d")) <= 31 && (s = parseInt(c.attr("data-d"))), parseInt(c.attr("data-m")) && parseInt(c.attr("data-m")) <= 11 && (i = parseInt(c.attr("data-m")) + 1), parseInt(c.attr("data-y")) && 4 == c.attr("data-y").length && (e = parseInt(c.attr("data-y"))), e > p.maxYear && (p.maxYear = e), e < p.minYear && (p.minYear = e), j()), f.show(), C() };
            c.click(function() { z() }), c.bind("focusin focus", function(d) { d.preventDefault() }), d(window).resize(function() { C() }) } }) } }(jQuery);

// 样式 2 - http://felicegattuso.com/projects/datedropper/
(function($) {
  var
    // CSS EVENT DETECT
    csse = {
      t : 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
      a : 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend'
    },
    // I18N
    i18n = {
      'en' : {
        name : 'English',
        gregorian : false,
        months : {
          short: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'June',
            'July',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec'
          ],
          full : [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ]
        },
        weekdays : {
          short : [
            'S',
            'M',
            'T',
            'W',
            'T',
            'F',
            'S'
          ],
          full : [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ]
        }
      },
      'ka' : {
        name : 'Georgian',
        gregorian : false,
        months : {
          short: [
            'იან',
            'თებ',
            'მარტ',
            'აპრ',
            'მაი',
            'ივნ',
            'ივლ',
            'აგვ',
            'სექტ',
            'ოქტ',
            'ნოემბ',
            'დეკ'
          ],
          full : [
            'იანვარი',
            'თებერვალი',
            'მარტი',
            'აპრილი',
            'მაისი',
            'ივნისი',
            'ივლისი',
            'აგვისტო',
            'სექტემბერი',
            'ოქტომბერი',
            'ნოემბერი',
            'დეკემბერი'
          ]
        },
        weekdays : {
          short : [
            'კვ',
            'ორ',
            'სამ',
            'ოთხ',
            'ხუთ',
            'პარ',
            'შაბ'
          ],
          full : [
            'კვირა',
            'ორშაბათი',
            'სამშაბათი',
            'ოთხშაბათი',
            'ხუთშაბათი',
            'პარასკევი',
            'შაბათი'
          ]
        }
      },//
      'it' : {
        name : 'Italiano',
        gregorian : true,
        months : {
          short: [
            'Gen',
            'Feb',
            'Mar',
            'Apr',
            'Mag',
            'Giu',
            'Lug',
            'Ago',
            'Set',
            'Ott',
            'Nov',
            'Dic'
          ],
          full : [
            'Gennaio',
            'Febbraio',
            'Marzo',
            'Aprile',
            'Maggio',
            'Giugno',
            'Luglio',
            'Agosto',
            'Settembre',
            'Ottobre',
            'Novembre',
            'Dicembre'
          ]
        },
        weekdays : {
          short : [
            'D',
            'L',
            'M',
            'M',
            'G',
            'V',
            'S'
          ],
          full : [
            'Domenica',
            'Lunedì',
            'Martedì',
            'Mercoledì',
            'Giovedì',
            'Venerdì',
            'Sabato'
          ]
        }
      },
      'fr' : {
        name : 'Français',
        gregorian : true,
        months : {
          short: [
            'Jan',
            'Fév',
            'Mar',
            'Avr',
            'Mai',
            'Jui',
            'Jui',
            'Aoû',
            'Sep',
            'Oct',
            'Nov',
            'Déc'
          ],
          full : [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
          ]
        },
        weekdays : {
          short : [
            'D',
            'L',
            'M',
            'M',
            'J',
            'V',
            'S'
          ],
          full : [
            'Dimanche',
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi'
          ]
        }
      },
      'zh' : {
        name : '中文',
        gregorian : true,
        months : {
          short: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ],
          full : [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ]
        },
        weekdays : {
          short : [
            '天',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六'
          ],
          full : [
            '星期天',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'
          ]
        }
      },
      'ar' : {
        name : 'العَرَبِيَّة',
        gregorian : false,
        months : {
          short: [
            'جانفي',
            'فيفري',
            'مارس',
            'أفريل',
            'ماي',
            'جوان',
            'جويلية',
            'أوت',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر'
          ],
          full : [
            'جانفي',
            'فيفري',
            'مارس',
            'أفريل',
            'ماي',
            'جوان',
            'جويلية',
            'أوت',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر'
          ]
        },
        weekdays : {
          short : [
            'S',
            'M',
            'T',
            'W',
            'T',
            'F',
            'S'
          ],
          full : [
            'الأحد',
            'الإثنين',
            'الثلثاء',
            'الأربعاء',
            'الخميس',
            'الجمعة',
            'السبت'
          ]
        }
      },
      'fa' : {
        name : 'فارسی',
        gregorian : false,
        months : {
          short: [
            'ژانویه',
            'فووریه',
            'مارچ',
            'آپریل',
            'می',
            'جون',
            'جولای',
            'آگوست',
            'سپتامبر',
            'اکتبر',
            'نوامبر',
            'دسامبر'
          ],
          full : [
            'ژانویه',
            'فووریه',
            'مارچ',
            'آپریل',
            'می',
            'جون',
            'جولای',
            'آگوست',
            'سپتامبر',
            'اکتبر',
            'نوامبر',
            'دسامبر'
          ]
        },
        weekdays : {
          short : [
            'S',
            'M',
            'T',
            'W',
            'T',
            'F',
            'S'
          ],
          full : [
            'یکشنبه',
            'دوشنبه',
            'سه شنبه',
            'چهارشنبه',
            'پنج شنبه',
            'جمعه',
            'شنبه'
          ]
        }
      },
      'hu' : {
        name : 'Hungarian',
        gregorian : true,
        months : {
          short: [
            "jan",
            "feb",
            "már",
            "ápr",
            "máj",
            "jún",
            "júl",
            "aug",
            "sze",
            "okt",
            "nov",
            "dec"
          ],
          full : [
            "január",
            "február",
            "március",
            "április",
            "május",
            "június",
            "július",
            "augusztus",
            "szeptember",
            "október",
            "november",
            "december"
          ]
        },
        weekdays : {
          short : [
            'v',
            'h',
            'k',
            's',
            'c',
            'p',
            's'
          ],
          full : [
            'vasárnap',
            'hétfő',
            'kedd',
            'szerda',
            'csütörtök',
            'péntek',
            'szombat'
          ]
        }
      },
      'gr' : {
        name : 'Ελληνικά',
        gregorian : true,
        months : {
          short: [
            "Ιαν",
            "Φεβ",
            "Μάρ",
            "Απρ",
            "Μάι",
            "Ιούν",
            "Ιούλ",
            "Αύγ",
            "Σεπ",
            "Οκτ",
            "Νοέ",
            "Δεκ"
          ],
          full : [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος"
          ]
        },
        weekdays : {
          short : [
            'Κ',
            'Δ',
            'Τ',
            'Τ',
            'Π',
            'Π',
            'Σ'
          ],
          full : [
            'Κυριακή',
            'Δευτέρα',
            'Τρίτη',
            'Τετάρτη',
            'Πέμπτη',
            'Παρασκευή',
            'Σάββατο'
          ]
        }
      },
      'es' : {
        name : 'Español',
        gregorian : true,
        months : {
          short: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
          ],
          full : [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ]
        },
        weekdays : {
          short : [
            'D',
            'L',
            'M',
            'X',
            'J',
            'V',
            'S'
          ],
          full : [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
          ]
        }
      },
      'da' : {
        name : 'Dansk',
        gregorian : true,
        months : {
          short: [
            "jan",
            "feb",
            "mar",
            "apr",
            "maj",
            "jun",
            "jul",
            "aug",
            "sep",
            "okt",
            "nov",
            "dec"
          ],
          full : [
            "januar",
            "februar",
            "marts",
            "april",
            "maj",
            "juni",
            "juli",
            "august",
            "september",
            "oktober",
            "november",
            "december"
          ]
        },
        weekdays : {
          short : [
            's',
            'm',
            't',
            'o',
            't',
            'f',
            'l'
          ],
          full : [
            'søndag',
            'mandag',
            'tirsdag',
            'onsdag',
            'torsdag',
            'fredag',
            'lørdag'
          ]
        }
      },
      'de' : {
        name : 'Deutsch',
        gregorian : true,
        months : {
          short: [
            "Jan",
            "Feb",
            "Mär",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dez"
          ],
          full : [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember"
          ]
        },
        weekdays : {
          short : [
            'S',
            'M',
            'D',
            'M',
            'D',
            'F',
            'S'
          ],
          full : [
            'Sonntag',
            'Montag',
            'Dienstag',
            'Mittwoch',
            'Donnerstag',
            'Freitag',
            'Samstag'
          ]
        }
      },
      'nl' : {
        name : 'Nederlands',
        gregorian : true,
        months : {
          short: [
            "jan",
            "feb",
            "maa",
            "apr",
            "mei",
            "jun",
            "jul",
            "aug",
            "sep",
            "okt",
            "nov",
            "dec"
          ],
          full : [
            "januari",
            "februari",
            "maart",
            "april",
            "mei",
            "juni",
            "juli",
            "augustus",
            "september",
            "oktober",
            "november",
            "december"
          ]
        },
        weekdays : {
          short : [
            'z',
            'm',
            'd',
            'w',
            'd',
            'v',
            'z'
          ],
          full : [
            'zondag',
            'maandag',
            'dinsdag',
            'woensdag',
            'donderdag',
            'vrijdag',
            'zaterdag'
          ]
        }
      },
      'pl' : {
        name : 'język polski',
        gregorian : true,
        months : {
          short: [
            "sty",
            "lut",
            "mar",
            "kwi",
            "maj",
            "cze",
            "lip",
            "sie",
            "wrz",
            "paź",
            "lis",
            "gru"
          ],
          full : [
            "styczeń",
            "luty",
            "marzec",
            "kwiecień",
            "maj",
            "czerwiec",
            "lipiec",
            "sierpień",
            "wrzesień",
            "październik",
            "listopad",
            "grudzień"
          ]
        },
        weekdays : {
          short : [
            'n',
            'p',
            'w',
            'ś',
            'c',
            'p',
            's'
          ],
          full : [
            'niedziela',
            'poniedziałek',
            'wtorek',
            'środa',
            'czwartek',
            'piątek',
            'sobota'
          ]
        }
      },
      'pt' : {
        name : 'Português',
        gregorian : true,
        months : {
          short: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
          ],
          full : [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
          ]
        },
        weekdays : {
          short : [
            "D",
            "S",
            "T",
            "Q",
            "Q",
            "S",
            "S"
          ],
          full : [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado"
          ]
        }
      },
      'si' : {
        name : 'Slovenščina',
        gregorian : true,
        months : {
          short: [
            "jan",
            "feb",
            "mar",
            "apr",
            "maj",
            "jun",
            "jul",
            "avg",
            "sep",
            "okt",
            "nov",
            "dec"
          ],
          full : [
            "januar",
            "februar",
            "marec",
            "april",
            "maj",
            "junij",
            "julij",
            "avgust",
            "september",
            "oktober",
            "november",
            "december"
          ]
        },
        weekdays : {
          short : [
            'n',
            'p',
            't',
            's',
            'č',
            'p',
            's'
          ],
          full : [
            'nedelja',
            'ponedeljek',
            'torek',
            'sreda',
            'četrtek',
            'petek',
            'sobota'
          ]
        }
      },
      'uk' : {
        name : 'українська мова',
        gregorian : true,
        months : {
          short: [
            "січень",
            "лютий",
            "березень",
            "квітень",
            "травень",
            "червень",
            "липень",
            "серпень",
            "вересень",
            "жовтень",
            "листопад",
            "грудень"
          ],
          full : [
            "січень",
            "лютий",
            "березень",
            "квітень",
            "травень",
            "червень",
            "липень",
            "серпень",
            "вересень",
            "жовтень",
            "листопад",
            "грудень"
          ]
        },
        weekdays : {
          short : [
            'н',
            'п',
            'в',
            'с',
            'ч',
            'п',
            'с'
          ],
          full : [
            'неділя',
            'понеділок',
            'вівторок',
            'середа',
            'четвер',
            'п\'ятниця',
            'субота'
          ]
        }
      },
      'ru' : {
        name : 'русский язык',
        gregorian : true,
        months : {
          short: [
            "январь",
            "февраль",
            "март",
            "апрель",
            "май",
            "июнь",
            "июль",
            "август",
            "сентябрь",
            "октябрь",
            "ноябрь",
            "декабрь"
          ],
          full : [
            "январь",
            "февраль",
            "март",
            "апрель",
            "май",
            "июнь",
            "июль",
            "август",
            "сентябрь",
            "октябрь",
            "ноябрь",
            "декабрь"
          ]
        },
        weekdays : {
          short : [
            'в',
            'п',
            'в',
            'с',
            'ч',
            'п',
            'с'
          ],
          full : [
            'воскресенье',
            'понедельник',
            'вторник',
            'среда',
            'четверг',
            'пятница',
            'суббота'
          ]
        }
      },
      'tr' : {
        name : 'Türkçe',
        gregorian : true,
        months : {
          short: [
            "Oca",
            "Şub",
            "Mar",
            "Nis",
            "May",
            "Haz",
            "Tem",
            "Ağu",
            "Eyl",
            "Eki",
            "Kas",
            "Ara"
          ],
          full : [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
          ]
        },
        weekdays : {
          short : [
            'P',
            'P',
            'S',
            'Ç',
            'P',
            'C',
            'C'
          ],
          full : [
            'Pazar',
            'Pazartesi',
            'Sali',
            'Çarşamba',
            'Perşembe',
            'Cuma',
            'Cumartesi'
          ]
        }
      },
      'ko' : {
        name : '조선말',
        gregorian : true,
        months : {
          short: [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월"
          ],
          full : [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월"
          ]
        },
        weekdays : {
          short : [
            '일',
            '월',
            '화',
            '수',
            '목',
            '금',
            '토'
          ],
          full : [
            '일요일',
            '월요일',
            '화요일',
            '수요일',
            '목요일',
            '금요일',
            '토요일'
          ]
        }
      },
      'fi' : {
        name : 'suomen kieli',
        gregorian : true,
        months : {
          short: [
            "Tam",
            "Hel",
            "Maa",
            "Huh",
            "Tou",
            "Kes",
            "Hei",
            "Elo",
            "Syy",
            "Lok",
            "Mar",
            "Jou"
          ],
          full : [
            "Tammikuu",
            "Helmikuu",
            "Maaliskuu",
            "Huhtikuu",
            "Toukokuu",
            "Kesäkuu",
            "Heinäkuu",
            "Elokuu",
            "Syyskuu",
            "Lokakuu",
            "Marraskuu",
            "Joulukuu"
          ]
        },
        weekdays : {
          short : [
            'S',
            'M',
            'T',
            'K',
            'T',
            'P',
            'L'
          ],
          full : [
            'Sunnuntai',
            'Maanantai',
            'Tiistai',
            'Keskiviikko',
            'Torstai',
            'Perjantai',
            'Lauantai'
          ]
        }
      },
      'vi':{
        name:'Tiếng việt',
        gregorian:false,
        months:{
          short:[
            'Th.01',
            'Th.02',
            'Th.03',
            'Th.04',
            'Th.05',
            'Th.06',
            'Th.07',
            'Th.08',
            'Th.09',
            'Th.10',
            'Th.11',
            'Th.12'
          ],
          full:[
            'Tháng 01',
            'Tháng 02',
            'Tháng 03',
            'Tháng 04',
            'Tháng 05',
            'Tháng 06',
            'Tháng 07',
            'Tháng 08',
            'Tháng 09',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12'
          ]
        },
        weekdays:{
          short:[
            'CN',
            'T2',
            'T3',
            'T4',
            'T5',
            'T6',
            'T7'
          ],
          full:[
            'Chủ nhật',
            'Thứ hai',
            'Thứ ba',
            'Thứ tư',
            'Thứ năm',
            'Thứ sáu',
            'Thứ bảy'
          ]
        }
      }
    },

    // MAIN VARS

    pickers = {},
    picker = null,
    picker_ctrl = false,
    pick_dragged = null,
    pick_drag_offset = null,
    pick_drag_temp = null,

    // CHECK FUNCTIONS

    is_click = false,
    is_ie = function() {
      var
        n = navigator.userAgent.toLowerCase();
      return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },
    is_touch = function() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
      else
        return false;
    },
    is_fx_mobile = function() {
      if(picker&&pickers[picker.id].fx&&!pickers[picker.id].fxmobile) {
        if($(window).width()<480)
          picker.element.removeClass('picker-fxs');
        else
          picker.element.addClass('picker-fxs')
      }
    },
    is_jumpable = function() {
      if( pickers[picker.id].jump >= pickers[picker.id].key.y.max - pickers[picker.id].key.y.min )
        return false;
      else
        return true;
    },
    is_locked = function() {
      var
        unix_current = get_unix(get_current_full()),
        unix_today = get_unix(get_today_full());

      if(pickers[picker.id].lock) {
        if(pickers[picker.id].lock=='from') {
          if(unix_current<unix_today) {
            picker_alrt();
            picker.element.addClass('picker-lkd');
            return true;
          }
          else {
            picker.element.removeClass('picker-lkd');
            return false;
          }
        }
        if(pickers[picker.id].lock=='to') {
          if(unix_current>unix_today) {
            picker_alrt();
            picker.element.addClass('picker-lkd');
            return true;
          }
          else {
            picker.element.removeClass('picker-lkd');
            return false;
          }
        }
      }

      if(pickers[picker.id].disabledays) {
        if(pickers[picker.id].disabledays.indexOf(unix_current) != -1) {
          picker_alrt();
          picker.element.addClass('picker-lkd');
          return true;
        }
        else {
          picker.element.removeClass('picker-lkd');
          return false;
        }
      }
    },
    is_int = function(n) {
      return n % 1 === 0;
    },
    is_date = function(value) {
      var
        format = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
      return format.test(value);
    },

    // REST FUNCTIONS

    get_current = function(k){
      return parseInt(pickers[picker.id].key[k].current);
    },
    get_today = function(k){
      return parseInt(pickers[picker.id].key[k].today);
    },
    get_today_full = function() {
      return get_today('m')+'/'+get_today('d')+'/'+get_today('y');
    },
    get_current_full = function() {
      return get_current('m')+'/'+get_current('d')+'/'+get_current('y');
    },
    get_jumped = function(k,val) {
      var
        a = [],
        key_values = pickers[picker.id].key[k];
      for (var i = key_values.min; i <= key_values.max; i++)
        if (i%val == 0)
          a.push(i);
      return a;
    },
    get_closest_jumped = function(int,arr) {
      var c = arr[0];
      var d = Math.abs (int - c);
      for (var i = 0; i < arr.length; i++) {
        var n = Math.abs (int - arr[i]);
        if (n < d) {
          d = n;
          c = arr[i];
        }
      }
      return c;
    },
    get_clear = function(k,n){
      var
        key_values = pickers[picker.id].key[k];
      if( n > key_values.max )
        return get_clear( k , (n-key_values.max)+(key_values.min-1) );
      else if( n < key_values.min )
        return get_clear( k , (n+1) + (key_values.max - key_values.min));
      else
        return n;
    },
    get_days_array = function() {
      if(i18n[pickers[picker.id].lang].gregorian)
        return [1,2,3,4,5,6,0];
      else
        return [0,1,2,3,4,5,6];
    },
    get_ul = function(k) {
      return get_picker_els('ul.pick[data-k="'+k+'"]');
    },
    get_eq = function(k,d) {
      ul = get_ul(k);
      var
        o = [];

      ul.find('li').each(function(){
        o.push($(this).attr('value'));
      });

      if(d=='last')
        return o[o.length-1];
      else
        return o[0];

    },
    get_picker_els = function(el) {
      if(picker)
        return picker.element.find(el);
    },
    get_unix = function(d) {
      return Date.parse(d) / 1000;
    },

    // RENDER FUNCTIONS

    picker_large_onoff = function() {
      if(pickers[picker.id].large) {
        picker.element.toggleClass('picker-lg');
        picker_render_calendar();
      }
    },
    picker_translate_onoff = function() {
      get_picker_els('ul.pick.pick-l').toggleClass('visible');
    },
    picker_offset = function(){
      if(!picker.element.hasClass('picker-modal')){
        var
          input = picker.input,
          left = input.offset().left + input.outerWidth()/2,
          top = input.offset().top + input.outerHeight();
        picker.element.css({
          'left' : left,
          'top' : top
        });
      }
    },
    picker_translate = function(v) {
      pickers[picker.id].lang = Object.keys(i18n)[v];
      picker_set_lang();
      picker_set();
    },
    picker_set_lang = function() {
      var
        picker_day_offset = get_days_array();
      get_picker_els('.pick-lg .pick-lg-h li').each(function(i){
        $(this).html(i18n[pickers[picker.id].lang].weekdays.short[picker_day_offset[i]]);
      });
      get_picker_els('ul.pick.pick-m li').each(function(){
        $(this).html(i18n[pickers[picker.id].lang].months.short[$(this).attr('value')-1]);
      });
    },
    picker_show = function() {
      picker.element.addClass('picker-focus');
    },
    picker_hide = function() {
      if(!is_locked()) {
        picker.element.removeClass('picker-focus');
        if(picker.element.hasClass('picker-modal'))
          $('.picker-modal-overlay').addClass('tohide');
        picker = null;
      }
      picker_ctrl = false;
    },
    picker_render_ul = function(k){
      var
        ul = get_ul(k),
        key_values = pickers[picker.id].key[k];

      //CURRENT VALUE
      pickers[picker.id].key[k].current = key_values.today < key_values.min && key_values.min || key_values.today;

      for (i = key_values.min; i <= key_values.max; i++) {
        var
          html = i;

        if(k=='m')
          html = i18n[pickers[picker.id].lang].months.short[i-1];
        if(k=='l')
          html = i18n[Object.keys(i18n)[i]].name;

        html += k=='d' ? '<span></span>' : '';

        $('<li>', {
          value: i,
          html: html
        })
        .appendTo(ul)
      }

      //PREV BUTTON
      $('<div>', {
        class: 'pick-arw pick-arw-s1 pick-arw-l',
        html: $('<i>', {
          class: 'pick-i-l'
        })
      })
      .appendTo(ul);

      //NEXT BUTTON
      $('<div>', {
        class: 'pick-arw pick-arw-s1 pick-arw-r',
        html: $('<i>', {
          class: 'pick-i-r'
        })
      })
      .appendTo(ul);

      if(k=='y') {

        //PREV BUTTON
        $('<div>', {
          class: 'pick-arw pick-arw-s2 pick-arw-l',
          html: $('<i>', {
            class: 'pick-i-l'
          })
        })
        .appendTo(ul);

        //NEXT BUTTON
        $('<div>', {
          class: 'pick-arw pick-arw-s2 pick-arw-r',
          html: $('<i>', {
            class: 'pick-i-r'
          })
        })
        .appendTo(ul);

      }

      picker_ul_transition(k,get_current(k));

    },
    picker_render_calendar = function() {

      var
        index = 0,
        w = get_picker_els('.pick-lg-b');

      w.find('li')
      .empty()
      .removeClass('pick-n pick-b pick-a pick-v pick-lk pick-sl pick-h')
      .attr('data-value','');

      var
        _C = new Date(get_current_full()),
        _S = new Date(get_current_full()),
        _L = new Date(get_current_full()),
        _NUM = function(d){
          var
            m = d.getMonth(),
            y = d.getFullYear();
          var l = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
          return [31, (l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
        };

      _L.setMonth(_L.getMonth()-1);
      _S.setDate(1);

      var
        o = _S.getDay()-1;
        if(o<0)
          o = 6;
        if(i18n[pickers[picker.id].lang].gregorian) {
          o--;
          if(o<0)
            o=6;
        }

      //before
      for(var i = _NUM(_L)-o ; i <= _NUM(_L) ; i++) {
        w.find('li').eq(index)
        .html(i)
        .addClass('pick-b pick-n pick-h');
        index++;
      }
      //current
      for(var i = 1 ; i <= _NUM(_S) ; i++) {
        w.find('li').eq(index)
        .html(i)
        .addClass('pick-n pick-v')
        .attr('data-value',i);
        index++;
      }
      //after
      if(w.find('li.pick-n').length < 42) {
        var
          e = 42 - w.find('li.pick-n').length;
        for(var i = 1 ; i <= e; i++) {
          w.find('li').eq(index).html(i)
          .addClass('pick-a pick-n pick-h');
          index++;
        }
      }
      if(pickers[picker.id].lock) {
        if(pickers[picker.id].lock==='from') {
          if(get_current('y')<=get_today('y')) {
            if(get_current('m')==get_today('m')) {
              get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="'+get_today('d')+'"]')
              .prevAll('li')
              .addClass('pick-lk')
            }
            else {
              if(get_current('m')<get_today('m')) {
                get_picker_els('.pick-lg .pick-lg-b li')
                .addClass('pick-lk')
              }
              else if(get_current('m')>get_today('m')&&get_current('y')<get_today('y')) {
                get_picker_els('.pick-lg .pick-lg-b li')
                .addClass('pick-lk')
              }
            }
          }
        }
        else {
          if(get_current('y')>=get_today('y')) {
            if(get_current('m')==get_today('m')) {
              get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="'+get_today('d')+'"]')
              .nextAll('li')
              .addClass('pick-lk')
            }
            else {
              if(get_current('m')>get_today('m')) {
                get_picker_els('.pick-lg .pick-lg-b li')
                .addClass('pick-lk')
              }
              else if(get_current('m')<get_today('m')&&get_current('y')>get_today('y')) {
                get_picker_els('.pick-lg .pick-lg-b li')
                .addClass('pick-lk')
              }
            }
          }
        }
      }
      if(pickers[picker.id].disabledays) {
        $.each(pickers[picker.id].disabledays, function( i, v ) {
          if(v&&is_date(v)) {
            var
              d = new Date(v*1000);
            if(d.getMonth()+1==get_current('m')&&d.getFullYear()==get_current('y'))
              get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="'+d.getDate()+'"]')
              .addClass('pick-lk');
          }
        });
      }

      get_picker_els('.pick-lg-b li.pick-v[data-value='+get_current('d')+']').addClass('pick-sl');

    },
    picker_fills = function() {

      var
        m = get_current('m'),
        y = get_current('y'),
        l = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));

      pickers[picker.id].key['d'].max =  [31, (l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m-1];

      if(get_current('d')>pickers[picker.id].key['d'].max) {
        pickers[picker.id].key['d'].current = pickers[picker.id].key['d'].max;
        picker_ul_transition('d',get_current('d'));
      }

      get_picker_els('.pick-d li')
      .removeClass('pick-wke')
      .each(function() {
        var
          d = new Date(m+"/"+$(this).attr('value')+"/"+y).getDay();

        $(this)
        .find('span')
        .html(i18n[pickers[picker.id].lang].weekdays.full[d]);

        if(d==0||d==6)
          $(this).addClass('pick-wke');

      });

      if(picker.element.hasClass('picker-lg')) {
        get_picker_els('.pick-lg-b li').removeClass('pick-wke');
        get_picker_els('.pick-lg-b li.pick-v')
        .each(function() {
          var
            d = new Date(m+"/"+$(this).attr('data-value')+"/"+y).getDay();
          if(d==0||d==6)
            $(this).addClass('pick-wke');

        });
      }

    },
    picker_set = function() {
      if(picker.element.hasClass('picker-lg'))
        picker_render_calendar();
      picker_fills();
      input_change_value();
    },

    // ACTION FUNCTIONS

    picker_ul_transition = function(k,i) {

      var
        ul = get_ul(k);

      ul.find('li').removeClass('pick-sl pick-bfr pick-afr');

      if(i==get_eq(k,'last')) {
        var li = ul.find('li[value="'+get_eq(k,'first')+'"]');
        li.clone().insertAfter(ul.find('li[value='+i+']'));
        li.remove();
      }
      if(i==get_eq(k,'first')) {
        var li = ul.find('li[value="'+get_eq(k,'last')+'"]');
        li.clone().insertBefore(ul.find('li[value='+i+']'));
        li.remove();
      }

      ul.find('li[value='+i+']').addClass('pick-sl');
      ul.find('li.pick-sl').nextAll('li').addClass('pick-afr');
      ul.find('li.pick-sl').prevAll('li').addClass('pick-bfr');

    },
    picker_values_increase = function(k,v) {

      var
        key_values = pickers[picker.id].key[k];

      if(v>key_values.max) {
        if(k=='d')
          picker_ul_turn('m','right');
        if(k=='m')
          picker_ul_turn('y','right');
        v = key_values.min;
      }
      if(v<key_values.min) {
        if(k=='d')
          picker_ul_turn('m','left');
        if(k=='m')
          picker_ul_turn('y','left');
        v = key_values.max;
      }
      pickers[picker.id].key[k].current = v;
      picker_ul_transition(k,v);

    },
    picker_ul_turn = function(k,d) {
      var
        v = get_current(k);
      if(d=='right')
        v++;
      else
        v--;
      picker_values_increase(k,v);
    },
    picker_alrt = function() {
      picker.element
      .addClass('picker-rmbl');
    },

    /* INPUT FUNCTIONS */

    input_fill = function(n) {
      return n < 10 ? '0' + n : n
    },
    input_ordinal_suffix = function(n) {
      var
        s=["th","st","nd","rd"],
        v=n%100;
      return n+(s[(v-20)%10]||s[v]||s[0]);
    },
    input_change_value = function() {

      if(!is_locked()&&picker_ctrl) {

        var
          d = get_current('d'),
          m = get_current('m'),
          y = get_current('y'),
          get_day = new Date(m+"/"+d+"/"+y).getDay(),

          str =
          pickers[picker.id].format
          .replace(/\b(d)\b/g, input_fill(d))
          .replace(/\b(m)\b/g, input_fill(m))
          .replace(/\b(S)\b/g, input_ordinal_suffix(d)) //new
          .replace(/\b(Y)\b/g, y)
          .replace(/\b(U)\b/g, get_unix(get_current_full())) //new
          .replace(/\b(D)\b/g, i18n[pickers[picker.id].lang].weekdays.short[get_day])
          .replace(/\b(l)\b/g, i18n[pickers[picker.id].lang].weekdays.full[get_day])
          .replace(/\b(F)\b/g, i18n[pickers[picker.id].lang].months.full[m-1])
          .replace(/\b(M)\b/g, i18n[pickers[picker.id].lang].months.short[m-1])
          .replace(/\b(n)\b/g, m)
          .replace(/\b(j)\b/g, d);

        picker
        .input
        .val(str)
        .change();

        picker_ctrl = false;

      }

    };

  // GET UI EVENT

  if(is_touch())
    var
      ui_event = {
        i : 'touchstart',
        m : 'touchmove',
        e : 'touchend'
      }
  else
    var
      ui_event = {
        i : 'mousedown',
        m : 'mousemove',
        e : 'mouseup'
      }


  var
    picker_node_el = 'div.datedropper.picker-focus';

  $(document)


  //CLOSE PICKER
  .on('click',function(e) {
    if(picker) {
      if(!picker.input.is(e.target) && !picker.element.is(e.target) && picker.element.has(e.target).length === 0) {
        picker_hide();
        pick_dragged = null;
      }
    }
  })

  //LOCK ANIMATION
  .on(csse.a,picker_node_el + '.picker-rmbl',function(){
    if(picker.element.hasClass('picker-rmbl'))
      $(this).removeClass('picker-rmbl');
  })

  //HIDE MODAL OVERLAY
  .on(csse.t,'.picker-modal-overlay',function(){
    $(this).remove();
  })


  //LARGE-MODE DAY CLICK
  .on(ui_event.i,picker_node_el+' .pick-lg li.pick-v',function(){
    get_picker_els('.pick-lg-b li').removeClass('pick-sl');
    $(this).addClass('pick-sl');
    pickers[picker.id].key['d'].current = $(this).attr('data-value');
    picker_ul_transition('d',$(this).attr('data-value'));
    picker_ctrl = true;
  })

  //BUTTON LARGE-MODE
  .on('click',picker_node_el+' .pick-btn-sz',function(){
    picker_large_onoff();
  })

  //BUTTON TRANSLATE-MODE
  .on('click',picker_node_el+' .pick-btn-lng',function(){
    picker_translate_onoff();
  })

  //JUMP
  .on(ui_event.i,picker_node_el+' .pick-arw.pick-arw-s2',function(e){

    e.preventDefault();
    pick_dragged = null;

    var
      i,
      k = $(this).closest('ul').data('k'),
      jump = pickers[picker.id].jump;

    if($(this).hasClass('pick-arw-r'))
      i = get_current('y') + jump;
    else
      i = get_current('y') - jump;

    var
      jumped_array = get_jumped('y',jump);

    if(i>jumped_array[jumped_array.length-1])
      i = jumped_array[0];
    if(i<jumped_array[0])
      i = jumped_array[jumped_array.length-1];

    pickers[picker.id].key['y'].current = i;
    picker_ul_transition('y',get_current('y'));

    picker_ctrl = true;

  })

  //DEFAULT ARROW
  .on(ui_event.i,picker_node_el+' .pick-arw.pick-arw-s1',function(e){
    e.preventDefault();
    pick_dragged = null;
    var
      k = $(this).closest('ul').data('k');
    if($(this).hasClass('pick-arw-r'))
      picker_ul_turn(k,'right');
    else
      picker_ul_turn(k,'left');

    picker_ctrl = true;

  })

  // JUMP
  .on(ui_event.i,picker_node_el+' ul.pick.pick-y li',function(){
    is_click = true;
  })
  .on(ui_event.e,picker_node_el+' ul.pick.pick-y li',function(){
    if(is_click&&is_jumpable()) {
      $(this).closest('ul').toggleClass('pick-jump');
      var
        jumped = get_closest_jumped(get_current('y'),get_jumped('y',pickers[picker.id].jump));
      pickers[picker.id].key['y'].current = jumped;
      picker_ul_transition('y',get_current('y'));
      is_click = false;
    }
  })

  //TOGGLE CALENDAR
  .on(ui_event.i,picker_node_el+' ul.pick.pick-d li',function(){
    is_click = true;
  })
  .on(ui_event.e,picker_node_el+' ul.pick.pick-d li',function(){
    if(is_click) {
      picker_large_onoff();
      is_click = false;
    }
  })

  //TOGGLE TRANSLATE MODE
  .on(ui_event.i,picker_node_el+' ul.pick.pick-l li',function(){
    is_click = true;
  })
  .on(ui_event.e,picker_node_el+' ul.pick.pick-l li',function(){
    if(is_click) {
      picker_translate_onoff();
      picker_translate($(this).val());
      is_click = false;
    }
  })

  //MOUSEDOWN ON UL
  .on(ui_event.i,picker_node_el+' ul.pick',function(e){
    pick_dragged = $(this);
    if(pick_dragged) {
      var
        k = pick_dragged.data('k');
      pick_drag_offset = is_touch() ? e.originalEvent.touches[0].pageY : e.pageY;
      pick_drag_temp = get_current(k);
    }
  })

  //MOUSEMOVE ON UL
  .on(ui_event.m,function(e){

    is_click = false;

    if(pick_dragged) {
      e.preventDefault();
      var
        k = pick_dragged.data('k');
        o = is_touch() ? e.originalEvent.touches[0].pageY : e.pageY;
      o = pick_drag_offset - o;
      o = Math.round(o * .026);
      i = pick_drag_temp + o;
      var
        int = get_clear(k,i);
      if(int!=pickers[picker.id].key[k].current)
        picker_values_increase(k,int);

      picker_ctrl = true;
    }
  })

  //MOUSEUP ON UL
  .on(ui_event.e,function(e){
    if( pick_dragged )
      pick_dragged = null,
      pick_drag_offset = null,
      pick_drag_temp = null;
    if(picker)
      picker_set();
  })

  //CLICK SUBMIT
  .on(ui_event.i,picker_node_el+' .pick-submit',function(){
    picker_hide();
  });

  $(window).resize(function(){
    if(picker) {
      picker_offset();
      is_fx_mobile();
    }
  });

  $.fn.dateDropper = function(options) {
    return $(this).each(function(){
      if($(this).is('input')&&!$(this).hasClass('picker-input')) {

        var
          input = $(this),
          id = 'datedropper-' + Object.keys(pickers).length;

        input
        .attr('data-id',id)
        .addClass('picker-input')
        .prop({
          'type':'text',
          'readonly' : true
        });

        var
          picker_default_date = (input.data('default-date')&&is_date(input.data('default-date'))) ? input.data('default-date') : null,
          picker_disabled_days = (input.data('disabled-days')) ? input.data('disabled-days').split(',') : null,
          picker_format = input.data('format') || 'm/d/Y',
          picker_fx = (input.data('fx')===false) ? input.data('fx') : true,
          picker_fx_class = (input.data('fx')===false) ? '' : 'picker-fxs',
          picker_fx_mobile = (input.data('fx-mobile')===false) ? input.data('fx-mobile') : true,
          picker_init_set = (input.data('init-set')===false) ? false : true,
          picker_lang = (input.data('lang')&&(input.data('lang') in i18n)) ? input.data('lang') : 'en',
          picker_large = (input.data('large-mode')===true) ? true : false,
          picker_large_class = (input.data('large-default')===true && picker_large===true) ? 'picker-lg' : '',
          picker_lock = (input.data('lock')=='from'||input.data('lock')=='to') ? input.data('lock') : false,
          picker_jump = (input.data('jump')&&is_int(input.data('jump'))) ? input.data('jump') : 10,
          picker_max_year = (input.data('max-year')&&is_int(input.data('max-year'))) ? input.data('max-year') : new Date().getFullYear(),
          picker_min_year = (input.data('min-year')&&is_int(input.data('min-year'))) ? input.data('min-year') : 1970,

          picker_modal = (input.data('modal')===true) ? 'picker-modal' : '',
          picker_theme = input.data('theme') || 'primary',
          picker_translate_mode = (input.data('translate-mode')===true) ? true : false;

        if(picker_disabled_days) {
          $.each(picker_disabled_days, function( index, value ) {
            if(value&&is_date(value))
              picker_disabled_days[index] = get_unix(value);
          });
        }

        pickers[id] = {
          disabledays : picker_disabled_days,
          format : picker_format,
          fx : picker_fx,
          fxmobile : picker_fx_mobile,
          lang : picker_lang,
          large : picker_large,
          lock : picker_lock,
          jump : picker_jump,
          key : {
            m : {
              min : 1,
              max : 12,
              current : 1,
              today : (new Date().getMonth()+1)
            },
            d : {
              min : 1,
              max : 31,
              current : 1,
              today : new Date().getDate()
            },
            y : {
              min : picker_min_year,
              max : picker_max_year,
              current : picker_min_year,
              today : new Date().getFullYear()
            },
            l : {
              min : 0,
              max : Object.keys(i18n).length-1,
              current : 0,
              today : 0
            }
          },
          translate : picker_translate_mode
        };

        if(picker_default_date) {

          var regex = /\d+/g;
          var string = picker_default_date;
          var matches = string.match(regex);

          $.each(matches, function( index, value ) {
            matches[index] = parseInt(value);
          });

          pickers[id].key.y.today = (matches[0]) ? matches[0] : pickers[id].key.y.today;
          pickers[id].key.m.today = (matches[1]&&matches[1]<=12) ? matches[1] : pickers[id].key.m.today;
          pickers[id].key.d.today = (matches[2]&&matches[2]<=31) ? matches[2] : pickers[id].key.d.today;


          if(pickers[id].key.y.today>pickers[id].key.y.max)
            pickers[id].key.y.max = pickers[id].key.y.today;
          if(pickers[id].key.y.today<pickers[id].key.y.min)
            pickers[id].key.y.min = pickers[id].key.y.today;

        }

        $('<div>', {
          class: 'datedropper ' + picker_modal + ' ' + picker_theme + ' ' + picker_fx_class + ' ' + picker_large_class,
          id: id,
          html: $('<div>', {
            class: 'picker'
          })
        })
        .appendTo('body');

        picker = {
          id : id,
          input : input,
          element : $('#' + id)
        };

        for( var k in pickers[id].key ) {
          $('<ul>', {
            class: 'pick pick-' + k,
            'data-k' : k
          })
          .appendTo(get_picker_els('.picker'));
          picker_render_ul(k);
        }

        if(pickers[id].large) {

          //calendar
          $('<div>', {
            class: 'pick-lg'
          })
          .insertBefore(get_picker_els('.pick-d'));

          $('<ul class="pick-lg-h"></ul><ul class="pick-lg-b"></ul>')
          .appendTo(get_picker_els('.pick-lg'));

          var
            picker_day_offset = get_days_array();

          for(var i = 0; i < 7 ; i++) {
            $('<li>', {
              html: i18n[pickers[picker.id].lang].weekdays.short[picker_day_offset[i]]
            })
            .appendTo(get_picker_els('.pick-lg .pick-lg-h'))
          }
          for(var i = 0; i < 42 ; i++) {
            $('<li>')
            .appendTo(get_picker_els('.pick-lg .pick-lg-b'))
          }
        }

        //buttons
        $('<div>', {
          class: 'pick-btns'
        })
        .appendTo(get_picker_els('.picker'));

        $('<div>', {
          class: 'pick-submit'
        })
        .appendTo(get_picker_els('.pick-btns'));

        if(pickers[picker.id].translate) {
          $('<div>', {
            class: 'pick-btn pick-btn-lng'
          })
          .appendTo(get_picker_els('.pick-btns'));
        }
        if(pickers[picker.id].large) {
          $('<div>', {
            class: 'pick-btn pick-btn-sz'
          })
          .appendTo(get_picker_els('.pick-btns'));
        }

        if(picker_format=='Y'||picker_format=='m') {
          get_picker_els('.pick-d,.pick-btn-sz').hide();
          picker.element.addClass('picker-tiny');
          if(picker_format=='Y')
            get_picker_els('.pick-m,.pick-btn-lng').hide();
          if(picker_format=='m')
            get_picker_els('.pick-y').hide();
        }

        if(picker_init_set) {
          picker_ctrl = true;
          input_change_value();
        }

        picker = null;

      }

    })
    .focus(function(e){

      e.preventDefault();
      $(this).blur();

      if(picker)
        picker_hide();

      picker = {
        id : $(this).data('id'),
        input : $(this),
        element : $('#'+$(this).data('id'))
      };

      is_fx_mobile();
      picker_offset();
      picker_set();
      picker_show();

      if(picker.element.hasClass('picker-modal'))
        $('body').append('<div class="picker-modal-overlay"></div>')

    });
  };
}(jQuery));



  BbaseDatePicker = BbaseView.extend({
    initialize: function() {
      this._super({
        template: `
          <div class="BbaseDatePicker-wrap">
            BbaseDatePicker
          </div>
        `
      });
    },
    initData: function() {
      return {}
    }
  });

  module.exports = BbaseDatePicker;
});