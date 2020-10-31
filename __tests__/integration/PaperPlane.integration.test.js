/**
 * @jest-environment node
 */
const jsdom = require("jsdom");
global.window = new jsdom.JSDOM().window;
global.XMLHttpRequest = window.XMLHttpRequest;

import {PaperPlane} from '../../src/PaperPlane';

let currentServer = null;

const startServer = function() {
    return new Promise((resolve, reject) => {
        const express = require('express');
        const app = express();
        const port = 3000;
        
        app.use(function(req, res, next) {
            // CORS setups b/c cross-domain requests are blocked
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.get('/', (req, res) => {
            res.send('Hello World!')
        });

        app.post('/post-test', (req, res) => {
            res.send('post data accepeted')
        });        
        
        currentServer = app.listen(port, () => {
            resolve(app);
        });
    });
};

const stopServer = function() {
    if(currentServer) {
        currentServer.close();
    }
};

test('PaperPond.get() returns correct response body', (done) => {
    startServer().then(() => {
        const cb = (resp) => {
            stopServer();
            expect(resp).toBe("Hello World!");
            done();
        };

        PaperPlane.get("http://localhost:3000/", new Map(), cb);
    });
});

test('PaperPond.get() returns correct status code', (done) => {
    startServer().then(() => {
        const cb = (respBody, xhr) => {
            stopServer();
            expect(xhr.status).toBe(200);
            done();
        };

        PaperPlane.get("http://localhost:3000/", new Map(), cb);
    });
});

test('PaperPond.post() makes POST request to server', (done) => {
    startServer().then(() => {
        const cb = (resp, xhr) => {
            stopServer();
            expect(resp).toBe("post data accepeted");
            done();
        };

        PaperPlane.post("http://localhost:3000/post-test", PaperPlane.makeJsonRequestData({"key":"val"}), cb);
    });
});
