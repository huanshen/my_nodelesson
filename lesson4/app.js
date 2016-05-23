//以博客园为例子，再做一遍，由于博客园可以自定义博客风格，所以有些评论不能获得

var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var cnodeUrl = 'http://www.cnblogs.com/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('.post_item_body .titlelnk').each(function (idx, element) {
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      //这里没有用到url.resolve，y因为地址本身就是完整的
      var href = $element.attr('href');

      topicUrls.push(href);
    });

    var ep = new eventproxy();

    ep.after('topic_html', topicUrls.length, function (topics) {
    //console.log(topics);
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];  //这里接的就是上面传进来的数组
        //console.log(topicUrl);
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          //title: $('.blog_comment_body').text().trim(),
          href: topicUrl,
          comment1: $('.blog_comment_body').eq(0).text(),
        });
      });

      console.log('final:');
      console.log(topics);
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch ' + topicUrl + ' successful');
          ep.emit('topic_html', [topicUrl, res.text]); //这里作为数组传到上面去，res.text就是网页的html格式
        });
    });

  });

  
