import * as Model from '../model/Model'
import * as Factory from '../model/Factory'

export interface IReader<T> {
    read(string: string): void
    get(): T[];
}

export interface CSSReaderDelegate {
    didUpdateMediaDescriptors(from: CSSReader): void
}

export class CSSReader implements IReader<Model.IMediaDescriptor> {
    private mediaDescriptors: Model.IMediaDescriptor[] = []
    private plainCSS: string[] = []
    private delegate: CSSReaderDelegate

    constructor(delegate: CSSReaderDelegate) {
        this.delegate = delegate;
        this.readAutomatic();
    }

    public get(): Model.IMediaDescriptor[] {
        return this.mediaDescriptors;
    }

    public read(string: string): void {
        if (!this.plainCSS.includes(string)) {
            this.plainCSS.push(string);
            this.refresh()
        } else {
            console.log("CSS Code is already included");
        }
    }

    private async readAutomatic(): Promise<void> {
        let stylesSheets = document.querySelectorAll('link');
        for (let i = stylesSheets.length; i--;) {
            if (stylesSheets[i].getAttribute('rel') === 'stylesheet') {
                let link = stylesSheets[i].getAttribute('href')
                let text = await this.loadCSSFile(link)
                    .then(function (text) {
                        return text;
                    })
                this.read(text);
            }
        }
    }

    private refresh(): void {
        if(this.plainCSS.length != 0) {
            let plainCSSCodeString = this.plainCSS.reverse().join("\n");
            this.mediaDescriptors = Factory.Factory.createMediaDescriptorsFromCSSString(plainCSSCodeString);
        }
        this.delegate.didUpdateMediaDescriptors(this);
    }

    private reset(): void {
        this.mediaDescriptors = [];
        this.plainCSS = [];
        this.refresh();
    }

    private async loadCSSFile(link: any) {
        return await fetch(link, {
            method: 'get'
        }).then( function (response) {
            return response.text()
        })
    }


}


