# User Preference Media Features - CSS Polyfill

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/blob/master/LICENSE)

In the scope of my bachelor thesis about 'CSS Media Queries Level 5 - Potentials for personalisation and implementation as polyfill', the new prefers- media features from the Media Queries Level 5 were examined. 
In addition, further user preference media features were investigated. These are taken from the [List](https://www.w3.org/WAI/APA/wiki/Media_features_use_cases_for_personalization) of personalization media features of the W3C APA working group.

The candidates are:
* [Captions Enabled](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Captions-Enabled)
* [Audio Description Enabled](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Audio-Description-Enabled)
* [Sign Language & Sign Language Enabled](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Sign-Language-and-Sign-Language-Enabled)
* [Pictograms Enabled](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Pictograms-Enabled)
* [Self-Voicing Enabled](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Self-Voicing-Enabled)
* [Display Skiplinks](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Display-Skiplinks)
* [Table of Contents](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Table-of-Contents)
* [Session Timeout & Extended ession Timeout](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Session-Timeout-und-Extended-Session-Timeout)

The advantages of these candidates are described at the [Wiki](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Wiki) of this repository. 
This CSS Polyfill offers the possibility to use these media features. 
Part of the Polyfill is a panel view, where the user can make his settings.
A login to OpenAPE to load the user context is also possible.

#### Demo Websites
- [Text demo website](https://gpii.eu/mq-5/example/text/index.html)
- [Video demo website](https://gpii.eu/mq-5/example/video/index.html)
- [Registration demo website](https://gpii.eu/mq-5/example/registration/index.html)

#### Operating Principle
After the web page is loaded, the script fetchs the external stylesheets to get the plain CSS text. 
Then it searches for media queries that contain media feature candidates. 
These would actually be ignored by the browser. 
The script runs its own algorithm to evaluate them. 
Afterwards a modified CSS code is generated, which is inserted into the HTML document as a style-element. 
Each time a preference is changed, the process is triggered again.
In addition, the scirpt also makes the media feature candidates available in JS as a media query list, as well as variables. 

#### How to setup the polyfill
To use the polyfill in any website, the two files from [built](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/tree/master/built) must be embedded in the HTML document as follows:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="preference-panel-style.css" type="text/css" />    
    </head>
    <body>
        ...
        <script src="preference-features-polyfill.js"></script>
        <script>
            // other scripts
        </script>
    </body>
</html>
```
It is important that the script is added to the body, because the body element must be loaded in order to add the panel view.
It is also important to note that CORS problems can occur when using the software locally on the computer. To avoid this, it is recommended to use a local server, for example through the WebStorm development environment (see [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)).

#### How to use the candidates...
##### ... in a Media Query
The media featrue candidates can be combined arbitrarily with other media featrues and media types, using the 'and' keyword ('or‘ and ',' do not work).   

```css
screen and (sign-language-enabled: true) and (min-width: 600px) and (captions-enabled: false)
/* true if the user prefers signLanguage and does not prefer captions and has a screen width of min 600px. */
```
They can also be negated with the 'not' modifier. Either the whole query or a single feature.

```css
screen and (not audio-description-enabled: true) 
/* true if the user does not prefer audio description and uses a device of the type screen. */
```
```css
not screen and (audio-description-enabled: true) 
/* true if the user does not prefer audio description and does not use a device of the type screen. */
```

If no value is assigned, the value will be evaluated in the Boolean context.  

```css
screen and (audio-description-enabled) 
/* audioDescriptionEnabled in this case has the boolean context: true. So the query will be true if the user prefers audio description */
```
```css
screen and (not audio-description-enabled) 
/* audioDescriptionEnabled in this case has the boolean context: false. So the query will be true if the user does not prefer audio description */
```

###### 1. CSS
Simply use the @media-rule as usual and then write the CSS code. 

```css
.skiplink {
     display: block;
     font: Arial, sans-serif
}
@media (display-skiplinks: onfocus) {
    .skiplink:not(:focus) {
        position: absolute;
        height: 1px;
        width: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        white-space: nowrap;
    }
}
@media (display-skiplinks: never) {
    .skiplinks {
        display: none;
    }
}
```

###### 2. JS
Instead of the window.matchMedia function, call the window.matchCommonTermMedia function, which is part of the polyfill script. 
This function also takes a media query string as parameter. 
As usual, a callback function can be stored, which is called as soon as the value of the media query changes. 
```javascript
let mqAudioDesc = window.matchCommonTermMedia("(audio-description-enabled)")
    mqAudioDesc.addListener(callback);

function callback() {
    if(mqAudioDesc.matches) {
        // turn audio description on
    } else {
        // turn audio description off
    }
}
```

##### ... as Variables
If it is necessary to read the current value of a media feature candidate in JS, you can do this as follows:
```html
<body>
    ...
    <script src="preference-features-polyfill.js"></script>
    <script>
        let audioDescValue = window.audioDescriptionEnabled;
        let captionValue = window.captionsEnabled;
        let signLangValue = window.signLanguageEnabled;
        let skipLinkValue = window.displaySkiplinks;
        let signLanguageValue = window.signLanguage;
        let contentsValue = window.tableOfContents;
        let sessionValue = window.sessionTimeout;
        let selfVoicingValue = window.selfVoicingEnabled;
        let pictoValue = window.pictogramsEnabled;
    </script>
</body>
```
#### How to configure the script
There is a possibility to configure the script. The settings can be set by calling the following methods on window.userPreferenceSettings. 
For example to show the user preference panel:
```javascript
window.userPreferenceSettings.showPreferencePanel();
```

| Funktion                        | Parameter            | Rückgabewert | Beschreibung                                     |
|---------------------------------|----------------------|--------------|--------------------------------------------------|
| addCSSCode                      | plainCSSCode: string | void         | Manually add CSS code afterwards                 |
| setAudioDescriptionEnabledValue | value: string        | void         | Manually set the Audio Description Enabled value |
| setCaptionsEnabledValue         | value: string        | void         | Manually set the Captions Enabled value          |
| setTableOfContentsValue         | value: string        | void         | Manually set the Table Of Contents value         |
| setSignLanguageValue            | value: string        | void         | Manually set the Sign Language value             |
| setSignLanguageEnabledValue     | value: string        | void         | Manually set the Sign Language Enabled value     |
| setPictogramsEnabledValue       | value: string        | void         | Manually set the Pictograms Enabled value        |
| setSelfVoicingEnabledValue      | value: string        | void         | Manually set the Self-Voicing Enabled value      |
| setSessionTimeoutValue          | value: string        | void         | Manually set the Session Timeout value           |
| setDisplaySkiplinksValue        | value: string        | void         | Manually set the Display Skiplinks value         |
| showPreferencePanel             | none                 | void         | Shows the preference panel view                  |
| hidePreferencePanel             | none                 | void         | Hides the preferences panel view                 |
| removePreferencePanel           | none                 | void         | Removes the preference panel view                |

#### How to contribute
The script was developed in Typescript 4.1.2 and uses the npm-package manager.
The code can be found at [src](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/tree/master/src).
A UML diagram can be found [here](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/blob/master/docs/UML-class-diagram.pdf).
```
npm install 
```
Installs all project dependencies.
```
npm run build
```
Runs the tsc command to compile the TypeScript code to JS Code first and then runs browserify to bundle the JS code.    
```
npm run test
```
Runs jest to test the script.
```
npm run release
```
Runs the build process first, then copies the bundled JS code and stylesheet to the built folder and at the end uglifies the JS-File.

#### Dependencies
- [TypeScript 4.1.2](https://www.typescriptlang.org)
- [npm](https://www.npmjs.com)
- [Jest](https://jestjs.io)
- [Browserify](http://browserify.org)
- [OpenAPE Client](https://github.com/REMEXLabs/openape.js)
