import { __decorate, __param, __metadata, __rest } from 'tslib';
import { InjectionToken, ɵɵdefineInjectable, Injectable, ComponentFactoryResolver, Injector, Optional, ɵɵinject, INJECTOR, EventEmitter, NgZone, Input, Output, Component, ChangeDetectionStrategy, Renderer2, ElementRef, ViewChild, ViewContainerRef, Inject, Directive, ChangeDetectorRef, NgModule } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective, FormControl, FormArray, Validators } from '@angular/forms';
import { isObservable, of, Observable, Subject } from 'rxjs';
import { filter, switchMap, take, distinctUntilChanged, startWith, debounceTime, map } from 'rxjs/operators';
import { DOCUMENT, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

function getFieldId(formId, field, index) {
    if (field.id) {
        return field.id;
    }
    let type = field.type;
    if (!type && field.template) {
        type = 'template';
    }
    return [formId, type, field.key, index].join('_');
}
function getKeyPath(field) {
    if (!field.key) {
        return [];
    }
    /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
    if (!field._keyPath || field._keyPath.key !== field.key) {
        const key = field.key.indexOf('[') === -1 ? field.key : field.key.replace(/\[(\w+)\]/g, '.$1');
        defineHiddenProp(field, '_keyPath', { key: field.key, path: key.indexOf('.') !== -1 ? key.split('.') : [key] });
    }
    return field._keyPath.path.slice(0);
}
const FORMLY_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];
function assignFieldValue(field, value, autoClear = false) {
    let paths = getKeyPath(field);
    while (field.parent) {
        field = field.parent;
        paths = [...getKeyPath(field), ...paths];
    }
    if (autoClear && value === undefined && field['autoClear'] && !field.formControl.parent) {
        const k = paths.pop();
        const m = paths.reduce((model, path) => model[path] || {}, field.parent.model);
        delete m[k];
        return;
    }
    assignModelValue(field.model, paths, value);
}
function assignModelValue(model, paths, value) {
    for (let i = 0; i < paths.length - 1; i++) {
        const path = paths[i];
        if (!model[path] || !isObject(model[path])) {
            model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
        }
        model = model[path];
    }
    model[paths[paths.length - 1]] = clone(value);
}
function getFieldInitialValue(field) {
    let value = field.options['_initialModel'];
    let paths = getKeyPath(field);
    while (field.parent) {
        field = field.parent;
        paths = [...getKeyPath(field), ...paths];
    }
    for (const path of paths) {
        if (!value) {
            return undefined;
        }
        value = value[path];
    }
    return value;
}
function getFieldValue(field) {
    let model = field.parent ? field.parent.model : field.model;
    for (const path of getKeyPath(field)) {
        if (!model) {
            return model;
        }
        model = model[path];
    }
    return model;
}
function reverseDeepMerge(dest, ...args) {
    args.forEach((src) => {
        for (const srcArg in src) {
            if (isNil(dest[srcArg]) || isBlankString(dest[srcArg])) {
                dest[srcArg] = clone(src[srcArg]);
            }
            else if (objAndSameType(dest[srcArg], src[srcArg])) {
                reverseDeepMerge(dest[srcArg], src[srcArg]);
            }
        }
    });
    return dest;
}
// check a value is null or undefined
function isNil(value) {
    return value == null;
}
function isUndefined(value) {
    return value === undefined;
}
function isBlankString(value) {
    return value === '';
}
function isFunction(value) {
    return typeof value === 'function';
}
function objAndSameType(obj1, obj2) {
    return (isObject(obj1) &&
        isObject(obj2) &&
        Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) &&
        !(Array.isArray(obj1) || Array.isArray(obj2)));
}
function isObject(x) {
    return x != null && typeof x === 'object';
}
function isPromise(obj) {
    return !!obj && typeof obj.then === 'function';
}
function clone(value) {
    if (!isObject(value) ||
        isObservable(value) ||
        /* instanceof SafeHtmlImpl */ value.changingThisBreaksApplicationSecurity ||
        ['RegExp', 'FileList', 'File', 'Blob'].indexOf(value.constructor.name) !== -1) {
        return value;
    }
    // https://github.com/moment/moment/blob/master/moment.js#L252
    if (value._isAMomentObject && isFunction(value.clone)) {
        return value.clone();
    }
    if (value instanceof AbstractControl) {
        return null;
    }
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (Array.isArray(value)) {
        return value.slice(0).map((v) => clone(v));
    }
    // best way to clone a js object maybe
    // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
    const proto = Object.getPrototypeOf(value);
    let c = Object.create(proto);
    c = Object.setPrototypeOf(c, proto);
    // need to make a deep copy so we dont use Object.assign
    // also Object.assign wont copy property descriptor exactly
    return Object.keys(value).reduce((newVal, prop) => {
        const propDesc = Object.getOwnPropertyDescriptor(value, prop);
        if (propDesc.get) {
            Object.defineProperty(newVal, prop, propDesc);
        }
        else {
            newVal[prop] = clone(value[prop]);
        }
        return newVal;
    }, c);
}
function defineHiddenProp(field, prop, defaultValue) {
    Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
    field[prop] = defaultValue;
}
function observeDeep({ source, paths, target, setFn }) {
    const observers = [];
    if (paths.length === 0) {
        target = source;
    }
    Object.keys(target).forEach((path) => {
        let unsubscribe = () => { };
        const observer = observe(source, [...paths, path], ({ firstChange, currentValue }) => {
            !firstChange && setFn();
            unsubscribe();
            const i = observers.indexOf(unsubscribe);
            if (i > -1) {
                observers.splice(i, 1);
            }
            if (isObject(currentValue) && currentValue.constructor.name === 'Object') {
                unsubscribe = observeDeep({ source, setFn, paths: [...paths, path], target: currentValue });
                observers.push(unsubscribe);
            }
        });
        observers.push(() => observer.unsubscribe());
    });
    return () => {
        observers.forEach((observer) => observer());
    };
}
function observe(o, paths, setFn) {
    if (!o._observers) {
        defineHiddenProp(o, '_observers', {});
    }
    let target = o;
    for (let i = 0; i < paths.length - 1; i++) {
        if (!target[paths[i]] || !isObject(target[paths[i]])) {
            target[paths[i]] = /^\d+$/.test(paths[i + 1]) ? [] : {};
        }
        target = target[paths[i]];
    }
    const key = paths[paths.length - 1];
    const prop = paths.join('.');
    if (!o._observers[prop]) {
        o._observers[prop] = { value: target[key], onChange: [] };
    }
    const state = o._observers[prop];
    if (state.onChange.indexOf(setFn) === -1) {
        state.onChange.push(setFn);
        setFn({ currentValue: state.value, firstChange: true });
        if (state.onChange.length === 1) {
            const { enumerable } = Object.getOwnPropertyDescriptor(target, key) || { enumerable: true };
            Object.defineProperty(target, key, {
                enumerable,
                configurable: true,
                get: () => state.value,
                set: (currentValue) => {
                    if (currentValue !== state.value) {
                        const previousValue = state.value;
                        state.value = currentValue;
                        state.onChange.forEach((changeFn) => changeFn({ previousValue, currentValue, firstChange: false }));
                    }
                },
            });
        }
    }
    return {
        setValue(value) {
            state.value = value;
        },
        unsubscribe() {
            state.onChange = state.onChange.filter((changeFn) => changeFn !== setFn);
        },
    };
}
function reduceFormUpdateValidityCalls(form, action) {
    const updateValidity = form._updateTreeValidity.bind(form);
    let updateValidityArgs = null;
    form._updateTreeValidity = (...args) => (updateValidityArgs = args);
    action();
    updateValidityArgs && updateValidity(updateValidityArgs);
    form._updateTreeValidity = updateValidity;
}

