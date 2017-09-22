import moment from 'moment';

import ibdb from '../../db/IBDB';

import ShowsModel from './ShowsModel';

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

    it("adds a show", ()=>{
        const [API_DATA, EXPECTED_DATA, IMAGE_FILENAME] = getTestData();
        return showsModel.addShow(API_DATA, )
    })
});

function getTestData() {
    // Data taken directly from an API call
    const API_DATA = {
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

    const IMAGE_FILENAME = "TEST_FILENAME.jpg";

    const EXPECTED_DATA = {
        title: API_DATA.title,
        year: API_DATA.year,
        overview: API_DATA.overview,
        first_aired: moment(API_DATA.first_aired).format('X'),
        runtime: API_DATA.runtime,
        network: API_DATA.network,
        status: API_DATA.status,
        rating: API_DATA.rating,
        updated_at: moment(API_DATA.updated_at).format('X'),
        slug: API_DATA.ids.slug,
        trakt_id: API_DATA.ids.trakt,
        tvdb_id: API_DATA.ids.tvdb,
        imdb_id: API_DATA.ids.imdb,
        tmdb_id: API_DATA.ids.tmdb,
        tvrage_id: API_DATA.ids.tvrage,
        image_filename: IMAGE_FILENAME
    };

    return [API_DATA, EXPECTED_DATA, IMAGE_FILENAME];
}