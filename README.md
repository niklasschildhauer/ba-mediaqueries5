# User Preference Media Features - CSS Polyfill

Wiki: [Presentation](https://gitlab.mi.hdm-stuttgart.de/ns107/ba-mq5/-/wikis/Presentation:-Common-Terms-as-Media-Features)

In the scope of this bachelor thesis, the new prefers- media features from the Media Queries Level 5 were examined. 
In addition, further user preference media features were investigated. These are taken from the [List](https://www.w3.org/WAI/APA/wiki/Media_features_use_cases_for_personalization) of personalization media features.

The candidates are:
* AudioDescriptionEnabled
* CaptionsEnabled
* PictogramsEnabled
* SignLanguage & SignLanguageEnabled
* TableOfContents
* DisplaySkiplinks
* SessionTimeout & ExtendedSessionTimeout
* SelfVoicingEnabled

The advantages of these candidates are described at (link). 
This CSS Polyfill offers the possibility to use these media features. 
Part of the Polyfill is a panel view, where the user can make his settings.
A login to OpenAPE to load the user context is also possible.

Picture?

#### Operating Principle
After the web page is loaded, the script fetch the external stylesheets to get the plain CSS text. 
Then it searches for media queries that contain media feature candidates. 
These would actually be ignored by the browser. 
The script runs its own algorithm to evaluate them. 
Afterwards a modified CSS code is generated, which is inserted into the HTML document as style-element. 
Each time a preference is changed, the process is triggered again.
In addition, the skirpt also makes the media feature candidates available in JS as a media query list, as well as the candidate value as a variable. 

#### How to setup the polyfill
Um den Polyfill in einer beliebigen Webseite zu verwenden, müssen die beiden Datein aus  


#### How to use the candidates...
##### ... in a Media Query
The media featrue candidates can be combined arbitrarily with other media featrues and media types, using the 'and' keyword ('or‘ and ',' do not work).   

```
screen and (signLanguageEnabled: true) and (min-width: 600px) and (captionsEnabled: false)
// true if the user prefers signLanguage and does not prefer captions and has a screen width of min 600px.
```
They can also be negated with the 'not' modifier. Either the whole query or a single feature.

```
screen and (not audioDescriptionEnabled: true) // true if the user does not prefer audio description and uses a device of the type screen. 
```
```
not screen and (audioDescriptionEnabled: true) // true if the user does not prefer audio description and does not use a device of the type screen. 
```

If no value is assigned, the value will be evaluated in the Boolean context.  

```
screen and (audioDescriptionEnabled) 
// audioDescriptionEnabled in this case has the boolean context: true. So the query will be true if the user prefers audio description
```
```
screen and (not audioDescriptionEnabled) 
// audioDescriptionEnabled in this case has the boolean context: false. So the query will be true if the user does not prefer audio description
```

###### 1. CSS
Simply use the @media-rule as usual and then write the CSS code. 

```
.skiplink {
     display: none;
     font: Arial, sans-serif
}
@media(displaySkiplinks: onfocus) {
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
@media(displaySkiplinks: never) {
    .skiplinks {
        display: none;
    }
}
```

###### 2. JS
Instead of the window.matchMedia function, call the window.matchCommonTermMedia function, which is part of the polyfill script. 
This function also takes a media query string as parameter. 
As usual, a callback function can be stored, which is called as soon as the value of the media query changes. 
```
let mqAudioDesc = window.matchCommonTermMedia("(audioDescriptionEnabled)")
    mqAudioDesc.addListener("change", callback);

function callback() {
    if(mqAudioDesc.matches()) {
        // turn audio description on
    } else {
        // turn audio description off
    }
}
```

##### ... as Variables
If it is necessary to read the current value of a media feature candidate in JS, you can do this as follows:
```
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
    <script>
</body>
```

