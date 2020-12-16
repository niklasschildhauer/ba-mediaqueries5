import {
    HTMLBasicElement,
    PersonasWrapperView,
    ListWrapperView,
    PersonasWrapperDelegate,
    ApplyButtonWrapperDelegate,
    ApplyButtonWrapperView,
    IApplyButtonWrapperView,
    ListWrapperDelegate,
    IListWrapperView,
    LoginWrapperView,
    LoginDelegate,
    HeaderWrapperView,
    HeaderViewDelegate,
    IHeaderWrapperView,
    ILoginWrapperView, OpenButtonViewDelegate, IOpenButtonView, OpenButtonView
} from './UserPreferenceViews';

import {CommonTerm, IUserPreference, Persona} from '../model/Model';
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";

/**
 * @interface IUserPreferenceViewController
 *
 * Defines the UserPreferenceViewController. The function will be called from the
 * {@linkcode IUserPreferencePresenter} which contains the logic of the view.
 */
export interface IUserPreferenceViewController {
    showLoginErrorMessage(message: string): void;
    selectPersona(persona: Persona): void;
    unselectAllPersona(): void;
    getAllSetPreferences(): IUserPreference[];
    selectUserPreferences(userPreferences: IUserPreference[]): void

    showPanel(): void; // nicht im Schaubild
    hidePanel(): void; // nicht im Schuabild
}

/**
 * @interface IViewController<T>
 *
 * Defines a ViewController with two lifecycle methods.
 */
export interface IViewController<T> {
    presenter: T;

    parseView(): void;
    removeView(): void;
}

/**
 * @class UserPreferenceViewController
 *
 * This View Controller creates all views for the User Preference Panel.
 */
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
    /**
     * Lifecycle Method
     * Inserts the view in the current HTML document
     */
    parseView(): void {
        // View is only shown, if the script is embeed at the bottom of the body and not in the header.
        if(document.body != null || document.body != undefined) {
            document.body.appendChild(this.element.element);
        }

    }

    /**
     * Lifecycle Method
     * Removes the view from the current HTML document
     */
    removeView(): void {
        if(this.element.id != null) {
            let child = document.getElementById(this.element.id)
            if(child != null || child != undefined) {
                document.removeChild(child);
            }
        }
    }

    /**
     * Changes the right Attribute of the panel to show the panel
     */
    showPanel(): void {
        this.panelWrapper.element.style.right = "2vh";
        this.showPanelButton.element.element.style.right = "-200px";
    }

    /**
     * Changes the right Attribute of the panel to hide the panel
     */
    hidePanel(): void {
        this.panelWrapper.element.style.right =  "-400px";
        this.showPanelButton.element.element.style.right = "2vh";
    }

    /**
     * Shows the current user preferences. For that the values in the
     * ListWrapperView will be set
     */
    selectUserPreferences(userPreferences: IUserPreference[]): void {
        for (let i = 0; i < userPreferences.length; i++) {
            this.listWrapper.setPreferences(userPreferences[i]);
        }
    }

    /**
     * Shows a error message in the LoginWrapperView
     */
    showLoginErrorMessage(message: string): void {
        this.loginWrapper.showErrorMessage(message);
    }

    /**
     * Shows that a persona is selected.
     */
    selectPersona(persona: Persona): void {
        this.personaWrapper.selectPersona(persona);
    }

    /**
     * Unselect all Personas
     */
    unselectAllPersona(): void {
        this.personaWrapper.unselectAllPersonas();
    }

    /**
     * @returns All set user preferences in the ListWrapperView
     */
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

/**
 * @interface IUserPreferencePresenter
 *
 * Defines the UserPreferencePresenter
 */
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

/**
 * @class UserPreferencePresenter
 *
 * Contains the logic of the view.
 */
export class UserPreferencePresenter implements IUserPreferencePresenter {
    private view: IUserPreferenceViewController;
    private userProfile: IUserPreferenceProfile;

    constructor(view: IUserPreferenceViewController, userProfile: IUserPreferenceProfile) {
        this.userProfile = userProfile;
        this.view = view;
    }

    /**
     * Is called from the view, after the ViewController is created.
     * It calls the reload function
     */
    viewDidLoad(): void {
        this.reload();
    }
    /**
     * Calls the refreshView method to reset the view.
     */
    reload() {
        this.refreshView();
    }

    /**
     * Calls the reload method to reset the view.
     */
    pressedCancel(): void {
        this.reload();
    }
    /**
     * Is called when the user does edit a preference. Then no persona should be selected.
     */
    editPreferences(): void {
        this.view.unselectAllPersona()
    }
    /**
     * Calls the User Profile to log a user in
     *
     * @param username   the openAPE username
     * @param passwort   the openAPE password
     */
    pressedLogin(username: string, password: string): void {
        this.userProfile.login(username, password);
        this.reload();
    }
    /**
     * Applies the user preferences set from the user.
     * First the UserPreferenceProfil is updated, after the reload function is executed.
     */
    pressedApplyPreferences(): void {
        this.userProfile.setUserPreferences(this.view.getAllSetPreferences());
        this.reload();
    }
    /**
     * Calls the showPanel method of the view
     */
    pressedShowPanel(): void {
        this.view.showPanel();
    }
    /**
     * Calls the hidePanel method of the view
     */
    pressedHidePanel(): void {
        this.view.hidePanel();
        this.reload();
    }
    /**
     * Tells the UserPreferenceProfile that a persona is selected
     */
    selectPersona(persona: Persona): void {
        this.userProfile.selectPersona(persona);
    }
    /**
     * Update the view to show that a persona is selcted
     */
    selectedPersona(persona: Persona): void {
        this.view.unselectAllPersona();
        this.view.selectPersona(persona);
        this.reload();
    }
    /**
     * Tells the view to show a login error message
     */
    showLoginErrorMessage(message: string): void {
        this.view.showLoginErrorMessage(message);
    }

    /**
     * Refreshs the view
     */
    private refreshView() {
        this.view.selectUserPreferences(this.userProfile.getUserPreferences());
        console.log(this.userProfile.getUserPreferences());
    }

}