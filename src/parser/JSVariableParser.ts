import * as Profile from "../user/UserPreferenceProfile";
import {CommonTerm, ICommonTermList, IUserPreference} from "../model/Model";
import {Factory} from "../model/Factory";
import {ICodeParser} from "./CodeParser";

/**
 * @class JSVariableParser
 *
 * It is responsible for the Common Term Lists. It contains the User Profile and the active Common Term Lists
 */
export class JSVariableParser implements ICodeParser {
    private userProfile: Profile.IUserPreferenceProfile;
    private commonTermLists: ICommonTermList[] = [];

    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile) {
        this.userProfile = userPreferenceProfile;
        this.parse();
        (window as any).matchCommonTermMedia = (string: string) => this.createCommonTermList(string);
    }

    /**
     * Creates a CommonTermList with a media query
     *
     * @returns A CommonTermList object
     */
    private createCommonTermList(string: string): ICommonTermList {
        const list = Factory.createCommonTermListFromMQString(string);
        const matchValue = this.evaluateCommonTermList(list);
        list.setMatchValue(matchValue);
        this.commonTermLists.push(list);
        return list
    }

    /**
     * In this case all stored CommonTermLists are iterated and checked if the match or not
     * If the match value changes, the callback function of the CommonTermList is executed.
     */
    parse(): void {
        let userPreferences = this.userProfile.getUserPreferences()
        for (let i = 0; i < userPreferences.length; i++) {
            this.setJSVariableForUserPreference(userPreferences[i]);
        }
        this.evaluateCommonTermLists();
    }

    /**
     * This function iterates over all stored CommonTermLists to evaluate each of them
     */
    private evaluateCommonTermLists(): void {
        for (let i = 0; i < this.commonTermLists.length; i++) {
            const newValue = this.evaluateCommonTermList(this.commonTermLists[i]);
            let oldValue = this.commonTermLists[i].matches;
            if(oldValue != newValue) {
                this.commonTermLists[i].setMatchValue(newValue);
                this.commonTermLists[i].callbackFunction();
            }
        }
    }

    /**
     * This function evaluates a CommonTermList
     *
     * @returns the current match value of the common term list
     */
    private evaluateCommonTermList(list: ICommonTermList): boolean {
        console.log(list);
        if(this.userProfile.doesMediaQueryMatch(list.mediaQuery)) {
            console.log("1");
            if(list.mediaQuery.supportedMediaQuery !== null) {
                console.log("2");
                return this.evaluateMediaQuery(list.mediaQuery.supportedMediaQuery);
            }
            console.log("3");
            return true;
        }
        console.log("4");
        return false;
    }


    private evaluateMediaQuery(mediaQuery: string): boolean {
        const mediaQueryList = (window as any).matchMedia(mediaQuery)
        return mediaQueryList.matches
    }

    /**
     * Makes the User Preferences accessible as Variables in JS
     */
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