const FORMLY_CONFIG = new InjectionToken('FORMLY_CONFIG');
/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
let FormlyConfig = class FormlyConfig {
    constructor() {
        this.types = {};
        this.validators = {};
        this.wrappers = {};
        this.messages = {};
        this.extras = {
            checkExpressionOn: 'changeDetectionCheck',
            showError(field) {
                return (field.formControl &&
                    field.formControl.invalid &&
                    (field.formControl.touched ||
                        (field.options.parentForm && field.options.parentForm.submitted) ||
                        !!(field.field.validation && field.field.validation.show)));
            },
        };
        this.extensions = {};
    }
    addConfig(config) {
        if (config.types) {
            config.types.forEach((type) => this.setType(type));
        }
        if (config.validators) {
            config.validators.forEach((validator) => this.setValidator(validator));
        }
        if (config.wrappers) {
            config.wrappers.forEach((wrapper) => this.setWrapper(wrapper));
        }
        if (config.validationMessages) {
            config.validationMessages.forEach((validation) => this.addValidatorMessage(validation.name, validation.message));
        }
        if (config.extensions) {
            config.extensions.forEach((c) => (this.extensions[c.name] = c.extension));
        }
        if (config.extras) {
            this.extras = Object.assign(Object.assign({}, this.extras), config.extras);
        }
    }
    setType(options) {
        if (Array.isArray(options)) {
            options.forEach((option) => this.setType(option));
        }
        else {
            if (!this.types[options.name]) {
                this.types[options.name] = { name: options.name };
            }
            ['component', 'extends', 'defaultOptions'].forEach((prop) => {
                if (options.hasOwnProperty(prop)) {
                    this.types[options.name][prop] = options[prop];
                }
            });
            if (options.wrappers) {
                options.wrappers.forEach((wrapper) => this.setTypeWrapper(options.name, wrapper));
            }
        }
    }
    getType(name) {
        if (!this.types[name]) {
            throw new Error(`[Formly Error] The type "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
        }
        this.mergeExtendedType(name);
        return this.types[name];
    }
    getMergedField(field = {}) {
        const type = this.getType(field.type);
        if (type.defaultOptions) {
            reverseDeepMerge(field, type.defaultOptions);
        }
        const extendDefaults = type.extends && this.getType(type.extends).defaultOptions;
        if (extendDefaults) {
            reverseDeepMerge(field, extendDefaults);
        }
        if (field && field.optionsTypes) {
            field.optionsTypes.forEach((option) => {
                const defaultOptions = this.getType(option).defaultOptions;
                if (defaultOptions) {
                    reverseDeepMerge(field, defaultOptions);
                }
            });
        }
        const componentRef = this.resolveFieldTypeRef(field);
        if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
            reverseDeepMerge(field, componentRef.instance.defaultOptions);
        }
        if (!field.wrappers && type.wrappers) {
            field.wrappers = [...type.wrappers];
        }
    }
    /** @internal */
    resolveFieldTypeRef(field = {}) {
        if (!field.type) {
            return null;
        }
        const type = this.getType(field.type);
        if (!type.component || type['_componentRef']) {
            return type['_componentRef'];
        }
        const { _resolver, _injector } = field.options;
        if (!_resolver || !_injector) {
            return null;
        }
        defineHiddenProp(type, '_componentRef', _resolver.resolveComponentFactory(type.component).create(_injector));
        return type['_componentRef'];
    }
    setWrapper(options) {
        this.wrappers[options.name] = options;
        if (options.types) {
            options.types.forEach((type) => {
                this.setTypeWrapper(type, options.name);
            });
        }
    }
    getWrapper(name) {
        if (!this.wrappers[name]) {
            throw new Error(`[Formly Error] The wrapper "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
        }
        return this.wrappers[name];
    }
    setTypeWrapper(type, name) {
        if (!this.types[type]) {
            this.types[type] = {};
        }
        if (!this.types[type].wrappers) {
            this.types[type].wrappers = [];
        }
        if (this.types[type].wrappers.indexOf(name) === -1) {
            this.types[type].wrappers.push(name);
        }
    }
    setValidator(options) {
        this.validators[options.name] = options;
    }
    getValidator(name) {
        if (!this.validators[name]) {
            throw new Error(`[Formly Error] The validator "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
        }
        return this.validators[name];
    }
    addValidatorMessage(name, message) {
        this.messages[name] = message;
    }
    getValidatorMessage(name) {
        return this.messages[name];
    }
    mergeExtendedType(name) {
        if (!this.types[name].extends) {
            return;
        }
        const extendedType = this.getType(this.types[name].extends);
        if (!this.types[name].component) {
            this.types[name].component = extendedType.component;
        }
        if (!this.types[name].wrappers) {
            this.types[name].wrappers = extendedType.wrappers;
        }
    }
};
FormlyConfig.ɵprov = ɵɵdefineInjectable({ factory: function FormlyConfig_Factory() { return new FormlyConfig(); }, token: FormlyConfig, providedIn: "root" });
FormlyConfig = __decorate([
    Injectable({ providedIn: 'root' })
], FormlyConfig);

let FormlyFormBuilder = class FormlyFormBuilder {
    constructor(config, resolver, injector, parentForm) {
        this.config = config;
        this.resolver = resolver;
        this.injector = injector;
        this.parentForm = parentForm;
    }
    buildForm(form, fieldGroup = [], model, options) {
        this.build({ fieldGroup, model, form, options });
    }
    build(field) {
        if (!this.config.extensions.core) {
            throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
        }
        if (!field.parent) {
            this._setOptions(field);
            reduceFormUpdateValidityCalls(field.form, () => this._build(field));
            const options = field.options;
            options.checkExpressions && options.checkExpressions(field, true);
            options.detectChanges && options.detectChanges(field);
        }
        else {
            this._build(field);
        }
    }
    _build(field) {
        if (!field) {
            return;
        }
        this.getExtensions().forEach((extension) => extension.prePopulate && extension.prePopulate(field));
        this.getExtensions().forEach((extension) => extension.onPopulate && extension.onPopulate(field));
        if (field.fieldGroup) {
            field.fieldGroup.forEach((f) => this._build(f));
        }
        this.getExtensions().forEach((extension) => extension.postPopulate && extension.postPopulate(field));
    }
    getExtensions() {
        return Object.keys(this.config.extensions).map((name) => this.config.extensions[name]);
    }
    _setOptions(field) {
        field.form = field.form || new FormGroup({});
        field.model = field.model || {};
        field.options = field.options || {};
        const options = field.options;
        if (!options._resolver) {
            defineHiddenProp(options, '_resolver', this.resolver);
        }
        if (!options._injector) {
            defineHiddenProp(options, '_injector', this.injector);
        }
        if (!options.build) {
            options._buildForm = () => {
                console.warn(`Formly: 'options._buildForm' is deprecated since v6.0, use 'options.build' instead.`);
                this.build(field);
            };
            options.build = (f) => this.build(f);
        }
        if (!options.parentForm && this.parentForm) {
            defineHiddenProp(options, 'parentForm', this.parentForm);
            observe(options, ['parentForm', 'submitted'], ({ firstChange }) => {
                if (!firstChange) {
                    options.checkExpressions(field);
                    options.detectChanges(field);
                }
            });
        }
    }
};
FormlyFormBuilder.ctorParameters = () => [
    { type: FormlyConfig },
    { type: ComponentFactoryResolver },
    { type: Injector },
    { type: FormGroupDirective, decorators: [{ type: Optional }] }
];
FormlyFormBuilder.ɵprov = ɵɵdefineInjectable({ factory: function FormlyFormBuilder_Factory() { return new FormlyFormBuilder(ɵɵinject(FormlyConfig), ɵɵinject(ComponentFactoryResolver), ɵɵinject(INJECTOR), ɵɵinject(FormGroupDirective, 8)); }, token: FormlyFormBuilder, providedIn: "root" });
FormlyFormBuilder = __decorate([
    Injectable({ providedIn: 'root' }),
    __param(3, Optional()),
    __metadata("design:paramtypes", [FormlyConfig,
        ComponentFactoryResolver,
        Injector,
        FormGroupDirective])
], FormlyFormBuilder);

let FormlyForm = class FormlyForm {
    constructor(builder, config, ngZone) {
        this.builder = builder;
        this.config = config;
        this.ngZone = ngZone;
        this.modelChange = new EventEmitter();
        this.field = {};
        this._modelChangeValue = {};
        this.valueChangesUnsubscribe = () => { };
    }
    set form(form) {
        this.field.form = form;
    }
    get form() {
        return this.field.form;
    }
    set model(model) {
        this.setField({ model });
    }
    get model() {
        return this.field.model;
    }
    set fields(fieldGroup) {
        this.setField({ fieldGroup });
    }
    get fields() {
        return this.field.fieldGroup;
    }
    set options(options) {
        this.setField({ options });
    }
    get options() {
        return this.field.options;
    }
    ngDoCheck() {
        if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
            this.checkExpressionChange();
        }
    }
    ngOnChanges(changes) {
        if (changes.fields || changes.form || (changes.model && this._modelChangeValue !== changes.model.currentValue)) {
            this.valueChangesUnsubscribe();
            this.builder.build(this.field);
            this.valueChangesUnsubscribe = this.valueChanges();
        }
    }
    ngOnDestroy() {
        this.valueChangesUnsubscribe();
    }
    checkExpressionChange() {
        this.field.options.checkExpressions(this.field);
    }
    valueChanges() {
        this.valueChangesUnsubscribe();
        const sub = this.field.options.fieldChanges
            .pipe(filter(({ type }) => type === 'valueChanges'), switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))))
            .subscribe(() => this.ngZone.runGuarded(() => {
            // runGuarded is used to keep in sync the expression changes
            // https://github.com/ngx-formly/ngx-formly/issues/2095
            this.checkExpressionChange();
            this.modelChange.emit((this._modelChangeValue = clone(this.model)));
        }));
        return () => sub.unsubscribe();
    }
    setField(field) {
        this.field = Object.assign(Object.assign({}, this.field), (this.config.extras.immutable ? clone(field) : field));
    }
};
FormlyForm.ctorParameters = () => [
    { type: FormlyFormBuilder },
    { type: FormlyConfig },
    { type: NgZone }
];
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FormlyForm.prototype, "form", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FormlyForm.prototype, "model", null);
__decorate([
    Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], FormlyForm.prototype, "fields", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FormlyForm.prototype, "options", null);
__decorate([
    Output(),
    __metadata("design:type", Object)
], FormlyForm.prototype, "modelChange", void 0);
FormlyForm = __decorate([
    Component({
        selector: 'formly-form',
        template: ` <formly-field *ngFor="let f of fields" [field]="f"></formly-field> `,
        providers: [FormlyFormBuilder],
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [FormlyFormBuilder, FormlyConfig, NgZone])
], FormlyForm);

let FormlyField = class FormlyField {
    constructor(config, renderer, resolver, elementRef) {
        this.config = config;
        this.renderer = renderer;
        this.resolver = resolver;
        this.elementRef = elementRef;
        this.hostObservers = [];
        this.componentRefs = [];
        this.hooksObservers = [];
        this.valueChangesUnsubscribe = () => { };
    }
    ngAfterContentInit() {
        this.triggerHook('afterContentInit');
    }
    ngAfterViewInit() {
        this.triggerHook('afterViewInit');
    }
    ngOnInit() {
        this.triggerHook('onInit');
    }
    ngOnChanges(changes) {
        this.triggerHook('onChanges', changes);
    }
    ngOnDestroy() {
        this.resetRefs(this.field);
        this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
        this.hooksObservers.forEach((unsubscribe) => unsubscribe());
        this.valueChangesUnsubscribe();
        this.triggerHook('onDestroy');
    }
    renderField(containerRef, f, wrappers) {
        if (this.containerRef === containerRef) {
            this.resetRefs(this.field);
            this.containerRef.clear();
        }
        if (wrappers && wrappers.length > 0) {
            const [wrapper, ...wps] = wrappers;
            const { component } = this.config.getWrapper(wrapper);
            const ref = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref, f);
            observe(ref.instance, ['fieldComponent'], ({ currentValue, previousValue, firstChange }) => {
                if (currentValue) {
                    const viewRef = previousValue ? previousValue.detach() : null;
                    if (viewRef && !viewRef.destroyed) {
                        currentValue.insert(viewRef);
                    }
                    else {
                        this.renderField(currentValue, f, wps);
                    }
                    !firstChange && ref.changeDetectorRef.detectChanges();
                }
            });
        }
        else if (f && f.type) {
            const { component } = this.config.getType(f.type);
            const ref = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref, f);
        }
    }
    triggerHook(name, changes) {
        if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
            this.valueChangesUnsubscribe = this.fieldChanges(this.field);
        }
        if (this.field && this.field.hooks && this.field.hooks[name]) {
            if (!changes || changes.field) {
                const r = this.field.hooks[name](this.field);
                if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
                    const sub = r.subscribe();
                    this.hooksObservers.push(() => sub.unsubscribe());
                }
            }
        }
        if (name === 'onChanges' && changes.field) {
            this.renderHostBinding();
            this.resetRefs(changes.field.previousValue);
            this.renderField(this.containerRef, this.field, this.field ? this.field.wrappers : []);
        }
    }
    attachComponentRef(ref, field) {
        this.componentRefs.push(ref);
        field._componentRefs.push(ref);
        Object.assign(ref.instance, { field });
    }
    renderHostBinding() {
        if (!this.field) {
            return;
        }
        this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
        this.hostObservers = [
            observe(this.field, ['hide'], ({ firstChange, currentValue }) => {
                if (!firstChange || (firstChange && currentValue)) {
                    this.renderer.setStyle(this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
                }
            }),
            observe(this.field, ['className'], ({ firstChange, currentValue }) => {
                if (!firstChange || (firstChange && currentValue)) {
                    this.renderer.setAttribute(this.elementRef.nativeElement, 'class', currentValue);
                }
            }),
        ];
    }
    resetRefs(field) {
        if (field) {
            if (field._componentRefs) {
                field._componentRefs = field._componentRefs.filter((ref) => this.componentRefs.indexOf(ref) === -1);
            }
            else {
                defineHiddenProp(this.field, '_componentRefs', []);
            }
        }
        this.componentRefs = [];
    }
    fieldChanges(field) {
        this.valueChangesUnsubscribe();
        if (!field) {
            return () => { };
        }
        const subscribes = [
            observeDeep({
                source: field,
                target: field.templateOptions,
                paths: ['templateOptions'],
                setFn: () => field.options.detectChanges(field),
            }),
            observeDeep({
                source: field,
                target: field.options.formState,
                paths: ['options', 'formState'],
                setFn: () => field.options.detectChanges(field),
            }),
        ];
        for (const path of [['template'], ['fieldGroupClassName'], ['validation', 'show']]) {
            const fieldObserver = observe(field, path, ({ firstChange }) => !firstChange && field.options.detectChanges(field));
            subscribes.push(() => fieldObserver.unsubscribe());
        }
        if (field.key && !field.fieldGroup) {
            const control = field.formControl;
            let valueChanges = control.valueChanges.pipe(distinctUntilChanged());
            if (control.value !== getFieldValue(field)) {
                valueChanges = valueChanges.pipe(startWith(control.value));
            }
            const { updateOn, debounce } = field.modelOptions;
            if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
                valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
            }
            const sub = valueChanges.subscribe((value) => {
                // workaround for https://github.com/angular/angular/issues/13792
                if (control instanceof FormControl && control['_fields'] && control['_fields'].length > 1) {
                    control.patchValue(value, { emitEvent: false, onlySelf: true });
                }
                if (field.parsers && field.parsers.length > 0) {
                    field.parsers.forEach((parserFn) => (value = parserFn(value)));
                }
                assignFieldValue(field, value, true);
                field.options.fieldChanges.next({ value, field, type: 'valueChanges' });
            });
            subscribes.push(() => sub.unsubscribe());
        }
        return () => subscribes.forEach((subscribe) => subscribe());
    }
};
FormlyField.ctorParameters = () => [
    { type: FormlyConfig },
    { type: Renderer2 },
    { type: ComponentFactoryResolver },
    { type: ElementRef }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormlyField.prototype, "field", void 0);
__decorate([
    ViewChild('container', { read: ViewContainerRef, static: true }),
    __metadata("design:type", ViewContainerRef)
], FormlyField.prototype, "containerRef", void 0);
FormlyField = __decorate([
    Component({
        selector: 'formly-field',
        template: '<ng-template #container></ng-template>',
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [FormlyConfig,
        Renderer2,
        ComponentFactoryResolver,
        ElementRef])
], FormlyField);

let FormlyAttributes = class FormlyAttributes {
    constructor(renderer, elementRef, _document) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.uiAttributesCache = {};
        this.uiAttributes = [...FORMLY_VALIDATORS, 'tabindex', 'placeholder', 'readonly', 'disabled', 'step'];
        /**
         * HostBinding doesn't register listeners conditionally which may produce some perf issues.
         *
         * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1991
         */
        this.uiEvents = {
            listeners: [],
            events: ['click', 'keyup', 'keydown', 'keypress', 'change'],
        };
        this.document = _document;
    }
    get to() {
        return this.field.templateOptions || {};
    }
    get fieldAttrElements() {
        return (this.field && this.field['_elementRefs']) || [];
    }
    ngOnChanges(changes) {
        if (changes.field) {
            this.field.name && this.setAttribute('name', this.field.name);
            this.uiEvents.listeners.forEach((listener) => listener());
            this.uiEvents.events.forEach((eventName) => {
                let callback = this.to && this.to[eventName];
                if (eventName === 'change') {
                    callback = this.onChange.bind(this);
                }
                if (callback) {
                    this.uiEvents.listeners.push(this.renderer.listen(this.elementRef.nativeElement, eventName, (e) => callback(this.field, e)));
                }
            });
            if (this.to && this.to.attributes) {
                observe(this.field, ['templateOptions', 'attributes'], ({ currentValue, previousValue }) => {
                    if (previousValue) {
                        Object.keys(previousValue).forEach((attr) => this.removeAttribute(attr));
                    }
                    if (currentValue) {
                        Object.keys(currentValue).forEach((attr) => this.setAttribute(attr, currentValue[attr]));
                    }
                });
            }
            this.detachElementRef(changes.field.previousValue);
            this.attachElementRef(changes.field.currentValue);
            if (this.fieldAttrElements.length === 1) {
                !this.id && this.field.id && this.setAttribute('id', this.field.id);
                this.focusObserver = observe(this.field, ['focus'], ({ currentValue }) => {
                    this.toggleFocus(currentValue);
                });
            }
        }
        if (changes.id) {
            this.setAttribute('id', this.id);
        }
    }
    /**
     * We need to re-evaluate all the attributes on every change detection cycle, because
     * by using a HostBinding we run into certain edge cases. This means that whatever logic
     * is in here has to be super lean or we risk seriously damaging or destroying the performance.
     *
     * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
     * Material issue: https://github.com/angular/components/issues/14024
     */
    ngDoCheck() {
        this.uiAttributes.forEach((attr) => {
            const value = this.to[attr];
            if (this.uiAttributesCache[attr] !== value) {
                this.uiAttributesCache[attr] = value;
                if (value || value === 0) {
                    this.setAttribute(attr, value === true ? attr : `${value}`);
                }
                else {
                    this.removeAttribute(attr);
                }
            }
        });
    }
    ngOnDestroy() {
        this.uiEvents.listeners.forEach((listener) => listener());
        this.detachElementRef(this.field);
        this.focusObserver && this.focusObserver.unsubscribe();
    }
    toggleFocus(value) {
        const element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
        if (!element || !element.nativeElement.focus) {
            return;
        }
        const isFocused = !!this.document.activeElement &&
            this.fieldAttrElements.some(({ nativeElement }) => this.document.activeElement === nativeElement || nativeElement.contains(this.document.activeElement));
        if (value && !isFocused) {
            element.nativeElement.focus();
        }
        else if (!value && isFocused) {
            element.nativeElement.blur();
        }
    }
    onFocus($event) {
        this.focusObserver && this.focusObserver.setValue(true);
        if (this.to.focus) {
            this.to.focus(this.field, $event);
        }
    }
    onBlur($event) {
        this.focusObserver && this.focusObserver.setValue(false);
        if (this.to.blur) {
            this.to.blur(this.field, $event);
        }
    }
    onChange($event) {
        if (this.to.change) {
            this.to.change(this.field, $event);
        }
        if (this.field.formControl) {
            this.field.formControl.markAsDirty();
        }
    }
    attachElementRef(f) {
        if (!f) {
            return;
        }
        if (f['_elementRefs'] && f['_elementRefs'].indexOf(this.elementRef) === -1) {
            f['_elementRefs'].push(this.elementRef);
        }
        else {
            defineHiddenProp(f, '_elementRefs', [this.elementRef]);
        }
    }
    detachElementRef(f) {
        const index = f && f['_elementRefs'] ? this.fieldAttrElements.indexOf(this.elementRef) : -1;
        if (index !== -1) {
            this.field['_elementRefs'].splice(index, 1);
        }
    }
    setAttribute(attr, value) {
        this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
    }
    removeAttribute(attr) {
        this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
    }
};
FormlyAttributes.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
__decorate([
    Input('formlyAttributes'),
    __metadata("design:type", Object)
], FormlyAttributes.prototype, "field", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], FormlyAttributes.prototype, "id", void 0);
FormlyAttributes = __decorate([
    Directive({
        selector: '[formlyAttributes]',
        host: {
            '(focus)': 'onFocus($event)',
            '(blur)': 'onBlur($event)',
        },
    }),
    __param(2, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Renderer2, ElementRef, Object])
], FormlyAttributes);

let FieldType = class FieldType {
    get model() {
        return this.field.model;
    }
    get form() {
        return this.field.form;
    }
    get options() {
        return this.field.options;
    }
    get key() {
        return this.field.key;
    }
    get formControl() {
        return this.field.formControl;
    }
    get to() {
        return this.field.templateOptions || {};
    }
    get showError() {
        return this.options.showError(this);
    }
    get id() {
        return this.field.id;
    }
    get formState() {
        return this.options.formState || {};
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], FieldType.prototype, "field", void 0);
FieldType = __decorate([
    Directive()
], FieldType);

let FormlyGroup = class FormlyGroup extends FieldType {
};
FormlyGroup = __decorate([
    Component({
        selector: 'formly-group',
        template: `
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    <ng-content></ng-content>
  `,
        host: {
            '[class]': 'field.fieldGroupClassName || ""',
        },
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], FormlyGroup);

let FormlyValidationMessage = class FormlyValidationMessage {
    constructor(config) {
        this.config = config;
    }
    ngOnChanges() {
        this.errorMessage$ = this.field.formControl.statusChanges.pipe(startWith(null), switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage))));
    }
    get errorMessage() {
        const fieldForm = this.field.formControl;
        for (const error in fieldForm.errors) {
            if (fieldForm.errors.hasOwnProperty(error)) {
                let message = this.config.getValidatorMessage(error);
                if (isObject(fieldForm.errors[error])) {
                    if (fieldForm.errors[error].errorPath) {
                        return;
                    }
                    if (fieldForm.errors[error].message) {
                        message = fieldForm.errors[error].message;
                    }
                }
                if (this.field.validation && this.field.validation.messages && this.field.validation.messages[error]) {
                    message = this.field.validation.messages[error];
                }
                if (this.field.validators && this.field.validators[error] && this.field.validators[error].message) {
                    message = this.field.validators[error].message;
                }
                if (this.field.asyncValidators &&
                    this.field.asyncValidators[error] &&
                    this.field.asyncValidators[error].message) {
                    message = this.field.asyncValidators[error].message;
                }
                if (typeof message === 'function') {
                    return message(fieldForm.errors[error], this.field);
                }
                return message;
            }
        }
    }
};
FormlyValidationMessage.ctorParameters = () => [
    { type: FormlyConfig }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormlyValidationMessage.prototype, "field", void 0);
FormlyValidationMessage = __decorate([
    Component({
        selector: 'formly-validation-message',
        template: '{{ errorMessage$ | async }}',
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [FormlyConfig])
], FormlyValidationMessage);

function unregisterControl(field, emitEvent = false) {
    const form = field.formControl.parent;
    if (!form) {
        return;
    }
    const control = field.formControl;
    const opts = { emitEvent };
    if (form instanceof FormArray) {
        const key = form.controls.findIndex((c) => c === control);
        if (key !== -1) {
            updateControl(form, opts, () => form.removeAt(key));
        }
    }
    else if (form instanceof FormGroup) {
        const paths = getKeyPath(field);
        const key = paths[paths.length - 1];
        if (form.get([key]) === control) {
            updateControl(form, opts, () => form.removeControl(key));
        }
    }
    control.setParent(null);
    if (field['autoClear']) {
        if (field.parent.model) {
            delete field.parent.model[field.key];
        }
        control.reset({ value: undefined, disabled: control.disabled }, { emitEvent: field.fieldGroup ? false : emitEvent, onlySelf: true });
    }
}
function findControl(field) {
    if (field.formControl) {
        return field.formControl;
    }
    const form = field.parent.formControl;
    return form ? form.get(getKeyPath(field)) : null;
}
function registerControl(field, control, emitEvent = false) {
    control = control || field.formControl;
    if (!control['_fields']) {
        defineHiddenProp(control, '_fields', []);
    }
    if (control['_fields'].indexOf(field) === -1) {
        control['_fields'].push(field);
    }
    if (!field.formControl && control) {
        defineHiddenProp(field, 'formControl', control);
        field.templateOptions.disabled = !!field.templateOptions.disabled;
        const disabledObserver = observe(field, ['templateOptions', 'disabled'], ({ firstChange, currentValue }) => {
            if (!firstChange) {
                currentValue ? field.formControl.disable() : field.formControl.enable();
            }
        });
        if (control.registerOnDisabledChange) {
            control.registerOnDisabledChange(disabledObserver.setValue);
        }
    }
    if (!field.form) {
        return;
    }
    let form = field.form;
    const paths = getKeyPath(field);
    if (!form['_formlyControls']) {
        defineHiddenProp(form, '_formlyControls', {});
    }
    form['_formlyControls'][paths.join('.')] = control;
    for (let i = 0; i < paths.length - 1; i++) {
        const path = paths[i];
        if (!form.get([path])) {
            registerControl({
                key: path,
                formControl: new FormGroup({}),
                form,
                parent: {},
            });
        }
        form = form.get([path]);
    }
    if (field['autoClear'] && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
        assignFieldValue(field, field.defaultValue);
    }
    const value = getFieldValue(field);
    if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
        control.patchValue(value, { emitEvent: false });
    }
    const key = paths[paths.length - 1];
    if (!field._hide && form.get([key]) !== control) {
        updateControl(form, { emitEvent }, () => form.setControl(key, control));
    }
}
function updateValidity(c) {
    const status = c.status;
    c.updateValueAndValidity({ emitEvent: false });
    if (status !== c.status) {
        c.statusChanges.emit(c.status);
    }
}
function updateControl(form, opts, action) {
    /**
     *  workaround for https://github.com/angular/angular/issues/27679
     */
    if (form instanceof FormGroup && !form['__patchForEachChild']) {
        defineHiddenProp(form, '__patchForEachChild', true);
        form._forEachChild = (cb) => {
            Object.keys(form.controls).forEach((k) => form.controls[k] && cb(form.controls[k], k));
        };
    }
    /**
     * workaround for https://github.com/angular/angular/issues/20439
     */
    const updateValueAndValidity = form.updateValueAndValidity.bind(form);
    if (opts.emitEvent === false) {
        form.updateValueAndValidity = (opts) => {
            updateValueAndValidity(Object.assign(Object.assign({}, (opts || {})), { emitEvent: false }));
        };
    }
    action();
    if (opts.emitEvent === false) {
        form.updateValueAndValidity = updateValueAndValidity;
    }
}

let FieldArrayType = class FieldArrayType extends FieldType {
    onPopulate(field) {
        if (!field.formControl && field.key) {
            registerControl(field, new FormArray([], { updateOn: field.modelOptions.updateOn }));
        }
        field.fieldGroup = field.fieldGroup || [];
        const length = field.model ? field.model.length : 0;
        if (field.fieldGroup.length > length) {
            for (let i = field.fieldGroup.length - 1; i >= length; --i) {
                unregisterControl(field.fieldGroup[i]);
                field.fieldGroup.splice(i, 1);
            }
        }
        for (let i = field.fieldGroup.length; i < length; i++) {
            const f = Object.assign(Object.assign({}, clone(field.fieldArray)), { key: `${i}` });
            field.fieldGroup.push(f);
        }
    }
    add(i, initialModel, { markAsDirty } = { markAsDirty: true }) {
        i = i == null ? this.field.fieldGroup.length : i;
        if (!this.model) {
            assignFieldValue(this.field, []);
        }
        this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
        this._build();
        markAsDirty && this.formControl.markAsDirty();
    }
    remove(i, { markAsDirty } = { markAsDirty: true }) {
        this.model.splice(i, 1);
        unregisterControl(this.field.fieldGroup[i], true);
        this.field.fieldGroup.splice(i, 1);
        this.field.fieldGroup.forEach((f, key) => (f.key = `${key}`));
        this._build();
        markAsDirty && this.formControl.markAsDirty();
    }
    _build() {
        this.options.build(this.field);
        this.options.fieldChanges.next({
            field: this.field,
            value: getFieldValue(this.field),
            type: 'valueChanges',
        });
    }
};
FieldArrayType = __decorate([
    Directive()
], FieldArrayType);

let FieldWrapper = class FieldWrapper extends FieldType {
};
__decorate([
    ViewChild('fieldComponent', { read: ViewContainerRef }),
    __metadata("design:type", ViewContainerRef)
], FieldWrapper.prototype, "fieldComponent", void 0);
FieldWrapper = __decorate([
    Directive()
], FieldWrapper);

let FormlyTemplateType = class FormlyTemplateType extends FieldType {
    constructor(sanitizer) {
        super();
        this.sanitizer = sanitizer;
        this.innerHtml = { content: null, template: null };
    }
    get template() {
        if (this.field && this.field.template !== this.innerHtml.template) {
            this.innerHtml = {
                template: this.field.template,
                content: this.to.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template,
            };
        }
        return this.innerHtml.content;
    }
};
FormlyTemplateType.ctorParameters = () => [
    { type: DomSanitizer }
];
FormlyTemplateType = __decorate([
    Component({
        selector: 'formly-template',
        template: `<div [innerHtml]="template"></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [DomSanitizer])
], FormlyTemplateType);

function evalStringExpression(expression, argNames) {
    try {
        return Function(...argNames, `return ${expression};`);
    }
    catch (error) {
        console.error(error);
    }
}
function evalExpression(expression, thisArg, argVal) {
    if (typeof expression === 'function') {
        return expression.apply(thisArg, argVal);
    }
    else {
        return expression ? true : false;
    }
}

/** @experimental */
class FieldExpressionExtension {
    onPopulate(field) {
        if (field._expressions) {
            return;
        }
        // cache built expression
        defineHiddenProp(field, '_expressions', {});
        field.expressionProperties = field.expressionProperties || {};
        observe(field, ['hide'], ({ currentValue, firstChange }) => {
            defineHiddenProp(field, '_hide', !!currentValue);
            if (!firstChange || (firstChange && currentValue === true)) {
                field.templateOptions.hidden = currentValue;
                field.options._hiddenFieldsForCheck.push(field);
            }
        });
        if (field.hideExpression) {
            observe(field, ['hideExpression'], ({ currentValue: expr }) => {
                field._expressions.hide = this.parseExpressions(field, 'hide', typeof expr === 'boolean' ? () => expr : expr);
            });
        }
        for (const key of Object.keys(field.expressionProperties)) {
            observe(field, ['expressionProperties', key], ({ currentValue: expr }) => {
                if (typeof expr === 'string' || isFunction(expr)) {
                    field._expressions[key] = this.parseExpressions(field, key, expr);
                }
                else if (expr instanceof Observable) {
                    const subscribe = () => expr.subscribe((v) => {
                        this.evalExpr(field, key, v);
                    });
                    let subscription = subscribe();
                    const onInit = field.hooks.onInit;
                    field.hooks.onInit = () => {
                        if (subscription === null) {
                            subscription = subscribe();
                        }
                        return onInit && onInit(field);
                    };
                    const onDestroy = field.hooks.onDestroy;
                    field.hooks.onDestroy = () => {
                        onDestroy && onDestroy(field);
                        subscription.unsubscribe();
                        subscription = null;
                    };
                }
            });
        }
    }
    postPopulate(field) {
        if (field.parent) {
            return;
        }
        if (!field.options.checkExpressions) {
            field.options.checkExpressions = (f, ignoreCache = false) => {
                reduceFormUpdateValidityCalls(f.form, () => this.checkExpressions(f, ignoreCache));
                const options = field.options;
                options._hiddenFieldsForCheck.sort((f) => (f.hide ? -1 : 1)).forEach((f) => this.changeHideState(f, f.hide));
                options._hiddenFieldsForCheck = [];
            };
            field.options._checkField = (f, ignoreCache) => {
                console.warn(`Formly: 'options._checkField' is deprecated since v6.0, use 'options.checkExpressions' instead.`);
                field.options.checkExpressions(f, ignoreCache);
            };
        }
    }
    parseExpressions(field, path, expr) {
        let parentExpression;
        if (field.parent && ['hide', 'templateOptions.disabled'].includes(path)) {
            parentExpression = evalStringExpression(`!!field.parent.${path}`, ['field']);
        }
        expr = expr || (() => false);
        if (typeof expr === 'string') {
            expr = evalStringExpression(expr, ['model', 'formState', 'field']);
        }
        let currentValue;
        return (ignoreCache) => {
            const exprValue = evalExpression(parentExpression ? (...args) => parentExpression(field) || expr(...args) : expr, { field }, [field.model, field.options.formState, field]);
            if (ignoreCache ||
                (currentValue !== exprValue &&
                    (!isObject(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue)))) {
                currentValue = exprValue;
                this.evalExpr(field, path, exprValue);
                return true;
            }
            return false;
        };
    }
    checkExpressions(field, ignoreCache = false) {
        if (!field) {
            return;
        }
        if (field._expressions) {
            for (const key of Object.keys(field._expressions)) {
                field._expressions[key](ignoreCache);
            }
        }
        if (field.fieldGroup) {
            field.fieldGroup.forEach((f) => this.checkExpressions(f, ignoreCache));
        }
    }
    changeDisabledState(field, value) {
        if (field.fieldGroup) {
            field.fieldGroup
                .filter((f) => !f.expressionProperties || !f.expressionProperties.hasOwnProperty('templateOptions.disabled'))
                .forEach((f) => this.changeDisabledState(f, value));
        }
        if (field.key && field.templateOptions.disabled !== value) {
            field.templateOptions.disabled = value;
        }
    }
    changeHideState(field, hide) {
        if (field.formControl && field.key) {
            defineHiddenProp(field, '_hide', !!(hide || field.hide));
            const c = field.formControl;
            if (c['_fields'].length > 1) {
                updateValidity(c);
            }
            hide === true && c['_fields'].every((f) => !!f._hide) ? unregisterControl(field) : registerControl(field);
        }
        if (field.fieldGroup) {
            field.fieldGroup.filter((f) => !f.hideExpression).forEach((f) => this.changeHideState(f, hide));
        }
        if (field.options.fieldChanges) {
            field.options.fieldChanges.next({ field, type: 'hidden', value: hide });
        }
    }
    evalExpr(field, prop, value) {
        try {
            let target = field;
            const paths = prop.split('.');
            const lastIndex = paths.length - 1;
            for (let i = 0; i < lastIndex; i++) {
                target = target[paths[i]];
            }
            target[paths[lastIndex]] = value;
        }
        catch (error) {
            error.message = `[Formly Error] [Expression "${prop}"] ${error.message}`;
            throw error;
        }
        if (prop === 'templateOptions.disabled' && field.key) {
            this.changeDisabledState(field, value);
        }
        if (prop.indexOf('model.') === 0) {
            const key = prop.replace(/^model\./, ''), control = field.key && field.key === key ? field.formControl : field.form.get(key);
            if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
                control.patchValue(value, { emitEvent: false });
            }
        }
    }
}

/** @experimental */
class FieldValidationExtension {
    constructor(config) {
        this.config = config;
    }
    onPopulate(field) {
        this.initFieldValidation(field, 'validators');
        this.initFieldValidation(field, 'asyncValidators');
    }
    initFieldValidation(field, type) {
        const validators = [];
        if (type === 'validators' && !(field.hasOwnProperty('fieldGroup') && !field.key)) {
            validators.push(this.getPredefinedFieldValidation(field));
        }
        if (field[type]) {
            for (const validatorName of Object.keys(field[type])) {
                validatorName === 'validation'
                    ? validators.push(...field[type].validation.map((v) => this.wrapNgValidatorFn(field, v)))
                    : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName));
            }
        }
        defineHiddenProp(field, '_' + type, validators);
    }
    getPredefinedFieldValidation(field) {
        let VALIDATORS = [];
        FORMLY_VALIDATORS.forEach((opt) => observe(field, ['templateOptions', opt], ({ currentValue, firstChange }) => {
            VALIDATORS = VALIDATORS.filter((o) => o !== opt);
            if (currentValue != null && currentValue !== false) {
                VALIDATORS.push(opt);
            }
            if (!firstChange && field.formControl) {
                updateValidity(field.formControl);
            }
        }));
        return (control) => {
            if (VALIDATORS.length === 0) {
                return null;
            }
            return Validators.compose(VALIDATORS.map((opt) => () => {
                const value = field.templateOptions[opt];
                switch (opt) {
                    case 'required':
                        return Validators.required(control);
                    case 'pattern':
                        return Validators.pattern(value)(control);
                    case 'minLength':
                        return Validators.minLength(value)(control);
                    case 'maxLength':
                        return Validators.maxLength(value)(control);
                    case 'min':
                        return Validators.min(value)(control);
                    case 'max':
                        return Validators.max(value)(control);
                }
            }))(control);
        };
    }
    wrapNgValidatorFn(field, validator, validatorName) {
        let validatorOption = null;
        if (typeof validator === 'string') {
            validatorOption = clone(this.config.getValidator(validator));
        }
        if (typeof validator === 'object' && validator.name) {
            validatorOption = clone(this.config.getValidator(validator.name));
            if (validator.options) {
                validatorOption.options = validator.options;
            }
        }
        if (typeof validator === 'object' && validator.expression) {
            const { expression } = validator, options = __rest(validator, ["expression"]);
            validatorOption = {
                name: validatorName,
                validation: expression,
                options: Object.keys(options).length > 0 ? options : null,
            };
        }
        if (typeof validator === 'function') {
            validatorOption = {
                name: validatorName,
                validation: validator,
            };
        }
        return (control) => {
            let errors = validatorOption.validation(control, field, validatorOption.options);
            if (validatorName) {
                if (isPromise(errors)) {
                    return errors.then((v) => this.handleAsyncResult(field, v, validatorOption));
                }
                if (isObservable(errors)) {
                    return errors.pipe(map((v) => this.handleAsyncResult(field, v, validatorOption)));
                }
                errors = !!errors;
            }
            return this.handleResult(field, errors, validatorOption);
        };
    }
    handleAsyncResult(field, isValid, options) {
        // workaround for https://github.com/angular/angular/issues/13200
        field.options.detectChanges(field);
        return this.handleResult(field, !!isValid, options);
    }
    handleResult(field, errors, { name, options }) {
        if (typeof errors === 'boolean') {
            errors = errors ? null : { [name]: options ? options : true };
        }
        const ctrl = field.formControl;
        ctrl && ctrl['_childrenErrors'] && ctrl['_childrenErrors'][name] && ctrl['_childrenErrors'][name]();
        if (ctrl && errors && errors[name]) {
            const errorPath = errors[name].errorPath ? errors[name].errorPath : (options || {}).errorPath;
            const childCtrl = errorPath ? field.formControl.get(errorPath) : null;
            if (childCtrl) {
                const _a = errors[name], { errorPath } = _a, opts = __rest(_a, ["errorPath"]);
                childCtrl.setErrors(Object.assign(Object.assign({}, (childCtrl.errors || {})), { [name]: opts }));
                !ctrl['_childrenErrors'] && defineHiddenProp(ctrl, '_childrenErrors', {});
                ctrl['_childrenErrors'][name] = () => {
                    const _a = childCtrl.errors || {}, _b = name, toDelete = _a[_b], childErrors = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    childCtrl.setErrors(Object.keys(childErrors).length === 0 ? null : childErrors);
                };
            }
        }
        return errors;
    }
}

