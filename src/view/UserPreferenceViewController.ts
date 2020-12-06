import {CommonTerm} from "../model/Model";

export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

interface IHTMLElementModel<T> {
    type: string;
    id: string | null;
    class: string | null;
    element: T

    appendChild(child: IHTMLElementModel<HTMLElement>): void
    appendChildren(children: IHTMLElementModel<HTMLElement>[]): void
    setAttribute(attribute: string, value: string): void
}

class HTMLBasicElement implements  IHTMLElementModel<HTMLElement> {
    id: string | null = null;
    type: string;
    class: string | null = null;
    element: HTMLElement;

    constructor(type: string, id: string | null, classString: string | null) {
        this.type = type;
        let element =  document.createElement(this.type);

        if(id != "" && id != null) {
            this.id = "user-preference-view-" + id;
            element.setAttribute("id", this.id);
        }
        if(classString != "" && classString != null) {
            this.class = "user-preference-view-" + classString;
            element.setAttribute("class", this.class);
        }

        this.element = element;
    }

    public appendChild(child: IHTMLElementModel<HTMLElement>): void {
        this.element.appendChild(child.element);
    }

    public appendChildren(children: IHTMLElementModel<HTMLElement>[]): void {
        for (let i = 0; i < children.length; i++) {
            this.element.appendChild(children[i].element);
        }
    }

    public setAttribute(attribute: string, value: string): void {
        this.element.setAttribute(attribute, value);
    }
}

class HTMLTextElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, text: string) {
        super(type, id, classString);
        this.appendText(text);
    }

    public appendText(text: string): void {
        let textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    }
}

class HTMLImageElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, src: string, alt: string) {
        super(type, id, classString);
        this.setAttribute("src", src);
        this.setAttribute("alt", alt);
    }
}

class HTMLUserInputElement implements IHTMLElementModel<HTMLInputElement> {
    class: string | null = null;
    element: HTMLInputElement;
    id: string | null = null;
    type: string = "input";

    constructor(type: string, id: string | null, classString: string | null) {
        let element =  document.createElement(this.type) as HTMLInputElement;
        element.setAttribute("type", type);

        if(id != "" && id != null) {
            this.id = "user-preference-view-" + id;
            element.setAttribute("id", this.id);
        }
        if(classString != "" && classString != null) {
            this.class = "user-preference-view-" + classString;
            element.setAttribute("class", this.class);
        }

        this.element = element;
    }

    public setCheckedValue(value: boolean) {
        this.element.checked = value;
    }

    public appendChild(child: IHTMLElementModel<HTMLElement>): void {
        this.element.appendChild(child.element);
    }

    public appendChildren(children: IHTMLElementModel<HTMLElement>[]): void {
        for (let i = 0; i < children.length; i++) {
            this.element.appendChild(children[i].element);
        }
    }

    public setAttribute(attribute: string, value: string): void {
        this.element.setAttribute(attribute, value);
    }

}

class OneDayStoryView {
    private imageElement: HTMLImageElement;
    private nameElement: HTMLTextElement;
    public element: HTMLBasicElement;

    constructor(name: string, imageSource: string) {
        this.imageElement = new HTMLImageElement("img",
            null,
            "one-day-story-image",
            imageSource, "Zeichnung aus den Alltagsbeschreibungen");

        this.nameElement = new HTMLTextElement("p", null, "one-day-story-label", name);
        let element = new HTMLBasicElement("div", null, "one-day-story-div");
        element.appendChildren([this.imageElement, this.nameElement]);
        this.element = element;
    }
}

class OneDayStoriesWrapperView {
    private alexanderODSView = new OneDayStoryView("Alexander", "https://gpii.eu/mq-5/assets/Alexander.png");
    private annaODSView = new OneDayStoryView("Anna", "https://gpii.eu/mq-5/assets/Anna.png");
    private caroleODSView = new OneDayStoryView("Carole", "https://gpii.eu/mq-5/assets/Carole.png");
    private larsODSView = new OneDayStoryView("Lars", "https://gpii.eu/mq-5/assets/Lars.png");
    private mariaODSView = new OneDayStoryView("Maria", "https://gpii.eu/mq-5/assets/Maria.png");
    private maryODSView = new OneDayStoryView("Mary", "https://gpii.eu/mq-5/assets/Mary.png");
    private monikaODSView = new OneDayStoryView("Monika", "https://gpii.eu/mq-5/assets/Monika.png");
    private susanODSView = new OneDayStoryView("Susan", "https://gpii.eu/mq-5/assets/Susan.png");
    private tomODSView = new OneDayStoryView("Tom", "https://gpii.eu/mq-5/assets/Tom.png");

    public element: HTMLBasicElement

    constructor() {
        let element = new HTMLBasicElement("div", "one-day-stories-wrapper", null);
        element.appendChildren([this.alexanderODSView.element,
            this.annaODSView.element,
            this.caroleODSView.element,
            this.larsODSView.element,
            this.mariaODSView.element,
            this.maryODSView.element,
            this.monikaODSView.element,
            this.susanODSView.element,
            this.tomODSView.element]);
        this.element = element;
    }
}

