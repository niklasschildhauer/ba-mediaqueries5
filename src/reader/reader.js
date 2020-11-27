"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test2 = exports.Manager = void 0;
var CommonTermsMediaFeatures;
(function (CommonTermsMediaFeatures) {
    CommonTermsMediaFeatures["displaySkiplinks"] = "displaySkiplinks";
    CommonTermsMediaFeatures["audioDescriptionEnabled"] = "audioDescriptionEnabled";
})(CommonTermsMediaFeatures || (CommonTermsMediaFeatures = {}));
var MediaCondition = /** @class */ (function () {
    function MediaCondition(type, value, negated) {
        this.type = type;
        this.value = value;
        this.negated = negated;
        //console.log("Media Condition: " + type);
    }
    return MediaCondition;
}());
var MediaQuery = /** @class */ (function () {
    function MediaQuery(query, body) {
        this.browserSupportedQuery = "";
        if (query.slice(0, 3).match("not")) {
            this.negated = true;
            query = query.slice(4);
            console.log("without not: " + query);
        }
        var array = query.split("and");
        var browserSupportedQuery = [];
        var mediaConditions = [];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var condition = array_1[_i];
            if (containsCommonTermMediaFeature(condition)) {
                mediaConditions.push(this.evaluateMediaConditionFrom(condition));
            }
            else {
                browserSupportedQuery.push(condition);
            }
        }
        this.browserSupportedQuery = browserSupportedQuery.join("and");
        this.query = mediaConditions;
        this.body = body;
        console.log("---------------");
        console.log(this.query);
        console.log(this.body);
        console.log(this.browserSupportedQuery);
        console.log("---------------");
    }
    MediaQuery.prototype.evaluateMediaConditionFrom = function (evaluateMediaConditionFrom) {
        var condition = removeWhitespaceFrom(evaluateMediaConditionFrom);
        var negated = false;
        if (condition.match("not")) {
            negated = true;
            condition = condition.replace("not", "");
        }
        var value = "true";
        if (condition.match(":")) {
            value = condition.match(":(.*).")[1];
            condition = condition.replace(":" + value, "");
        }
        var mediaFeature;
        if (condition.match("\\((.*?)\\)")) {
            mediaFeature = condition.match("\\((.*?)\\)")[1];
        }
        return new MediaCondition(CommonTermsMediaFeatures[mediaFeature], value, negated);
    };
    return MediaQuery;
}());
var UserPreference = /** @class */ (function () {
    function UserPreference(preference, value) {
        this.preference = preference;
        this.value = value;
    }
    return UserPreference;
}());
var Manager = /** @class */ (function () {
    function Manager(plainCSS) {
        this.mediaQueries = [];
        this.plainCSS = plainCSS;
        this.userPreferences = [
            new UserPreference(CommonTermsMediaFeatures.audioDescriptionEnabled, "true"),
            new UserPreference(CommonTermsMediaFeatures.displaySkiplinks, "never"),
        ];
        this.readCSS();
        this.addCSS();
    }
    Manager.prototype.readCSS = function () {
        var regex = new RegExp("@media.\(.*)\.\\{", "g");
        // @ts-ignore
        var matches = this.plainCSS.matchAll(regex);
        var result = matches.next();
        while (!result.done) {
            var queryString = result.value[1];
            var queryIndex = result.value.index;
            if (containsCommonTermMediaFeature(queryString)) {
                var body = this.getBodyOfMediaQueryAt(queryIndex);
                this.mediaQueries.push(new MediaQuery(queryString, body));
            }
            result = matches.next();
        }
    };
    Manager.prototype.addCSS = function () {
        console.log(this.mediaQueries);
        var cssStyle = [];
        for (var i = 0; i < this.mediaQueries.length; i++) {
            var mediaQuery = this.mediaQueries[i];
            if (this.doesMediaQueryMatchUserPreferences(mediaQuery)) {
                var body = mediaQuery.body;
                if (mediaQuery.browserSupportedQuery !== "") {
                    body = "@media " + mediaQuery.browserSupportedQuery + " {\n" + mediaQuery.body + "\n}";
                }
                cssStyle.push(body);
            }
        }
        console.log(cssStyle);
        var style = document.createElement('style');
        style.setAttribute("id", "common-terms-media-queries");
        style.innerHTML = cssStyle.join("\n");
        document.head.appendChild(style);
    };
    Manager.prototype.getBodyOfMediaQueryAt = function (index) {
        return getTextBetweenBrackets(this.plainCSS.slice(index), "{", "}");
    };
    Manager.prototype.test = function () {
        return 3;
    };
    Manager.prototype.doesMediaQueryMatchUserPreferences = function (mediaQuery) {
        for (var i = 0; i < mediaQuery.query.length; i++) {
            for (var k = 0; k < this.userPreferences.length; k++) {
                var condition = mediaQuery.query[i];
                var preference = this.userPreferences[k];
                if (condition.type === preference.preference) {
                    if (mediaQuery.negated) {
                        if (condition.value === preference.value && !condition.negated ||
                            condition.value !== preference.value && condition.negated) {
                            return false;
                        }
                    }
                    else {
                        if (condition.value !== preference.value && !condition.negated ||
                            condition.value === preference.value && condition.negated) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };
    return Manager;
}());
exports.Manager = Manager;
function test2() {
    return true;
}
exports.test2 = test2;
/*
window.onload = () => {
    main();
    console.log("Gestartet!")
}*/
function main() {
    // let styleText = ""
    // let stylesSheets = document.querySelectorAll('link');
    // for (var i = stylesSheets.length; i--;) {
    //     if(stylesSheets[i].getAttribute('rel') === 'stylesheet') {
    //         let link = stylesSheets[i].getAttribute('href')
    //         let cssContent = this.loadCSSContent(link)
    //             .then(function(text) {
    //                 styleText = styleText + text;
    //             })
    //         styleText = cssContent
    //     }
    // }
    // console.log(styleText);
    //var manager = new Manager(text)
}
function loadCSSContent(link) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(link, {
                        method: 'get'
                    })
                        .then(function (response) {
                        return response.text();
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// Utilities
function getTextBetweenBrackets(text, firstBracket, lastBracket) {
    var string = text.slice(text.indexOf(firstBracket) + 2); // delete first bracket and linespace
    var openBracketsCount = 1;
    for (var i = 0; i < string.length; i++) {
        if (string.charAt(i) === firstBracket) {
            openBracketsCount = openBracketsCount + 1;
        }
        if (string.charAt(i) === lastBracket) {
            openBracketsCount = openBracketsCount - 1;
        }
        if (openBracketsCount === 0) {
            return string.slice(0, i);
        }
    }
    return string;
}
function containsCommonTermMediaFeature(query) {
    var contains = false;
    Object.keys(CommonTermsMediaFeatures).forEach(function (key) {
        if (query.match(key)) {
            contains = true;
        }
    });
    return contains;
}
function splitQueryString(query) {
    return query.split("and");
}
function removeWhitespaceFrom(string) {
    return string.replace(/\s/g, '');
}
// can be deleted
function getArrayOfTextBetweenBrackets(text, firstBracket, lastBracket) {
    // @ts-ignore
    var matches = text.matchAll(new RegExp("\\" + firstBracket + "(.*?)\\" + lastBracket, "g"));
    var list = [];
    var result = matches.next();
    while (!result.done) {
        list.push(result.value[1]);
        result = matches.next();
    }
    return list;
}
// can be deleted