/** @experimental */
class FieldFormExtension {
    prePopulate(field) {
        if (!this.root) {
            this.root = field;
        }
        if (field.parent) {
            Object.defineProperty(field, 'form', {
                get: () => field.parent.formControl,
                configurable: true,
            });
        }
    }
    onPopulate(field) {
        if (field.key) {
            this.addFormControl(field);
        }
        if (field.form && field.hasOwnProperty('fieldGroup') && !field.key) {
            defineHiddenProp(field, 'formControl', field.form);
        }
    }
    postPopulate(field) {
        if (this.root !== field) {
            return;
        }
        this.root = null;
        const updateValidity = this.setValidators(field);
        updateValidity && field.form._updateTreeValidity();
    }
    addFormControl(field) {
        let control = findControl(field);
        if (!control) {
            const controlOptions = { updateOn: field.modelOptions.updateOn };
            control = field.fieldGroup
                ? new FormGroup({}, controlOptions)
                : new FormControl({ value: getFieldValue(field), disabled: false }, controlOptions);
        }
        registerControl(field, control);
    }
    setValidators(field) {
        let updateValidity$1 = false;
        if (field.key || !field.parent) {
            const { formControl: c } = field;
            const disabled = field.templateOptions ? field.templateOptions.disabled : false;
            if (disabled && c.enabled) {
                c.disable({ emitEvent: false, onlySelf: true });
                updateValidity$1 = true;
            }
            if (null === c.validator || null === c.asyncValidator) {
                c.setValidators(() => {
                    const v = Validators.compose(this.mergeValidators(field, '_validators'));
                    return v ? v(c) : null;
                });
                c.setAsyncValidators(() => {
                    const v = Validators.composeAsync(this.mergeValidators(field, '_asyncValidators'));
                    return v ? v(c) : of(null);
                });
                if (!c.parent) {
                    updateValidity(c);
                }
                else {
                    updateValidity$1 = true;
                }
            }
        }
        (field.fieldGroup || []).forEach((f) => f && this.setValidators(f) && (updateValidity$1 = true));
        return updateValidity$1;
    }
    mergeValidators(field, type) {
        const validators = [];
        const c = field.formControl;
        if (c && c['_fields'] && c['_fields'].length > 1) {
            c['_fields']
                .filter((f) => !f._hide)
                .forEach((f) => validators.push(...f[type]));
        }
        else {
            validators.push(...field[type]);
        }
        if (field.fieldGroup) {
            field.fieldGroup
                .filter((f) => f && !f.key && f.fieldGroup)
                .forEach((f) => validators.push(...this.mergeValidators(f, type)));
        }
        return validators;
    }
}

