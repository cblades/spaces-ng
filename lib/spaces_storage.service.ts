import {
    Injectable
}
from '@angular/core';

import {
    SpacesLoggingService
} from './spaces_logging.service'

@Injectable()
export class SpacesStorageService {
    /* bcs - app store testing */
    public storage: any = {};

    constructor(
        private logging: SpacesLoggingService
    ) { 
        this.logging.moduleColor('#00008b', '#fff', 'SpacesStorageService');
    }

    ngOnInit() { /* empty block */ }
    
    public create(key, value): void {
        this.storage[key] = value;
    }
    
    public read(key): any {
        return this.storage[key];
    }
    
    public delete(key): void {
        delete this.storage[key];
    }
    
    public update(key, value): void {
        this.storage[key] = value;
    }
}