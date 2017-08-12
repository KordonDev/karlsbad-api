const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.getAll = function(req, res) {
    fetchAllTopics()
        .then(topics => res.json(topics))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
};

exports.getByName = function(req, res) {
    fetchTopic(req.params.name)
        .then(newsList => res.json(newsList))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
}

const fetchAllTopics = function() {
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
                console.log(`Fetched ${topicList.length} topics`);
                return topicList;
            });
}

const fetchTopic = function(requestedTopicName) {
    return fetchAllTopics()
        .then((topics) => topics.find((topic) => topic.name === requestedTopicName))
        .then(topic => topic ? topic : res.send(404))
        .then((topic) => fetch(`http://www.karlsbad.de/${topic.link}`))
        .then(data => data.text())
        .then(html => {
            let $ = cheerio.load(html);
            let newsHtml = $('.news-article-list .article-teaser-complete');
            const newsList = [];
            newsHtml.each((index, newsHtml) => {
                newsList.push({
                    title: $(newsHtml).children('.news-article-title').children('a').text(),
                    date: $(newsHtml).children('.news-article-subtitle').text(),
                    content: $(newsHtml).children('.news-article-content').text()
                });
            });
            console.log(`Fetched news of ${requestedTopicName}`);
            return newsList;
        });
}