import {Persona} from "../model/Model";
import {IUserPreferenceProfile} from "../user/UserPreferenceProfile";
import {IUserPreferenceViewController} from "./UserPreferenceViewController";

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
     * Is called when the cancel button is pressed.
     * Calls the reload method to reset the view.
     */
    pressedCancel(): void {
        this.reload();
    }
    /**
     * Is called when the user does edit a preference.
     * Then no persona should be selected.
     */
    editPreferences(): void {
        this.view.unselectAllPersona();
        this.pressedApplyPreferences();
    }
    /**
     * Calls the user profile to log in a user
     *
     * @param username: string   (openAPE username)
     * @param passwort: string   (openAPE password)
     */
    pressedLogin(username: string, password: string): void {
        this.userProfile.login(username, password);
        this.reload();
    }
    /**
     * Applies the user preferences set from the user.
     * First the UserPreferenceProfil is updated, after that the reload function is executed.
     */
    pressedApplyPreferences(): void {
        this.userProfile.setUserPreferences(this.view.getAllSetPreferences());
        this.reload();
    }
    /**
     * Is called when the show panel button is pressed.
     * Calls the showPanel method of the view.
     */
    pressedShowPanel(): void {
        this.view.showPanel();
    }
    /**
     * Is called when the hide panel is pressed.
     * Calls the hidePanel method of the view.
     */
    pressedHidePanel(): void {
        this.view.hidePanel();
        this.reload();
    }
    /**
     * Tells the UserPreferenceProfile that a persona is selected.
     *
     * @param: persona: Persona
     */
    selectPersona(persona: Persona): void {
        this.userProfile.selectPersona(persona);
    }
    /**
     * Updates the view to show that a persona is selected.
     *
     * @param persona: Persona
     */
    selectedPersona(persona: Persona): void {
        this.view.unselectAllPersona();
        this.view.selectPersona(persona);
        this.reload();
    }
    /**
     * Tells the view to show a login error message.
     *
     * @param: message: string
     */
    showLoginErrorMessage(message: string): void {
        this.view.showLoginErrorMessage(message);
    }

    /**
     * Refreshes the view
     */
    private refreshView() {
        this.view.selectUserPreferences(this.userProfile.getUserPreferences());
    }

}