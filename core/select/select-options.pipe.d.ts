import { PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
interface ISelectOption {
    label: string;
    disabled?: boolean;
    value?: any;
    group?: ISelectOption[];
}
export declare class FormlySelectOptionsPipe implements PipeTransform {
    transform(options: any, field?: FormlyFieldConfig): Observable<ISelectOption[]>;
    private transformOptions;
    private transformOption;
    private transformSelectProps;
}
export {};
