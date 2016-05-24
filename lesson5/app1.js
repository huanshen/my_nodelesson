var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html

var cnodeUrl = 'http://www.cnblogs.com/';
var result1=[];
var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  superagent.get(url)
        .end(function (err, res) {
          var $ = cheerio.load(res.text);
    var obj={};
    obj.href= url;
    obj.comment1= $('.blog_comment_body').eq(0).text().trim();
    
    result1.push(obj);
        });
  setTimeout(function () {
    concurrencyCount--;
    callback( result1);
  }, delay);
};

var topicUrls = [];
//获取需要抓取的网页的地址，然后存储到topicUrls中。
//不过这里是一次性的，大概20次吧。

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('.post_item_body .titlelnk').each(function (idx, element) {
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      var href = $element.attr('href');
      topicUrls.push(href);
      //console.log(topicUrls);
    });
    tt(topicUrls);
  });

function tt(topicUrls){

async.mapLimit(topicUrls, 5, function (url, callback) {
//这里的callback函数没有理解错的话应该是后面的那个function(err,result).
console.log(topicUrls.length);
  fetchUrl(url, callback);
}, function (urlt) {
 console.log(urlt);
  
  
  
});
}


