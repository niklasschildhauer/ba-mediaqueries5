import {
    HTMLBasicElement,
    HTMLTextElement,
    OneDayStoriesWrapperView,
    ListWrapperView,
    OneDayStoriesWrapperDelegate
} from './UserPreferenceViews';

import { OneDayStoriesPeople } from '../model/Model';

export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

export class UserPreferenceViewController implements IUserPreferenceViewController, OneDayStoriesWrapperDelegate {
    delegate: UserPreferenceViewDelegate;

    private wrapper = new HTMLBasicElement("div", "wrapper", null);
    private headlineWrapper = new HTMLBasicElement("div", "headline-wrapper", null);
    private settingsSubHeading =  new HTMLTextElement("h3", null, null, "SETTINGS");
    private userPreferencesHeading =  new HTMLTextElement("h1", null, null, "User Preferences");

    private oneDayStoriesWrapper = new OneDayStoriesWrapperView(this);
    private listWrapper = new ListWrapperView();

    public constructor(delegate: UserPreferenceViewDelegate) {
        this.delegate = delegate;

        this.refreshView();
        this.createView();
        this.parseView();
    }

    private createView(): void {
        this.headlineWrapper.appendChildren([this.settingsSubHeading, this.userPreferencesHeading])
        this.wrapper.appendChild(this.headlineWrapper);
        this.wrapper.appendChild(this.oneDayStoriesWrapper.element);
        this.wrapper.appendChild(this.listWrapper.element);

    }

    private parseView(): void {
        // View is only shown, if the script is embeed at the bottom of the body and not in the header.
        if(document.body != null || document.body != undefined) {
            document.body.appendChild(this.wrapper.element);
        }
    }

    refreshView(): void {
        console.log("refreshView");
        this.delegate.setUserPreferences("Hallo über das Delegate", this);
    }

    didSelectHuman(human: OneDayStoriesPeople): void {
        console.log("Did select hier " + human);
    }
}