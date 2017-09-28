var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/scraping');
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');


var URL = 'https://vk.com/tlptime';
var results = [];

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);
        //информация о новости

        $('.wall_post_text').each(function(key, item) {
            results[key] = {
                text: $(this).text()
            };
        })
        callback();
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

q.push(URL);