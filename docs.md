# spaces-ng
*Version: 0.1.0*

## Spaces Base
All ThreatConnect&trade; Spaces Apps are provided default parameters via the query parameters of the URI when executed.  The Spaces Base Service provides access to these params via a subscription on the Router params observable.  In order to guarantee the parameters are retrieved before execution of App logic the Spaces Base Class provides the `initialize` Promise property that will be resovled after the parameters are parsed.

The Spaces Base service provides access to a few *key* properties that can be access after the service is initialized.  The `tcToken` property will always provide a current API token (automatic renewal) to use when communicating with the ThreatConnect API.

```javascript
ngOnInit() {
    this.router
        .routerState
        .root
        .queryParams
        .subscribe(params => {
            /* initialize spaces module with params (only once) */
            this.spacesBase.init(params);

            this.spacesBase.initialized.then(() => {
                /* store app parameters */
                this.storage.create('tcSelectedItem', this.spacesBase.param('tcSelectedItem'));
                this.storage.create('tcType', this.spacesBase.param('tcType'));
            });
        });
}
```

## Spaces Logging Service
The [Spaces Logging](classes/_lib_spaces_logging_service_.spacesloggingservice.html) Service provides a wrapper around `console.log()` with additional features such as Submodule, Method, file and line number detection.  Logging colors to quickly identify which log message comes from which module.  Logging level for the app to allow easy debugging/troubleshooting.

### Supported Logging Levels
+ Critical
+ Error
+ Warn
+ Info
+ Debug
+ Important
 
### Set Logging Level and Module Colors

```javascript
constructor(
    private logging: SpacesLoggingService
) {
    this.logging.logLevel = 'debug';  // set app default logging level
    this.logging.moduleColor('#633974', '#fff', 'AppComponent');  // set logging console colors
}
```

### Set Logging Level Colors

```javascript
constructor(
    private logging: SpacesLoggingService
) {
    this.logging.logLevel = 'debug';  // set app default logging level
    /* optional set non default colors */
    this.logging.criticalColor('#633974', '#fff');  // set logging level console colors
    this.logging.debugColor('#666', '#fff');  // set logging level console colors
    <...snipped>
}
```

### Disable logging colors

```javascript
constructor(
    private logging: SpacesLoggingService
) {
    this.logging.logLevel = 'debug';  // set app default logging level
    this.logging.disableColor();
}
```

### Example Logging

```javascript
ngOnInit() {
    this.logging.critical('Critial Title', 'Something failed and can not recover.')
    this.logging.error('Error Title', 'Something failed.')
    this.logging.warn('Warn Title', 'This probably should not happen.')
    this.logging.info('Info Title', 'An informative message.')
    this.logging.debug('Debug Title', 'Lots of noise.')
    this.logging.important('Important Title', 'Look at me!!!')
}
```

## Spaces Messaging
The [Spaces Messaging](classes/_lib_spaces_messages_service_.spacesmessagesservice.html) Service provides a wrapper on [PrimeNg Growl](http://www.primefaces.org/primeng/#/growl).  This service allows the App to send a message to the base App Component from any custom compponent.

### app.component.html

```html
<div class="spaces-content">
    <p-growl [value]="messages.msgs"></p-growl>
    <router-outlet></router-outlet>
</div>
```

### Trigger Growl message.
From custom component that imports the `SpacesMessagesService` a Growl messages can be triggered using the examples below.  Or just using `this.message.showSuccess()`, `this.message.showInfo()`, `this.message.showWarning()`, or `this.message.showError()` directly in any method.

```javascript
import {
    SpacesMessagesService
}
from 'spaces-ng/main';

// <snipped...>

constructor(
    private messages: SpacesMessagesService
) { /* empty block */ }

    /* example of spaces-ng message feature */
public errorMessage(msg) {
    this.messages.showError('Error Message', msg);
}

/* example of spaces-ng message feature */
public successMessage(msg) {
    this.messages.showSuccess('Success Message', msg);
}
```

## Spaces Request
The [Spaces Request](classes/_lib_spaces_request_service_.spacesrequestservice.html) Service provides a wrapper around the `@angular/http` module to simplify interaction with the ThreatConnect API or any Remote endpoint.  The Spaces Request Service provides easy access to the ThreatConnect API Secury Proxy service.

```javascript
import {
    SpacesRequestService
}
from 'spaces-ng/main';
import { Observable } from 'rxjs/Rx';

// <snipped...>

constructor(
    private request: SpacesRequestService
) { /* empty block */ }

public getData(
    apiUser: string,
    apiKey: string
): Observable<any> {
    let myRequest = this.request
        .resetOptions()
        .proxy(true)
        .url(url)
        .param('api_username', apiUser)
        .param('api_key', apiKey)
        .method('GET');

    return dtRequest.request()
        .map(res => res.json() || {},
            this.handleError);
}
```

## Release Notes

## 0.1.0
+ Initial Release