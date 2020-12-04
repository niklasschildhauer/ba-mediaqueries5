import * as Model from '../model/Model'
import * as Factory from '../model/Factory'
export interface IReader<T> {
    read(string: string): void
    get(): T[];
}

export class CSSReader implements IReader<Model.IMediaDescriptor> {
    private mediaDescriptors: Model.IMediaDescriptor[] = []
    private plainCSSString: string = ""

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

}


