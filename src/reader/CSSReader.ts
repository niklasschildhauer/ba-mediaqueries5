import * as Model from '../model/Model'
import * as Factory from '../model/Factory'

/**
 * @interface IReader<T>
 *
 * Defines a Reader class with the two methods read and get.
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
 * The class manges the media descriptors and reads CSS Code
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
     * @returns An array of the media descriptors
     */
    public get(): Model.IMediaDescriptor[] {
        return this.mediaDescriptors;
    }

    /**
     * Reads CSS Code.
     *
     * @param string   plain CSS Code to read
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
     * Searchs in the HTML Document for CSS Code
     */
    private async readAutomatic(): Promise<void> {
        //Vielleicht noch umbauen -> Effizienter machen
            // // Query the document for any element that could have styles.
            // var styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
            // var styleArray: Element[] = [];
            // styleElements.forEach((el) => {
            //    styleArray.push(el);
            // });
            // // Fetch all styles and ensure the results are in document order.
            // // Resolve with a single string of CSS text.
            // Promise.all(styleArray.map((el) => {
            //     if (el.href) {
            //         return fetch(el.href).then((response) => response.text());
            //     } else {
            //         return el.innerHTML;
            //     }
            // })).then((stylesArray) => stylesArray.join('\n'));



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
     * the media descriptors has changed.
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
     * Loads a CSS File
     */
    private async loadCSSFile(link: any) {
        return await fetch(link, {
            method: 'get'
        }).then( function (response) {
            return response.text()
        })
    }


}


