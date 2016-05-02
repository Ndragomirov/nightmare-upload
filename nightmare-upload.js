var Nightmare = require('nightmare');

Nightmare.action('upload',
    function (name, options, parent, win, renderer, done) {
        parent.on('upload', function (selector, path) {
            console.log(arguments);
            path = Array.isArray(path) ? path : [path];
            var wc = win.webContents;
            try {
                wc.debugger.attach("1.1");
            } catch (err) {
                console.error("Debugger attach failed : ", err);
                return parent.emit('upload', err);
            }
            wc.debugger.sendCommand("DOM.getDocument", {}, function (err, res) {
                if (err.code) {
                    return parent.emit('upload', err);
                }
                console.log(arguments);
                wc.debugger.sendCommand("DOM.querySelector", {
                    nodeId: res.root.nodeId,
                    selector: selector
                }, function (err, res) {
                    if (err.code) {
                        return parent.emit('upload', err);
                    }
                    console.log(arguments);
                    wc.debugger.sendCommand("DOM.setFileInputFiles", {
                        nodeId: res.nodeId,
                        files: path  // Actual list of paths
                    }, function (err, res) {
                        if (err.code) {
                            return parent.emit('upload', err);
                        }
                        console.log(arguments);
                        wc.debugger.detach();
                        parent.emit('upload');
                    });
                });
            });
        });
        done();
        return this;
    },
    function (selector, path, done) {
        this.child.once('upload', function (err, result) {
            if (err) return done(err);
            done(null, result);
        });
        this.child.emit('upload', selector, path);
    });
