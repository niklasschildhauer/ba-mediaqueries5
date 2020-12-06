import {
    HTMLBasicElement,
    HTMLTextElement,
    PersonasWrapperView,
    ListWrapperView,
    PersonasWrapperDelegate
} from './UserPreferenceViews';

import {CommonTerm, Persona} from '../model/Model';
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";

export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

export class UserPreferenceViewController implements IUserPreferenceViewController, PersonasWrapperDelegate {
    delegate: UserPreferenceViewDelegate;
    private userProfile: IUserPreferenceProfile

    private wrapper = new HTMLBasicElement("div", "wrapper", null);
    private headlineWrapper = new HTMLBasicElement("div", "headline-wrapper", null);
    private settingsSubHeading =  new HTMLTextElement("h3", null, null, "SETTINGS");
    private userPreferencesHeading =  new HTMLTextElement("h1", null, null, "User Preferences");

    private personaWrapper = new PersonasWrapperView(this);
    private listWrapper = new ListWrapperView();

    public constructor(delegate: UserPreferenceViewDelegate, userProfile: IUserPreferenceProfile) {
        this.delegate = delegate;
        this.userProfile = userProfile;

        this.refreshView();
        this.createView();
        this.parseView();
    }

    private createView(): void {
        this.headlineWrapper.appendChildren([this.settingsSubHeading, this.userPreferencesHeading])
        this.wrapper.appendChild(this.headlineWrapper);
        this.wrapper.appendChild(this.personaWrapper.element);
        this.wrapper.appendChild(this.listWrapper.element);

    }

    private parseView(): void {
        // View is only shown, if the script is embeed at the bottom of the body and not in the header.
        if(document.body != null || document.body != undefined) {
            document.body.appendChild(this.wrapper.element);
        }
    }

    refreshView(): void {
        this.setUserPreferences();
    }

    private setUserPreferences() {
        let preferences = this.userProfile.getUserPreferences();
        for (let i = 0; i < preferences.length; i++) {
            this.listWrapper.setPreferences(preferences[i]);
        }
    }

    didSelectPersona(human: Persona, from: PersonasWrapperView): void {
        console.log("Did select hier " + human);
    }
}