"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceViewController = void 0;
var UserPreferenceViewController = /** @class */ (function () {
    function UserPreferenceViewController(delegate) {
        this.delegate = delegate;
        this.refreshView();
    }
    UserPreferenceViewController.prototype.refreshView = function () {
        console.log("refreshView");
        this.delegate.setUserPreferences("Hallo");
    };
    return UserPreferenceViewController;
}());
exports.UserPreferenceViewController = UserPreferenceViewController;
