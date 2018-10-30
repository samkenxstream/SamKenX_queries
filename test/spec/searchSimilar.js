'use strict';

const expect = require('chai').expect;
const elasticsearch = require('elasticsearch');
const nockBack = require('nock').back;
const queries = require('../../');

const localEsClient = new elasticsearch.Client({ host: '127.0.0.1:9200', log: null, apiVersion: '6.3' });

describe('search.similar()', () => {
    it('should return the desired results', () => {
        let nockDone;

        nockBack('search-similar.json', (_nockDone) => { nockDone = _nockDone; });

        return queries.search.similar('chaik', localEsClient)
        .then((similar) => {
            expect(similar).to.have.length(10);
            expect(similar[0]).to.contain.all.keys('package', 'score', 'searchScore');
            expect(similar[0].package.name).to.equal('chalk');
            nockDone();
        });
    });

    it('should return empty if searched without any text', () => (
        queries.search.similar('', localEsClient)
        .then((similar) => {
            expect(similar).to.have.length(0);
        })
    ));
});
