import {
    Injectable
}
from '@angular/core';

import {
    Http,
    QueryEncoder,
    RequestMethod,
    RequestOptions,
    Response,
    URLSearchParams
}
from '@angular/http';

import {
    SpacesLoggingService
} from './spaces_logging.service'

class SpacesQueryEncoder extends QueryEncoder {
    encodeKey(k: string): string { return encodeURIComponent(k); }
    encodeValue(v: string): string { return encodeURIComponent(v); }
}


@Injectable()
export class SpacesBaseService {
    private _params: any;
    private _tcToken: string;
    private _tcTokenExpires: number;
    private _initialized: boolean = false;
    private initPromise: Promise<boolean>;
    private initResolve: any;

    constructor(
        private http: Http,
        private logging: SpacesLoggingService
    ) { 
        /* Set logging module parameters */
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesBaseService');
        this.initPromise = new Promise(resolve => this.initResolve = resolve);
    }

    ngOnInit() { /* empty block */ }
    
    public init(params): void {
        /**
         * Initialize the Base Service with Query String Parameters
         * @param {any} params  Query String Parameters 
         */
        if (Object.keys(params).length > 0 && params.constructor === Object) {
            this.logging.debug('params', params);
            if (!this._initialized) {
                this._initialized = true;
                this._params = params;
                this._tcToken = decodeURIComponent(params['tcToken']);  // set for token renew
                this._tcTokenExpires = params['tcTokenExpires'];  // set for token renew
                this.initResolve();
            }
        }
    }

    get initialized(): Promise<boolean> {
        /**
         * Promise resolved when Query String Parameters are parsed
         */
        return this.initPromise;
    }

    get params(): any {
        /**
         * The entire parameters object from initial load of App
         */
        return this._params;
    }
    
    public param(name): string {
        /**
         * Return the request parameter
         * @param {string} name The parameter name (key)
         * @return {string} Decoded URL component
         */
         if (this.initialized) {
            // spaces need to be un-encoded from '+' before decoding
            let param = this._params[name];
            if (param != undefined) {
                param = decodeURIComponent(param.replace('+', ' '));
            }
            return param;
         } else {
            this.logging.warn('Service is not intialized.', '');
            return '';
         }
    }
    
    get tcApiPath(): string {
        /**
         * Return the ThreatConnect API Path
         * @return {number} The ThreatConnect API path passed in the query string parameters
         */
        return this.param('tcApiPath');
    }
    
    get tcProxyServer(): string {
        /**
         * Return the ThreatConnect Proxy Server URL
         * @return {string} The ThreatConnect Proxy Server URL calculated from tcApiPath
         */
        // return this.param('tcApiPath').replace(/\/api$/, '');
        /* The proxy server *should* be the same server as is being accessed for the Spaces app. */
        return '';
    }
    
    get tcSpaceElementId(): string {
        /**
         * Return the ThreatConnect Spaces Element Id
         * @return {number} The Spaces Element Id passed in the query string parameters
         */
        return this.param('tcSpaceElementId');
    }
    
    get tcToken(): string {
        /**
         * Return the ThreatConnect API Token
         * @return {string} The API token passed in the query string parameters
         */
         
        /* check if token is expired and if so renew */
        let buffer = 15;
        let currentSeconds = (new Date).getTime() / 1000 + buffer;
        if (this._tcTokenExpires < currentSeconds) { 
            this.tcTokenRenew();
        } else {
            return this._tcToken;
        }
    }
    
    private tcTokenRenew(): any {
        /**
         * Renew ThreatConnect API Token
         * @return {string} The new ThreatConnect Token
         */
        let params = new URLSearchParams('', new SpacesQueryEncoder());  // must be above options
        let options = new RequestOptions({
            method: RequestMethod.Get,
            search: params
        });
        params.set('expiredToken', this._tcToken);

        let url = [
            this._params['tcApiPath'].replace('/api', ''),
            'appAuth'
        ].join('/');
        
        this.http.request(url, options)
            .subscribe(
                res => {
                    this.logging.debug('res', res);
                    let response = res.json();
                    if (response.success === true) {
                        this._tcToken = response.apiToken;
                        this._tcTokenExpires = response.apiTokenExpires;
                    }
                    return this._tcToken;
                },
                err => {
                    this.logging.error('Token Renewal Error', err);
                    // bcs - should old token be returned
                    return this._tcToken;
                }
            );
    }
    
    private handleAjaxError(error: Response): any {
        /**
         * Execute the API request
         * @param {Response} err - The https Response Object
         */
        var errorText = error.text();
        this.logging.error('spaces_base.service: request to ' +  error.url + 
            ' failed with: ', errorText);
        // console.error('spaces_base.service: request to ' + 
        //     error.url + ' failed with: ' + errorText);
        return Promise.reject(errorText || error);
    }
}