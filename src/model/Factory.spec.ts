import {Factory} from './Factory'
import * as Model from './Model'
import {CommonTerm} from './Model'

test('Media Feature Factory - createMediaFeatureFrom #1', () => {
    let factoryModel = Factory.createMediaFeatureFrom("(display-skiplinks: true)");
    let model = new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "true")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #2', () => {
    expect(function() {
        Factory.createMediaFeatureFrom("(pictogram: true)");
    }).toThrow(new Error('There is no matching common term: (pictogram)'));
});

test('Media Feature Factory - createMediaFeatureFrom #3', () => {
    let factoryModel = Factory.createMediaFeatureFrom('(sign-language: "dgs")');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.1', () => {
    let factoryModel = Factory.createMediaFeatureFrom('(sign-language: dgs)');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.2', () => {
    let factoryModel = Factory.createMediaFeatureFrom("(sign-language: 'dgs')");
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #4', () => {
    let factoryModel = Factory.createMediaFeatureFrom('not (sign-language-enabled: false)');
    let model = new Model.MediaFeature(CommonTerm.signLanguageEnabled, true, "false")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #1', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen ";

    let result = Factory.createMediaDescriptorFromMQStringAndBodyString("screen and (display-skiplinks: always)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #2', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen and (max-width: 300px)";

    let result = Factory.createMediaDescriptorFromMQStringAndBodyString("screen and (display-skiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen and (min-width: 100px) and (max-width: 300px)";

    let result = Factory.createMediaDescriptorFromMQStringAndBodyString("screen and (min-width: 100px) and (display-skiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "not screen and (min-width: 100px) and (max-width: 300px)";

    let result = Factory.createMediaDescriptorFromMQStringAndBodyString("not screen and (min-width: 100px) and (display-skiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, true)
    expect(result.body).toBe(model.body);
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always"),
                                new Model.MediaFeature(CommonTerm.tableOfContents, true, "true")];
    let supportedMediaQuery = null;

    let result = Factory.createMediaDescriptorFromMQStringAndBodyString("(display-skiplinks: always) and not (table-of-contents)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromCSSString #1', () => {
    let css = "@media not screen and (display-skiplinks: onfocus) {" +
        "body { background: black; }" +
        "}" +
        "\n" +
        "@media (pictograms-enabled) {" +
        "body { background: yellow; }" +
        "}"
    let body1 = "body { background: black; }"
    let body2 = "body { background: yellow; }"
    let unsupportedMediaQuery1 = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "onfocus")];
    let unsupportedMediaQuery2 = [new Model.MediaFeature(CommonTerm.pictogramsEnabled, false, "true")];
    let supportedMediaQuery1 = "not screen ";

    let result = Factory.createMediaDescriptorsFromCSSString(css);

    let model1 = new Model.MediaDescriptor(unsupportedMediaQuery1, supportedMediaQuery1, body1, true);
    let model2 = new Model.MediaDescriptor(unsupportedMediaQuery2, null, body2, false);

    expect(result).toStrictEqual([model1, model2]);
});

test('Media Descriptor Factory - createMediaDescriptorFromCSSString #2', () => {
    let css = "@media not screen and not (display-skiplinks: onfocus) and (sign-language: gsd) and (sign-language: 'fsd') {" +
        "body { background: black; }" +
        "}" +
        "\n" +
        "@media print (pictograms-enabled) and not (session-timeout: 2.4) {" +
        "body { background: yellow; }" +
        "}"
    let body1 = "body { background: black; }"
    let body2 = "body { background: yellow; }"
    let unsupportedMediaQuery1 = [new Model.MediaFeature(CommonTerm.displaySkiplinks, true, "onfocus"),
                                new Model.MediaFeature(CommonTerm.signLanguage, false, "gsd"),
                                new Model.MediaFeature(CommonTerm.signLanguage, false, "fsd")];
    let unsupportedMediaQuery2 = [new Model.MediaFeature(CommonTerm.pictogramsEnabled, false, "true"),
                                new Model.MediaFeature(CommonTerm.sessionTimeout, true, "2.4"),];
    let supportedMediaQuery1 = "not screen ";
    let supportedMediaQuery2 = "print ";

    let result = Factory.createMediaDescriptorsFromCSSString(css);

    let model1 = new Model.MediaDescriptor(unsupportedMediaQuery1, supportedMediaQuery1, body1, true);
    let model2 = new Model.MediaDescriptor(unsupportedMediaQuery2, null, body2, false);

    expect(result).toStrictEqual([model1, model2]);
});



test('Media Descriptor Factory - createCommonTermListFromMQString #1', () => {
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen ";

    let result = Factory.createCommonTermListFromMQString("screen and (display-skiplinks: always)");

    let model = new Model.CommonTermList(unsupportedMediaQuery, supportedMediaQuery, false)
    expect(result.mediaQuery.negated).toBe(model.mediaQuery.negated);
    expect(result.mediaQuery.supportedMediaQuery).toBe(model.mediaQuery.supportedMediaQuery);
    expect(result.mediaQuery.unSupportedMediaQuery).toStrictEqual(model.mediaQuery.unSupportedMediaQuery);
});



