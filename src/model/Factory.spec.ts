import * as Factory from './Factory'
import * as Model from './Model'
import {CommonTerm} from './Model'

test('Media Feature Factory - createMediaFeatureFrom #1', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom("(displaySkiplinks: true)");
    let model = new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "true")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #2', () => {
    expect(function() {
        Factory.MediaFeatureFactory.createMediaFeatureFrom("(picto: true)");
    }).toThrow(new Error('There is no matching common term.'));
});

test('Media Feature Factory - createMediaFeatureFrom #3', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('(signLanguage: "dgs")');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.1', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('(signLanguage: dgs)');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.2', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom("(signLanguage: 'dgs')");
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #4', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('not (signLanguageEnabled: false)');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, true, "false")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #1', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen ";

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorFromMQStringAndBodyString("screen and (displaySkiplinks: always)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.negated).toBe(model.negated);
    expect(result.supportedMediaQuery).toBe(model.supportedMediaQuery);
    expect(result.unsupportedMediaQuery).toStrictEqual(model.unsupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #2', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen and (max-width: 300px)";

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorFromMQStringAndBodyString("screen and (displaySkiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.negated).toBe(model.negated);
    expect(result.supportedMediaQuery).toBe(model.supportedMediaQuery);
    expect(result.unsupportedMediaQuery).toStrictEqual(model.unsupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "screen and (min-width: 100px) and (max-width: 300px)";

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorFromMQStringAndBodyString("screen and (min-width: 100px) and (displaySkiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.negated).toBe(model.negated);
    expect(result.supportedMediaQuery).toBe(model.supportedMediaQuery);
    expect(result.unsupportedMediaQuery).toStrictEqual(model.unsupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always")];
    let supportedMediaQuery = "not screen and (min-width: 100px) and (max-width: 300px)";

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorFromMQStringAndBodyString("not screen and (min-width: 100px) and (displaySkiplinks: always) and (max-width: 300px)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, true)
    expect(result.body).toBe(model.body);
    expect(result.negated).toBe(model.negated);
    expect(result.supportedMediaQuery).toBe(model.supportedMediaQuery);
    expect(result.unsupportedMediaQuery).toStrictEqual(model.unsupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromMQStringAndBodyString #3', () => {
    let body = "body { background: black; }"
    let unsupportedMediaQuery = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "always"),
                                new Model.MediaFeature(CommonTerm.tableOfContents, true, "true")];
    let supportedMediaQuery = null;

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorFromMQStringAndBodyString("(displaySkiplinks: always) and not (tableOfContents)", body);

    let model = new Model.MediaDescriptor(unsupportedMediaQuery, supportedMediaQuery, body, false)
    expect(result.body).toBe(model.body);
    expect(result.negated).toBe(model.negated);
    expect(result.supportedMediaQuery).toBe(model.supportedMediaQuery);
    expect(result.unsupportedMediaQuery).toStrictEqual(model.unsupportedMediaQuery);
});

test('Media Descriptor Factory - createMediaDescriptorFromCSSString #1', () => {
    let css = "@media not screen and (displaySkiplinks: onfocus) {" +
        "body { background: black; }" +
        "}" +
        "\n" +
        "@media (pictogramsEnabled) {" +
        "body { background: yellow; }" +
        "}"
    let body1 = "body { background: black; }"
    let body2 = "body { background: yellow; }"
    let unsupportedMediaQuery1 = [new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "onfocus")];
    let unsupportedMediaQuery2 = [new Model.MediaFeature(CommonTerm.pictogramsEnabled, false, "true")];
    let supportedMediaQuery1 = "not screen ";

    let result = Factory.MediaDescriptorFactory.createMediaDescriptorsFromCSSString(css);

    let model1 = new Model.MediaDescriptor(unsupportedMediaQuery1, supportedMediaQuery1, body1, true);
    let model2 = new Model.MediaDescriptor(unsupportedMediaQuery2, null, body2, false);

    expect(result).toStrictEqual([model1, model2]);
});






