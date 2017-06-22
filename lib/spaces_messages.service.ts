import { Injectable } from '@angular/core';
import { Message } from 'primeng/primeng';
import { SpacesLoggingService } from './spaces_logging.service'

@Injectable()
export class SpacesMessagesService {
    public msgs: Message[] = [];

    constructor(
        private logging: SpacesLoggingService
    ) { 
        this.logging.moduleColor('#00008b', '#fff', 'SpacesMessagesService');
    }

    public showSuccess(summary: string, detail: string) {
        this.showMessage('success', summary, detail);
    }

    public showInfo(summary: string, detail: string) {
        this.showMessage('info', summary, detail);
    }

    public showWarning(summary: string, detail: string) {
        this.showMessage('warn', summary, detail);
    }

    public showError(summary: string, detail: string) {
        this.showMessage('error', summary, detail);
    }

    private showMessage(severity: string, summary: string, detail: string) {
        this.clearMessages();
        this.msgs.push({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    private clearMessages() {
        this.msgs = [];
    }
}