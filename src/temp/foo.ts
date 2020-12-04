
export const sum
    = (...a: number[]) =>
    a.reduce((acc, val) => acc + val, 0);


/*
enum CommonTermsMediaFeatures {
    displaySkiplinks = "displaySkiplinks",
    audioDescriptionEnabled = "audioDescriptionEnabled"
}

interface IMediaCondition {
    type: CommonTermsMediaFeatures;
    value: string;
    negated: boolean;
}

interface IMediaQuery {
    query: IMediaCondition[];
    body: string;
    browserSupportedQuery: string;
    negated: boolean;
}

interface IManager {
    //(source: string, subString: string): boolean;
}

interface IUserPreference {
    preference: CommonTermsMediaFeatures;
    value: string;
}

class MediaCondition implements IMediaCondition{
    type: CommonTermsMediaFeatures;
    value: string;
    negated: boolean;

    constructor(type: CommonTermsMediaFeatures, value: string, negated: boolean) {
        this.type = type;
        this.value = value;
        this.negated = negated;

        //console.log("Media Condition: " + type);
    }
}

class MediaQuery implements IMediaQuery {
    query: IMediaCondition[];
    body: string;
    browserSupportedQuery: string = "";
    negated: boolean;

    constructor(query: string, body: string) {
        if (query.slice(0, 3).match("not")) {
            this.negated = true;
            query = query.slice(4);
            console.log("without not: " +query);
        }

        let array = query.split("and");
        let browserSupportedQuery: string[] = [];
        let mediaConditions: IMediaCondition[] = [];
        for (const condition of array) {
            if (containsCommonTermMediaFeature(condition)) {
                mediaConditions.push(this.evaluateMediaConditionFrom(condition));
            } else {
                browserSupportedQuery.push(condition);
            }
        }

        this.browserSupportedQuery = browserSupportedQuery.join("and");
        this.query = mediaConditions;
        this.body = body;
        console.log("---------------");
        console.log(this.query);
        console.log(this.body);
        console.log(this.browserSupportedQuery);
        console.log("---------------");
    }

    evaluateMediaConditionFrom(evaluateMediaConditionFrom): IMediaCondition {
        let condition = removeWhitespaceFrom(evaluateMediaConditionFrom);

        let negated = false;
        if (condition.match("not")) {
            negated = true;
            condition = condition.replace("not", "");
        }

        let value = "true";
        if(condition.match(":")) {
            value = condition.match(":(.*).")[1];
            condition = condition.replace(":" + value, "");
        }

        let mediaFeature;
        if(condition.match("\\((.*?)\\)")){
            mediaFeature = condition.match("\\((.*?)\\)")[1];
        }
        return new MediaCondition(CommonTermsMediaFeatures[mediaFeature], value, negated);
    }
}

class UserPreference implements IUserPreference {
    preference: CommonTermsMediaFeatures;
    value: string;

    constructor(preference, value) {
        this.preference = preference;
        this.value = value;
    }
}


export class Manager implements IManager {
    private plainCSS: string;
    private mediaQueries: IMediaQuery[] = [];
    private userPreferences: UserPreference[];

    constructor(plainCSS: string) {
        this.plainCSS = plainCSS;

        this.userPreferences = [
            new UserPreference(CommonTermsMediaFeatures.audioDescriptionEnabled, "true"),
            new UserPreference(CommonTermsMediaFeatures.displaySkiplinks, "never"),
        ]
        this.readCSS();
        this.addCSS();
    }

    public readCSS () {
        const regex = new RegExp("@media.\(.*)\.\\{", "g")
        // @ts-ignore
        let matches = this.plainCSS.matchAll(regex);
        let result = matches.next();
        while (!result.done) {
            let queryString = result.value[1];
            let queryIndex = result.value.index;
            if (containsCommonTermMediaFeature(queryString)) {
                let body = this.getBodyOfMediaQueryAt(queryIndex);
                this.mediaQueries.push(new MediaQuery(queryString, body));
            }
            result = matches.next();
        }
    }

    public addCSS() {
        console.log(this.mediaQueries);
        let cssStyle: string[] = []
        for (var i = 0; i < this.mediaQueries.length; i++) {
            let mediaQuery = this.mediaQueries[i]
            if(this.doesMediaQueryMatchUserPreferences(mediaQuery)) {
                let body = mediaQuery.body
                if(mediaQuery.browserSupportedQuery !== "") {
                    body = "@media " + mediaQuery.browserSupportedQuery + " {\n" + mediaQuery.body + "\n}";
                }
                cssStyle.push(body);
            }
        }
        console.log(cssStyle);
        const style = document.createElement('style');
        style.setAttribute("id", "common-terms-media-queries");
        style.innerHTML = cssStyle.join("\n");
        document.head.appendChild(style);
    }

    public test(): number {
        return 3
    }

    private doesMediaQueryMatchUserPreferences(mediaQuery: IMediaQuery): boolean {
        for (var i = 0; i < mediaQuery.query.length; i++) {
            for (var k = 0; k < this.userPreferences.length; k++) {
                let condition = mediaQuery.query[i];
                let preference = this.userPreferences[k];
                if(condition.type === preference.preference) {
                    if(mediaQuery.negated) {
                        if(condition.value === preference.value && !condition.negated ||
                            condition.value !== preference.value && condition.negated) {
                            return false;
                        }
                    } else {
                        if(condition.value !== preference.value && !condition.negated ||
                            condition.value === preference.value && condition.negated) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}

export function test2(): boolean {
    return true
}

/!*
window.onload = () => {
    main();
    console.log("Gestartet!")
}*!/
function main() {
    // let styleText = ""
    // let stylesSheets = document.querySelectorAll('link');
    // for (var i = stylesSheets.length; i--;) {
    //     if(stylesSheets[i].getAttribute('rel') === 'stylesheet') {
    //         let link = stylesSheets[i].getAttribute('href')
    //         let cssContent = this.loadCSSContent(link)
    //             .then(function(text) {
    //                 styleText = styleText + text;
    //             })
    //         styleText = cssContent
    //     }
    // }
    // console.log(styleText);

    //var coordinator = new Manager(text)

}
async function loadCSSContent(link) {
    return await fetch(link, {
        method: 'get'
    })
        .then( function (response) {
            return response.text()
        })
}

// Utilities

function containsCommonTermMediaFeature(query: string) : boolean {
    let contains = false ;
    Object.keys(CommonTermsMediaFeatures).forEach((key) => {
        if (query.match(key)) {
            contains = true;
        }
    });
    return contains;
}

function splitQueryString(query: string): string[]{
    return query.split("and");
}


function removeWhitespaceFrom(string: string){
    return string.replace(/\s/g, '');
}

// can be deleted
function getArrayOfTextBetweenBrackets(text: string, firstBracket: string, lastBracket: string) : string[] {
    // @ts-ignore
    let matches = text.matchAll(new RegExp("\\" + firstBracket + "(.*?)\\" + lastBracket, "g"));
    let list = [];

    let result = matches.next();
    while (!result.done) {
        list.push(result.value[1]);

        result = matches.next();
    }

    return list;
}


// can be deleted*/
