/* Core */
import { Injectable } from '@angular/core';

/* Third-Party */
import { BowserService } from 'ngx-bowser';

@Injectable()
export class SpacesLoggingService {
    private _logLevel: number = 1;  // info
    private useColor: boolean = true;
    private browser: string;
    // title color defaults
    private defaultBackground: string = '#fff';
    private defaultColor: string = '#000';
    // colors by level
    private criticalBackground: string = '#F296A1';
    private criticalColor: string = '#000';
    private debugBackground: string = '#9EBABA';
    private debugColor: string = '#FFF';
    private errorBackground: string = '#F296A1';
    private errorColor: string = '#FFF';
    private importantBackground: string = '#FF1493';
    private importantColor: string = '#000';
    private infoBackground: string = '#CCC691';
    private infoColor: string = '#000';
    private warnBackground: string = '#F5AD89';
    private warnColor: string = '#000';
    // colors by method
    private methodColors: any = {};
    private moduleColors: any = {};
    // levels - bcs change to enum if possible
    private levels: any = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        critical: 4,
        important: 5
    }

    constructor(
        private bowser: BowserService
    ) { 
        this.browser = this.bowser.bowser.name.toLowerCase();
        this.info('Browser', this.browser);
    }

    ngOnInit() { /* empty block */ }
    
    get logLevel(): string {
        /**
         * Return the logging level
         * @return {string} The logging level (debug, info, warn, critical)
         */
        let levels = Object.keys(this.levels);
        return levels[this._logLevel];
    }
    
    set logLevel(level: string) {
        /**
         * Set the logging level
         * @param {string} The logging level (debug, info, warn, critical)
         */
        if (this.levels[level] !== 'null') {
            this._logLevel = this.levels[level];
        }
    }
    
    public disableColor(): void {
        /**
         * Disable colors in console logging
         */
        this.useColor = false;
    }
    
    public criticalColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for critical console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.criticalBackground = background;
        this.criticalColor = color;
    }
    
    public debugColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for debug console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.debugBackground = background;
        this.debugColor = color;
    }
    
    public errorColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for error console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.errorBackground = background;
        this.errorColor = color;
    }
    
    public importantColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for info console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.importantBackground = background;
        this.importantColor = color;
    }
    
    public infoColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for log console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.infoBackground = background;
        this.infoColor = color;
    }
    
    public warnColors(
        background: string,
        color: string
    ) {
        /**
         * Set color for warn console messages
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.warnBackground = background;
        this.warnColor = color;
    }
    
    public methodColor(
        background: string,
        color: string,
        methodName?: string
    ): void {
        /**
         * Set default color for the title on all logs for the current method
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        if (!methodName) {
            // try to get method name from the stack
            let methodIndex = this.methodIndex();
            const error = new Error;
            let logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                let caller = this.parseLogLine(logStack[methodIndex]);
                methodName = caller.method;
            }
        }
        if (methodName !== 'null') {
            this.methodColors[methodName] = {
                bg: background,
                color: color
            }
        }
    }
    
    public moduleColor(
        background: string,
        color: string,
        moduleName?: string
    ): void {
        /**
         * Set default color for the title on all logs for the current module
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        if (!moduleName) {
            let methodIndex = this.methodIndex();
            const error = new Error;
            let logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                let caller = this.parseLogLine(logStack[methodIndex]);
                moduleName = caller.module;
            }
        }
        if (moduleName !== 'null') {
            this.moduleColors[moduleName] = {
                bg: background,
                color: color
            }
        }
    }
    
    public log(
        level: string,
        title: string,
        msg: any,
        bg: string = '#fff',
        color: string = '#000',
        headerBg: string = '#fff',
        headerColor: string = '#000',
        methodIndex: any = undefined
    ): void {
        /**
         * Console Log the message
         * @param {string} level - The logging level
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         * @param {string} headerBg - The background color in hex format for the header.
         * @param {string} headerColor - The font color in hex format for the header.
         * @param {number} methodIndex - The index of the method in the stack
         */
        let levelNo = this.levels[level];
        
        if (levelNo >= this._logLevel) {
            const error = new Error;
            let logStack = error.stack ? error.stack.split('\n') : [];
            
            if (methodIndex == undefined) {
                methodIndex = this.methodIndex();
            }
            // console.log('methodIndex', methodIndex);
            let caller = this.parseLogLine(logStack[methodIndex]);
            if (this.browser == 'chrome' &&  caller.module === 'SafeSubscriber') {
                // best try to handle chrome stack manipulation
                caller = this.parseLogLine(logStack[logStack.length - 1]);
            }
            
            let c = this.useColor ? ' %c ' : ' ';
            let header = [
                level.toUpperCase(),
                c,
                this.getHeader(logStack[methodIndex]),
                c,
                title,
                ' '].join(' ');
            
            // update colors if module color defined
            if (this.moduleColors[caller.module]) {
                bg = this.moduleColors[caller.module].bg;
                color = this.moduleColors[caller.module].color;
            }
            
            // update colors if method color defined
            if (this.methodColors[caller.method]) {
                bg = this.methodColors[caller.method].bg;
                color = this.methodColors[caller.method].color;
            }
            
            // console log
            if (this.useColor) {
                console.log(header, this.css(headerBg, header), this.css(bg, color), msg);
            } else {
                console.log(header, msg);
            }
        }
    }
    
    private getHeader(
        logLine: string
    ): string {
        /**
         * Best effor to retrieve module, method, fileName, and line number from error stack.
         * @param {string} logLine - The line from the Error stack
         * @param {boolean} color - Return header with color
         * @return {object} The module, method, fileName, and line number
         */
        let header;
        let data;
        let line_data;
        let module;
        let method;
        let fileName;
        let line;
        // console.log('logLine', logLine);
        
        let divider1;
        let divider2;
        
        switch (this.browser) {
            case 'chrome':
                data = logLine.trim().match(/^at\s(?:new\s)?(\w+)(?:\.)?(\w+)?\s/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                
                module = data[1];
                method = data[2];
                fileName = line_data[1];
                line = line_data[2];
                
                header = '';
                divider1 = '';
                if (module) {
                    header += module;
                    divider1 = ':';
                }
                if (method) {
                    header += divider1 + method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            case 'firefox':
                data = logLine.trim().match(/(\w+)\.(?:\w+)\.(\w+)@/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                
                module = data[1];
                method = data[2];
                fileName = line_data[1];
                line = line_data[2];
                
                header = '';
                divider1 = '';
                if (module) {
                    header += module;
                    divider1 = ':';
                }
                if (method) {
                    header += divider1 + method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            case 'safari':
                data = logLine.trim().match(/^(\w+)@/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                
                method = data[1];
                fileName = line_data[1];
                line = line_data[2];
                
                header = '';
                divider1 = '';
                if (method) {
                    header += method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            default:
                console.warn('Advanced logging is not supported in browser', this.browser);
        } 
        return header;
    }
    
    private parseLogLine(logLine: string): any {
        /**
         * Best effor to retrieve module, method, fileName, and line number from error stack.
         * @param {string} logLine - The line from the Error stack
         * @return {object} The module, method, fileName, and line number
         */
        let data;
        let line_data;
        let module;
        let method;
        let fileName;
        let line;
        // console.log('logLine', logLine);
        
        // TODO - switch this to case statement to define regex so data and line_data are only set once.
        if (this.browser === 'chrome') {
            /* best effor at getting module, method, fileName and line number */
            data = logLine.trim().match(/^at\s(?:new\s)?(\w+)(?:\.)?(\w+)?\s/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        } else if (this.browser === 'firefox') {
            data = logLine.trim().match(/(\w+)\.(?:\w+)\.(\w+)@/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        } else if (this.browser === 'safari') {
            data = logLine.trim().match(/^(\w+)@/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        }
        if (data) {
            module = data[1] || 'NA';
            method = data[2] || 'NA';
        }
        if (line_data) {
            fileName = line_data[1] || '?';
            line = line_data[2] || '?';
        }
        return {
            module: module,
            method: method,
            fileName: fileName,
            line: line
        }
    }
    
    private methodIndex(): number {
        /**
         * Return the method index dependent on the browser.
         * @return {string} The index number
         */
        let index = 3;
        switch (this.browser) {
            case 'chrome':
                index = 3;
                break;
            case 'firefox':
                index = 2;
                break;
            case 'safari':
                index = 2;
                break;
            default:
                console.warn('Advanced logging is not supported in browser', this.browser);
        } 
        return index;
    }
    
    public critical(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Critical messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('critical', title, msg, bg, color, this.criticalBackground, this.criticalColor);
    }

    public debug(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Debug messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('debug', title, msg, bg, color, this.debugBackground, this.debugColor);
    }
    
    public error(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Error messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('error', title, msg, bg, color, this.errorBackground, this.errorColor);
    }

    public info(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Info messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('info', title, msg, bg, color, this.infoBackground, this.infoColor);
    }
    
    public important(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Warn messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('important', title, msg, bg, color, this.importantBackground, this.importantColor);
    }

    public warn(
        title: string,
        msg: any = '',
        bg: string = this.defaultBackground,
        color: string = this.defaultColor
    ): void {
        /**
         * Console Log Warn messages
         * @param {string} title - The title or description of the data being logged
         * @param {string} msg - The msg to be logged
         * @param {string} bg - The background color in hex format.
         * @param {string} color - The font color in hex format.
         */
        this.log('warn', title, msg, bg, color, this.warnBackground, this.warnColor);
    }

    private css(
        background:string,
        color: string
    ): string {
        /**
         * Format the CSS for console colors
         * @param {string} background - The background color in hex format.
         * @param {string} color - The font color in hex format.
         * @return {string} The formatted CSS string for console colors
         */
        return [
            'background: ',
            background + '; ',
            'color: ',
            color + ';'
        ].join(' ');
    }
}