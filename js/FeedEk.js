/*
* FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            MaxCount: 25,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: 'DD MMMM YYYY',
            ShowCategory:false
        }, opt);

        var id = $(this).attr("id"), i, s = "", dt;
        $("#" + id).empty();
        if (def.FeedUrl == undefined) return;
        $("#" + id).append('<div id="preloading"><img class="text-center" src="loader.gif" /></div>');

        var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount;

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
            dataType: "json",
            success: function (data) {
                $("#" + id).empty();
                if (!(data.query.results.rss instanceof Array)) {
                    data.query.results.rss = [data.query.results.rss];
                }
                $.each(data.query.results.rss, function (e, itm) {

                  s += '<li>';

                    if (def.ShowImage) {
                      if (itm.channel.item.enclosure != null && itm.channel.item.enclosure != undefined ) {
                        s += '<div class="itemImage"><p><img src="' + itm.channel.item.enclosure.url;
                        s += '" /></p></div>'
                        }
                      }

                  s += '<div class="itemTitle"><a href="' + itm.channel.item.link + '" target="' + def.TitleLinkTarget + '" >' + itm.channel.item.title + '</a></div>';


                    if (def.ShowPubDate){
                        dt = new Date(itm.channel.item.pubDate);
                        s += '<div class="itemDate">';
                        if ($.trim(def.DateFormat).length > 0) {
                            try {
                                moment.lang(def.DateFormatLang);
                                s += moment(dt).format(def.DateFormat);
                            }
                            catch (e){s += dt.toLocaleDateString();}
                        }
                        else {
                            s += dt.toLocaleDateString();
                        }
                        s += '</div>';
                    }
                    if (def.ShowDesc) {
                        s += '<div class="itemContent">';
//                         if (def.DescCharacterLimit > 0 && itm.channel.item.description.length > def.DescCharacterLimit) {
                         if (def.DescCharacterLimit > 0 && itm.channel.item.description != null && itm.channel.item.description != undefined && itm.channel.item.description.length > def.DescCharacterLimit) {
                            s += itm.channel.item.description.substring(0, def.DescCharacterLimit) + '...';
                        }
                        else {
                            s += itm.channel.item.description;
                         }
                         s += '</div>';
                    }
                    if (def.ShowSource) {
                        s += '<div class="itemSource">' + itm.channel.item.guid.content; + '</div>';
                    }
                });
                $("#" + id).append('<ul class="feedEkList">' + s + '</ul>');
            }
        });
    };
})(jQuery);
