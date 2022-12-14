import {CommonTerm, Persona, SkipLinkValues, TableOfContentsValue, UserPreference} from "../model/Model";
/**
 * @interface IHTMLElementModel
 *
 * Represents the basic html element
 */
interface IHTMLElementModel<T> {
    type: string;
    id: string | null;
    class: string | null;
    element: T

    appendChild(child: IHTMLElementModel<HTMLElement>): void
    appendChildren(children: IHTMLElementModel<HTMLElement>[]): void
    setAttribute(attribute: string, value: string): void
}

/**
 * @class HTMLBasicElement
 *
 * Implements IHTMLElementModel as basic HTMLBasicElement and configures it
 */
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

/**
 * @class HTMLTextElement
 *
 * Implements IHTMLElementModel as html text element. It extends the HTMLBasicElement class
 */
export class HTMLTextElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, text: string) {
        super(type, id, classString);
        this.appendText(text);
    }

    public appendText(text: string): void {
        let textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    }

    public clearText(): void {
        this.element.textContent = "";
    }
}

/**
 * @class HTMLImageElement
 *
 * Represents a html image element. It extends the HTMLBasicElement class
 */
export class HTMLImageElement extends HTMLBasicElement {
    constructor(type: string, id: string | null, classString: string | null, src: string, alt: string) {
        super(type, id, classString);
        this.setAttribute("src", src);
        this.setAttribute("alt", alt);
    }
}

/**
 * @class HTMLImageElement
 *
 * Represents a html user input element. Implements IHTMLElementModel
 */
export class HTMLUserInputElement implements IHTMLElementModel<HTMLInputElement> {
    class: string | null = null;
    element: HTMLInputElement;
    id: string | null = null;
    type: string = "input";

