"use strict";

var _IMDBScraperModel = require("./IMDBScraperModel");

var _IMDBScraperModel2 = _interopRequireDefault(_IMDBScraperModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("IMDBScraperModel", function () {
    var imdbScraperModel = {};
    beforeEach(function () {
        imdbScraperModel = new _IMDBScraperModel2.default();
    });

    it("gets the img src for a movie", function () {
        expect.assertions(2);
        return imdbScraperModel.getPosterURL('tt0116629').then(function (url) {
            expect(url.startsWith('https')).toBe(true);
            expect(url.endsWith('jpg')).toBe(true);
        });
    });
});