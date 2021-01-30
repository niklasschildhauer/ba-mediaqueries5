import * as Model from '../model/Model'
import * as Factory from '../model/Factory'

/**
 * @interface IReader<T>
 *
 * Defines a reader class with the two methods read and get.
 */
export interface IReader<T> {
    read(string: string): void
    get(): T[];
}


/**
 * @interface CSSReaderDelegate
 *
 * Defines the delegate methods which will be called from the CSSReader to inform the
 * {@linkcode ScriptCoordinator} that something has changed.
 */
export interface CSSReaderDelegate {
    didUpdateMediaDescriptors(from: CSSReader): void
}


/**
 * @class UserPreferenceProfile
 *
 * Implements the IReader<Model.IMediaDescriptor> interface.
 * The class manages the media descriptors and reads CSS Code.
 */
export class CSSReader implements IReader<Model.IMediaDescriptor> {
    private mediaDescriptors: Model.IMediaDescriptor[] = [];
    private plainCSS: string[] = [];
    private delegate: CSSReaderDelegate;

    constructor(delegate: CSSReaderDelegate) {
        this.delegate = delegate;
        this.readAutomatic();
    }

    /**
     * Returns the current media descriptors
     *
     * @returns Model.IMediaDescriptor[]
     */
    public get(): Model.IMediaDescriptor[] {
        return this.mediaDescriptors;
    }

    /**
     * Reads CSS code.
     *
     * @param string   (plain CSS Code to read)
     */
    public read(string: string): void {
        if (!this.plainCSS.includes(string)) {
            this.plainCSS.push(string);
            this.refresh();
        } else {
            console.log("CSS Code is already included");
        }
    }


    /**
     * Searchs in the HTML document for CSS Code and calls the read method.
     */
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

    /**
     * Refresh method to create new media descriptors and to inform the delegate that
     * the media descriptors has changed. It is called from the read method.
     */
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

    /**
     * Loads an external CSS file.
     */
    private async loadCSSFile(link: any) {
        return await fetch(link, {
            method: 'GET'
        }).then( function (response) {
            return response.text()
        })
    }


}