/** @experimental */
class CoreExtension {
    constructor(config) {
        this.config = config;
        this.formId = 0;
    }
    prePopulate(field) {
        const root = field.parent;
        this.initRootOptions(field);
        if (root) {
            Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
            Object.defineProperty(field, 'model', {
                get: () => (field.key && field.fieldGroup ? getFieldValue(field) : root.model),
                configurable: true,
            });
        }
        this.getFieldComponentInstance(field).prePopulate();
    }
    onPopulate(field) {
        this.initFieldOptions(field);
        this.getFieldComponentInstance(field).onPopulate();
        if (field.fieldGroup) {
            field.fieldGroup.forEach((f, index) => {
                if (f) {
                    Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
                    Object.defineProperty(f, 'index', { get: () => index, configurable: true });
                }
                this.formId++;
            });
        }
    }
    postPopulate(field) {
        this.getFieldComponentInstance(field).postPopulate();
    }
    initRootOptions(field) {
        if (field.parent) {
            return;
        }
        const options = field.options;
        field.options.formState = field.options.formState || {};
        if (!options.showError) {
            options.showError = this.config.extras.showError;
        }
        if (!options.fieldChanges) {
            defineHiddenProp(options, 'fieldChanges', new Subject());
        }
        if (!options._hiddenFieldsForCheck) {
            options._hiddenFieldsForCheck = [];
        }
        options._markForCheck = (f) => {
            console.warn(`Formly: 'options._markForCheck' is deprecated since v6.0, use 'options.detectChanges' instead.`);
            options.detectChanges(f);
        };
        options.detectChanges = (f) => {
            if (f._componentRefs) {
                f._componentRefs.forEach((ref) => {
                    // NOTE: we cannot use ref.changeDetectorRef, see https://github.com/ngx-formly/ngx-formly/issues/2191
                    const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
                    changeDetectorRef.markForCheck();
                });
            }
            if (f.fieldGroup) {
                f.fieldGroup.forEach((f) => f && options.detectChanges(f));
            }
        };
        options.resetModel = (model) => {
            model = clone(model !== null && model !== void 0 ? model : options._initialModel);
            if (field.model) {
                Object.keys(field.model).forEach((k) => delete field.model[k]);
                Object.assign(field.model, model || {});
            }
            options.build(field);
            field.form.reset(model);
            if (options.parentForm && options.parentForm.control === field.formControl) {
                options.parentForm.submitted = false;
            }
        };
        options.updateInitialValue = () => (options._initialModel = clone(field.model));
        field.options.updateInitialValue();
    }
    initFieldOptions(field) {
        reverseDeepMerge(field, {
            id: getFieldId(`formly_${this.formId}`, field, field['index']),
            hooks: {},
            modelOptions: {},
            templateOptions: !field.type || !field.key
                ? {}
                : {
                    label: '',
                    placeholder: '',
                    focus: false,
                    disabled: false,
                },
        });
        if (field.type !== 'formly-template' &&
            (field.template || (field.expressionProperties && field.expressionProperties.template))) {
            field.type = 'formly-template';
        }
        if (!field.type && field.fieldGroup) {
            field.type = 'formly-group';
        }
        if (field.type) {
            this.config.getMergedField(field);
        }
        if (!field['autoClear'] && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
            assignFieldValue(field, field.defaultValue);
        }
        field.wrappers = field.wrappers || [];
    }
    getFieldComponentInstance(field) {
        const componentRef = this.config.resolveFieldTypeRef(field);
        const instance = componentRef ? componentRef.instance : {};
        return {
            prePopulate: () => instance.prePopulate && instance.prePopulate(field),
            onPopulate: () => instance.onPopulate && instance.onPopulate(field),
            postPopulate: () => instance.postPopulate && instance.postPopulate(field),
        };
    }
}

