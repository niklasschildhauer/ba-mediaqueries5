"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.ManagerSingelton = void 0;
var ManagerSingelton = /** @class */ (function () {
    function ManagerSingelton() {
        // this.UserPreferenceViewController = new View.UserPreferenceViewController(this);
    }
    ManagerSingelton.prototype.setUserPreferences = function (string) {
        console.log(string);
    };
    return ManagerSingelton;
}());
exports.ManagerSingelton = ManagerSingelton;
function test() {
    console.log("test124");
}
exports.test = test;
