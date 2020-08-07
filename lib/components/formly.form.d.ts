import { DoCheck, OnChanges, SimpleChanges, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '../models';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
export declare class FormlyForm implements DoCheck, OnChanges, OnDestroy {
    private builder;
    private config;
    private ngZone;
    set form(form: FormGroup | FormArray);
    get form(): FormGroup | FormArray;
    set model(model: any);
    get model(): any;
    set fields(fieldGroup: FormlyFieldConfig[]);
    get fields(): FormlyFieldConfig[];
    set options(options: FormlyFormOptions);
    get options(): FormlyFormOptions;
    modelChange: EventEmitter<any>;
    private field;
    private _modelChangeValue;
    private valueChangesUnsubscribe;
    constructor(builder: FormlyFormBuilder, config: FormlyConfig, ngZone: NgZone);
    ngDoCheck(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private checkExpressionChange;
    private valueChanges;
    private setField;
}
