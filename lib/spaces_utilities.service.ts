import {
    Injectable
}
from '@angular/core';

import {
    SpacesLoggingService
} from './spaces_logging.service'

@Injectable()
export class SpacesUtilityService {
    constructor(
        private logging: SpacesLoggingService
    ) { 
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesUtilityService');
    }

    ngOnInit() { /* empty block */ }
    
    public isEmpty(obj): boolean {
        /**
         * Check to see if Object is empty
         * @param {Object} obj - The object to check
         */
        let isEmpty = true;
        if (Object.keys(obj).length > 0 && obj.constructor === Object) {
            isEmpty = false;
        }
        return isEmpty;
    }
    
    public findIndex(hay: any[], needle: string): number {
        /**
         * Return the index of a string in an array
         * @param {Array} hay - The array continaing the string
         * @param {String} needle - The string to find
         */
        return hay.indexOf(needle);
    };
}