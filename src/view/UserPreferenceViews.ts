import {CommonTerm, OneDayStoriesPeople, SkipLinkValues, UserPreference} from "../model/Model";
import {UserPreferenceProfile} from "../user/UserPreferenceProfile";

interface IHTMLElementModel<T> {
    type: string;
    id: string | null;
    class: string | null;
    element: T

    appendChild(child: IHTMLElementModel<HTMLElement>): void
    appendChildren(children: IHTMLElementModel<HTMLElement>[]): void
    setAttribute(attribute: string, value: string): void
}

export class HTMLBasicElement implements  IHTMLElementModel<HTMLElement> {
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

    public addClickEventListener(listener: () => any): void{
        this.element.addEventListener("click", listener);
    }
}

export class HTMLTextElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, text: string) {
        super(type, id, classString);
        this.appendText(text);
    }

    public appendText(text: string): void {
        let textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    }
}

export class HTMLImageElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, src: string, alt: string) {
        super(type, id, classString);
        this.setAttribute("src", src);
        this.setAttribute("alt", alt);
    }
}

export class HTMLUserInputElement implements IHTMLElementModel<HTMLInputElement> {
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

    public setValue(value: string): void {
        this.element.value = value;
    }

    public getValue(): string {
        return this.element.value;
    }

    public getCheckedValue(): boolean {
        return this.element.checked;
    }

    public setCheckedValue(value: boolean): void {
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
    public name: OneDayStoriesPeople;

    constructor(name: OneDayStoriesPeople, imageSource: string) {
        this.imageElement = new HTMLImageElement("img",
            null,
            "one-day-story-image",
            imageSource, "Zeichnung aus den Alltagsbeschreibungen");

        this.nameElement = new HTMLTextElement("p", null, "one-day-story-label", name);
        let element = new HTMLBasicElement("div", null, "one-day-story-div");
        element.appendChildren([this.imageElement, this.nameElement]);
        this.element = element;
        this.name = name;
    }
}

export interface OneDayStoriesWrapperDelegate {
    didSelectHuman(human: OneDayStoriesPeople, from: OneDayStoriesWrapperView): void;
}

export class OneDayStoriesWrapperView {
    private alexanderODSView = new OneDayStoryView(OneDayStoriesPeople.alexander, "https://gpii.eu/mq-5/assets/Alexander.png");
    private annaODSView = new OneDayStoryView(OneDayStoriesPeople.anna, "https://gpii.eu/mq-5/assets/Anna.png");
    private caroleODSView = new OneDayStoryView(OneDayStoriesPeople.carole, "https://gpii.eu/mq-5/assets/Carole.png");
    private larsODSView = new OneDayStoryView(OneDayStoriesPeople.lars, "https://gpii.eu/mq-5/assets/Lars.png");
    private mariaODSView = new OneDayStoryView(OneDayStoriesPeople.maria, "https://gpii.eu/mq-5/assets/Maria.png");
    private maryODSView = new OneDayStoryView(OneDayStoriesPeople.mary, "https://gpii.eu/mq-5/assets/Mary.png");
    private monikaODSView = new OneDayStoryView(OneDayStoriesPeople.monika, "https://gpii.eu/mq-5/assets/Monika.png");
    private susanODSView = new OneDayStoryView(OneDayStoriesPeople.susan, "https://gpii.eu/mq-5/assets/Susan.png");
    private tomODSView = new OneDayStoryView(OneDayStoriesPeople.tom, "https://gpii.eu/mq-5/assets/Tom.png");

    private oneDayStoriesViews = [this.alexanderODSView,
        this.annaODSView,
        this.caroleODSView,
        this.larsODSView,
        this.mariaODSView,
        this.maryODSView,
        this.monikaODSView,
        this.susanODSView,
        this.tomODSView];

    public element: HTMLBasicElement

    private delegate: OneDayStoriesWrapperDelegate;

    constructor(delegate: OneDayStoriesWrapperDelegate) {
        let element = new HTMLBasicElement("div", "one-day-stories-wrapper", null);
        for (let i = 0; i < this.oneDayStoriesViews.length; i++) {
            this.oneDayStoriesViews[i].element.addClickEventListener(() =>{
                this.delegate.didSelectHuman(this.oneDayStoriesViews[i].name, this);
            })
            element.appendChild(this.oneDayStoriesViews[i].element);
        }
        this.element = element;
        this.delegate = delegate;
    }
}

export class SwitchControlView {
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

