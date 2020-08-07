import { FormlyFieldConfig } from '../models';
export declare abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> {
    field: F;
    defaultOptions?: F;
    get model(): any;
    get form(): import("@angular/forms").FormGroup | import("@angular/forms").FormArray;
    get options(): import("../models").FormlyFormOptions;
    get key(): string;
    get formControl(): import("@angular/forms").AbstractControl;
    get to(): import("../models").FormlyTemplateOptions;
    get showError(): boolean;
    get id(): string;
    get formState(): any;
}
