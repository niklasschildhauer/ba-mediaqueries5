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
     * Calls the reload method to reset the view.
     */
    pressedCancel(): void {
        this.reload();
    }
    /**
     * Is called when the user does edit a preference. Then no persona should be selected.
     */
    editPreferences(): void {
        this.view.unselectAllPersona();
        this.pressedApplyPreferences();
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