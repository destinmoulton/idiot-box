'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _trakt3 = require('./config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trakt = new _trakt2.default(_trakt4.default);
/**
trakt.search.text({
            query: 'days',
            type: 'movie',
            extended: 'full'
        }).then((res)=>{
            console.log(res[1]);
            console.log(moment(res[1].movie.updated_at).format('X'));
        });
        
/**
trakt.seasons.summary({
            id: 107460,
            extended: 'full'
        }).then((res)=>{
            console.log(res);
        });

/**
trakt.seasons.season({
            id: 107460,
            season: 1,
            extended: 'full'
        }).then((res)=>{
            console.log(res);
        });
/**
trakt.episodes.summary({
    id: 107460,
    season: 1,
    episode: 4,
    extended: 'full'
}).then((res)=>{
    console.log(res);
});
**/
var nums = [1, 5, 12];

var process = [];

nums.forEach(function (num) {
    process.push(firstPromise(num).then(function (second) {
        return secondPromise(second);
    }));
});

Promise.all(process).then(function (results) {
    console.log(results);
});

function firstPromise(seed) {
    return new Promise(function (resolve, reject) {
        resolve(seed + 5);
    });
}

function secondPromise(secondSeed) {
    return new Promise(function (resolve, reject) {
        resolve(secondSeed + 2);
    });
}