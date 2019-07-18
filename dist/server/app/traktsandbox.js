"use strict";

var _moment = _interopRequireDefault(require("moment"));

var _trakt = _interopRequireDefault(require("trakt.tv"));

var _trakt2 = _interopRequireDefault(require("./config/trakt.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var trakt = new _trakt["default"](_trakt2["default"]);
/**
trakt.search.text({
            query: 'days',
            type: 'movie',
            extended: 'full'
        }).then((res)=>{
            console.log(res[1]);
            console.log(moment(res[1].movie.updated_at).format('X'));
        });
        
**/

trakt.seasons.summary({
  id: 107460,
  extended: 'full'
}).then(function (res) {
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