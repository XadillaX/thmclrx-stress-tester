/**
 * XadillaX created at 2014-10-11 14:47
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved.
 */
var moment = require("moment");
var thmclrx = require("thmclrx");
var walk = require("walk");
var path = require("path");
var run = require("sync-runner");
var ejs = require("ejs");
var fs = require("fs");

var fileCount = 0;
var timeCount = 0;
var sizeCount = 0;
var files = [];

var template = fs.readFileSync(__dirname + "/../template/.template.ejs", { encoding: "utf8" });
var index = fs.readFileSync(__dirname + "/../template/index.ejs", { encoding: "utf8" });

/**
 * test
 */
exports.test = function() {
    // delete previous
    run("rm -rf " + __dirname + "/../result/*");

    var p = __dirname + "/../picture/";
    var walker = walk.walk(p);

    walker.on("file", function(root, fileStats, next) {
        // is this a jpg / gif / png picture
        var ext = path.extname(fileStats.name);
        if([".jpg", ".jpeg", ".png", ".gif"].indexOf(ext.toLowerCase()) === -1) {
            return next();
        }

        var startTime = moment();
        thmclrx.mixGet(root + "/" + fileStats.name, 32, function(err, result) {
            var endTime = moment();
            var d = endTime - startTime;

            var str = "Process `" + root + "/" + fileStats.name + "` for " + (d / 1000).format(5) + " s. Size: " + (fileStats.size / 1024 / 1024) + " MB.";
            fileCount++;
            timeCount += d;
            sizeCount += fileStats.size;
            files.push(fileStats.name);

            console.log(str);

            var html = ejs.render(template, { filename: fileStats.name, colors: result, img: "../picture/" + fileStats.name, time: d });
            fs.writeFile(__dirname + "/../result/" + fileStats.name + ".html", html, { encoding: "utf8" }, function() {});

            next();
        });
    });

    walker.on("end", function() {
        var str = "Finished " + fileCount + " pictures for " + timeCount.format(5) + " s.";
        console.log(str);

        var html = ejs.render(index, { time: timeCount, size: sizeCount, count: fileCount, files: files });
        fs.writeFile(__dirname + "/../result/index.html", html, { encoding: "utf8" }, function() {
            run("open " + __dirname + "/../result/index.html");
        });
    });
};
