#! /usr/bin/env node
/**
 * XadillaX created at 2014-10-10 16:41:53
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved
 */
require("sugar");
var opts = require("nomnom").script("./run.js").option("action", {
    position    : 0,
    required    : true,
    help        : "tester action. [gen|test]",
    callback    : function(v) {
        if(v !== "gen" && v !== "test") {
            return "Wrong command.";
        }
    }
}).option("type", {
    abbr        : "t",
    default     : "7",
    help        : "type number in http://m.lovebizhi.com/."
}).option("pages", {
    abbr        : "p",
    default     : "1-5",
    help        : "example: 1,3,5-9,12"
}).parse();

switch(opts.action) {
    case "gen": {
        require("./lib/generator").generate(opts);
        break;
    }

    case "test": {
        require("./lib/tester").test();
        break;
    }
}
