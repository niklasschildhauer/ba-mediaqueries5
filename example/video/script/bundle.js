(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextBetweenBrackets = exports.removeUnimportantCharactersFrom = exports.removeSubstringFrom = exports.removeWhitespaceFrom = void 0;
function removeWhitespaceFrom(string) {
    return string.replace(/\s/g, '');
}
exports.removeWhitespaceFrom = removeWhitespaceFrom;
function removeSubstringFrom(string, substring) {
    return string.replace(substring, '');
}
exports.removeSubstringFrom = removeSubstringFrom;
function removeUnimportantCharactersFrom(string) {
    var result = removeWhitespaceFrom(string);
    result = removeSubstringFrom(result, '\"');
    result = removeSubstringFrom(result, '\'');
    result = removeSubstringFrom(result, '"');
    result = removeSubstringFrom(result, "'");
    return result;
}
exports.removeUnimportantCharactersFrom = removeUnimportantCharactersFrom;
function getTextBetweenBrackets(text, firstBracket, lastBracket) {
    var string = text.slice(text.indexOf(firstBracket) + 1); // delete first bracket
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
exports.getTextBetweenBrackets = getTextBetweenBrackets;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptCoordinator = void 0;
var UserPreferenceViewController_1 = require("../view/UserPreferenceViewController");
var Reader = require("../reader/CSSReader");
var Model_1 = require("../model/Model");
var UserPreferenceProfile_1 = require("../user/UserPreferenceProfile");
var JSVariableParser_1 = require("../parser/JSVariableParser");
var CodeParser_1 = require("../parser/CodeParser");
var CSSCodeParser_1 = require("../parser/CSSCodeParser");
var NetworkAPI_1 = require("../network/NetworkAPI");
var ScriptCoordinator = /** @class */ (function () {
    function ScriptCoordinator() {
        console.log("Hello World");
        console.log("-----------");
        this.cssReader = new Reader.CSSReader(this);
        this.userProfile = this.createUserProfile();
        this.rootViewController = new UserPreferenceViewController_1.UserPreferenceViewController(this.userProfile);
        this.codeParser = this.createCodeParser(this.userProfile);
    }
    ScriptCoordinator.prototype.createUserProfile = function () {
        var network = new NetworkAPI_1.NetworkAPI();
        return new UserPreferenceProfile_1.UserPreferenceProfile(this, network);
    };
    ScriptCoordinator.prototype.createCodeParser = function (userProfile) {
        var jsParser = new JSVariableParser_1.JSVariableParser(userProfile);
        var cssParser = new CSSCodeParser_1.CSSCodeParser(userProfile, this.cssReader);
        return new CodeParser_1.CodeParser(jsParser, cssParser);
    };
    ScriptCoordinator.prototype.addCSSCode = function (string) {
        this.cssReader.read(string);
        console.log(this.cssReader.get());
    };
    ScriptCoordinator.prototype.setAudioDescriptionEnabledValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.audioDescriptionEnabled, value));
    };
    ScriptCoordinator.prototype.setCaptionsEnabledValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.captionsEnabled, value));
    };
    ScriptCoordinator.prototype.setSignLanguageValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.signLanguage, value));
    };
    ScriptCoordinator.prototype.setSignLanguageEnabledValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.signLanguageEnabled, value));
    };
    ScriptCoordinator.prototype.setPictogramsEnabledValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.pictogramsEnabled, value));
    };
    ScriptCoordinator.prototype.setSelfVoicingEnabledValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.selfVoicingEnabled, value));
    };
    ScriptCoordinator.prototype.setSessionTimeoutValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.sessionTimeout, value));
    };
    ScriptCoordinator.prototype.setDisplaySkiplinksValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.displaySkiplinks, value));
    };
    ScriptCoordinator.prototype.setTableOfContentsValue = function (value) {
        this.userProfile.setUserPreference(new Model_1.UserPreference(Model_1.CommonTerm.tableOfContents, value));
    };
    ScriptCoordinator.prototype.parseCode = function () {
        this.codeParser.parse();
    };
    // DELEGATE FUNCTIONS
    ScriptCoordinator.prototype.didUpdateMediaDescriptors = function (from) {
        this.parseCode();
        console.log("update CSS Code!");
    };
    ScriptCoordinator.prototype.didUpdateProfile = function (from) {
        this.parseCode();
        this.rootViewController.presenter.reload();
    };
    ScriptCoordinator.prototype.recievedLoginErrorMessage = function (message, from) {
        this.rootViewController.presenter.showLoginErrorMessage(message);
    };
    ScriptCoordinator.prototype.didSelectPersona = function (persona, from) {
        this.rootViewController.presenter.selectedPersona(persona);
    };
    return ScriptCoordinator;
}());
exports.ScriptCoordinator = ScriptCoordinator;

},{"../model/Model":5,"../network/NetworkAPI":6,"../parser/CSSCodeParser":8,"../parser/CodeParser":9,"../parser/JSVariableParser":10,"../reader/CSSReader":11,"../user/UserPreferenceProfile":12,"../view/UserPreferenceViewController":13}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Coordinator = require("./coordinator/ScriptCoordinator");
window.userPreferenceSettings = new Coordinator.ScriptCoordinator();

},{"./coordinator/ScriptCoordinator":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
var Model_1 = require("./Model");
var common = require("../common/utility");
var utility_1 = require("../common/utility");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.createMediaDescriptorsFromCSSString = function (cssCode) {
        var regex = new RegExp("@media.(.*?).\\{", "g");
        var matches = cssCode.matchAll(regex);
        var result = matches.next();
        var mediaDescriptors = [];
        while (!result.done) {
            if (result.value[1] != undefined && result.value.index != undefined) {
                var queryString = result.value[1];
                var queryIndex = result.value.index;
                if (Model_1.CommonTermUtil.containsCommonTermMediaFeature(queryString)[0]) {
                    var body = common.getTextBetweenBrackets(cssCode.slice(queryIndex), "{", "}");
                    mediaDescriptors.push(this.createMediaDescriptorFromMQStringAndBodyString(queryString, body));
                }
            }
            result = matches.next();
        }
        return mediaDescriptors;
    };
    Factory.createMediaDescriptorFromMQStringAndBodyString = function (mediaQuery, body) {
        var _a;
        var query = mediaQuery;
        var negated;
        _a = this.isMediaQueryNegated(query), negated = _a[0], query = _a[1];
        var mediaConditions = this.split(query, "and");
        var supportedMediaQuery = [];
        var unsupportedMediaQuery = [];
        for (var _i = 0, mediaConditions_1 = mediaConditions; _i < mediaConditions_1.length; _i++) {
            var condition = mediaConditions_1[_i];
            var commonTermMediaFeature = Model_1.CommonTermUtil.containsCommonTermMediaFeature(condition);
            if (commonTermMediaFeature[0]) {
                unsupportedMediaQuery.push(this.createMediaFeatureFrom(condition));
            }
            else {
                supportedMediaQuery.push(condition);
            }
        }
        console.log("---------------");
        console.log(unsupportedMediaQuery);
        console.log(body);
        console.log(supportedMediaQuery.join("and"));
        console.log(negated);
        console.log("---------------");
        var supportedMediaQueryString = supportedMediaQuery.join("and");
        if (negated) {
            supportedMediaQueryString = "not " + supportedMediaQueryString;
        }
        if (supportedMediaQueryString == "") {
            supportedMediaQueryString = null;
        }
        return new Model_1.MediaDescriptor(unsupportedMediaQuery, supportedMediaQueryString, body, negated);
    };
    //Zusammenwerfen ??
    Factory.createCommonTermListFromMQString = function (mediaQuery) {
        var _a;
        var query = mediaQuery;
        var negated;
        _a = this.isMediaQueryNegated(query), negated = _a[0], query = _a[1];
        var mediaConditions = this.split(query, "and");
        var supportedMediaQuery = [];
        var unsupportedMediaQuery = [];
        for (var _i = 0, mediaConditions_2 = mediaConditions; _i < mediaConditions_2.length; _i++) {
            var condition = mediaConditions_2[_i];
            var commonTermMediaFeature = Model_1.CommonTermUtil.containsCommonTermMediaFeature(condition);
            if (commonTermMediaFeature[0]) {
                unsupportedMediaQuery.push(this.createMediaFeatureFrom(condition));
            }
            else {
                supportedMediaQuery.push(condition);
            }
        }
        console.log("---------------");
        console.log(unsupportedMediaQuery);
        console.log(supportedMediaQuery.join("and"));
        console.log(negated);
        console.log("---------------");
        var supportedMediaQueryString = supportedMediaQuery.join("and");
        if (negated) {
            supportedMediaQueryString = "not " + supportedMediaQueryString;
        }
        if (supportedMediaQueryString == "") {
            supportedMediaQueryString = null;
        }
        return new Model_1.CommonTermList(unsupportedMediaQuery, supportedMediaQueryString, negated);
    };
    Factory.createMediaFeatureFrom = function (condition) {
        var conditionString = utility_1.removeUnimportantCharactersFrom(condition);
        var negated = false;
        if (conditionString.match("not")) {
            negated = true;
            conditionString = conditionString.replace("not", "");
        }
        var value = "true";
        var valueArray = conditionString.match(":(.*).");
        if (valueArray != null) {
            value = valueArray[1];
            conditionString = conditionString.replace(":" + value, "");
        }
        var mediaFeature = Model_1.CommonTermUtil.containsCommonTermMediaFeature(conditionString)[1];
        if (mediaFeature == null || mediaFeature == undefined) {
            throw new Error('There is no matching common term: ' + conditionString);
        }
        return new Model_1.MediaFeature(mediaFeature, negated, value);
    };
    // checks if the media Query is negated or not.
    Factory.isMediaQueryNegated = function (mediaQuery) {
        if (mediaQuery.slice(0, 3).match("not")) {
            return [true, mediaQuery.slice(4)];
        }
        else {
            return [false, mediaQuery];
        }
    };
    Factory.split = function (mediaQuery, between) {
        return mediaQuery.split(between);
    };
    return Factory;
}());
exports.Factory = Factory;

},{"../common/utility":1,"./Model":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipLinkValues = exports.Persona = exports.CommonTerm = exports.UserPreference = exports.MediaFeature = exports.VideoElement = exports.CommonTermList = exports.MediaDescriptor = exports.MediaQuery = exports.CommonTermUtil = void 0;
var CommonTermUtil = /** @class */ (function () {
    function CommonTermUtil() {
    }
    CommonTermUtil.containsCommonTermMediaFeature = function (query) {
        var result = [false, null];
        Object.keys(CommonTerm).forEach(function (key) {
            if (query.match(key)) {
                var commonTerm = key;
                result = [true, commonTerm];
            }
        });
        return result;
    };
    return CommonTermUtil;
}());
exports.CommonTermUtil = CommonTermUtil;
var MediaQuery = /** @class */ (function () {
    function MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated) {
        this.negated = negated;
        this.supportedMediaQuery = supportedMediaQuery;
        this.unSupportedMediaQuery = unSupportedMediaQuery;
    }
    return MediaQuery;
}());
exports.MediaQuery = MediaQuery;
var MediaDescriptor = /** @class */ (function () {
    function MediaDescriptor(unSupportedMediaQuery, supportedMediaQuery, body, negated) {
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.body = body;
    }
    return MediaDescriptor;
}());
exports.MediaDescriptor = MediaDescriptor;
var CommonTermList = /** @class */ (function () {
    function CommonTermList(unSupportedMediaQuery, supportedMediaQuery, negated) {
        this.callbackFunction = function () { return void 0; };
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.matchValue = false;
    }
    CommonTermList.prototype.addListener = function (event, callback) {
        this.callbackFunction = callback;
    };
    CommonTermList.prototype.matches = function () {
        return this.matchValue;
    };
    CommonTermList.prototype.setMatchValue = function (value) {
        this.matchValue = value;
    };
    return CommonTermList;
}());
exports.CommonTermList = CommonTermList;
var VideoElement = /** @class */ (function () {
    function VideoElement() {
    }
    return VideoElement;
}());
exports.VideoElement = VideoElement;
var MediaFeature = /** @class */ (function () {
    function MediaFeature(mediaFeature, negated, value) {
        this.mediaFeature = mediaFeature;
        this.negated = negated;
        this.value = value;
    }
    return MediaFeature;
}());
exports.MediaFeature = MediaFeature;
var UserPreference = /** @class */ (function () {
    function UserPreference(mediaFeature, value) {
        this.mediaFeature = mediaFeature;
        this.value = value;
    }
    return UserPreference;
}());
exports.UserPreference = UserPreference;
var CommonTerm;
(function (CommonTerm) {
    CommonTerm["displaySkiplinks"] = "displaySkiplinks";
    CommonTerm["audioDescriptionEnabled"] = "audioDescriptionEnabled";
    CommonTerm["captionsEnabled"] = "captionsEnabled";
    CommonTerm["pictogramsEnabled"] = "pictogramsEnabled";
    CommonTerm["selfVoicingEnabled"] = "selfVoicingEnabled";
    CommonTerm["tableOfContents"] = "tableOfContents";
    CommonTerm["extendedSessionTimeout"] = "extendedSessionTimeout";
    CommonTerm["signLanguage"] = "signLanguage";
    CommonTerm["signLanguageEnabled"] = "signLanguageEnabled";
    CommonTerm["sessionTimeout"] = "sessionTimeout";
})(CommonTerm = exports.CommonTerm || (exports.CommonTerm = {}));
var Persona;
(function (Persona) {
    Persona["alexander"] = "Alexander";
    Persona["anna"] = "Anna";
    Persona["carole"] = "Carole";
    Persona["lars"] = "Lars";
    Persona["maria"] = "Maria";
    Persona["mary"] = "Mary";
    Persona["monika"] = "Monika";
    Persona["susan"] = "Susan";
    Persona["tom"] = "Tom";
})(Persona = exports.Persona || (exports.Persona = {}));
var SkipLinkValues;
(function (SkipLinkValues) {
    SkipLinkValues["onfocus"] = "onfocus";
    SkipLinkValues["always"] = "always";
    SkipLinkValues["never"] = "never";
})(SkipLinkValues = exports.SkipLinkValues || (exports.SkipLinkValues = {}));

},{}],6:[function(require,module,exports){
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
exports.NetworkAPI = exports.NetworkUserResultUserPreference = void 0;
var Model_1 = require("../model/Model");
var Personas = require("./Personas/Personas");
var NetworkUserResultUserPreference = /** @class */ (function () {
    function NetworkUserResultUserPreference(success, errorMessage, userPreferences) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.userPreferences = userPreferences;
    }
    return NetworkUserResultUserPreference;
}());
exports.NetworkUserResultUserPreference = NetworkUserResultUserPreference;
var NetworkAPI = /** @class */ (function () {
    function NetworkAPI() {
        this.client = new OpenAPEClient();
    }
    NetworkAPI.prototype.loadUserContext = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var userContextList, userPreferenceArrays, userPreferences;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.login(username, password)
                            .catch(function (err) {
                            return new NetworkUserResultUserPreference(false, err, []);
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.getUserContextList()
                                .then(function (result) {
                                return result["user-context-uris"];
                            })
                                .catch(function (err) {
                                return new NetworkUserResultUserPreference(false, err, []);
                            })];
                    case 2:
                        userContextList = _a.sent();
                        return [4 /*yield*/, Promise.all(userContextList.map(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.client.getUserContext(context)
                                                .then(function (result) {
                                                return _this.createUserPreferencesFromOpenAPEJSON(result);
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 3:
                        userPreferenceArrays = _a.sent();
                        userPreferences = [];
                        userPreferenceArrays.forEach(function (array) {
                            array.forEach(function (preference) {
                                userPreferences.push(preference);
                            });
                        });
                        if (userPreferences.length === 0) {
                            return [2 /*return*/, new NetworkUserResultUserPreference(false, "No suitable user context can be loaded", [])];
                        }
                        return [2 /*return*/, new NetworkUserResultUserPreference(true, null, userPreferences)];
                }
            });
        });
    };
    // private async getUserContextId(uri: string) {
    //     console.log(uri)
    //     this.client.getUserContext(uri)
    //         .then(function(result){
    //             console.log(result)
    //         })
    //         .catch(function(err){
    //             console.log(err)
    //         })
    // }
    NetworkAPI.prototype.loadPreferenceSetFromPersona = function (persona) {
        var userPreferences;
        switch (persona) {
            case Model_1.Persona.alexander:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.alexanderPreferences);
                break;
            case Model_1.Persona.anna:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.annaPreferences);
                break;
            case Model_1.Persona.carole:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.carolePreferences);
                break;
            case Model_1.Persona.lars:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.larsPreferences);
                break;
            case Model_1.Persona.maria:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.mariaPreferences);
                break;
            case Model_1.Persona.mary:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.maryPreferences);
                break;
            case Model_1.Persona.monika:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.monikaPreferences);
                break;
            case Model_1.Persona.susan:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.susanPreferences);
                break;
            case Model_1.Persona.tom:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.tomPreferences);
                break;
            default:
                userPreferences = [];
                break;
        }
        return Promise.resolve(new NetworkUserResultUserPreference(true, null, userPreferences));
    };
    // hier muss noch gecheckt werden wie der Kontext heißt...
    NetworkAPI.prototype.createUserPreferencesFromOpenAPEJSON = function (json) {
        var preferences = json;
        if (preferences["contexts"] !== undefined) {
            preferences = preferences["contexts"];
        }
        if (preferences["gpii-default"] !== undefined) {
            preferences = preferences["gpii-default"];
        }
        try {
            preferences = preferences["preferences"];
        }
        catch (e) {
            console.log("Could not load Preferences");
            console.log(e);
            return [];
        }
        if (preferences === undefined) {
            return [];
        }
        var preferenceSet = [];
        try {
            (preferences["http://registry.gpii.eu/common/signLanguage"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.signLanguage, preferences["http://registry.gpii.eu/common/signLanguage"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/signLanguageEnabled"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.signLanguageEnabled, preferences["http://registry.gpii.eu/common/signLanguageEnabled"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/pictogramsEnabled"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.pictogramsEnabled, preferences["http://registry.gpii.eu/common/pictogramsEnabled"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/audioDescriptionEnabled"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.audioDescriptionEnabled, preferences["http://registry.gpii.eu/common/audioDescriptionEnabled"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/captionsEnabled"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.captionsEnabled, preferences["http://registry.gpii.eu/common/captionsEnabled"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/tableOfContents"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.tableOfContents, preferences["http://registry.gpii.eu/common/tableOfContents"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/displaySkiplinks"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.displaySkiplinks, preferences["http://registry.gpii.eu/common/displaySkiplinks"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/sessionTimeout"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.sessionTimeout, preferences["http://registry.gpii.eu/common/sessionTimeout"] + "")) : "";
            (preferences["http://registry.gpii.eu/common/selfVoicingEnabled"] != undefined) ?
                preferenceSet.push(new Model_1.UserPreference(Model_1.CommonTerm.selfVoicingEnabled, preferences["http://registry.gpii.eu/common/selfVoicingEnabled"] + "")) : "";
        }
        catch (e) {
            console.log(e);
        }
        return preferenceSet;
    };
    return NetworkAPI;
}());
exports.NetworkAPI = NetworkAPI;
var CONSTANTS = {
    TOKEN_PATH: "/token",
    USER_CONTEXT_PATH: "/api/user-contexts",
    OPENAPE_SERVER_URL: "https://openape.gpii.eu",
    CONTENT_TYPE: "application/json"
};
var OpenAPEClient = /** @class */ (function () {
    /**
     * constructor
     *
     * Creates a new client for the given login data.
     *
     * @param {string} username - The username used to login.
     * @param {string} password - The password used to login.
     * @param {string} [serverUrl="http://openape.gpii.eu"] - The URL of the server to connect to.
     * @param {string} [contentType="JSON"] - The content type to be used a default. Can be "JSON" or "XML".
     */
    function OpenAPEClient(serverUrl, contentType) {
        if (serverUrl === void 0) { serverUrl = CONSTANTS.OPENAPE_SERVER_URL; }
        if (contentType === void 0) { contentType = CONSTANTS.CONTENT_TYPE; }
        this.arrStatusText = [];
        this.contentType = contentType;
        this.serverUrl = serverUrl;
        this.token = null;
    }
    OpenAPEClient.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.isPasswordCorrect(password) && this.isUsernameCorrect(username))) return [3 /*break*/, 5];
                        data = new URLSearchParams();
                        data.append("grant_type", "password");
                        data.append("username", username);
                        data.append("password", password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchAPIPost(data, CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.TOKEN_PATH)];
                    case 2:
                        response = _a.sent();
                        this.token = response.access_token;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log('Fetch Error :-S', err_1);
                        throw new Error("Login failed");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log("Passord or username are not valid.");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OpenAPEClient.prototype.getUserContexts = function (userContextList) {
        return __awaiter(this, void 0, void 0, function () {
            var resultData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultData = [];
                        return [4 /*yield*/, userContextList.forEach(function (uri) {
                                _this.getUserContext(uri)
                                    .then(function (result) {
                                    resultData.push(result);
                                })
                                    .catch(function (err) {
                                    console.log(err);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(resultData)];
                }
            });
        });
    };
    OpenAPEClient.prototype.fetchAPIPost = function (data, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Connection will be established with server: " + url);
                        return [4 /*yield*/, fetch(url, {
                                method: 'post',
                                body: data
                            })
                                .then(function (response) {
                                if (response.status !== 200 && response.status !== 201) {
                                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                                    return;
                                }
                                return response.json();
                            })
                                .then(function (json) {
                                return json;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenAPEClient.prototype.fetchAPIGet = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isTokenCorrect(this.token)) {
                            throw new Error("Token is not correct");
                            return [2 /*return*/];
                        }
                        console.log("Connection will be established with server: " + url);
                        return [4 /*yield*/, fetch(url, {
                                'method': 'get',
                                // @ts-ignore
                                'headers': {
                                    'Content-Type': this.contentType,
                                    'Authorization': this.token,
                                },
                            })
                                .then(function (response) {
                                if (response.status !== 200 && response.status !== 201) {
                                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                                    return;
                                }
                                return response.json();
                            })
                                .then(function (json) {
                                return json;
                            })];
                    case 1: 
                    // @ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * getUserContextList
     *
     * This function is used to retrieve a list of URIs to accessible user contexts.
     * It relates to ISO/IEC 24752-8 7.2.6.
     *
     * @param {function} successCallback - The function to be called on success.
     * @param {function} errorCallback - The function to be called on error.
     * @param {string} [contentType="JSON"] - The content type to be used if the default set in the client
     * should not be used. Can be "JSON" or "XML".
     * @returns {object} - A JavaScript object with all user contexts information.
     */
    OpenAPEClient.prototype.getUserContextList = function (contentType) {
        if (contentType === void 0) { contentType = this.contentType; }
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetchAPIGet(CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.USER_CONTEXT_PATH)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Fetch Error :-S', err_2);
                        throw new Error("Loading user contexts failed");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * getUserContext
     *
     * This function can be used to retrieve a certain user context from the OpenAPE server with a given ID.
     * It relates to ISO/ICE 24752-8 7.2.3.
     *
     * @param {string} userContextId - The ID of the stored user context that shall be retrieved.
     * @param {function} successCallback - The function to be called on success.
     * @param {function} errorCallback - The function to be called on error.
     * @param {string} [contentType="JSON"] - The content type to be used if the default set in the client
     * should not be used. Can be "JSON" or "XML".
     * @returns {object} - A JavaScript object with the user context's information.
     */
    OpenAPEClient.prototype.getUserContext = function (userContextId, contentType) {
        if (contentType === void 0) { contentType = this.contentType; }
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isContextIdCorrect(userContextId)) {
                            throw new Error("User context is not correct");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchAPIGet(CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.USER_CONTEXT_PATH + '/' + userContextId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_3 = _a.sent();
                        console.log('Fetch Error :-S', err_3);
                        throw new Error("Loading user context id failed");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // HELPER-METHODS
    /**
     * isPasswordCorrect
     *
     * This function checks the correctness of the given password.
     *
     * @param {string} password - The password to be checked.
     * @returns {boolean} - Whether the password is correct or not.
     */
    OpenAPEClient.prototype.isPasswordCorrect = function (password) {
        var isPasswordCorrect = true;
        if (password == "") {
            console.log("Password can not be empty");
            isPasswordCorrect = false;
        }
        else if (password === undefined) {
            console.log("Please enter a password");
            isPasswordCorrect = false;
        }
        return isPasswordCorrect;
    };
    /**
     * isUsernameCorrect
     *
     * This function checks the correctness of the given username.
     *
     * @param {string} username - The username to be checked.
     * @returns {boolean} - Whether the username is correct or not.
     */
    OpenAPEClient.prototype.isUsernameCorrect = function (username) {
        var isUsernameCorrect = true;
        if (username == "") {
            this.arrStatusText.push("Username can not be empty");
            isUsernameCorrect = false;
        }
        else if (username === undefined) {
            console.log("Please enter a username");
            isUsernameCorrect = false;
        }
        return isUsernameCorrect;
    };
    /**
     * isTokenCorrect
     *
     * This function checks the correctness of the given token.
     *
     * @returns {boolean} - Whether the token is correct or not.
     */
    OpenAPEClient.prototype.isTokenCorrect = function (token) {
        var isTokenCorrect = true;
        if (token === undefined || token === null) {
            console.log("Please initialize the library");
            isTokenCorrect = false;
        }
        return isTokenCorrect;
    };
    /**
     * isContextIdCorrect
     *
     * This function checks the correctness of the given context ID.
     *
     * @param {string} contextId  - The context ID to be checked.
     * @returns {boolean} - Whether the context ID is correct or not.
     */
    OpenAPEClient.prototype.isContextIdCorrect = function (contextId) {
        var isContextIdCorrect = true;
        if (contextId == "") {
            console.log("The contextId can not be empty");
            isContextIdCorrect = false;
        }
        else if (contextId === undefined) {
            console.log("Please enter a contextId");
            isContextIdCorrect = false;
        }
        return isContextIdCorrect;
    };
    return OpenAPEClient;
}());

},{"../model/Model":5,"./Personas/Personas":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examplePreferences = exports.tomPreferences = exports.susanPreferences = exports.monikaPreferences = exports.maryPreferences = exports.mariaPreferences = exports.larsPreferences = exports.carolePreferences = exports.annaPreferences = exports.alexanderPreferences = void 0;
exports.alexanderPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.annaPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": false,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.carolePreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/audioDescriptionEnabled": true,
                "http://registry.gpii.eu/common/displaySkiplinks": "onfocus",
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.larsPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/captionsEnabled": true,
                "http://registry.gpii.eu/common/signLanguageEnabled": true,
                "http://registry.gpii.eu/common/signLanguage": "nsl",
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.mariaPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/audioDescriptionEnabled": true,
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.maryPreferences = {
    "gpii-default": {
        "name": null,
        "preferences": {
            "http://terms.gpii.net/common/audioDescriptionEnabled": true,
            "http://registry.gpii.eu/common/signLanguage": "nsl"
        }
    }
};
exports.monikaPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.susanPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.tomPreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/language": "es",
                "http://registry.gpii.eu/common/magnifierEnabled": true,
                "http://registry.gpii.eu/common/magnification": 2,
                "http://registry.gpii.eu/common/tracking": ["mouse", "caret"],
                "http://registry.gpii.eu/common/screenReaderTTSEnabled": true,
                "http://registry.gpii.eu/common/screenReaderBrailleOutput": false,
                "http://registry.gpii.eu/common/punctuationVerbosity": "some",
                "http://registry.gpii.eu/common/selfVoicingEnabled": true,
                "http://registry.gpii.eu/common/speechRate": 180,
                "http://registry.gpii.eu/common/pitch": 0.7
            }
        }
    }
};
exports.examplePreferences = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.eu/common/signLanguage": "es",
                "http://registry.gpii.eu/common/signLanguageEnabled": true,
                "http://registry.gpii.eu/common/pictogramsEnabled": true,
                "http://registry.gpii.eu/common/audioDescriptionEnabled": true,
                "http://registry.gpii.eu/common/captionsEnabled": true,
                "http://registry.gpii.eu/common/tableOfContents": false,
                "http://registry.gpii.eu/common/displaySkiplinks": "some",
                "http://registry.gpii.eu/common/sessionTimeout": 1.2,
                "http://registry.gpii.eu/common/selfVoicingEnabled": true
            }
        }
    }
};

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSCodeParser = void 0;
var Model_1 = require("../model/Model");
var CSSCodeParser = /** @class */ (function () {
    function CSSCodeParser(userPreferenceProfile, cssReader) {
        this.styleId = "common-terms-media-queries";
        this.cssReader = cssReader;
        this.userProfile = userPreferenceProfile;
    }
    CSSCodeParser.prototype.parse = function () {
        this.resetCSSCode();
        var cssCode = this.createCSSCode();
        this.parseCSSCode(cssCode);
    };
    CSSCodeParser.prototype.createCSSCode = function () {
        var cssStyle = [];
        var mediaDescriptors = this.cssReader.get();
        for (var i = 0; i < mediaDescriptors.length; i++) {
            var mediaDescriptor = mediaDescriptors[i];
            if (this.userProfile.doesMediaQueryMatch(mediaDescriptor.mediaQuery)) {
                var cssCode = mediaDescriptor.body;
                if (mediaDescriptor.mediaQuery.supportedMediaQuery !== null) {
                    cssCode = "@media " + mediaDescriptor.mediaQuery.supportedMediaQuery + " {\n" + cssCode + "\n}";
                }
                cssStyle.push(cssCode);
            }
        }
        var cssString = this.createCSSVariables() + cssStyle.join("\n");
        cssString = cssString + cssStyle.join("\n");
        return cssString;
    };
    CSSCodeParser.prototype.parseCSSCode = function (cssCode) {
        var style = document.createElement('style');
        style.setAttribute("id", this.styleId);
        style.innerHTML = cssCode;
        document.head.appendChild(style);
    };
    CSSCodeParser.prototype.resetCSSCode = function () {
        var style = document.getElementById(this.styleId);
        if (style != null) {
            style.remove();
        }
    };
    CSSCodeParser.prototype.createCSSVariables = function () {
        var variables = ["--audio-description-enabled: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.audioDescriptionEnabled),
            "--captions-enabled: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.captionsEnabled),
            "--self-voicing-enabled: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.selfVoicingEnabled),
            "--session-timeout: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.sessionTimeout),
            "--extended-session-timeout: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.extendedSessionTimeout),
            "--sign-language: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.signLanguage),
            "--sign-language-enabled: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.signLanguageEnabled),
            "--table-of-contents: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.tableOfContents),
            "--display-skiplinks: " + this.userProfile.getValueForMediaFeature(Model_1.CommonTerm.displaySkiplinks),];
        var pseudoRootClass = ":root {\n";
        for (var i = 0; i < variables.length; i++) {
            pseudoRootClass = pseudoRootClass + "   " + variables[i] + ";\n";
        }
        return pseudoRootClass + "}\n\n";
    };
    return CSSCodeParser;
}());
exports.CSSCodeParser = CSSCodeParser;

},{"../model/Model":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeParser = void 0;
var CodeParser = /** @class */ (function () {
    function CodeParser(jsVariableParser, cssCodeParser) {
        this.cssParser = cssCodeParser;
        this.jsParser = jsVariableParser;
    }
    CodeParser.prototype.parse = function () {
        this.jsParser.parse();
        this.cssParser.parse();
    };
    return CodeParser;
}());
exports.CodeParser = CodeParser;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSVariableParser = void 0;
var Model_1 = require("../model/Model");
var Factory_1 = require("../model/Factory");
var JSVariableParser = /** @class */ (function () {
    function JSVariableParser(userPreferenceProfile) {
        var _this = this;
        this.commonTermLists = [];
        this.userProfile = userPreferenceProfile;
        this.parse();
        window.matchCommonTermMedia = function (string) { return _this.createCommonTermList(string); };
    }
    JSVariableParser.prototype.createCommonTermList = function (string) {
        var list = Factory_1.Factory.createCommonTermListFromMQString(string);
        var matchValue = this.evaluateCommonTermList(list);
        list.setMatchValue(matchValue);
        this.commonTermLists.push(list);
        return list;
    };
    JSVariableParser.prototype.parse = function () {
        var userPreferences = this.userProfile.getUserPreferences();
        for (var i = 0; i < userPreferences.length; i++) {
            this.setJSVariableForUserPreference(userPreferences[i]);
        }
        this.evaluateCommonTermLists();
    };
    JSVariableParser.prototype.evaluateCommonTermLists = function () {
        for (var i = 0; i < this.commonTermLists.length; i++) {
            var newValue = this.evaluateCommonTermList(this.commonTermLists[i]);
            var oldValue = this.commonTermLists[i].matches();
            if (oldValue != newValue) {
                this.commonTermLists[i].setMatchValue(newValue);
                this.commonTermLists[i].callbackFunction();
            }
        }
    };
    JSVariableParser.prototype.evaluateCommonTermList = function (list) {
        console.log(list);
        if (this.userProfile.doesMediaQueryMatch(list.mediaQuery)) {
            console.log("1");
            if (list.mediaQuery.supportedMediaQuery !== null) {
                console.log("2");
                return this.evaluateMediaQuery(list.mediaQuery.supportedMediaQuery);
            }
            console.log("3");
            return true;
        }
        console.log("4");
        return false;
    };
    JSVariableParser.prototype.evaluateMediaQuery = function (mediaQuery) {
        var mediaQueryList = window.matchMedia(mediaQuery);
        return mediaQueryList.matches;
    };
    JSVariableParser.prototype.setJSVariableForUserPreference = function (userPreference) {
        switch (userPreference.mediaFeature) {
            case Model_1.CommonTerm.audioDescriptionEnabled:
                window.audioDescriptionEnabled = userPreference.value;
                break;
            case Model_1.CommonTerm.captionsEnabled:
                window.captionsEnabled = userPreference.value;
                break;
            case Model_1.CommonTerm.displaySkiplinks:
                window.displaySkiplinks = userPreference.value;
                break;
            case Model_1.CommonTerm.extendedSessionTimeout:
                window.extendedSessionTimeout = userPreference.value;
                break;
            case Model_1.CommonTerm.pictogramsEnabled:
                window.pictogramsEnabled = userPreference.value;
                break;
            case Model_1.CommonTerm.selfVoicingEnabled:
                window.selfVoicingEnabled = userPreference.value;
                break;
            case Model_1.CommonTerm.sessionTimeout:
                window.sessionTimeout = userPreference.value;
                break;
            case Model_1.CommonTerm.signLanguage:
                window.signLanguage = userPreference.value;
                break;
            case Model_1.CommonTerm.signLanguageEnabled:
                window.signLanguageEnabled = userPreference.value;
                break;
            case Model_1.CommonTerm.tableOfContents:
                window.tableOfContents = userPreference.value;
                break;
        }
    };
    return JSVariableParser;
}());
exports.JSVariableParser = JSVariableParser;

},{"../model/Factory":4,"../model/Model":5}],11:[function(require,module,exports){
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
exports.CSSReader = void 0;
var Factory = require("../model/Factory");
var CSSReader = /** @class */ (function () {
    function CSSReader(delegate) {
        this.mediaDescriptors = [];
        this.plainCSS = [];
        this.delegate = delegate;
        this.readAutomatic();
    }
    CSSReader.prototype.get = function () {
        return this.mediaDescriptors;
    };
    CSSReader.prototype.read = function (string) {
        if (!this.plainCSS.includes(string)) {
            this.plainCSS.push(string);
            this.refresh();
        }
        else {
            console.log("CSS Code is already included");
        }
    };
    CSSReader.prototype.readAutomatic = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stylesSheets, i, link, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stylesSheets = document.querySelectorAll('link');
                        i = stylesSheets.length;
                        _a.label = 1;
                    case 1:
                        if (!i--) return [3 /*break*/, 4];
                        if (!(stylesSheets[i].getAttribute('rel') === 'stylesheet')) return [3 /*break*/, 3];
                        link = stylesSheets[i].getAttribute('href');
                        return [4 /*yield*/, this.loadCSSFile(link)
                                .then(function (text) {
                                return text;
                            })];
                    case 2:
                        text = _a.sent();
                        this.read(text);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CSSReader.prototype.refresh = function () {
        if (this.plainCSS.length != 0) {
            var plainCSSCodeString = this.plainCSS.reverse().join("\n");
            this.mediaDescriptors = Factory.Factory.createMediaDescriptorsFromCSSString(plainCSSCodeString);
        }
        this.delegate.didUpdateMediaDescriptors(this);
    };
    CSSReader.prototype.reset = function () {
        this.mediaDescriptors = [];
        this.plainCSS = [];
        this.refresh();
    };
    CSSReader.prototype.loadCSSFile = function (link) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(link, {
                            method: 'get'
                        }).then(function (response) {
                            return response.text();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CSSReader;
}());
exports.CSSReader = CSSReader;

},{"../model/Factory":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceProfile = void 0;
var Model = require("../model/Model");
var Model_1 = require("../model/Model");
var UserPreferenceProfile = /** @class */ (function () {
    function UserPreferenceProfile(delegate, network) {
        this.userPreferences = [];
        this.setDefaultValues();
        this.delegate = delegate;
        this.network = network;
    }
    UserPreferenceProfile.prototype.refresh = function () {
        this.delegate.didUpdateProfile(this);
        console.log(this.userPreferences);
    };
    UserPreferenceProfile.prototype.setDefaultValues = function () {
        this.userPreferences = defaultPreferences.slice();
        console.log("_-----------");
        console.log(defaultPreferences);
        console.log("_-----------");
    };
    UserPreferenceProfile.prototype.login = function (username, password) {
        var _this = this;
        this.network.loadUserContext(username, password)
            .then(function (result) {
            if (result.success) {
                _this.setUserPreferences(result.userPreferences);
            }
            if (!result.success && result.errorMessage != null) {
                _this.delegate.recievedLoginErrorMessage(result.errorMessage, _this);
            }
            return result;
        });
    };
    UserPreferenceProfile.prototype.doesMediaFeatureMatch = function (mediaFeature) {
        for (var k = 0; k < this.userPreferences.length; k++) {
            var preference = this.userPreferences[k];
            if (mediaFeature.mediaFeature === preference.mediaFeature) {
                if (mediaFeature.value !== preference.value && !mediaFeature.negated ||
                    mediaFeature.value === preference.value && mediaFeature.negated) {
                    return false;
                }
            }
        }
        return true;
    };
    UserPreferenceProfile.prototype.doesMediaQueryMatch = function (mediaQuery) {
        for (var i = 0; i < mediaQuery.unSupportedMediaQuery.length; i++) {
            var mediaFeature = mediaQuery.unSupportedMediaQuery[i];
            var matchValue = this.doesMediaFeatureMatch(mediaFeature);
            if (mediaQuery.negated && matchValue ||
                !matchValue && !mediaQuery.negated) {
                return false;
            }
        }
        return true;
    };
    UserPreferenceProfile.prototype.getValueForMediaFeature = function (mediaFeature) {
        for (var i = 0; i < this.userPreferences.length; i++) {
            if (this.userPreferences[i].mediaFeature == mediaFeature) {
                return this.userPreferences[i].value;
            }
        }
        // else return the default value
        for (var i = 0; i < defaultPreferences.length; i++) {
            if (defaultPreferences[i].mediaFeature == mediaFeature) {
                return this.userPreferences[i].value;
            }
        }
        return "";
    };
    UserPreferenceProfile.prototype.getUserPreferences = function () {
        return this.userPreferences;
    };
    UserPreferenceProfile.prototype.changeUserPreference = function (preference) {
        for (var i = 0; i < this.userPreferences.length; i++) {
            if (this.userPreferences[i].mediaFeature == preference.mediaFeature) {
                this.userPreferences[i] = preference;
                return;
            }
        }
    };
    UserPreferenceProfile.prototype.setUserPreferences = function (preferences) {
        this.setDefaultValues();
        for (var i = 0; i < preferences.length; i++) {
            this.changeUserPreference(preferences[i]);
        }
        this.refresh();
    };
    UserPreferenceProfile.prototype.setUserPreference = function (preference) {
        this.changeUserPreference(preference);
        this.refresh();
    };
    UserPreferenceProfile.prototype.selectPersona = function (persona) {
        var _this = this;
        this.network.loadPreferenceSetFromPersona(persona)
            .then(function (result) {
            if (result.success) {
                _this.setUserPreferences(result.userPreferences);
                _this.delegate.didSelectPersona(persona, _this);
            }
            return result;
        });
    };
    return UserPreferenceProfile;
}());
exports.UserPreferenceProfile = UserPreferenceProfile;
var defaultPreferences = [new Model.UserPreference(Model_1.CommonTerm.audioDescriptionEnabled, "false"),
    new Model.UserPreference(Model_1.CommonTerm.captionsEnabled, "false"),
    new Model.UserPreference(Model_1.CommonTerm.displaySkiplinks, "never"),
    new Model.UserPreference(Model_1.CommonTerm.extendedSessionTimeout, "false"),
    new Model.UserPreference(Model_1.CommonTerm.pictogramsEnabled, "false"),
    new Model.UserPreference(Model_1.CommonTerm.selfVoicingEnabled, "false"),
    new Model.UserPreference(Model_1.CommonTerm.sessionTimeout, "1"),
    new Model.UserPreference(Model_1.CommonTerm.signLanguage, ""),
    new Model.UserPreference(Model_1.CommonTerm.signLanguageEnabled, "false"),
    new Model.UserPreference(Model_1.CommonTerm.tableOfContents, "true")
];

},{"../model/Model":5}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencePresenter = exports.UserPreferenceViewController = void 0;
var UserPreferenceViews_1 = require("./UserPreferenceViews");
var UserPreferenceViewController = /** @class */ (function () {
    function UserPreferenceViewController(userProfile) {
        this.element = new UserPreferenceViews_1.HTMLBasicElement("div", "wrapper", null);
        this.headline = new UserPreferenceViews_1.HTMLTextElement("h1", null, null, "User Preferences");
        this.personaWrapper = new UserPreferenceViews_1.PersonasWrapperView(this);
        this.listWrapper = new UserPreferenceViews_1.ListWrapperView(this);
        this.applyButtonWrapper = new UserPreferenceViews_1.ApplyButtonWrapperView(this);
        this.loginWrapper = new UserPreferenceViews_1.LoginWrapperView(this);
        this.presenter = new UserPreferencePresenter(this, userProfile);
        this.createView();
        this.parseView();
        this.presenter.viewDidLoad();
    }
    UserPreferenceViewController.prototype.createView = function () {
        // this.headlineWrapper.appendChildren([this.settingsSubHeading, this.userPreferencesHeading])
        this.element.appendChild(this.headline);
        this.element.appendChild(this.personaWrapper.element);
        this.element.appendChild(this.loginWrapper.element);
        this.element.appendChild(this.listWrapper.element);
        this.element.appendChild(this.applyButtonWrapper.element);
    };
    UserPreferenceViewController.prototype.parseView = function () {
        // View is only shown, if the script is embeed at the bottom of the body and not in the header.
        if (document.body != null || document.body != undefined) {
            document.body.appendChild(this.element.element);
        }
    };
    UserPreferenceViewController.prototype.removeView = function () {
        if (this.element.id != null) {
            var child = document.getElementById(this.element.id);
            if (child != null || child != undefined) {
                document.removeChild(child);
            }
        }
    };
    UserPreferenceViewController.prototype.selectUserPreferences = function (userPreferences) {
        for (var i = 0; i < userPreferences.length; i++) {
            this.listWrapper.setPreferences(userPreferences[i]);
        }
    };
    UserPreferenceViewController.prototype.showLoginErrorMessage = function (message) {
        this.loginWrapper.showErrorMessage(message);
    };
    UserPreferenceViewController.prototype.selectPersona = function (persona) {
        this.personaWrapper.selectPersona(persona);
    };
    UserPreferenceViewController.prototype.unselectAllPersona = function () {
        this.personaWrapper.unselectAllPersonas();
    };
    UserPreferenceViewController.prototype.getAllSetPreferences = function () {
        return this.listWrapper.getAllPreferences();
    };
    // DELEGATE FUNCTIONS
    UserPreferenceViewController.prototype.didSelectPersona = function (persona, from) {
        console.log("Did select hier " + persona);
        this.presenter.selectPersona(persona);
    };
    UserPreferenceViewController.prototype.didPressApply = function (from) {
        this.presenter.pressedApplyPreferences();
    };
    UserPreferenceViewController.prototype.didPressCancel = function (from) {
        this.presenter.pressedCancel();
    };
    UserPreferenceViewController.prototype.didEditPreferences = function (from) {
        this.presenter.editPreferences();
    };
    UserPreferenceViewController.prototype.didPressLogin = function (username, password) {
        this.presenter.pressedLogin(username, password);
    };
    return UserPreferenceViewController;
}());
exports.UserPreferenceViewController = UserPreferenceViewController;
var UserPreferencePresenter = /** @class */ (function () {
    function UserPreferencePresenter(view, userProfile) {
        this.userProfile = userProfile;
        this.view = view;
    }
    UserPreferencePresenter.prototype.viewDidLoad = function () {
        this.reload();
    };
    UserPreferencePresenter.prototype.reload = function () {
        this.refreshView();
    };
    UserPreferencePresenter.prototype.pressedCancel = function () {
        this.reload();
    };
    UserPreferencePresenter.prototype.editPreferences = function () {
        this.view.unselectAllPersona();
    };
    UserPreferencePresenter.prototype.pressedLogin = function (username, password) {
        this.userProfile.login(username, password);
        this.reload();
    };
    UserPreferencePresenter.prototype.pressedApplyPreferences = function () {
        this.userProfile.setUserPreferences(this.view.getAllSetPreferences());
        this.reload();
    };
    UserPreferencePresenter.prototype.selectPersona = function (persona) {
        this.userProfile.selectPersona(persona);
    };
    UserPreferencePresenter.prototype.selectedPersona = function (persona) {
        this.view.unselectAllPersona();
        this.view.selectPersona(persona);
        this.reload();
    };
    UserPreferencePresenter.prototype.showLoginErrorMessage = function (message) {
        this.view.showLoginErrorMessage(message);
    };
    UserPreferencePresenter.prototype.refreshView = function () {
        this.view.selectUserPreferences(this.userProfile.getUserPreferences());
        console.log(this.userProfile.getUserPreferences());
    };
    return UserPreferencePresenter;
}());
exports.UserPreferencePresenter = UserPreferencePresenter;

},{"./UserPreferenceViews":14}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWrapperView = exports.ListWrapperView = exports.ApplyButtonWrapperView = exports.ButtonView = exports.RadioButtonView = exports.SwitchControlView = exports.PersonasWrapperView = exports.HTMLUserInputElement = exports.HTMLImageElement = exports.HTMLTextElement = exports.HTMLBasicElement = void 0;
var Model_1 = require("../model/Model");
var HTMLBasicElement = /** @class */ (function () {
    function HTMLBasicElement(type, id, classString) {
        this.id = null;
        this.class = null;
        this.type = type;
        var element = document.createElement(this.type);
        if (id != "" && id != null) {
            this.id = "user-preference-view-" + id;
            element.setAttribute("id", this.id);
        }
        if (classString != "" && classString != null) {
            this.class = "user-preference-view-" + classString;
            element.setAttribute("class", this.class);
        }
        this.element = element;
    }
    HTMLBasicElement.prototype.appendChild = function (child) {
        this.element.appendChild(child.element);
    };
    HTMLBasicElement.prototype.appendChildren = function (children) {
        for (var i = 0; i < children.length; i++) {
            this.element.appendChild(children[i].element);
        }
    };
    HTMLBasicElement.prototype.setAttribute = function (attribute, value) {
        this.element.setAttribute(attribute, value);
    };
    HTMLBasicElement.prototype.addClickEventListener = function (listener) {
        this.element.addEventListener("click", listener);
    };
    return HTMLBasicElement;
}());
exports.HTMLBasicElement = HTMLBasicElement;
var HTMLTextElement = /** @class */ (function (_super) {
    __extends(HTMLTextElement, _super);
    function HTMLTextElement(type, id, classString, text) {
        var _this = _super.call(this, type, id, classString) || this;
        _this.appendText(text);
        return _this;
    }
    HTMLTextElement.prototype.appendText = function (text) {
        var textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    };
    return HTMLTextElement;
}(HTMLBasicElement));
exports.HTMLTextElement = HTMLTextElement;
var HTMLImageElement = /** @class */ (function (_super) {
    __extends(HTMLImageElement, _super);
    function HTMLImageElement(type, id, classString, src, alt) {
        var _this = _super.call(this, type, id, classString) || this;
        _this.setAttribute("src", src);
        _this.setAttribute("alt", alt);
        return _this;
    }
    return HTMLImageElement;
}(HTMLBasicElement));
exports.HTMLImageElement = HTMLImageElement;
var HTMLUserInputElement = /** @class */ (function () {
    function HTMLUserInputElement(type, id, classString) {
        this.class = null;
        this.id = null;
        this.type = "input";
        var element = document.createElement(this.type);
        element.setAttribute("type", type);
        if (id != "" && id != null) {
            this.id = "user-preference-view-" + id;
            element.setAttribute("id", this.id);
        }
        if (classString != "" && classString != null) {
            this.class = "user-preference-view-" + classString;
            element.setAttribute("class", this.class);
        }
        this.element = element;
    }
    HTMLUserInputElement.prototype.setValue = function (value) {
        this.element.value = value;
    };
    HTMLUserInputElement.prototype.getValue = function () {
        return this.element.value;
    };
    HTMLUserInputElement.prototype.getCheckedValue = function () {
        return this.element.checked;
    };
    HTMLUserInputElement.prototype.setCheckedValue = function (value) {
        this.element.checked = value;
    };
    HTMLUserInputElement.prototype.appendChild = function (child) {
        this.element.appendChild(child.element);
    };
    HTMLUserInputElement.prototype.appendChildren = function (children) {
        for (var i = 0; i < children.length; i++) {
            this.element.appendChild(children[i].element);
        }
    };
    HTMLUserInputElement.prototype.setAttribute = function (attribute, value) {
        this.element.setAttribute(attribute, value);
    };
    HTMLUserInputElement.prototype.setChangeEventListener = function (changeCall) {
        this.element.addEventListener("change", changeCall);
    };
    return HTMLUserInputElement;
}());
exports.HTMLUserInputElement = HTMLUserInputElement;
var PersonaView = /** @class */ (function () {
    function PersonaView(name, imageSource) {
        this.imageElement = new HTMLImageElement("img", null, "persona-image", imageSource, "Zeichnung aus den Alltagsbeschreibungen");
        this.nameElement = new HTMLTextElement("p", null, "persona-label", name);
        var element = new HTMLBasicElement("div", null, "persona-div");
        element.appendChildren([this.imageElement, this.nameElement]);
        this.element = element;
        this.name = name;
    }
    PersonaView.prototype.select = function () {
        this.element.setAttribute("id", "user-preference-persona-selected");
    };
    PersonaView.prototype.unselect = function () {
        this.element.element.removeAttribute("id");
    };
    return PersonaView;
}());
var PersonasWrapperView = /** @class */ (function () {
    function PersonasWrapperView(delegate) {
        var _this = this;
        this.alexanderODSView = new PersonaView(Model_1.Persona.alexander, "https://gpii.eu/mq-5/assets/Alexander.png");
        this.annaODSView = new PersonaView(Model_1.Persona.anna, "https://gpii.eu/mq-5/assets/Anna.png");
        this.caroleODSView = new PersonaView(Model_1.Persona.carole, "https://gpii.eu/mq-5/assets/Carole.png");
        this.larsODSView = new PersonaView(Model_1.Persona.lars, "https://gpii.eu/mq-5/assets/Lars.png");
        this.mariaODSView = new PersonaView(Model_1.Persona.maria, "https://gpii.eu/mq-5/assets/Maria.png");
        this.maryODSView = new PersonaView(Model_1.Persona.mary, "https://gpii.eu/mq-5/assets/Mary.png");
        this.monikaODSView = new PersonaView(Model_1.Persona.monika, "https://gpii.eu/mq-5/assets/Monika.png");
        this.susanODSView = new PersonaView(Model_1.Persona.susan, "https://gpii.eu/mq-5/assets/Susan.png");
        this.tomODSView = new PersonaView(Model_1.Persona.tom, "https://gpii.eu/mq-5/assets/Tom.png");
        this.personaViews = [this.alexanderODSView,
            this.annaODSView,
            this.caroleODSView,
            this.larsODSView,
            this.mariaODSView,
            this.maryODSView,
            this.monikaODSView,
            this.susanODSView,
            this.tomODSView];
        var element = new HTMLBasicElement("div", "personas-wrapper", null);
        var _loop_1 = function (i) {
            this_1.personaViews[i].element.addClickEventListener(function () {
                _this.delegate.didSelectPersona(_this.personaViews[i].name, _this);
            });
            element.appendChild(this_1.personaViews[i].element);
        };
        var this_1 = this;
        for (var i = 0; i < this.personaViews.length; i++) {
            _loop_1(i);
        }
        this.element = element;
        this.delegate = delegate;
    }
    PersonasWrapperView.prototype.selectPersona = function (persona) {
        for (var i = 0; i < this.personaViews.length; i++) {
            if (this.personaViews[i].name === persona) {
                this.personaViews[i].select();
            }
        }
    };
    PersonasWrapperView.prototype.unselectAllPersonas = function () {
        for (var i = 0; i < this.personaViews.length; i++) {
            this.personaViews[i].unselect();
        }
    };
    return PersonasWrapperView;
}());
exports.PersonasWrapperView = PersonasWrapperView;
var SwitchControlView = /** @class */ (function () {
    function SwitchControlView(name) {
        this.checkBoxElement = new HTMLUserInputElement("checkbox", name + "-switcher", "switch-input");
        this.checkBoxElement.setCheckedValue(true);
        this.spanElement = new HTMLBasicElement("span", null, "slider round");
        this.element = new HTMLBasicElement("label", null, "switch-control");
        this.element.appendChildren([this.checkBoxElement, this.spanElement]);
    }
    SwitchControlView.prototype.setCheckedValue = function (value) {
        this.checkBoxElement.setCheckedValue(value);
    };
    SwitchControlView.prototype.getCheckedValue = function () {
        return this.checkBoxElement.getCheckedValue();
    };
    SwitchControlView.prototype.setChangeEventListener = function (changeCall) {
        this.checkBoxElement.setChangeEventListener(changeCall);
    };
    return SwitchControlView;
}());
exports.SwitchControlView = SwitchControlView;
var RadioButtonView = /** @class */ (function () {
    function RadioButtonView(name, values) {
        this.element = new HTMLBasicElement("div", null, "radio-label");
        this.inputs = [];
        for (var i = 0; i < values.length; i++) {
            var input = new HTMLUserInputElement("radio", name + "-radio", "radio-input");
            input.setAttribute("name", name);
            input.setAttribute("value", "" + values[i]);
            var label = new HTMLTextElement("label", null, null, "" + values[i]);
            label.setAttribute("for", "" + values[i]);
            var div = new HTMLBasicElement("div", null, "radio-div");
            div.appendChildren([input, label]);
            this.element.appendChild(div);
            this.inputs.push(input);
        }
    }
    RadioButtonView.prototype.getValue = function () {
        for (var i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].getCheckedValue()) {
                return this.inputs[i].getValue();
            }
        }
        return "";
    };
    RadioButtonView.prototype.setValue = function (value) {
        for (var i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].getValue() == value) {
                this.inputs[i].setCheckedValue(true);
            }
        }
    };
    return RadioButtonView;
}());
exports.RadioButtonView = RadioButtonView;
var ButtonView = /** @class */ (function (_super) {
    __extends(ButtonView, _super);
    function ButtonView(id, classString, label, functionCall) {
        var _this = _super.call(this, "button", id, classString) || this;
        _this.element.setAttribute("type", "button");
        var textNode = document.createTextNode(label);
        _this.element.appendChild(textNode);
        _this.addClickEventListener(functionCall);
        return _this;
    }
    return ButtonView;
}(HTMLBasicElement));
exports.ButtonView = ButtonView;
var ApplyButtonWrapperView = /** @class */ (function () {
    function ApplyButtonWrapperView(delegate) {
        var _this = this;
        this.applyButton = new ButtonView("apply-button", "button", "Apply Preferences", function () { return _this.applyPreferences(); });
        this.cancelButton = new ButtonView("cancel-button", "button", "Cancel", function () { return _this.cancel(); });
        this.delegate = delegate;
        var element = new HTMLBasicElement("div", null, "apply-button-wrapper");
        element.appendChildren([this.cancelButton, this.applyButton]);
        this.element = element;
    }
    ApplyButtonWrapperView.prototype.applyPreferences = function () {
        this.delegate.didPressApply(this);
    };
    ApplyButtonWrapperView.prototype.cancel = function () {
        this.delegate.didPressCancel(this);
    };
    // Not implemented
    ApplyButtonWrapperView.prototype.hideButtons = function () {
        //this.element.element.removeAttribute("id");
    };
    // Not implemented
    ApplyButtonWrapperView.prototype.showButtons = function () {
        //this.element.setAttribute("id", "apply-button-wrapper-show");
    };
    return ApplyButtonWrapperView;
}());
exports.ApplyButtonWrapperView = ApplyButtonWrapperView;
var CommonTermListEntryBooleanView = /** @class */ (function () {
    function CommonTermListEntryBooleanView(name, commonTerm, valueChangedCall) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new SwitchControlView(commonTerm);
        this.commonTerm = commonTerm;
        var element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
        this.input.setChangeEventListener(valueChangedCall);
    }
    CommonTermListEntryBooleanView.prototype.setValue = function (value) {
        if (value == "true") {
            this.input.setCheckedValue(true);
        }
        else {
            this.input.setCheckedValue(false);
        }
    };
    CommonTermListEntryBooleanView.prototype.getValue = function () {
        return this.input.getCheckedValue() + ""; // HIER FEHLT NOCH WAS!
    };
    return CommonTermListEntryBooleanView;
}());
var CommonTermListEntryTextInputView = /** @class */ (function () {
    function CommonTermListEntryTextInputView(name, commonTerm, valueChangedCall) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new HTMLUserInputElement("text", commonTerm + "-input", "text-input");
        this.commonTerm = commonTerm;
        var element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input]);
        this.element = element;
        this.input.setChangeEventListener(valueChangedCall);
    }
    CommonTermListEntryTextInputView.prototype.getValue = function () {
        return this.input.getValue();
    };
    CommonTermListEntryTextInputView.prototype.setValue = function (value) {
        this.input.setValue(value);
    };
    return CommonTermListEntryTextInputView;
}());
var CommonTermListEntryRadioInputView = /** @class */ (function () {
    function CommonTermListEntryRadioInputView(name, commonTerm, values, valueChangedCall) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new RadioButtonView(name, values);
        this.commonTerm = commonTerm;
        var element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
        for (var i = 0; i < this.input.inputs.length; i++) {
            this.input.inputs[i].setChangeEventListener(valueChangedCall);
        }
    }
    CommonTermListEntryRadioInputView.prototype.getValue = function () {
        return this.input.getValue();
    };
    CommonTermListEntryRadioInputView.prototype.setValue = function (value) {
        this.input.setValue(value);
    };
    return CommonTermListEntryRadioInputView;
}());
var ListWrapperView = /** @class */ (function () {
    function ListWrapperView(delegate) {
        var _this = this;
        this.audioDescriptionListEntry = new CommonTermListEntryBooleanView("Audio Description Enabled", Model_1.CommonTerm.audioDescriptionEnabled, function () { return _this.editPreference(); });
        this.captionsEnabledListEntry = new CommonTermListEntryBooleanView("Captions Enabled", Model_1.CommonTerm.captionsEnabled, function () { return _this.editPreference(); });
        this.pictogramsEnabledListEntry = new CommonTermListEntryBooleanView("Pictograms Enabled", Model_1.CommonTerm.pictogramsEnabled, function () { return _this.editPreference(); });
        this.tableOfContentsListEntry = new CommonTermListEntryBooleanView("Table of Contents", Model_1.CommonTerm.tableOfContents, function () { return _this.editPreference(); });
        this.selfVoicingEnabledListEntry = new CommonTermListEntryBooleanView("Self-Voicing Enabled", Model_1.CommonTerm.selfVoicingEnabled, function () { return _this.editPreference(); });
        this.signLanguageEnabledListEntry = new CommonTermListEntryBooleanView("Sign Language Enabled", Model_1.CommonTerm.signLanguageEnabled, function () { return _this.editPreference(); });
        this.sessionTimeout = new CommonTermListEntryTextInputView("Session Timeout", Model_1.CommonTerm.sessionTimeout, function () { return _this.editPreference(); });
        this.signLanguage = new CommonTermListEntryTextInputView("Sign Language", Model_1.CommonTerm.signLanguage, function () { return _this.editPreference(); });
        this.displaySkiplinks = new CommonTermListEntryRadioInputView("Display Skiplinks", Model_1.CommonTerm.displaySkiplinks, [Model_1.SkipLinkValues.onfocus, Model_1.SkipLinkValues.always, Model_1.SkipLinkValues.never], function () { return _this.editPreference(); });
        this.listEntries = [this.audioDescriptionListEntry,
            this.captionsEnabledListEntry,
            this.pictogramsEnabledListEntry,
            this.tableOfContentsListEntry,
            this.selfVoicingEnabledListEntry,
            this.signLanguageEnabledListEntry,
            this.signLanguage,
            this.sessionTimeout,
            this.displaySkiplinks,
        ];
        var element = new HTMLBasicElement("div", "ct-list-wrapper", null);
        for (var i = 0; i < this.listEntries.length; i++) {
            element.appendChild(this.listEntries[i].element);
        }
        this.element = element;
        this.delegate = delegate;
    }
    ListWrapperView.prototype.editPreference = function () {
        this.delegate.didEditPreferences(this);
    };
    ListWrapperView.prototype.getAllPreferences = function () {
        var preferences = [];
        for (var i = 0; i < this.listEntries.length; i++) {
            preferences.push(new Model_1.UserPreference(this.listEntries[i].commonTerm, this.listEntries[i].getValue()));
        }
        return preferences;
    };
    ListWrapperView.prototype.setPreferences = function (preference) {
        for (var i = 0; i < this.listEntries.length; i++) {
            if (preference.mediaFeature == this.listEntries[i].commonTerm) {
                this.listEntries[i].setValue(preference.value);
            }
        }
    };
    return ListWrapperView;
}());
exports.ListWrapperView = ListWrapperView;
var LoginWrapperView = /** @class */ (function () {
    function LoginWrapperView(delegate) {
        var _this = this;
        this.usernameField = new HTMLUserInputElement("text", "openape-username", "text-input");
        this.passwordField = new HTMLUserInputElement("password", "openape-password", "text-input");
        this.loginButton = new ButtonView("login-button", "button", "Login", function () { return _this.login(); });
        this.errorMessage = new HTMLTextElement("p", "error-field", null, "");
        this.delegate = delegate;
        this.element = new HTMLBasicElement("div", "login-wrapper", null);
        this.element.appendChildren([this.usernameField, this.passwordField, this.errorMessage, this.loginButton]);
    }
    LoginWrapperView.prototype.showErrorMessage = function (text) {
        this.errorMessage.appendText(text);
    };
    LoginWrapperView.prototype.login = function () {
        this.delegate.didTapLogin(this.usernameField.getValue(), this.passwordField.getValue());
    };
    return LoginWrapperView;
}());
exports.LoginWrapperView = LoginWrapperView;

},{"../model/Model":5}]},{},[3]);
