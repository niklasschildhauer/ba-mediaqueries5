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
    IListWrapperView, LoginWrapperView, LoginDelegate
} from './UserPreferenceViews';

import {CommonTerm, IUserPreference, Persona} from '../model/Model';
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";

export interface IUserPreferenceViewController {
    showLoginErrorMessage(message: string): void;
    selectPersona(persona: Persona): void;
    unselectAllPersona(): void;
    getAllSetPreferences(): IUserPreference[];
    selectUserPreferences(userPreferences: IUserPreference[]): void
}

export interface IViewController<T> {
    presenter: T;

    parseView(): void;
    removeView(): void;
}

export class UserPreferenceViewController implements IViewController<IUserPreferencePresenter>, IUserPreferenceViewController, PersonasWrapperDelegate, ApplyButtonWrapperDelegate, ListWrapperDelegate, LoginDelegate {
    presenter: IUserPreferencePresenter;

    private element = new HTMLBasicElement("div", "wrapper", null);
    private headline = new HTMLTextElement("h1", null, null, "User Preferences");

    private personaWrapper = new PersonasWrapperView(this);
    private listWrapper = new ListWrapperView(this);
    private applyButtonWrapper = new ApplyButtonWrapperView(this);
    private loginWrapper = new LoginWrapperView(this);


    public constructor(userProfile: IUserPreferenceProfile) {
        this.presenter = new UserPreferencePresenter(this, userProfile);

        this.createView();
        this.parseView();
        this.presenter.viewDidLoad();
    }

    private createView(): void {
        // this.headlineWrapper.appendChildren([this.settingsSubHeading, this.userPreferencesHeading])
        this.element.appendChild(this.headline);
        this.element.appendChild(this.personaWrapper.element);
        this.element.appendChild(this.loginWrapper.element);
        this.element.appendChild(this.listWrapper.element);
        this.element.appendChild(this.applyButtonWrapper.element);
    }

    parseView(): void {
        // View is only shown, if the script is embeed at the bottom of the body and not in the header.
        if(document.body != null || document.body != undefined) {
            document.body.appendChild(this.element.element);
        }
    }

    removeView(): void {
        if(this.element.id != null) {
            let child = document.getElementById(this.element.id)
            if(child != null || child != undefined) {
                document.removeChild(child);
            }
        }
    }

    selectUserPreferences(userPreferences: IUserPreference[]): void {
        for (let i = 0; i < userPreferences.length; i++) {
            this.listWrapper.setPreferences(userPreferences[i]);
        }
    }
    showLoginErrorMessage(message: string): void {
        this.loginWrapper.showErrorMessage(message);
    }

    selectPersona(persona: Persona): void {
        this.personaWrapper.selectPersona(persona);
    }

    unselectAllPersona(): void {
        this.personaWrapper.unselectAllPersonas();
    }

    getAllSetPreferences(): IUserPreference[] {
        return this.listWrapper.getAllPreferences();
    }


    // DELEGATE FUNCTIONS
    didSelectPersona(persona: Persona, from: PersonasWrapperView): void {
        console.log("Did select hier " + persona);
        this.presenter.selectPersona(persona);
    }

    didPressApply(from: IApplyButtonWrapperView): void {
        this.presenter.pressedApplyPreferences();
    }

    didPressCancel(from: IApplyButtonWrapperView): void {
        this.presenter.pressedCancel();
    }

    didEditPreferences(from: IListWrapperView): void {
        this.presenter.editPreferences();
    }

    didTapLogin(username: string, password: string): void {
        this.presenter.pressedLogin(username, password);
    }
}

export interface IUserPreferencePresenter {

    viewDidLoad(): void;
    editPreferences(): void;
    pressedCancel(): void;
    pressedLogin(username: string, password: string): void;
    pressedApplyPreferences(): void;
    selectPersona(persona: Persona): void;
    selectedPersona(persona: Persona): void;
    showLoginErrorMessage(message: string): void;
    reload(): void
}

export class UserPreferencePresenter implements IUserPreferencePresenter {
    private view: IUserPreferenceViewController;
    private userProfile: IUserPreferenceProfile;

    constructor(view: IUserPreferenceViewController, userProfile: IUserPreferenceProfile) {
        this.userProfile = userProfile;
        this.view = view;
    }

    viewDidLoad(): void {
        this.reload();
    }
    reload() {
        this.refreshView();
    }
    pressedCancel(): void {
        this.reload();
    }
    editPreferences(): void {
        this.view.unselectAllPersona()
    }
    pressedLogin(username: string, password: string): void {
        this.userProfile.login(username, password);
        this.reload();
    }
    pressedApplyPreferences(): void {
        this.userProfile.setUserPreferences(this.view.getAllSetPreferences());
        this.reload();
    }
    selectPersona(persona: Persona): void {
        this.userProfile.selectPersona(persona);
    }
    selectedPersona(persona: Persona): void {
        this.view.unselectAllPersona();
        this.view.selectPersona(persona);
        this.reload();
    }
    showLoginErrorMessage(message: string): void {
        this.view.showLoginErrorMessage(message);
    }

    private refreshView() {
        this.view.selectUserPreferences(this.userProfile.getUserPreferences());
        console.log(this.userProfile.getUserPreferences());
    }

}