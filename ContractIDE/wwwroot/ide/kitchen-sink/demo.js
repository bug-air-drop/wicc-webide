/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */


define(function (require, exports, module) {
    "use strict";

    require("ace/lib/fixoldbrowsers");
    require("ace/ext/rtl");
    require("ace/multi_select");

    var config = require("ace/config");
    config.init();

    var env = {};

    var dom = require("ace/lib/dom");
    var net = require("ace/lib/net");
    var lang = require("ace/lib/lang");
    var useragent = require("ace/lib/useragent");
    var event = require("ace/lib/event");
    var theme = require("ace/theme/tomorrow_night_bright");
    var editSession = require("ace/edit_session").EditSession;
    var undoManager = require("ace/undomanager").UndoManager;
    var hashHandler = require("ace/keyboard/hash_handler").HashHandler;
    var renderer = require("ace/virtual_renderer").VirtualRenderer;
    var editor = require("ace/editor").Editor;
    var whitespace = require("ace/ext/whitespace");
    var elasticTabstopsLite = require("ace/ext/elastic_tabstops_lite").ElasticTabstopsLite;
    var incrementalSearch = require("ace/incremental_search").IncrementalSearch;

    //var TokenTooltip = require("./token_tooltip").TokenTooltip;
    //require("ace/config").defineOptions(editor.prototype, "editor", {
    //    showTokenInfo: {
    //        set: function (val) {
    //            if (val) {
    //                this.tokenTooltip = this.tokenTooltip || new TokenTooltip(this);
    //            }
    //            else if (this.tokenTooltip) {
    //                this.tokenTooltip.destroy();
    //                delete this.tokenTooltip;
    //            }
    //        },
    //        get: function () {
    //            return !!this.tokenTooltip;
    //        },
    //        handlesSet: true
    //    }
    //});

    /*********** create editor ***************************/
    var container = document.getElementById("editor-container");

    // Splitting.
    var Split = require("ace/split").Split;
    var split = new Split(container, theme, 1);
    env.editor = split.getEditor(0);
    env.editor.getSession().setMode("ace/mode/lua");
    env.editor.setFontSize(18);
    //split.on("focus", function (editor) {
    //    env.editor = editor;
    //});
    env.split = split;

    window.env = env;

    document.getElementById('editor-container').style.fontSize = '18px';

    //var consoleEl = dom.createElement("div");
    //container.parentNode.appendChild(consoleEl);
    //consoleEl.style.cssText = "position:fixed; bottom:1px; right:0;border:1px solid #baf; z-index:100";

    ////var cmdLine = new layout.singleLineEditor(consoleEl);
    ////cmdLine.editor = env.editor;
    ////env.editor.cmdLine = cmdLine;

    ///*********** manage layout ***************************/
    //var consoleHeight = 20;
    //function onResize() {
    //    var left = env.split.$container.offsetLeft;
    //    var width = document.documentElement.clientWidth - left;
    //    container.style.width = width + "px";
    //    container.style.height = document.documentElement.clientHeight - consoleHeight + "px";
    //    env.split.resize();

    //    consoleEl.style.width = width + "px";
      
    //}

    //window.onresize = onResize;
    //onResize();



});