"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import traktConfig from './config/trakt.config';
//const trakt = new Trakt(traktConfig);
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
/**trakt.seasons
    .summary({
        id: 107460,
        extended: "full",
    })
    .then((res) => {
        console.log(res);
    });**/
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
//# sourceMappingURL=traktsandbox.js.map