import * as Model from '../model/Model'
import * as Factory from '../model/Factory'

export interface IReader<T> {
    read(string: string): void
    get(): T[];
}

export interface CSSReaderDelegate {
    didResetMediaDescriptors(from: CSSReader): void
}

export class CSSReader implements IReader<Model.IMediaDescriptor> {
    private mediaDescriptors: Model.IMediaDescriptor[] = []
    private plainCSSString: string = ""
    private delegate: CSSReaderDelegate

    constructor(delegate: CSSReaderDelegate) {
        this.delegate = delegate;
    }

    public get(): Model.IMediaDescriptor[] {
        return this.mediaDescriptors;
    }

    public read(string: string): void {
        this.plainCSSString = this.plainCSSString + "\n" + string;
        this.refresh()
    }

    private refresh(): void {
        this.mediaDescriptors = [];
        this.mediaDescriptors = Factory.MediaDescriptorFactory.createMediaDescriptorsFromCSSString(this.plainCSSString);
    }

    private reset(): void {
        this.mediaDescriptors = [];
        this.plainCSSString = "";
        this.delegate.didResetMediaDescriptors(this);
    }

}


