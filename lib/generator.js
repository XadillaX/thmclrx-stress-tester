/**
 * XadillaX created at 2014-10-11 13:39
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved.
 */
var fs = require("fs");
var cheerio = require("cheerio");
var run = require("sync-runner");
var url = require("url");
var path = require("path");
var Scarlet = require("scarlet-task");
var spidex = require("spidex");
var scarlet = new Scarlet(20);

function download(TO) {
    console.log("Downloading " + TO.task);
    var uri = url.parse(TO.task);
    var filename = path.basename(uri.pathname);

    spidex.get(TO.task, function(content) {
        fs.writeFile(__dirname + "/../picture/" + filename, content, { encoding: "binary" }, function() {
            scarlet.taskDone(TO);
        });
    }, "binary");
}

function processIndex(TO) {
    console.log("Parsing " + TO.task);

    spidex.get(TO.task, function(html, status) {
        var $ = cheerio.load(html);
        $("div.pics ul li a img").each(function() {
            scarlet.push($(this).attr("src"), download);
        });
        scarlet.taskDone(TO);
    }, "utf8");
}

/**
 * generate pictures
 * @param options
 */
exports.generate = function(options) {
    var pages = options.pages.split(',').reduce(function(array, value) {
        value = value.trim().split('-').map(function(v) {
            return parseInt(v);
        });

        if(value.length === 1) array.push(value[0]);
        else {
            for(var i = 0; i < value.length - 1; i++) {
                if(value[i] <= value[i + 1]) {
                    for(var j = value[i]; j <= value[i + 1]; j++) {
                        array.push(j);
                    }
                } else {
                    for(var j = value[i]; j >= value[i + 1]; j--) {
                        array.push(j);
                    }
                }
            }
        }

        return array;
    }, []).unique().sort(function(a, b) { return a - b; });
    var type = options.type;

    // delete previous pictures
    run("rm -rf " + __dirname + "/../picture/*");

    for(var i = 0; i < pages.length; i++) {
        scarlet.push("http://m.lovebizhi.com/category/{type}/{page}".assign({ type: type, page: pages[i] }), processIndex);
    }
};
