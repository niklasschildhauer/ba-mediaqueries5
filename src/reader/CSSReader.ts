import * as Model from '../model/Model'
export interface IReader<T> {
    read(string: string): void
    get(): T;
}


//
// export class CSSReader implements IReader<Model.IMediaDescriptor> {
//
//     public constructor() {
//     }
//
//     get(): Model.IMediaDescriptor {
//         return "Hallo" as Model.IMediaDescriptor;
//     }
//
//     read(string: string): void {
//     }
//
// }

/*

*/
