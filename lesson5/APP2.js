var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html

var cnodeUrl = 'https://cnodejs.org/';

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
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
       var href = $element.attr('href');
      topicUrls.push(href);
    });
  });


  async.mapLimit(topicUrls, 5, function (url, callback) {
  superagent.get(url)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    
    var $ = cheerio.load(res.text);
    var obj={};
    obj[title]= $('.topic_full_title').text().trim();
    obj[href]= url;
    obj[comment1]= $('.reply_content').eq(0).text().trim();
    
    console.log(obj);
    });
}, function (url) {
  
  });