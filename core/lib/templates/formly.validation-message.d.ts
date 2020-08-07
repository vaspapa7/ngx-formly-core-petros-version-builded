import { OnChanges } from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig } from '../models';
import { Observable } from 'rxjs';
export declare class FormlyValidationMessage implements OnChanges {
    private config;
    field: FormlyFieldConfig;
    errorMessage$: Observable<string>;
    constructor(config: FormlyConfig);
    ngOnChanges(): void;
    get errorMessage(): string | Observable<string>;
}
