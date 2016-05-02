/**
 * Module dependencies.
 */

require('mocha-generators')
    .install();

var Nightmare = require('nightmare');
var should = require('chai')
    .should();
var url = require('url');
var server = require('./server');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');

/**
 * Temporary directory
 */

var tmp_dir = path.join(__dirname, 'tmp')

/**
 * Get rid of a warning.
 */

process.setMaxListeners(0);

/**
 * Locals.
 */

var base = 'http://localhost:7500/';

describe('Nightmare Upload', function () {
    before(function (done) {
        require('../nightmare-upload.js');
        server.listen(7500, done);
    });

    it('should be constructable', function *() {
        var nightmare = Nightmare();
        nightmare.should.be.ok;
        yield nightmare.end();
    });

    describe('filling file input', function () {
        var nightmare;

        beforeEach(function () {
            nightmare = Nightmare({
                show: false
            });
        });

        afterEach(function *() {
            yield nightmare.end();
        });

        it('should use provided `selector` and `path`', function*() {
            var filesLength = yield nightmare
                .goto(base)
                .upload('#single-file-input', path.join(__dirname, 'fixture/1.txt'))
                .evaluate(function () {
                    return document.querySelector('#single-file-input').files.length;
                });
            filesLength.should.be.equal(1)
        })

        it('should be able to upload multiple files', function *() {
            var filesLength = yield nightmare
                .goto(base)
                .upload('#multi-file-input', [
                    path.join(__dirname, 'fixture/1.txt'),
                    path.join(__dirname, 'fixture/2.txt')
                ])
                .evaluate(function () {
                    return document.querySelector('#multi-file-input').files.length;
                });
            filesLength.should.be.equal(2);
        })
    })

});