    constructor(type: string, id: string | null, classString: string | null, placeholder: string | null) {
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
        if(placeholder != "" && placeholder != null) {
            element.setAttribute("placeholder", placeholder);
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

    public setChangeEventListener(changeCall: () => void): void {
        this.element.addEventListener("change", changeCall);
    }
}


interface IPersonaView {
    element: HTMLBasicElement;
    name: Persona;
    select(): void;
    unselect(): void;
}

/**
 * @class PersonaView
 *
 * UIView of a persona. The picture and the name are displayed.
 */
class PersonaView implements IPersonaView {
    private imageElement: HTMLImageElement;
    private nameElement: HTMLTextElement;
    public element: HTMLBasicElement;
    public name: Persona;

    constructor(name: Persona, imageSource: string) {
        this.imageElement = new HTMLImageElement("img",
            null,
            "persona-image",
            imageSource, "Zeichnung aus den Alltagsbeschreibungen");

        this.nameElement = new HTMLTextElement("p", null, "persona-label", name);
        let element = new HTMLBasicElement("div", null, "persona-div");
        element.appendChildren([this.imageElement, this.nameElement]);
        this.element = element;
        this.name = name;
    }

    public select(): void {
        this.element.setAttribute("id", "user-preference-persona-selected")
    }

    public unselect(): void {
        this.element.element.removeAttribute("id");
    }
}

export interface PersonasWrapperDelegate {
    didSelectPersona(persona: Persona, from: PersonasWrapperView): void;
}

export interface IPersonasWrapperView {
    element: HTMLBasicElement;

    selectPersona(persona: Persona): void;
    unselectAllPersonas(): void;
}

/**
 * @class PersonasWrapperView
 *
 * UIView of the persona section. It contains all personas from
 * the MOOCAP project
 */
export class PersonasWrapperView implements IPersonasWrapperView {
    private alexanderODSView = new PersonaView(Persona.alexander, "https://gpii.eu/mq-5/assets/Alexander.png");
    private annaODSView = new PersonaView(Persona.anna, "https://gpii.eu/mq-5/assets/Anna.png");
    private caroleODSView = new PersonaView(Persona.carole, "https://gpii.eu/mq-5/assets/Carole.png");
    private larsODSView = new PersonaView(Persona.lars, "https://gpii.eu/mq-5/assets/Lars.png");
    private mariaODSView = new PersonaView(Persona.maria, "https://gpii.eu/mq-5/assets/Maria.png");
    private maryODSView = new PersonaView(Persona.mary, "https://gpii.eu/mq-5/assets/Mary.png");
    private monikaODSView = new PersonaView(Persona.monika, "https://gpii.eu/mq-5/assets/Monika.png");
    private susanODSView = new PersonaView(Persona.susan, "https://gpii.eu/mq-5/assets/Susan.png");
    private tomODSView = new PersonaView(Persona.tom, "https://gpii.eu/mq-5/assets/Tom.png");

    private personaViews = [this.alexanderODSView,
        this.annaODSView,
        this.caroleODSView,
        this.larsODSView,
        this.mariaODSView,
        this.maryODSView,
        this.monikaODSView,
        this.susanODSView,
        this.tomODSView];

    public element: HTMLBasicElement

    private delegate: PersonasWrapperDelegate;

    constructor(delegate: PersonasWrapperDelegate) {
        let element = new HTMLBasicElement("div", "personas-wrapper", null);
        for (let i = 0; i < this.personaViews.length; i++) {
            this.personaViews[i].element.addClickEventListener(() =>{
                this.delegate.didSelectPersona(this.personaViews[i].name, this);
            });
            element.appendChild(this.personaViews[i].element);
        }
        this.element = element;
        this.delegate = delegate;
    }

    selectPersona(persona: Persona): void {
        for (let i = 0; i < this.personaViews.length; i++) {
            if(this.personaViews[i].name === persona) {
                this.personaViews[i].select();
            }
        }
    }

    unselectAllPersonas(): void {
        for (let i = 0; i < this.personaViews.length; i++) {
            this.personaViews[i].unselect();
        }
    }
}

/**
 * @class SwitchControlView
 *
 * Switch control to active and deactivate.
 */
export class SwitchControlView {
    public element: HTMLBasicElement;
    private checkBoxElement: HTMLUserInputElement;
    private spanElement: HTMLBasicElement;

    constructor(name: string) {
        this.checkBoxElement = new HTMLUserInputElement("checkbox", name + "-switcher", "switch-input", null);
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

    public setChangeEventListener(changeCall: () => void): void {
        this.checkBoxElement.setChangeEventListener(changeCall);
    }
}

/**
 * @class RadioButtonView
 *
 * Radio button control to choose a value of a set of values.
 */
export class RadioButtonView {
    public inputs: HTMLUserInputElement[];
    public element: HTMLBasicElement

    constructor(name: string, values: string[]) {
        this.element = new HTMLBasicElement("div", null, "radio-label");
        this.inputs = [];
        for (let i = 0; i < values.length; i++) {
            let input = new HTMLUserInputElement("radio", name + "-radio", "radio-input", null);
            input.setAttribute("name", name);
            input.setAttribute("value", "" + values[i]);

            let label = new HTMLTextElement("label", null, null, "" + values[i]);
            label.setAttribute("for", "" + values[i]);

            let div = new HTMLBasicElement("div", null, "radio-div");
            div.appendChildren([input, label]);

            this.element.appendChild(div);
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

/**
 * @class ImageButtonView
 *
 * UIView with a image as button
 */
export class ImageButtonView extends HTMLBasicElement{

    constructor(id: string | null, classString: string | null, imagePath: string, altText: string, functionCall: () => void) {
        super("span", id, classString);
        //this.element.setAttribute("type", "button");
        let imageNode = new HTMLImageElement("img", "close-button-image", "", imagePath, altText);
        this.element.appendChild(imageNode.element);

        this.addClickEventListener(functionCall);
    }

}

/**
 * @class LabelButtonView
 *
 * UIView with a label as button
 */
export class LabelButtonView extends HTMLBasicElement{

    constructor(id: string | null, classString: string | null, label: string, functionCall: () => void) {
        super("button", id, classString);
        this.element.setAttribute("type", "button");
        let textNode = document.createTextNode(label);
        this.element.appendChild(textNode);

        this.addClickEventListener(functionCall);
    }

}
export interface ApplyButtonWrapperDelegate {
    didPressApply(from: IApplyButtonWrapperView): void;
    didPressCancel(from: IApplyButtonWrapperView): void;

}

export interface IApplyButtonWrapperView {
    element: HTMLBasicElement;

    showButtons(): void;
    hideButtons(): void;
}

/**
 * @class ApplyButtonWrapperView
 *
 * UIView with confirm and cancel button
 */
export class ApplyButtonWrapperView implements IApplyButtonWrapperView {
    private applyButton = new LabelButtonView("apply-button", "button", "Apply Preferences", () => this.applyPreferences());
    private cancelButton = new LabelButtonView("cancel-button", "button", "Cancel", () => this.cancel());
    element: HTMLBasicElement;

    private delegate: ApplyButtonWrapperDelegate
    constructor(delegate: ApplyButtonWrapperDelegate) {
        this.delegate = delegate;
        let element = new HTMLBasicElement("div", null, "apply-button-wrapper")
        element.appendChildren([this.cancelButton, this.applyButton]);
        this.element = element;
    }

    private applyPreferences() {
        this.delegate.didPressApply(this);
    }

    private cancel() {
        this.delegate.didPressCancel(this);
    }

    // Not implemented
    hideButtons(): void {
        //this.element.element.removeAttribute("id");
    }

    // Not implemented
    showButtons(): void {
        //this.element.setAttribute("id", "apply-button-wrapper-show");
    }

}

export interface IHeaderWrapperView {
    element: HTMLBasicElement;

}

export interface HeaderViewDelegate {
    didPressHidePanel(from: IHeaderWrapperView): void;
}

/**
 * @class ApplyButtonWrapperView
 *
 * Header view with title and close button
 */
export class HeaderWrapperView implements IHeaderWrapperView {
    element: HTMLBasicElement;
    private headline = new HTMLTextElement("h1", null, null, "User Preferences");
    private hidePanelButton = new ImageButtonView("hide-panel-button", "button", "https://gpii.eu/mq-5/assets/close.svg", "Close Button", () => this.hidePanel());


    private delegate: HeaderViewDelegate
    constructor(delegate: HeaderViewDelegate) {
        this.delegate = delegate;
        let element = new HTMLBasicElement("div", null, "header-view-wrapper")
        element.appendChildren([this.headline, this.hidePanelButton]);
        this.element = element;
    }

    private hidePanel() {
        this.delegate.didPressHidePanel(this);
    }
}


interface ICommonTermListEntry<T> {
    element: HTMLBasicElement;
    commonTerm: CommonTerm;

    getValue(): string;
    setValue(value: string): void;
}

/**
 * @class CommonTermListEntryBooleanView
 *
 * Is a list entry with a switch control on the right side to active and
 * deactivate.
 */
class CommonTermListEntryBooleanView implements ICommonTermListEntry<SwitchControlView>{
    private label: HTMLTextElement;
    private input: SwitchControlView
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm, valueChangedCall: () => void) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new SwitchControlView(commonTerm);
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
        this.input.setChangeEventListener(valueChangedCall);
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

/**
 * @class CommonTermListEntryTextInputView
 *
 * Is a list entry with text input on the right side
 */
class CommonTermListEntryTextInputView implements ICommonTermListEntry<HTMLUserInputElement>{
    private label: HTMLTextElement;
    private input: HTMLUserInputElement;
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm, valueChangedCall: () => void) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new HTMLUserInputElement("text", commonTerm + "-input", "text-input", null);
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input]);
        this.element = element;
        this.input.setChangeEventListener(valueChangedCall);

    }

    public getValue(): string {
        return this.input.getValue();
    }

    public setValue(value: string) {
        this.input.setValue(value);
    }
}

/**
 * @class CommonTermListEntryTextInputView
 *
 * Is a list entry with radio button on the right side
 * to choose a value of a set of values
 */
class CommonTermListEntryRadioInputView implements ICommonTermListEntry<RadioButtonView>{
    private label: HTMLTextElement;
    private input: RadioButtonView;
    public commonTerm: CommonTerm;
    public element: HTMLBasicElement;


    constructor(name: string, commonTerm: CommonTerm, values: string[], valueChangedCall: () => void) {
        this.label = new HTMLTextElement("p", null, "list-entry-label", name);
        this.input = new RadioButtonView(name, values);
        this.commonTerm = commonTerm;

        let element = new HTMLBasicElement("div", null, "ct-list-entry-div");
        element.appendChildren([this.label, this.input.element]);
        this.element = element;
        for (let i = 0; i < this.input.inputs.length; i++) {
            this.input.inputs[i].setChangeEventListener(valueChangedCall);
        }
    }

    public getValue(): string {
        return this.input.getValue();
    }

    public setValue(value: string): void {
        this.input.setValue(value);
    }
}

export interface IListWrapperView {
    element: HTMLBasicElement;

    getAllPreferences(): UserPreference[];
    setPreferences(preference: UserPreference): void;
}

export interface ListWrapperDelegate {
    didEditPreferences(from: IListWrapperView): void;
}

/**
 * @class ListWrapperView
 *
 * View which contains all list entries to set the user preferences
 */
export class ListWrapperView implements  IListWrapperView {
    private audioDescriptionListEntry = new CommonTermListEntryBooleanView("Audio Description Enabled", CommonTerm.audioDescriptionEnabled, () => this.editPreference());
    private captionsEnabledListEntry = new CommonTermListEntryBooleanView("Captions Enabled", CommonTerm.captionsEnabled, () => this.editPreference());
    private pictogramsEnabledListEntry = new CommonTermListEntryBooleanView("Pictograms Enabled", CommonTerm.pictogramsEnabled, () => this.editPreference());
    // private tableOfContentsListEntry = new CommonTermListEntryBooleanView("Table of Contents", CommonTerm.tableOfContents, () => this.editPreference());
    private selfVoicingEnabledListEntry = new CommonTermListEntryBooleanView("Self-Voicing Enabled", CommonTerm.selfVoicingEnabled, () => this.editPreference());
    private signLanguageEnabledListEntry = new CommonTermListEntryBooleanView("Sign Language Enabled", CommonTerm.signLanguageEnabled, () => this.editPreference());

    private sessionTimeout = new CommonTermListEntryTextInputView("Session Timeout", CommonTerm.sessionTimeout, () => this.editPreference());
    private signLanguage = new CommonTermListEntryTextInputView("Sign Language", CommonTerm.signLanguage, () => this.editPreference());

    private displaySkiplinks = new CommonTermListEntryRadioInputView("Display Skiplinks", CommonTerm.displaySkiplinks, [SkipLinkValues.onfocus, SkipLinkValues.always, SkipLinkValues.never], () => this.editPreference());
    private tableOfContents = new CommonTermListEntryRadioInputView("Table Of Contents", CommonTerm.tableOfContents, [TableOfContentsValue.show, TableOfContentsValue.noPreferences, TableOfContentsValue.hide], () => this.editPreference());

    private listEntries = [this.audioDescriptionListEntry,
        this.captionsEnabledListEntry,
        this.pictogramsEnabledListEntry,
        this.selfVoicingEnabledListEntry,
        this.signLanguageEnabledListEntry,
        this.signLanguage,
        this.sessionTimeout,
        this.tableOfContents,
        this.displaySkiplinks,
    ]

    private delegate: ListWrapperDelegate;

    public element: HTMLBasicElement

    constructor(delegate: ListWrapperDelegate) {
        let element = new HTMLBasicElement("div", "ct-list-wrapper", null);

        for (let i = 0; i < this.listEntries.length; i++) {
            element.appendChild(this.listEntries[i].element);
        }
        this.element = element;
        this.delegate = delegate;
    }

    private editPreference(): void {
        this.delegate.didEditPreferences(this);
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

export interface ILoginWrapperView {
    showErrorMessage(text: string): void;
}

export interface LoginDelegate {
    didPressLogin(username: string, password: string, from: ILoginWrapperView): void;
}

/**
 * @class LoginWrapperView
 *
 * Login wrapper view to log into an openAPE account
 */
export class LoginWrapperView implements  ILoginWrapperView {
    private usernameField = new HTMLUserInputElement("text", "openape-username", "text-input", "Username");
    private usernameLabel = new HTMLTextElement("label", null, "openape-label", "Username");
    private passwordField = new HTMLUserInputElement("password", "openape-password", "text-input", "Password");
    private passwordLabel = new HTMLTextElement("label", null, "openape-label", "Password");
    private openAPEImage = new HTMLImageElement("img", "open-ape-logo", null, "https://gpii.eu/mq-5/assets/open-ape-logo.png", "Open Ape Logo");


    private loginButton = new LabelButtonView("login-button", "button", "Login", () => this.login());

    private errorMessage = new HTMLTextElement("p", "error-field", null, "");

    public element: HTMLBasicElement

    private delegate: LoginDelegate;

    constructor(delegate: LoginDelegate) {
        this.delegate = delegate;

        this.openAPEImage.addClickEventListener(this.openOpenAPE);

        this.element = new HTMLBasicElement("div", "login-wrapper", null);
        this.element.appendChildren([this.openAPEImage, this.usernameLabel, this.usernameField, this.passwordLabel, this.passwordField, this.loginButton, this.errorMessage]);
    }

    showErrorMessage(text: string) {
        this.errorMessage.clearText();
        this.errorMessage.appendText(text);
    }

    private login(): void{
        this.delegate.didPressLogin(this.usernameField.getValue(), this.passwordField.getValue(), this);
    }

    private openOpenAPE(): void {
        (window as any).open("https://openape.gpii.eu");
    }
}

export interface IOpenButtonView {
    element: HTMLBasicElement;

    showPanel(): void;
}

export interface OpenButtonViewDelegate {
    didPressShowPanel(from: IOpenButtonView): void;
}

/**
 * @class LoginWrapperView
 *
 * Button view to open the user preference panel
 */
export class OpenButtonView implements IOpenButtonView {
    public element: HTMLBasicElement;

    private hidePanelButton = new ImageButtonView("show-panel-button", "button", "https://gpii.eu/mq-5/assets/open.svg", "Open Button", () => this.showPanel());
    private label = new HTMLTextElement("p", "show-panel-label", null, "Change User Preferences");


    private delegate: OpenButtonViewDelegate
    constructor(delegate: OpenButtonViewDelegate) {
        this.delegate = delegate;

        const element = new HTMLBasicElement("div", "open-button-view", null);
        element.appendChildren([this.label, this.hidePanelButton]);
        this.element = element;

        this.element.addClickEventListener(() => this.showPanel());
    }

    showPanel(): void {
        this.delegate.didPressShowPanel(this);
    }
}