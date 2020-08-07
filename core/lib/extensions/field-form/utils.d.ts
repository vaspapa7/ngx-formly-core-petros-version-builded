import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../models';
export declare function unregisterControl(field: FormlyFieldConfig, emitEvent?: boolean): void;
export declare function findControl(field: FormlyFieldConfig): AbstractControl;
export declare function registerControl(field: FormlyFieldConfigCache, control?: any, emitEvent?: boolean): void;
export declare function updateValidity(c: AbstractControl): void;