class SwitchControlView {
    public element: HTMLBasicElement;
    private checkBoxElement: HTMLUserInputElement;
    private spanElement: HTMLBasicElement;

    constructor(name: string) {
        this.checkBoxElement = new HTMLUserInputElement("checkbox", name + "-switcher", "switch-input");
        this.checkBoxElement.setCheckedValue(true);
        this.spanElement = new HTMLBasicElement("span", null, "slider round");

        this.element = new HTMLBasicElement("label", null, "switch-control");
        this.element.appendChildren([this.checkBoxElement, this.spanElement]);
    }

    public setCheckedValue(value: boolean) {
        this.checkBoxElement.setCheckedValue(value);
    }
}

class RadioButtonView {
    public inputs: HTMLUserInputElement[];
    public element: HTMLBasicElement

    constructor(name: string, values: string[]) {
        this.element = new HTMLBasicElement("div", null, "radio-label");
        this.inputs = [];
        for (let i = 0; i < values.length; i++) {
            let input = new HTMLUserInputElement("radio", name + "-radio", "radio-input");
            input.setAttribute("name", name);
            input.setAttribute("value", values[i]);

            let label = new HTMLTextElement("label", null, null, values[i]);
            label.setAttribute("for", values[i]);
            this.element.appendChildren([input, label]);
            this.inputs.push(input);
        }
    }
}


interface ICommonTermListEntry<T> {
    element: HTMLBasicElement;
    commonTerm: CommonTerm;
}

class CommonTermListEntryBooleanView implements ICommonTermListEntry<SwitchControlView>{
    private label: HTMLTextElement;
    private input: SwitchControlView
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new SwitchControlView(commonTerm);
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
    }

    public setCheckedValue(value: boolean) {
        this.input.setCheckedValue(value);
    }
}

class CommonTermListEntryTextInputView implements ICommonTermListEntry<HTMLUserInputElement>{
    private label: HTMLTextElement;
    private input: HTMLUserInputElement;
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new HTMLUserInputElement("text", commonTerm + "-input", "text-input");
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input]);
        this.element = element;
    }
}

class CommonTermListEntryRadioInputView implements ICommonTermListEntry<RadioButtonView>{
    private label: HTMLTextElement;
    private input: RadioButtonView;
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm, values: string[]) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new RadioButtonView(name, values);
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
    }
}

class ListWrapperView {
    private audioDescriptionListEntry = new CommonTermListEntryBooleanView("Audio Description Enabled", CommonTerm.audioDescriptionEnabled);
    private captionsEnabledListEntry = new CommonTermListEntryBooleanView("Captions Enabled", CommonTerm.captionsEnabled);
    private pictogramsEnabledListEntry = new CommonTermListEntryBooleanView("Pictograms Enabled", CommonTerm.pictogramsEnabled);
    private tableOfContentsListEntry = new CommonTermListEntryBooleanView("Table of Contents", CommonTerm.audioDescriptionEnabled);
    private selfVoicingEnabledListEntry = new CommonTermListEntryBooleanView("Self-Voicing Enabled", CommonTerm.audioDescriptionEnabled);
    private signLanguageEnabledListEntry = new CommonTermListEntryBooleanView("Sign Language Enabled", CommonTerm.audioDescriptionEnabled);

    private sessionTimeout = new CommonTermListEntryTextInputView("Session Timeout", CommonTerm.sessionTimeout);
    private signLanguage = new CommonTermListEntryTextInputView("Sign Language", CommonTerm.signLanguage);

    private displaySkiplinks = new CommonTermListEntryRadioInputView("Display Skiplinks", CommonTerm.displaySkiplinks, ["always", "never", "onfocus"]);



    public element: HTMLBasicElement

    constructor() {
        let element = new HTMLBasicElement("div", "ct-list-wrapper", null);
        element.appendChildren([this.audioDescriptionListEntry.element,
            this.captionsEnabledListEntry.element,
            this.pictogramsEnabledListEntry.element,
            this.tableOfContentsListEntry.element,
            this.selfVoicingEnabledListEntry.element,
            this.signLanguageEnabledListEntry.element,
            this.signLanguage.element,
            this.sessionTimeout.element,
            this.displaySkiplinks.element,
        ]);
        this.element = element;
        this.audioDescriptionListEntry.setCheckedValue(true);
    }
}

export class UserPreferenceViewController implements IUserPreferenceViewController {
    delegate: UserPreferenceViewDelegate;

    private wrapper = new HTMLBasicElement("div", "wrapper", null);
    private headlineWrapper = new HTMLBasicElement("div", "headline-wrapper", null);
    private settingsSubHeading =  new HTMLTextElement("h3", null, null, "SETTINGS");
    private userPreferencesHeading =  new HTMLTextElement("h1", null, null, "User Preferences");

    private oneDayStoriesWrapper = new OneDayStoriesWrapperView();
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
}