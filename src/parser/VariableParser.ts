import * as Profile from "../user/UserPreferenceProfile";
import {IReader} from "../reader/CSSReader";
import {IMediaDescriptor} from "../model/Model";
import {IParser} from "./CSSCodeParser";

export class JSVariableParser implements IParser {
    private userProfile: Profile.IUserPreferenceProfile;

    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile) {
        this.userProfile = userPreferenceProfile;
        this.parse();
    }

    parse(): void {
        foo = 243;
    }

}

export declare var foo: number;

// const x = {
//     aInternal: 10,
//     aListener: function(val) {},
//     set a(val) {
//         this.aInternal = val;
//         this.aListener(val);
//     },
//     get a() {
//         return this.aInternal;
//     },
//     registerListener: function(listener) {
//         this.aListener = listener;
//     }
// }
//
// x.registerListener(function(val) {
//     alert("Someone changed the value of x.a to " + val);
// });
//
// x.a = 42;