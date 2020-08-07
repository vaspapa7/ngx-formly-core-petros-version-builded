import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { FormlyFieldConfig, FormlyExtension } from '../models';
export declare abstract class FieldArrayType<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> implements FormlyExtension {
    formControl: FormArray;
    onPopulate(field: FormlyFieldConfig): void;
    add(i?: number, initialModel?: any, { markAsDirty }?: {
        markAsDirty: boolean;
    }): void;
    remove(i: number, { markAsDirty }?: {
        markAsDirty: boolean;
    }): void;
    private _build;
}
