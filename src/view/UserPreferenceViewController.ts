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
import {IUserPreferencePresenter, UserPreferencePresenter} from "./UserPreferencePresenter";

/**
 * @interface IUserPreferenceViewController
 *
 * Defines the UserPreferenceViewController. The functions will be called from the
 * {@linkcode IUserPreferencePresenter} which contains the logic of the view.
 */
export interface IUserPreferenceViewController {
    showLoginErrorMessage(message: string): void;
    selectPersona(persona: Persona): void;
    unselectAllPersona(): void;
    getAllSetPreferences(): IUserPreference[];
    selectUserPreferences(userPreferences: IUserPreference[]): void
    showPanel(): void;
    hidePanel(): void;
}

/**
 * @interface IViewController<T>
 *
 * Defines the lifecycle methods of a ViewController.
 */
export interface IViewController<T> {
    presenter: T;

    parseView(): void;
    removeView(): void;
}

/**
 * @class UserPreferenceViewController
 *
 * Implements IViewController<IUserPreferencePresenter> interface.
 * This view controller creates all views for the user preference panel.
 */
export class UserPreferenceViewController implements IViewController<IUserPreferencePresenter>, IUserPreferenceViewController, PersonasWrapperDelegate, ApplyButtonWrapperDelegate, ListWrapperDelegate, LoginDelegate, HeaderViewDelegate, OpenButtonViewDelegate {
    presenter: IUserPreferencePresenter;

    private element = new HTMLBasicElement("div", "wrapper", null);
    private panelWrapper = new HTMLBasicElement("div", "panel-wrapper", null);

    private headerWrapper = new HeaderWrapperView(this)
    private personaWrapper = new PersonasWrapperView(this);
    private listWrapper = new ListWrapperView(this);
    private applyButtonWrapper = new ApplyButtonWrapperView(this);
    private loginWrapper = new LoginWrapperView(this);
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
        // this.panelWrapper.appendChild(this.applyButtonWrapper.element);
        this.element.appendChild(this.showPanelButton.element);
        this.element.appendChild(this.panelWrapper);
    }

    /**
     * Lifecycle method
     * Inserts the view into the current HTML document
     */
    parseView(): void {
        // View is only shown, if the script is embed at the bottom of the body and not in the header.
        if(document.body != null || document.body != undefined) {
            document.body.appendChild(this.element.element);
        }

    }

    /**
     * Lifecycle method
     * Removes the view from the current HTML document
     */
    removeView(): void {
        if(this.element.id != null) {
            let child = document.getElementById(this.element.id)
            if(child != null || child != undefined) {
                document.body.removeChild(child);
            }
        }
    }

    /**
     * Changes the CSS "right" attribute of the panel to show the panel
     */
    showPanel(): void {
        this.panelWrapper.element.style.right = "2vh";
        this.showPanelButton.element.element.style.right = "-200px";
    }

    /**
     * Changes the CSS "right" attribute of the panel to hide the panel
     */
    hidePanel(): void {
        this.panelWrapper.element.style.right =  "-400px";
        this.showPanelButton.element.element.style.right = "2vh";
    }

    /**
     * Shows the current user preferences. For that the values in the
     * ListWrapperView will be set.
     *
     * @param userPreferences: IUserPreference[]
     */
    selectUserPreferences(userPreferences: IUserPreference[]): void {
        for (let i = 0; i < userPreferences.length; i++) {
            this.listWrapper.setPreferences(userPreferences[i]);
        }
    }

    /**
     * Shows a error message in the LoginWrapperView.
     *
     * @param message: string
     */
    showLoginErrorMessage(message: string): void {
        this.loginWrapper.showErrorMessage(message);
    }

    /**
     * Shows that a persona is selected.
     *
     * @param persona: Persona
     */
    selectPersona(persona: Persona): void {
        this.personaWrapper.selectPersona(persona);
    }

    /**
     * Unselects all Personas.
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
    /**
     * Called from the PersonasWrapperView when a persona is selected.
     *
     * @param from: PersonasWrapperView
     * @param persona: Persona
     */
    didSelectPersona(persona: Persona, from: PersonasWrapperView): void {
        this.presenter.selectPersona(persona);
    }

    /**
     * Called from the IApplyButtonWrapperView when the apply button is pressed.
     *
     * @param from: IApplyButtonWrapperView
     */
    didPressApply(from: IApplyButtonWrapperView): void {
        this.presenter.pressedApplyPreferences();
    }

    /**
     * Called from the IApplyButtonWrapperView when the cancel button is pressed
     *
     * @param from: IApplyButtonWrapperView
     */
    didPressCancel(from: IApplyButtonWrapperView): void {
        this.presenter.pressedCancel();
    }

    /**
     * Called from the IListWrapperView when a preference is edited.
     *
     * @param from: IHeaderWrapperView
     */
    didEditPreferences(from: IListWrapperView): void {
        this.presenter.editPreferences();
    }

    /**
     * Called from the ILoginWrapperView to login a user.
     *
     * @param from: IHeaderWrapperView
     * @param password: string
     * @param username: string
     */
    didPressLogin(username: string, password: string, from: ILoginWrapperView): void {
        this.presenter.pressedLogin(username, password);
    }

    /**
     * Called from the IHeaderWrapperView when the hide button is pressed.
     *
     * @param from: IHeaderWrapperView
     */
    didPressHidePanel(from: IHeaderWrapperView): void {
        this.presenter.pressedHidePanel();
    }

    /**
     * Called from the IOpenButtonView when the show button is pressed.
     *
     * @param from: IOpenButtonView
     */
    didPressShowPanel(from: IOpenButtonView): void {
        this.presenter.pressedShowPanel();
    }
}
