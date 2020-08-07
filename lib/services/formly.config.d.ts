import { InjectionToken, ComponentRef } from '@angular/core';
import { FieldType } from './../templates/field.type';
import { FormlyFieldConfig, FormlyFieldConfigCache, ConfigOption, TypeOption, ValidatorOption, WrapperOption, FormlyExtension, ValidationMessageOption } from '../models';
export declare const FORMLY_CONFIG: InjectionToken<ConfigOption[]>;
/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
export declare class FormlyConfig {
    types: {
        [name: string]: TypeOption;
    };
    validators: {
        [name: string]: ValidatorOption;
    };
    wrappers: {
        [name: string]: WrapperOption;
    };
    messages: {
        [name: string]: ValidationMessageOption['message'];
    };
    extras: ConfigOption['extras'];
    extensions: {
        [name: string]: FormlyExtension;
    };
    addConfig(config: ConfigOption): void;
    setType(options: TypeOption | TypeOption[]): void;
    getType(name: string): TypeOption;
    getMergedField(field?: FormlyFieldConfig): any;
    /** @internal */
    resolveFieldTypeRef(field?: FormlyFieldConfigCache): ComponentRef<FieldType>;
    setWrapper(options: WrapperOption): void;
    getWrapper(name: string): WrapperOption;
    setTypeWrapper(type: string, name: string): void;
    setValidator(options: ValidatorOption): void;
    getValidator(name: string): ValidatorOption;
    addValidatorMessage(name: string, message: ValidationMessageOption['message']): void;
    getValidatorMessage(name: string): string | ((error: any, field: FormlyFieldConfig) => string | import("rxjs").Observable<string>);
    private mergeExtendedType;
}
