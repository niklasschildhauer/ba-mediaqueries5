import {IMediaDescriptor, IMediaFeature, MediaDescriptor, CommonTermUtil, MediaFeature, CommonTerm} from "./Model";
import * as common from '../common/utility'
import {removeUnimportantCharactersFrom} from "../common/utility";

export class MediaDescriptorFactory {
    public static createMediaDescriptorFrom(mediaQuery: string, body: string): IMediaDescriptor {
        let query = mediaQuery;
        let negated: boolean

        [negated, query] = this.isMediaQueryNegated(query);

        let mediaConditions = this.split(query, "and");
        let supportedMediaQuery: string[] = [];
        let unsupportedMediaQuery: IMediaFeature[] = [];
        for (const condition of mediaConditions) {
            let commonTermMediaFeature = CommonTermUtil.containsCommonTermMediaFeature(condition)
            if (commonTermMediaFeature[0]) {
                unsupportedMediaQuery.push(MediaFeatureFactory.createMediaFeatureFrom(condition));
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

        return new MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery.join("and"), body, negated)
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

export class MediaFeatureFactory {
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
        // let mediaFeatureArray = conditionString.match("\\((.*?)\\)");
        // console.log(mediaFeatureArray);
        // if(mediaFeatureArray != null){
        //     console.log(mediaFeatureArray[1]);
        //     console.log(CommonTermUtil.containsCommonTermMediaFeature(mediaFeatureArray[1]));
        //     mediaFeature = CommonTermUtil.containsCommonTermMediaFeature(mediaFeatureArray[1])[1];
        // }
        // console.log(mediaFeature);

        if(mediaFeature == null || mediaFeature == undefined) {
            throw new Error('There is no matching common term.');
        }
        return new MediaFeature(mediaFeature, negated, value);
    }
}
