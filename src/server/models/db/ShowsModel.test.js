import path from 'path';

import moment from 'moment';

import ibdb from '../../db/IBDB';

import ShowsModel from './ShowsModel';

// Data taken directly from an API call
const DATASET_ONE = {
    title: 'Day Break',
    year: 2006,
    ids: 
    { 
        trakt: 4594,
        slug: 'day-break',
        tvdb: 79509,
        imdb: 'tt0801425',
        tmdb: 4618,
        tvrage: 8152
    },
    overview: 'Today Detective Brett Hopper will be accused of shooting state attorney Alberto Garza. He will offer his rock solid alibi. He will realize he\'s been framed. And he will run. Then, he will wake up and start the day over again.',
    first_aired: '2006-11-16T02:00:00.000Z',
    airs: { day: 'Wednesday', time: '21:00', timezone: 'America/New_York' },
    runtime: 42,
    certification: 'TV-14',
    network: 'ABC (US)',
    country: 'us',
    trailer: null,
    homepage: null,
    status: 'ended',
    rating: 7.76882,
    votes: 372,
    updated_at: '2017-07-06T09:28:20.000Z',
    language: 'en',
    available_translations: [ 'bg', 'bs', 'el', 'en', 'es', 'fr', 'ru', 'tr' ],
    genres: [ 'drama', 'action', 'adventure', 'fantasy', 'science-fiction' ],
    aired_episodes: 13
};

const DATASET_TWO = {
    title: 'Happy Days',
    year: 1974,
    ids: 
    { 
        trakt: 3822,
        slug: 'happy-days',
        tvdb: 74475,
        imdb: 'tt0070992',
        tmdb: 3845,
        tvrage: 3785
    },
    overview: 'A nostalgic comedy set in 1950s Milwaukee centered on the squeaky-clean Cunningham family and their relationship with Fonzie, a motorcycle-riding Casanova who became a pop-culture phenomenon during the show\'s heyday in the 1970s.',
    first_aired: '1974-01-15T00:00:00.000Z',
    airs: { day: 'Tuesday', time: '20:00', timezone: 'America/New_York' },
    runtime: 25,
    certification: 'TV-PG',
    network: 'ABC (US)',
    country: 'us',
    trailer: null,
    homepage: null,
    status: 'ended',
    rating: 7.54359,
    votes: 195,
    updated_at: '2017-09-19T11:00:28.000Z',
    language: 'en',
    available_translations: [ 'en', 'fr', 'it', 'ru' ],
    genres: [ 'comedy' ],
    aired_episodes: 255
};

describe("ShowsModel", ()=>{
    let showsModel = {};

    beforeEach(() => {
        const dbConfig = {
            inMemory: true
        };

        const migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
        };

        return ibdb.connect(dbConfig)
            .then(() => {
                return ibdb._db.migrate(migConfig);
            })
            .then(()=>{
                showsModel = new ShowsModel(ibdb);
            });
    });

    afterEach(()=>{
        ibdb.close();
    });

    const IMAGE_FILENAME_ONE = "FILENEME_ONE.png";
    const IMAGE_FILENAME_TWO = "FILENAME_TWO.png";
    const EXPECTED_DATA_ONE = collateExpectation(DATASET_ONE, IMAGE_FILENAME_ONE);
    const EXPECTED_DATA_TWO = collateExpectation(DATASET_TWO, IMAGE_FILENAME_TWO);
    it("adds a single show", ()=>{
        expect.assertions(1);
        
        return showsModel.addShow(DATASET_ONE, IMAGE_FILENAME_ONE)
                .then((res)=>{
                    expect(res).toMatchObject(EXPECTED_DATA_ONE);
                });
    });

    describe("Adds Multiple and", ()=>{
        beforeEach(()=>{
            return showsModel.addShow(DATASET_ONE, IMAGE_FILENAME_ONE)
                .then((res)=>{
                    return showsModel.addShow(DATASET_TWO, IMAGE_FILENAME_TWO)
                });
        });

        it("gets single by id [getSingle()]", ()=>{
            expect.assertions(1);
            return showsModel.getSingle(2)
                    .then((res)=>{
                        expect(res).toMatchObject(EXPECTED_DATA_TWO);
                    });
        });

        it("gets single by slug [getSingleBySlug()]", ()=>{
            expect.assertions(1);
            return showsModel.getSingleBySlug('day-break')
                    .then((res)=>{
                        expect(res).toMatchObject(EXPECTED_DATA_ONE);
                    });
        });

        it("gets single by trakt id [getSingleByTraktID()]", ()=>{
            expect.assertions(1);
            return showsModel.getSingleByTraktID(3822)
                    .then((res)=>{
                        expect(res).toMatchObject(EXPECTED_DATA_TWO);
                    });
        });
    });
});



function collateExpectation(apiData, imageFilename) {
    const EXPECTED_DATA = {
        title: apiData.title,
        year: apiData.year,
        overview: apiData.overview,
        first_aired: parseInt(moment(apiData.first_aired).format('X')),
        runtime: apiData.runtime,
        network: apiData.network,
        status: apiData.status,
        rating: apiData.rating,
        updated_at: parseInt(moment(apiData.updated_at).format('X')),
        slug: apiData.ids.slug,
        trakt_id: apiData.ids.trakt,
        tvdb_id: apiData.ids.tvdb,
        imdb_id: apiData.ids.imdb,
        tmdb_id: apiData.ids.tmdb,
        tvrage_id: apiData.ids.tvrage,
        image_filename: imageFilename
    };

    return EXPECTED_DATA;
}