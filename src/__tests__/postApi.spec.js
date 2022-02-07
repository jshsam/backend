
const supertest = require("supertest");
const express = require("express");
const app = express();
const ping = require('../api-routes/ping');
const posts = require('../api-routes/posts');

app.use('/api', ping, posts);


// This group performs tests on the different api routes' response status codes
describe("Test API response status codes", () => {

    test("It should return successful response status code/body for correct api/ping route", done => {

            supertest(app)
                .get('/api/ping')
                .expect(200, { success: 'true' },done);
    });

    test("It should return unsuccessful response status code for incorrect api/ping route", done => {

            supertest(app)
                .get('/api/pings')
                .expect(404, done);
    })

    test("It should return successful response status code for correct post route with required tag parameter", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech'})
                .expect(200, done);
    });

    test("It should return unsuccessful response status code for incorrect post route with required tag parameter", done => {

        supertest(app)
            .get('/api/post')
            .query({tag:'tech'})
            .expect(404, done);
    });

});

// This group performs tests on the /api/posts query parameters
describe("Tests parameters input", () => {

    describe("Tests tag parameter(s) input", () => {

        test("It should return successful response when only one tag parameter(s) are input", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech'})
                .expect(200, done);
        });

        test("It should return successful response when more than one tag parameter(s) are input", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech', tag:'health'})
                .expect(200, done);
        });

        test("It should return unsuccessful response status code/body when no parameters are input", done => {

            supertest(app)
                .get('/api/posts')
                .expect(400, {error: 'Tags parameter is required' },done);
        });

        test("It should return unsuccessful response status code/body when only tag parameter(s) are missing", done => {

            supertest(app)
                .get('/api/posts')
                .query({sortBy:'id', direction:'desc'})
                .expect(400, {error: 'Tags parameter is required' },done);
        });
    });

    describe("Tests sortBy parameter", () => {

        test("It should return successful response when only sortBy parameter is input with required tag parameter", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech', sortBy:'id'})
                .expect(200, done);
        });

        test("It should return unsuccessful response when invalid sortBy parameter is input", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech', sortBy:'author'})
                .expect(400, done);
        });

    });

    describe("Tests direction parameter", () => {

        test("It should return successful response when only direction parameter is input with required tag parameter", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech', direction:'desc'})
                .expect(200, done);
        });

        test("It should return unsuccessful response when invalid direction parameter is input", done => {

            supertest(app)
                .get('/api/posts')
                .query({tag:'tech', direction:'down'})
                .expect(400, done);
        });

    });
}); 