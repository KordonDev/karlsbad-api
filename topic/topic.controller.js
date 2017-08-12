const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.getAll = function(req, res) {
    console.log('topics');
    return fetch('http://www.karlsbad.de/news')
        .then((data) => data.text())
        .then((html) => {
            let $ = cheerio.load(html);
            let topics = $('#bs_list li');
            let topicList = [];
            topics.each((i, topic) => {
                if ($(topic).children('a').length > 0) {
                    topicList.push(
                        {
                            "name": $(topic).children('a').text(),
                            "link": $(topic).children('a').attr('href'),
                        }
                    );
                } else {
                    let topicWithoutChilds = $(topic).clone().children().remove().end();
                    topicList.push(
                        {
                            "name": topicWithoutChilds.text(),
                            "link": null,
                        }
                    );
                }
            });
            res.json(topicList);
        })
        .catch(error => {
            console.error(error);
            res.send(500);
        });
};

exports.getById = function(req, res) {
    let path = req.params[0].split("/");
    console.log(path[0]);
    return getAllTopics()
        .then((topics) => topics.find((topic) => topic.name === path[0]))
        .then((topic) => fetch(`http://www.karlsbad.de/${topic.link}`))
        .then(data => console.log(data));
}