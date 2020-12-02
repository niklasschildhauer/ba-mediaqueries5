export interface IMediaDescriptor {
    unsupportedMediaQuery: IMediaFeature[]
    supportedMediaQuery: string
    negated: boolean
    body: string
}



export interface IMediaCondition {
    mediaFeature: IMediaFeature
    value: string
    negated: boolean
}



export interface IMediaFeature {

}



export interface ISourceTag {

}



