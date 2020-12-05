export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

interface IHTMLElementModel {
    type: string;
    id: string | null;
    class: string | null;
    element: HTMLElement

    appendChild(child: IHTMLElementModel): void
}

class HTMLBasicElement implements  IHTMLElementModel {
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

    public appendChild(child: IHTMLElementModel): void {
        this.element.appendChild(child.element);
    }

    public appendChilds(childs: IHTMLElementModel[]): void {
        for (let i = 0; i < childs.length; i++) {
            this.element.appendChild(childs[i].element);
        }
    }

    public setAttribute(attribute: string, value: string) {
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


class OneDayStoryView {
    imageElement: HTMLImageElement;
    nameElement: HTMLTextElement;
    element: HTMLBasicElement;

    constructor(name: string, imageSource: string) {
        this.imageElement = new HTMLImageElement("img",
            null,
            "one-day-story-image",
            imageSource, "Zeichnung aus den Alltagsbeschreibungen");

        this.nameElement = new HTMLTextElement("p", null, "one-day-story-label", name);
        let element = new HTMLBasicElement("div", null, "one-day-story-div");
        element.appendChilds([this.imageElement, this.nameElement]);
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
        let element = new HTMLBasicElement("div", null, "one-day-stories-wrapper");
        element.appendChilds([this.alexanderODSView.element,
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

export class UserPreferenceViewController implements IUserPreferenceViewController {
    delegate: UserPreferenceViewDelegate;

    private wrapper = new HTMLBasicElement("div", "wrapper", null);
    private headlineWrapper = new HTMLBasicElement("div", "headline-wrapper", null);
    private settingsSubHeading =  new HTMLTextElement("h3", null, null, "SETTINGS");
    private userPreferencesHeading =  new HTMLTextElement("h1", null, null, "User Preferences");

    private oneDayStoriesWrapper = new OneDayStoriesWrapperView();

    public constructor(delegate: UserPreferenceViewDelegate) {
        this.delegate = delegate;

        this.refreshView();
        this.createView();
        this.parseView();
    }

    private createView(): void {
        this.headlineWrapper.appendChilds([this.settingsSubHeading, this.userPreferencesHeading])
        this.wrapper.appendChild(this.headlineWrapper);
        this.wrapper.appendChild(this.oneDayStoriesWrapper.element);

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