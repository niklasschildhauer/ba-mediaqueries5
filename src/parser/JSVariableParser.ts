import * as Profile from "../user/UserPreferenceProfile";
import {CommonTerm, CommonTermList, ICommonTermList, IUserPreference} from "../model/Model";
import {Factory} from "../model/Factory";
import {ICodeParser} from "./CodeParser";

export class JSVariableParser implements ICodeParser {
    private userProfile: Profile.IUserPreferenceProfile;
    private commonTermLists: ICommonTermList[] = [];

    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile) {
        this.userProfile = userPreferenceProfile;
        this.parse();
        (window as any).matchCommonTermMedia = (string: string) => this.createCommonTermList(string);
    }

    private createCommonTermList(string: string): ICommonTermList {
        const list = Factory.createCommonTermListFromMQString(string);
        this.commonTermLists.push(list);
        return list
    }


    parse(): void {
        let userPreferences = this.userProfile.getUserPreferences()
        for (let i = 0; i < userPreferences.length; i++) {
            this.setJSVariableForUserPreference(userPreferences[i]);
        }
        this.evaluateCommonTermLists();
    }

    private evaluateCommonTermLists(): void {
        for (let i = 0; i < this.commonTermLists.length; i++) {
            const matchValue = this.evaluateCommonTermList(this.commonTermLists[i]);
            this.commonTermLists[i].setMatchValue(matchValue);
            this.commonTermLists[i].callbackFunction();
        }
    }

    private evaluateCommonTermList(list: ICommonTermList): boolean {
        console.log(list);
        if(this.userProfile.doesMediaQueryMatch(list.mediaQuery)) {
            console.log("1");
            if(list.mediaQuery.supportedMediaQuery !== null) {
                console.log("2");
                return this.evaluateMediaQueryList(list.mediaQuery.supportedMediaQuery);
            }
            console.log("3");
            return true;
        }
        console.log("4");
        return false;
    }

    private evaluateMediaQueryList(mediaQuery: string): boolean {
        const mediaQueryList = (window as any).matchMedia(mediaQuery)
        return mediaQueryList.matches
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
