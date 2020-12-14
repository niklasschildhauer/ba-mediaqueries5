import {
    HTMLBasicElement,
    HTMLTextElement,
    PersonasWrapperView,
    ListWrapperView,
    PersonasWrapperDelegate,
    LabelButtonView,
    ApplyButtonWrapperDelegate,
    ApplyButtonWrapperView,
    IApplyButtonWrapperView,
    ListWrapperDelegate,
    IListWrapperView,
    LoginWrapperView,
    LoginDelegate,
    ImageButtonView,
    HeaderWrapperView,
    HeaderViewDelegate,
    IHeaderWrapperView,
    ILoginWrapperView, OpenButtonViewDelegate, IOpenButtonView, OpenButtonView
} from './UserPreferenceViews';

import {CommonTerm, IUserPreference, Persona} from '../model/Model';
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";

export interface IUserPreferenceViewController {
    showLoginErrorMessage(message: string): void;

    selectPersona(persona: Persona): void;

    unselectAllPersona(): void;

    getAllSetPreferences(): IUserPreference[];

    selectUserPreferences(userPreferences: IUserPreference[]): void

    showPanel(): void; // nicht im Schaubild
    hidePanel(): void; // nicht im Schuabild
}

export interface IViewController<T> {
    presenter: T;

    parseView(): void;

    removeView(): void;
}

export class UserPreferenceViewController implements IViewController<IUserPreferencePresenter>, IUserPreferenceViewController, PersonasWrapperDelegate, ApplyButtonWrapperDelegate, ListWrapperDelegate, LoginDelegate, HeaderViewDelegate, OpenButtonViewDelegate {
    presenter: IUserPreferencePresenter;

    private element = new HTMLBasicElement("div", "wrapper", null);

    private panelWrapper = new HTMLBasicElement("div", "panel-wrapper", null);

    // nicht im Schaubild // Button muss auf den Server zum download!
    private headerWrapper = new HeaderWrapperView(this)
    private personaWrapper = new PersonasWrapperView(this);
    private listWrapper = new ListWrapperView(this);
    private applyButtonWrapper = new ApplyButtonWrapperView(this);
    private loginWrapper = new LoginWrapperView(this);

    // nicht im Schaubild // Button muss auf den Server zum download!
    private showPanelButton = new OpenButtonView(this);

    public constructor(userProfile: IUserPreferenceProfile) {
        this.presenter = new UserPreferencePresenter(this, userProfile);

        this.createView();
        this.parseView();
        this.presenter.viewDidLoad();
    }

    private createView(): void {
        this.panelWrapper.appendChild(this.headerWrapper.element);
        this.panelWrapper.appendChild(this.personaWrapper.element);
        this.panelWrapper.appendChild(this.listWrapper.element);
        this.panelWrapper.appendChild(this.loginWrapper.element);
        this.panelWrapper.appendChild(this.applyButtonWrapper.element);
        this.element.appendChild(this.showPanelButton.element);
        this.element.appendChild(this.panelWrapper);
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

        // if(this.showPanelButton.element.id != null) {
        //     let child = document.getElementById(this.showPanelButton.element.id)
        //     if(child != null || child != undefined) {
        //         document.removeChild(child);
        //     }
        // }
    }

    showPanel(): void {
        this.panelWrapper.element.style.right = "2vh";
        this.showPanelButton.element.element.style.right = "-200px";
        //this.element.element.style.right = getComputedStyle(document.documentElement).getPropertyValue('--padding');
    }

    hidePanel(): void {
        this.panelWrapper.element.style.right =  "-400px";
        this.showPanelButton.element.element.style.right = "2vh";
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

    //Renamed!
    didPressLogin(username: string, password: string, from: ILoginWrapperView): void {
        this.presenter.pressedLogin(username, password);
    }
    //nicht im Schaubild
    didPressHidePanel(from: IHeaderWrapperView): void {
        this.presenter.pressedHidePanel();
    }
    //nicht im Schaubild
    didPressShowPanel(from: IOpenButtonView): void {
        this.presenter.pressedShowPanel();
    }
}

export interface IUserPreferencePresenter {

    viewDidLoad(): void;
    editPreferences(): void;
    pressedCancel(): void;
    pressedShowPanel(): void;
    pressedHidePanel(): void;
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
    pressedShowPanel(): void {
        this.view.showPanel();
    }
    pressedHidePanel(): void {
        this.view.hidePanel();
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