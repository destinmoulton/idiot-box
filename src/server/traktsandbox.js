import moment from 'moment';
import Trakt from 'trakt.tv';
import traktConfig from './config/trakt.config';
const trakt = new Trakt(traktConfig);
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
let nums = [1, 5, 12];

let process = [];

nums.forEach((num)=>{
    process.push(firstPromise(num).then((second)=>{return secondPromise(second)}));
});

Promise.all(process)
    .then((results)=>{
        console.log(results);
    });

function firstPromise(seed){
    return new Promise((resolve, reject)=>{
        resolve(seed+5);
    });
}

function secondPromise(secondSeed){
    return new Promise((resolve, reject)=>{
        resolve(secondSeed+2);
    });
}