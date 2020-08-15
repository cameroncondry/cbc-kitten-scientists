#!/usr/bin/env node

"use strict";

var Promise = require('bluebird');

var _ = require('lodash');
var request = Promise.promisifyAll(require('superagent'));

var staticContributors = [
  {
    login: 'SphtMarathon',
    html_url: 'https://www.reddit.com/user/SphtMarathon'
  },
  {
    login: 'FancyRabbitt',
    html_url: 'https://www.reddit.com/user/FancyRabbitt'
  },
  {
    login: 'Azulan',
    html_url: 'https://www.reddit.com/user/Azulan'
  },
  {
    login: 'Mewnine',
    html_url: 'https://www.reddit.com/user/Mewnine'
  },
  {
    login: 'pefoley2',
    html_url: 'https://www.reddit.com/user/pefoley2'
  },
  {
    login: 'DirCattus',
    html_url: 'https://www.reddit.com/user/DirCattus'
  },
  {
    login: 'adituv',
    html_url: 'https://github.com/adituv'
  },
  {
    login: 'Eliezer Kanal'
  },
  {
    login: 'ironchefpython',
    html_url: 'https://github.com/ironchefpython'
  },
  {
    login: 'carver',
    html_url: 'https://github.com/carver'
  },
  {
    login: 'Meleneth',
    html_url: 'https://github.com/meleneth'
  },
  {
    login: 'Tom Rauchenwald'
  },
  {
    login: '古明地板 (Cirn09)',
    html_url: 'https://github.com/Cirn09'
  },
];


request
  .get('https://api.github.com/repos/cameroncondry/cbc-kitten-scientists/contributors')
  .query({
    per_page: 100
  })
  .set('Accept', 'application/vnd.github.v3+json')
  .set('User-Agent', 'cbc-kitten-scientists contributors generator')
  .endAsync()
  .then(parseContributors)
  .catch(error => console.error(error));

function parseContributors(response) {
  var contributors = _.chain(response.body.concat(staticContributors))
    .sortBy(function nameToLowerCase(contributor) {
      return contributor.login.toLowerCase();
    })
    .remove(function excludeCameron(contributor) {
      return contributor.login !== "cameroncondry";
    })
    .map(toMarkdown)
    .value()
    .join('\n');

  console.log(contributors);
}

function toMarkdown(contributor) {
  return contributor.html_url ?
    '- [' + contributor.login + '](' + contributor.html_url + ')' :
    '- ' + contributor.login;
}