    public getCheckedValue(): boolean {
        return this.checkBoxElement.getCheckedValue();
    }
}

export class RadioButtonView {
    public inputs: HTMLUserInputElement[];
    public element: HTMLBasicElement

    constructor(name: string, values: string[]) {
        this.element = new HTMLBasicElement("div", null, "radio-label");
        this.inputs = [];
        for (let i = 0; i < values.length; i++) {
            let input = new HTMLUserInputElement("radio", name + "-radio", "radio-input");
            input.setAttribute("name", name);
            input.setAttribute("value", "" + values[i]);

            let label = new HTMLTextElement("label", null, null, "" + values[i]);
            label.setAttribute("for", "" + values[i]);
            this.element.appendChildren([input, label]);
            this.inputs.push(input);
        }
    }

    public getValue(): string {
        for (let i = 0; i < this.inputs.length; i++) {
            if(this.inputs[i].getCheckedValue()) {
                return this.inputs[i].getValue();
            }
        }
        return "";
    }

    public setValue(value: string) {
        for (let i = 0; i < this.inputs.length; i++) {
            if(this.inputs[i].getValue() == value) {
                this.inputs[i].setCheckedValue(true);
            }
        }
    }
}


interface ICommonTermListEntry<T> {
    element: HTMLBasicElement;
    commonTerm: CommonTerm;

    getValue(): string;
    setValue(value: string): void;
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

    public setValue(value: string): void {
        if(value == "true") {
            this.input.setCheckedValue(true);
        } else {
            this.input.setCheckedValue(false);
        }

    }

    public getValue(): string {
        return this.input.getCheckedValue() + ""; // HIER FEHLT NOCH WAS!
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

    public getValue(): string {
        return this.input.getValue();
    }

    public setValue(value: string) {
        this.input.setValue(value);
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

    public getValue(): string {
        return this.input.getValue();
    }

    public setValue(value: string): void {
        this.input.setValue(value);
    }
}

export class ListWrapperView {
    private audioDescriptionListEntry = new CommonTermListEntryBooleanView("Audio Description Enabled", CommonTerm.audioDescriptionEnabled);
    private captionsEnabledListEntry = new CommonTermListEntryBooleanView("Captions Enabled", CommonTerm.captionsEnabled);
    private pictogramsEnabledListEntry = new CommonTermListEntryBooleanView("Pictograms Enabled", CommonTerm.pictogramsEnabled);
    private tableOfContentsListEntry = new CommonTermListEntryBooleanView("Table of Contents", CommonTerm.tableOfContents);
    private selfVoicingEnabledListEntry = new CommonTermListEntryBooleanView("Self-Voicing Enabled", CommonTerm.selfVoicingEnabled);
    private signLanguageEnabledListEntry = new CommonTermListEntryBooleanView("Sign Language Enabled", CommonTerm.signLanguageEnabled);

    private sessionTimeout = new CommonTermListEntryTextInputView("Session Timeout", CommonTerm.sessionTimeout);
    private signLanguage = new CommonTermListEntryTextInputView("Sign Language", CommonTerm.signLanguage);

    private displaySkiplinks = new CommonTermListEntryRadioInputView("Display Skiplinks", CommonTerm.displaySkiplinks, [SkipLinkValues.onfocus, SkipLinkValues.always, SkipLinkValues.never]);

    private listEntries = [this.audioDescriptionListEntry,
        this.captionsEnabledListEntry,
        this.pictogramsEnabledListEntry,
        this.tableOfContentsListEntry,
        this.selfVoicingEnabledListEntry,
        this.signLanguageEnabledListEntry,
        this.signLanguage,
        this.sessionTimeout,
        this.displaySkiplinks,
    ]

    public element: HTMLBasicElement

    constructor() {
        let element = new HTMLBasicElement("div", "ct-list-wrapper", null);

        for (let i = 0; i < this.listEntries.length; i++) {
            element.appendChild(this.listEntries[i].element);
        }
        this.element = element;
    }

    getAllPreferences(): UserPreference[] {
        let preferences: UserPreference[] = [];
        for (let i = 0; i < this.listEntries.length; i++) {
            preferences.push(new UserPreference(this.listEntries[i].commonTerm, this.listEntries[i].getValue()))
        }
        return preferences;
    }

    setPreferences(preference: UserPreference): void {
        for (let i = 0; i < this.listEntries.length; i++) {
            if(preference.mediaFeature == this.listEntries[i].commonTerm) {
                this.listEntries[i].setValue(preference.value);
            }
        }
    }
}