import {
    IMediaDescriptor,
    IMediaFeature,
    MediaDescriptor,
    CommonTermUtil,
    MediaFeature,
    CommonTerm,
    ICommonTermList, CommonTermList
} from "./Model";
import * as common from '../common/utility'
import {removeUnimportantCharactersFrom} from "../common/utility";


export class Factory {
    public static createMediaDescriptorsFromCSSString(cssCode: string): IMediaDescriptor[] {
        const regex = new RegExp("@media.(.*?).\\{", "g")

        let matches = cssCode.matchAll(regex);
        let result = matches.next();
        let mediaDescriptors = []
        while (!result.done) {
            if (result.value[1] != undefined && result.value.index != undefined) {
                let queryString = result.value[1];
                let queryIndex = result.value.index;
                if (CommonTermUtil.containsCommonTermMediaFeature(queryString)[0]) {
                    let body = common.getTextBetweenBrackets(cssCode.slice(queryIndex), "{", "}");
                    mediaDescriptors.push(this.createMediaDescriptorFromMQStringAndBodyString(queryString, body));
                }
            }
            result = matches.next();
        }

        return mediaDescriptors;
    }

    public static createMediaDescriptorFromMQStringAndBodyString(mediaQuery: string, body: string): IMediaDescriptor {
        let query = mediaQuery;
        let negated: boolean

        [negated, query] = this.isMediaQueryNegated(query);

        let mediaConditions = this.split(query, "and");
        let supportedMediaQuery: string[] = [];
        let unsupportedMediaQuery: IMediaFeature[] = [];
        for (const condition of mediaConditions) {
            let commonTermMediaFeature = CommonTermUtil.containsCommonTermMediaFeature(condition)
            if (commonTermMediaFeature[0]) {
                unsupportedMediaQuery.push(this.createMediaFeatureFrom(condition));
            } else {
                supportedMediaQuery.push(condition);
            }
        }
        console.log("---------------");
        console.log(unsupportedMediaQuery);
        console.log(body);
        console.log(supportedMediaQuery.join("and"));
        console.log(negated)
        console.log("---------------");

        let supportedMediaQueryString: string | null = supportedMediaQuery.join("and")
        if (negated) {
            supportedMediaQueryString = "not " + supportedMediaQueryString
        }

        if (supportedMediaQueryString == "") {
            supportedMediaQueryString = null;
        }

        return new MediaDescriptor(unsupportedMediaQuery, supportedMediaQueryString, body, negated)
    }

    //Zusammenwerfen ??
    public static createCommonTermListFromMQString(mediaQuery: string): ICommonTermList {
        let query = mediaQuery;
        let negated: boolean

        [negated, query] = this.isMediaQueryNegated(query);

        let mediaConditions = this.split(query, "and");
        let supportedMediaQuery: string[] = [];
        let unsupportedMediaQuery: IMediaFeature[] = [];
        for (const condition of mediaConditions) {
            let commonTermMediaFeature = CommonTermUtil.containsCommonTermMediaFeature(condition)
            if (commonTermMediaFeature[0]) {
                unsupportedMediaQuery.push(this.createMediaFeatureFrom(condition));
            } else {
                supportedMediaQuery.push(condition);
            }
        }
        console.log("---------------");
        console.log(unsupportedMediaQuery);
        console.log(supportedMediaQuery.join("and"));
        console.log(negated)
        console.log("---------------");

        let supportedMediaQueryString: string | null = supportedMediaQuery.join("and")
        if (negated) {
            supportedMediaQueryString = "not " + supportedMediaQueryString
        }

        if (supportedMediaQueryString == "") {
            supportedMediaQueryString = null;
        }

        return new CommonTermList(unsupportedMediaQuery, supportedMediaQueryString, negated)
    }

    public static createMediaFeatureFrom(condition: string): IMediaFeature {
        let conditionString = removeUnimportantCharactersFrom(condition);

        let negated = false;
        if (conditionString.match("not")) {
            negated = true;
            conditionString = conditionString.replace("not", "");
        }

        let value = "true";
        let valueArray = conditionString.match(":(.*).");
        if(valueArray != null) {
            value = valueArray[1];
            conditionString = conditionString.replace(":" + value, "");
        }



        let mediaFeature = CommonTermUtil.containsCommonTermMediaFeature(conditionString)[1];

        if(mediaFeature == null || mediaFeature == undefined) {
            throw new Error('There is no matching common term: ' + conditionString);
        }
        return new MediaFeature(mediaFeature, negated, value);
    }

    // checks if the media Query is negated or not.
    private static isMediaQueryNegated(mediaQuery: string) : [boolean, string] {
        if (mediaQuery.slice(0, 3).match("not")) {
            return [true, mediaQuery.slice(4)]
        } else {
            return [false, mediaQuery]
        }
    }

    private static split(mediaQuery: string, between: string) : string[] {
        return mediaQuery.split(between);
    }
}
