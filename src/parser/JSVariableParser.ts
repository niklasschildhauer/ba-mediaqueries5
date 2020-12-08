import * as Profile from "../user/UserPreferenceProfile";
import {CommonTerm, IUserPreference} from "../model/Model";
import {IParser} from "./CSSCodeParser";

export class JSVariableParser implements IParser {
    private userProfile: Profile.IUserPreferenceProfile;
    private eventListeners: CommonTermList[] = [];

    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile) {
        this.userProfile = userPreferenceProfile;
        this.parse();
        (window as any).matchCommonTermMedia = (string: string) => this.doesMediaQueryMatch(string);
    }

    doesMediaQueryMatch(string: string): CommonTermList {
        const list = new CommonTermList();
        this.eventListeners.push(list);
        return list
    }

    parse(): void {
        let userPreferences = this.userProfile.getUserPreferences()
        for (let i = 0; i < userPreferences.length; i++) {
            this.setJSVariableForUserPreference(userPreferences[i]);
        }
        for (let i = 0; i < this.eventListeners.length; i++) {
            console.log(this.eventListeners.length);
             this.eventListeners[i].callbackFunction();
        }
    }

    private setJSVariableForUserPreference(userPreference: IUserPreference) {
        switch (userPreference.mediaFeature){
            case CommonTerm.audioDescriptionEnabled:
                (window as any).audioDescriptionEnabled = userPreference.value;
                break;
            case CommonTerm.captionsEnabled:
                (window as any).captionsEnabled = userPreference.value;
                break;
            case CommonTerm.displaySkiplinks:
                (window as any).displaySkiplinks = userPreference.value;
                break;
            case CommonTerm.extendedSessionTimeout:
                (window as any).extendedSessionTimeout = userPreference.value;
                break;
            case CommonTerm.pictogramsEnabled:
                (window as any).pictogramsEnabled = userPreference.value;
                break;
            case CommonTerm.selfVoicingEnabled:
                (window as any).selfVoicingEnabled = userPreference.value;
                break;
            case CommonTerm.sessionTimeout:
                (window as any).sessionTimeout = userPreference.value;
                break;
            case CommonTerm.signLanguage:
                (window as any).signLanguage = userPreference.value;
                break;
            case CommonTerm.signLanguageEnabled:
                (window as any).signLanguageEnabled = userPreference.value;
                break;
            case CommonTerm.tableOfContents:
                (window as any).tableOfContents = userPreference.value;
                break;
        }
    }
}

export interface ICommonTermList {
    addListener(event: string, callback: () => any): void;
    matches(): boolean;
}

export class CommonTermList implements ICommonTermList {
    callbackFunction: () => any = () => void 0;

    addListener(event: string, callback: () => any): void {
        this.callbackFunction = callback;
    }

    matches():boolean {
        return true
    }

    constructor() {
    }

}



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