var FormlyModule_1;
function defaultFormlyConfig(config) {
    return {
        types: [
            { name: 'formly-group', component: FormlyGroup },
            { name: 'formly-template', component: FormlyTemplateType },
        ],
        extensions: [
            { name: 'core', extension: new CoreExtension(config) },
            { name: 'field-validation', extension: new FieldValidationExtension(config) },
            { name: 'field-form', extension: new FieldFormExtension() },
            { name: 'field-expression', extension: new FieldExpressionExtension() },
        ],
    };
}
let FormlyModule = FormlyModule_1 = class FormlyModule {
    constructor(configService, configs = []) {
        if (!configs) {
            return;
        }
        configs.forEach((config) => configService.addConfig(config));
    }
    static forRoot(config = {}) {
        return {
            ngModule: FormlyModule_1,
            providers: [
                { provide: FORMLY_CONFIG, multi: true, useFactory: defaultFormlyConfig, deps: [FormlyConfig] },
                { provide: FORMLY_CONFIG, useValue: config, multi: true },
                FormlyConfig,
                FormlyFormBuilder,
            ],
        };
    }
    static forChild(config = {}) {
        return {
            ngModule: FormlyModule_1,
            providers: [{ provide: FORMLY_CONFIG, useValue: config, multi: true }, FormlyFormBuilder],
        };
    }
};
FormlyModule.ctorParameters = () => [
    { type: FormlyConfig },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [FORMLY_CONFIG,] }] }
];
FormlyModule = FormlyModule_1 = __decorate([
    NgModule({
        declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage, FormlyTemplateType],
        exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
        imports: [CommonModule],
    }),
    __param(1, Optional()), __param(1, Inject(FORMLY_CONFIG)),
    __metadata("design:paramtypes", [FormlyConfig, Array])
], FormlyModule);

/*
 * Public API Surface of core
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FORMLY_CONFIG, FieldArrayType, FieldType, FieldWrapper, FormlyConfig, FormlyField, FormlyForm, FormlyFormBuilder, FormlyModule, FormlyAttributes as ɵFormlyAttributes, FormlyGroup as ɵFormlyGroup, FormlyValidationMessage as ɵFormlyValidationMessage, defaultFormlyConfig as ɵa, FormlyTemplateType as ɵb, CoreExtension as ɵc, FieldValidationExtension as ɵd, defineHiddenProp as ɵdefineHiddenProp, FieldFormExtension as ɵe, FieldExpressionExtension as ɵf, getFieldInitialValue as ɵgetFieldInitialValue, observe as ɵobserve, reverseDeepMerge as ɵreverseDeepMerge };
//# sourceMappingURL=ngx-formly-core.js.map
