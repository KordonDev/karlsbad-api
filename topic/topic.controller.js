const fetch = require('node-fetch');
const cheerio = require('cheerio');
const FormData = require('form-data');
const auth = require('../authorization/authorization');
const isoFetch = require('isomorphic-fetch');

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
            console.log(`Fetched news of ${req.params.name}`);
            return newsList;
        })
        .then(newsList => res.json(newsList))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
}


/*

    HTTP Post /news
    {
        action: 'article_meta_create',
        category_id: id
    }

    HTTP Post /news
    {
        action:article_meta_change_save
        header:Jugendübung
        matchcodes:
        publish_where: 0  = gar nicht, 1 = Internet, 2 = Internet und Druck, 3 = Druck
        pTag_valid_begin:16
        pMonat_valid_begin:8
        pJahr_valid_begin:2017
        pTag_valid_end:17
        pMonat_valid_end:8
        pJahr_valid_end:2017
        article_print_editions_new:695
        article_print_editions_delete:693 #new_print_editions select option
    }

    HTTP Post /news
    {
        action:article_content_change_save
        article_id:77851
        fields_to_update:default,hinweise_verlag,print_header,content_online,content_counter
        fields_to_remove:
        required_fields:
        content_counter:15
        max_chars_in_articles:0
        content_printable:<P-U>Jugendübung</P-U><TEXTBLOCK>Test</TEXTBLOCK>
        print_header:Jugendübung
        default:<p>Test</p>
        hinweise_verlag:
        content_online:
    }

*/

exports.create = function(req, res) {
    const requestedTopicName = req.params.name;
    console.log('Requestbody: ' + req.body);
    res.sendStatus(200);
    // publishDate, unpublishDate, printWeekOfYear, title
    getIdForTopic(requestedTopicName)
        .catch(error => {
            console.error(`Didn't find topic ${requestedTopicName}`)
            res.sendStatus(404);
        })
        .then(id => {
            console.log(id);
            const form = new FormData();
            form.append('action', 'article_meta_create');
            form.append('category_id', id);
            let options = {
                method: 'POST',
                body: form,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
            }};
            return fetch('http://www.karlsbad.de/news', options);
        })
        .then(data => data.text())
        .then(html => {
            // hier kommt noch die falsche Seite zurück
            console.log(html);
            const $ = cheerio.load(html);
            $.prototype.logHtml = function() {
                console.log(this.html());
            };

            printOpitons = $('select[name=article_print_editions]');
            console.log(printOpitons.length);
            printOpitons.each((ip, p) => {
                console.log(p.text());
            });
            res.sendStatus(200);
        });
}

// GET /news?action=view_navigator&category_id=
const fetchAllTopics = function() {
    console.log(auth.getCookie());
    return isoFetch('http://www.karlsbad.de/news', { headers: {Cookie: auth.getCookie()}})
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
        .then((topics) => topics.find((topic) => compareStrings(topic.name, requestedTopicName)))
        .then(topic => topic ? topic : res.sendStatus(404))
        .then((topic) => fetch(`http://www.karlsbad.de/${topic.link}`))
        .then(data => data.text());
}

const getIdForTopic = function(requestedTopicName) {
    return fetchAllTopics()
        .then((topics) => topics.find((topic) => compareStrings(topic.name, requestedTopicName)))
        .then(topic => {
            console.log(topic);
            return topic.link.substr(-3)
        });
}

const compareStrings = function(string1, string2) {
    return string1.replace(/ /gi, '').toLowerCase() === string2.replace(/ /gi, '').toLowerCase();
}
