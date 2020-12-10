import {
    HTMLBasicElement,
    HTMLTextElement,
    PersonasWrapperView,
    ListWrapperView,
    PersonasWrapperDelegate,
    ButtonView,
    ApplyButtonWrapperDelegate,
    ApplyButtonWrapperView,
    IApplyButtonWrapperView,
    ListWrapperDelegate,
    IListWrapperView, LoginWrapper, LoginDelegate
} from './UserPreferenceViews';

import {CommonTerm, Persona} from '../model/Model';
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";

export interface IUserPreferenceViewController {
    refreshView(): void;
    showLoginErrorMessage(message: string): void;
}

export interface UserPreferenceViewDelegate {
}

export class UserPreferenceViewController implements IUserPreferenceViewController, PersonasWrapperDelegate, ApplyButtonWrapperDelegate, ListWrapperDelegate, LoginDelegate {
    delegate: UserPreferenceViewDelegate;
    private userProfile: IUserPreferenceProfile

    private wrapper = new HTMLBasicElement("div", "wrapper", null);
    // private headlineWrapper = new HTMLBasicElement("div", "headline-wrapper", null);
    // private settingsSubHeading =  new HTMLTextElement("h3", null, null, "SETTINGS");
    private userPreferencesHeading = new HTMLTextElement("h1", null, null, "User Preferences");

    private personaWrapper = new PersonasWrapperView(this);
    private listWrapper = new ListWrapperView(this);

    private applyButtonWrapper = new ApplyButtonWrapperView(this);

    private loginWrapper = new LoginWrapper(this);


    public constructor(delegate: UserPreferenceViewDelegate, userProfile: IUserPreferenceProfile) {
        this.delegate = delegate;
        this.userProfile = userProfile;

        this.refreshView();
        this.createView();
        this.parseView();
    }

    private createView(): void {
        // this.headlineWrapper.appendChildren([this.settingsSubHeading, this.userPreferencesHeading])
        this.wrapper.appendChild(this.userPreferencesHeading);
        this.wrapper.appendChild(this.personaWrapper.element);
        this.wrapper.appendChild(this.loginWrapper.element);
        this.wrapper.appendChild(this.listWrapper.element);
        this.wrapper.appendChild(this.applyButtonWrapper.element);
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


    showLoginErrorMessage(message: string): void {
        this.loginWrapper.showErrorMessage(message);
    }

    // DELEGATE FUNCTIONS
    didSelectPersona(persona: Persona, from: PersonasWrapperView): void {
        console.log("Did select hier " + persona);
        this.userProfile.didSelectPersona(persona);
        //this.applyButtonWrapper.hideButtons();
    }

    didPressApply(from: IApplyButtonWrapperView): void {
        this.userProfile.setUserPreferences(this.listWrapper.getAllPreferences());
    }

    didPressCancel(from: IApplyButtonWrapperView): void {
        this.refreshView();
    }

    didEditPreferences(from: IListWrapperView): void {
        this.personaWrapper.unSelectPersona();
        //this.applyButtonWrapper.showButtons();
        console.log("did edit preference");
    }

    didTapLogin(username: string, password: string): void {
        this.userProfile.login(username, password);
    }
}