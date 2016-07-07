const request = require('request');

const REQUEST_TIMEOUT = 5000;
const HTTP_STATIC_OK = 200;
const API_TOKEN = require('./config').token;

/**
 * 获取远程 API 内容
 * @param  {String} url    URL
 * @param  {String} query  搜索词
 * @return {Promise}       异步结果
 */
const getRemote = function getRemote(url, query) {
    const option = {
        url,
        qs: {
            q: query,
            token: API_TOKEN
        },
        timeout: REQUEST_TIMEOUT
    };

    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            'use strict';

            if (error) {
                console.log(`get remote content error:${error.toString()} ## ${url}`);
                reject(error);
            }

            if (response.statusCode !== HTTP_STATIC_OK) {
                console.log(`get remote content error:errorCode(${response.statusCode}) ## ${url}`);
                reject(response.statusCode);
            }

            let res = null;
            try {
                res = JSON.parse(body);
            } catch (err) {
                console.log(`parse json error: ${err.toString()}`);
                reject(body);
            }

            resolve(res);
        });
    });
};

/**
 * 获取豆瓣音乐搜索结果
 * @param  {String} query 搜索词
 * @return {Promise}      异步结果
 */
const query = function query(key) {
    const url = 'https://amark.baipan.me/api/mark/search';
    return getRemote(url, key).then(res => {
        if (res.errno) {
            return [];
        }

        return res.data.hits.map(item => {
            return {
                uid: item.id,
                title: item.title,
                arg: item.url,
                icon: '3DD862CD-7C32-4949-9B49-F867393360FA.png',
                subtitle: item.url,
                valid: true
            };
        });
    }, err => {
        console.log(err);
    });
};

module.exports = {query};
