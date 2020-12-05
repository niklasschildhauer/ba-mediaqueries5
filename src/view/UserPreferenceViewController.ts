export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

interface IHTMLElementModel {
    type: string;
    id: string;
    element: HTMLElement

    appendChild(child: IHTMLElementModel): void
}

class HTMLElementModel implements  IHTMLElementModel {
    id: string;
    type: string;
    class: string;
    element: HTMLElement;

    constructor(type: string, id: string, classString: string) {
        this.id = "user-preference-view-" + id;
        this.class = "user-preference-view-" + classString;
        this.type = type;

        let element =  document.createElement(type);
        element.setAttribute("id", id);

        this.element = element;
    }

    public appendChild(child: IHTMLElementModel): void {
        this.element.appendChild(child.element);
    }

    public appendText(text: string): void {
        let textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    }

}

export class UserPreferenceViewController implements IUserPreferenceViewController {
    delegate: UserPreferenceViewDelegate;

    private wrapper = new HTMLElementModel("div", "wrapper", "");
    private audioDescriptionLabel = new HTMLElementModel("label", "audio-description-label", "switch");


    public constructor(delegate: UserPreferenceViewDelegate) {
        this.delegate = delegate;

        this.refreshView();
        this.createView();
        this.parseView();
    }

    private createView(): void {
        this.wrapper.appendChild(this.audioDescriptionLabel);
        this.wrapper.appendText("Hallo");

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