import { __spread, __values, __assign, __decorate, __param, __metadata, __read, __extends, __rest } from 'tslib';
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
    var type = field.type;
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
        var key = field.key.indexOf('[') === -1 ? field.key : field.key.replace(/\[(\w+)\]/g, '.$1');
        defineHiddenProp(field, '_keyPath', { key: field.key, path: key.indexOf('.') !== -1 ? key.split('.') : [key] });
    }
    return field._keyPath.path.slice(0);
}
var FORMLY_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];
function assignFieldValue(field, value, autoClear) {
    if (autoClear === void 0) { autoClear = false; }
    var paths = getKeyPath(field);
    while (field.parent) {
        field = field.parent;
        paths = __spread(getKeyPath(field), paths);
    }
    if (autoClear && value === undefined && field['autoClear'] && !field.formControl.parent) {
        var k = paths.pop();
        var m = paths.reduce(function (model, path) { return model[path] || {}; }, field.parent.model);
        delete m[k];
        return;
    }
    assignModelValue(field.model, paths, value);
}
function assignModelValue(model, paths, value) {
    for (var i = 0; i < paths.length - 1; i++) {
        var path = paths[i];
        if (!model[path] || !isObject(model[path])) {
            model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
        }
        model = model[path];
    }
    model[paths[paths.length - 1]] = clone(value);
}
function getFieldInitialValue(field) {
    var e_1, _a;
    var value = field.options['_initialModel'];
    var paths = getKeyPath(field);
    while (field.parent) {
        field = field.parent;
        paths = __spread(getKeyPath(field), paths);
    }
    try {
        for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
            var path = paths_1_1.value;
            if (!value) {
                return undefined;
            }
            value = value[path];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return value;
}
function getFieldValue(field) {
    var e_2, _a;
    var model = field.parent ? field.parent.model : field.model;
    try {
        for (var _b = __values(getKeyPath(field)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var path = _c.value;
            if (!model) {
                return model;
            }
            model = model[path];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return model;
}
function reverseDeepMerge(dest) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args.forEach(function (src) {
        for (var srcArg in src) {
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
        return value.slice(0).map(function (v) { return clone(v); });
    }
    // best way to clone a js object maybe
    // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
    var proto = Object.getPrototypeOf(value);
    var c = Object.create(proto);
    c = Object.setPrototypeOf(c, proto);
    // need to make a deep copy so we dont use Object.assign
    // also Object.assign wont copy property descriptor exactly
    return Object.keys(value).reduce(function (newVal, prop) {
        var propDesc = Object.getOwnPropertyDescriptor(value, prop);
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
function observeDeep(_a) {
    var source = _a.source, paths = _a.paths, target = _a.target, setFn = _a.setFn;
    var observers = [];
    if (paths.length === 0) {
        target = source;
    }
    Object.keys(target).forEach(function (path) {
        var unsubscribe = function () { };
        var observer = observe(source, __spread(paths, [path]), function (_a) {
            var firstChange = _a.firstChange, currentValue = _a.currentValue;
            !firstChange && setFn();
            unsubscribe();
            var i = observers.indexOf(unsubscribe);
            if (i > -1) {
                observers.splice(i, 1);
            }
            if (isObject(currentValue) && currentValue.constructor.name === 'Object') {
                unsubscribe = observeDeep({ source: source, setFn: setFn, paths: __spread(paths, [path]), target: currentValue });
                observers.push(unsubscribe);
            }
        });
        observers.push(function () { return observer.unsubscribe(); });
    });
    return function () {
        observers.forEach(function (observer) { return observer(); });
    };
}
function observe(o, paths, setFn) {
    if (!o._observers) {
        defineHiddenProp(o, '_observers', {});
    }
    var target = o;
    for (var i = 0; i < paths.length - 1; i++) {
        if (!target[paths[i]] || !isObject(target[paths[i]])) {
            target[paths[i]] = /^\d+$/.test(paths[i + 1]) ? [] : {};
        }
        target = target[paths[i]];
    }
    var key = paths[paths.length - 1];
    var prop = paths.join('.');
    if (!o._observers[prop]) {
        o._observers[prop] = { value: target[key], onChange: [] };
    }
    var state = o._observers[prop];
    if (state.onChange.indexOf(setFn) === -1) {
        state.onChange.push(setFn);
        setFn({ currentValue: state.value, firstChange: true });
        if (state.onChange.length === 1) {
            var enumerable = (Object.getOwnPropertyDescriptor(target, key) || { enumerable: true }).enumerable;
            Object.defineProperty(target, key, {
                enumerable: enumerable,
                configurable: true,
                get: function () { return state.value; },
                set: function (currentValue) {
                    if (currentValue !== state.value) {
                        var previousValue_1 = state.value;
                        state.value = currentValue;
                        state.onChange.forEach(function (changeFn) { return changeFn({ previousValue: previousValue_1, currentValue: currentValue, firstChange: false }); });
                    }
                },
            });
        }
    }
    return {
        setValue: function (value) {
            state.value = value;
        },
        unsubscribe: function () {
            state.onChange = state.onChange.filter(function (changeFn) { return changeFn !== setFn; });
        },
    };
}
function reduceFormUpdateValidityCalls(form, action) {
    var updateValidity = form._updateTreeValidity.bind(form);
    var updateValidityArgs = null;
    form._updateTreeValidity = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (updateValidityArgs = args);
    };
    action();
    updateValidityArgs && updateValidity(updateValidityArgs);
    form._updateTreeValidity = updateValidity;
}

var FORMLY_CONFIG = new InjectionToken('FORMLY_CONFIG');
/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
var FormlyConfig = /** @class */ (function () {
    function FormlyConfig() {
        this.types = {};
        this.validators = {};
        this.wrappers = {};
        this.messages = {};
        this.extras = {
            checkExpressionOn: 'changeDetectionCheck',
            showError: function (field) {
                return (field.formControl &&
                    field.formControl.invalid &&
                    (field.formControl.touched ||
                        (field.options.parentForm && field.options.parentForm.submitted) ||
                        !!(field.field.validation && field.field.validation.show)));
            },
        };
        this.extensions = {};
    }
    FormlyConfig.prototype.addConfig = function (config) {
        var _this = this;
        if (config.types) {
            config.types.forEach(function (type) { return _this.setType(type); });
        }
        if (config.validators) {
            config.validators.forEach(function (validator) { return _this.setValidator(validator); });
        }
        if (config.wrappers) {
            config.wrappers.forEach(function (wrapper) { return _this.setWrapper(wrapper); });
        }
        if (config.validationMessages) {
            config.validationMessages.forEach(function (validation) { return _this.addValidatorMessage(validation.name, validation.message); });
        }
        if (config.extensions) {
            config.extensions.forEach(function (c) { return (_this.extensions[c.name] = c.extension); });
        }
        if (config.extras) {
            this.extras = __assign(__assign({}, this.extras), config.extras);
        }
    };
    FormlyConfig.prototype.setType = function (options) {
        var _this = this;
        if (Array.isArray(options)) {
            options.forEach(function (option) { return _this.setType(option); });
        }
        else {
            if (!this.types[options.name]) {
                this.types[options.name] = { name: options.name };
            }
            ['component', 'extends', 'defaultOptions'].forEach(function (prop) {
                if (options.hasOwnProperty(prop)) {
                    _this.types[options.name][prop] = options[prop];
                }
            });
            if (options.wrappers) {
                options.wrappers.forEach(function (wrapper) { return _this.setTypeWrapper(options.name, wrapper); });
            }
        }
    };
    FormlyConfig.prototype.getType = function (name) {
        if (!this.types[name]) {
            throw new Error("[Formly Error] The type \"" + name + "\" could not be found. Please make sure that is registered through the FormlyModule declaration.");
        }
        this.mergeExtendedType(name);
        return this.types[name];
    };
    FormlyConfig.prototype.getMergedField = function (field) {
        var _this = this;
        if (field === void 0) { field = {}; }
        var type = this.getType(field.type);
        if (type.defaultOptions) {
            reverseDeepMerge(field, type.defaultOptions);
        }
        var extendDefaults = type.extends && this.getType(type.extends).defaultOptions;
        if (extendDefaults) {
            reverseDeepMerge(field, extendDefaults);
        }
        if (field && field.optionsTypes) {
            field.optionsTypes.forEach(function (option) {
                var defaultOptions = _this.getType(option).defaultOptions;
                if (defaultOptions) {
                    reverseDeepMerge(field, defaultOptions);
                }
            });
        }
        var componentRef = this.resolveFieldTypeRef(field);
        if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
            reverseDeepMerge(field, componentRef.instance.defaultOptions);
        }
        if (!field.wrappers && type.wrappers) {
            field.wrappers = __spread(type.wrappers);
        }
    };
    /** @internal */
    FormlyConfig.prototype.resolveFieldTypeRef = function (field) {
        if (field === void 0) { field = {}; }
        if (!field.type) {
            return null;
        }
        var type = this.getType(field.type);
        if (!type.component || type['_componentRef']) {
            return type['_componentRef'];
        }
        var _a = field.options, _resolver = _a._resolver, _injector = _a._injector;
        if (!_resolver || !_injector) {
            return null;
        }
        defineHiddenProp(type, '_componentRef', _resolver.resolveComponentFactory(type.component).create(_injector));
        return type['_componentRef'];
    };
    FormlyConfig.prototype.setWrapper = function (options) {
        var _this = this;
        this.wrappers[options.name] = options;
        if (options.types) {
            options.types.forEach(function (type) {
                _this.setTypeWrapper(type, options.name);
            });
        }
    };
    FormlyConfig.prototype.getWrapper = function (name) {
        if (!this.wrappers[name]) {
            throw new Error("[Formly Error] The wrapper \"" + name + "\" could not be found. Please make sure that is registered through the FormlyModule declaration.");
        }
        return this.wrappers[name];
    };
    FormlyConfig.prototype.setTypeWrapper = function (type, name) {
        if (!this.types[type]) {
            this.types[type] = {};
        }
        if (!this.types[type].wrappers) {
            this.types[type].wrappers = [];
        }
        if (this.types[type].wrappers.indexOf(name) === -1) {
            this.types[type].wrappers.push(name);
        }
    };
    FormlyConfig.prototype.setValidator = function (options) {
        this.validators[options.name] = options;
    };
    FormlyConfig.prototype.getValidator = function (name) {
        if (!this.validators[name]) {
            throw new Error("[Formly Error] The validator \"" + name + "\" could not be found. Please make sure that is registered through the FormlyModule declaration.");
        }
        return this.validators[name];
    };
    FormlyConfig.prototype.addValidatorMessage = function (name, message) {
        this.messages[name] = message;
    };
    FormlyConfig.prototype.getValidatorMessage = function (name) {
        return this.messages[name];
    };
    FormlyConfig.prototype.mergeExtendedType = function (name) {
        if (!this.types[name].extends) {
            return;
        }
        var extendedType = this.getType(this.types[name].extends);
        if (!this.types[name].component) {
            this.types[name].component = extendedType.component;
        }
        if (!this.types[name].wrappers) {
            this.types[name].wrappers = extendedType.wrappers;
        }
    };
    FormlyConfig.ɵprov = ɵɵdefineInjectable({ factory: function FormlyConfig_Factory() { return new FormlyConfig(); }, token: FormlyConfig, providedIn: "root" });
    FormlyConfig = __decorate([
        Injectable({ providedIn: 'root' })
    ], FormlyConfig);
    return FormlyConfig;
}());

var FormlyFormBuilder = /** @class */ (function () {
    function FormlyFormBuilder(config, resolver, injector, parentForm) {
        this.config = config;
        this.resolver = resolver;
        this.injector = injector;
        this.parentForm = parentForm;
    }
    FormlyFormBuilder.prototype.buildForm = function (form, fieldGroup, model, options) {
        if (fieldGroup === void 0) { fieldGroup = []; }
        this.build({ fieldGroup: fieldGroup, model: model, form: form, options: options });
    };
    FormlyFormBuilder.prototype.build = function (field) {
        var _this = this;
        if (!this.config.extensions.core) {
            throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
        }
        if (!field.parent) {
            this._setOptions(field);
            reduceFormUpdateValidityCalls(field.form, function () { return _this._build(field); });
            var options = field.options;
            options.checkExpressions && options.checkExpressions(field, true);
            options.detectChanges && options.detectChanges(field);
        }
        else {
            this._build(field);
        }
    };
    FormlyFormBuilder.prototype._build = function (field) {
        var _this = this;
        if (!field) {
            return;
        }
        this.getExtensions().forEach(function (extension) { return extension.prePopulate && extension.prePopulate(field); });
        this.getExtensions().forEach(function (extension) { return extension.onPopulate && extension.onPopulate(field); });
        if (field.fieldGroup) {
            field.fieldGroup.forEach(function (f) { return _this._build(f); });
        }
        this.getExtensions().forEach(function (extension) { return extension.postPopulate && extension.postPopulate(field); });
    };
    FormlyFormBuilder.prototype.getExtensions = function () {
        var _this = this;
        return Object.keys(this.config.extensions).map(function (name) { return _this.config.extensions[name]; });
    };
    FormlyFormBuilder.prototype._setOptions = function (field) {
        var _this = this;
        field.form = field.form || new FormGroup({});
        field.model = field.model || {};
        field.options = field.options || {};
        var options = field.options;
        if (!options._resolver) {
            defineHiddenProp(options, '_resolver', this.resolver);
        }
        if (!options._injector) {
            defineHiddenProp(options, '_injector', this.injector);
        }
        if (!options.build) {
            options._buildForm = function () {
                console.warn("Formly: 'options._buildForm' is deprecated since v6.0, use 'options.build' instead.");
                _this.build(field);
            };
            options.build = function (f) { return _this.build(f); };
        }
        if (!options.parentForm && this.parentForm) {
            defineHiddenProp(options, 'parentForm', this.parentForm);
            observe(options, ['parentForm', 'submitted'], function (_a) {
                var firstChange = _a.firstChange;
                if (!firstChange) {
                    options.checkExpressions(field);
                    options.detectChanges(field);
                }
            });
        }
    };
    FormlyFormBuilder.ctorParameters = function () { return [
        { type: FormlyConfig },
        { type: ComponentFactoryResolver },
        { type: Injector },
        { type: FormGroupDirective, decorators: [{ type: Optional }] }
    ]; };
    FormlyFormBuilder.ɵprov = ɵɵdefineInjectable({ factory: function FormlyFormBuilder_Factory() { return new FormlyFormBuilder(ɵɵinject(FormlyConfig), ɵɵinject(ComponentFactoryResolver), ɵɵinject(INJECTOR), ɵɵinject(FormGroupDirective, 8)); }, token: FormlyFormBuilder, providedIn: "root" });
    FormlyFormBuilder = __decorate([
        Injectable({ providedIn: 'root' }),
        __param(3, Optional()),
        __metadata("design:paramtypes", [FormlyConfig,
            ComponentFactoryResolver,
            Injector,
            FormGroupDirective])
    ], FormlyFormBuilder);
    return FormlyFormBuilder;
}());

var FormlyForm = /** @class */ (function () {
    function FormlyForm(builder, config, ngZone) {
        this.builder = builder;
        this.config = config;
        this.ngZone = ngZone;
        this.modelChange = new EventEmitter();
        this.field = {};
        this._modelChangeValue = {};
        this.valueChangesUnsubscribe = function () { };
    }
    Object.defineProperty(FormlyForm.prototype, "form", {
        get: function () {
            return this.field.form;
        },
        set: function (form) {
            this.field.form = form;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormlyForm.prototype, "model", {
        get: function () {
            return this.field.model;
        },
        set: function (model) {
            this.setField({ model: model });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormlyForm.prototype, "fields", {
        get: function () {
            return this.field.fieldGroup;
        },
        set: function (fieldGroup) {
            this.setField({ fieldGroup: fieldGroup });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormlyForm.prototype, "options", {
        get: function () {
            return this.field.options;
        },
        set: function (options) {
            this.setField({ options: options });
        },
        enumerable: true,
        configurable: true
    });
    FormlyForm.prototype.ngDoCheck = function () {
        if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
            this.checkExpressionChange();
        }
    };
    FormlyForm.prototype.ngOnChanges = function (changes) {
        if (changes.fields || changes.form || (changes.model && this._modelChangeValue !== changes.model.currentValue)) {
            this.valueChangesUnsubscribe();
            this.builder.build(this.field);
            this.valueChangesUnsubscribe = this.valueChanges();
        }
    };
    FormlyForm.prototype.ngOnDestroy = function () {
        this.valueChangesUnsubscribe();
    };
    FormlyForm.prototype.checkExpressionChange = function () {
        this.field.options.checkExpressions(this.field);
    };
    FormlyForm.prototype.valueChanges = function () {
        var _this = this;
        this.valueChangesUnsubscribe();
        var sub = this.field.options.fieldChanges
            .pipe(filter(function (_a) {
            var type = _a.type;
            return type === 'valueChanges';
        }), switchMap(function () { return _this.ngZone.onStable.asObservable().pipe(take(1)); }))
            .subscribe(function () {
            return _this.ngZone.runGuarded(function () {
                // runGuarded is used to keep in sync the expression changes
                // https://github.com/ngx-formly/ngx-formly/issues/2095
                _this.checkExpressionChange();
                _this.modelChange.emit((_this._modelChangeValue = clone(_this.model)));
            });
        });
        return function () { return sub.unsubscribe(); };
    };
    FormlyForm.prototype.setField = function (field) {
        this.field = __assign(__assign({}, this.field), (this.config.extras.immutable ? clone(field) : field));
    };
    FormlyForm.ctorParameters = function () { return [
        { type: FormlyFormBuilder },
        { type: FormlyConfig },
        { type: NgZone }
    ]; };
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
            template: " <formly-field *ngFor=\"let f of fields\" [field]=\"f\"></formly-field> ",
            providers: [FormlyFormBuilder],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [FormlyFormBuilder, FormlyConfig, NgZone])
    ], FormlyForm);
    return FormlyForm;
}());

var FormlyField = /** @class */ (function () {
    function FormlyField(config, renderer, resolver, elementRef) {
        this.config = config;
        this.renderer = renderer;
        this.resolver = resolver;
        this.elementRef = elementRef;
        this.hostObservers = [];
        this.componentRefs = [];
        this.hooksObservers = [];
        this.valueChangesUnsubscribe = function () { };
    }
    FormlyField.prototype.ngAfterContentInit = function () {
        this.triggerHook('afterContentInit');
    };
    FormlyField.prototype.ngAfterViewInit = function () {
        this.triggerHook('afterViewInit');
    };
    FormlyField.prototype.ngOnInit = function () {
        this.triggerHook('onInit');
    };
    FormlyField.prototype.ngOnChanges = function (changes) {
        this.triggerHook('onChanges', changes);
    };
    FormlyField.prototype.ngOnDestroy = function () {
        this.resetRefs(this.field);
        this.hostObservers.forEach(function (hostObserver) { return hostObserver.unsubscribe(); });
        this.hooksObservers.forEach(function (unsubscribe) { return unsubscribe(); });
        this.valueChangesUnsubscribe();
        this.triggerHook('onDestroy');
    };
    FormlyField.prototype.renderField = function (containerRef, f, wrappers) {
        var _this = this;
        if (this.containerRef === containerRef) {
            this.resetRefs(this.field);
            this.containerRef.clear();
        }
        if (wrappers && wrappers.length > 0) {
            var _a = __read(wrappers), wrapper = _a[0], wps_1 = _a.slice(1);
            var component = this.config.getWrapper(wrapper).component;
            var ref_1 = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref_1, f);
            observe(ref_1.instance, ['fieldComponent'], function (_a) {
                var currentValue = _a.currentValue, previousValue = _a.previousValue, firstChange = _a.firstChange;
                if (currentValue) {
                    var viewRef = previousValue ? previousValue.detach() : null;
                    if (viewRef && !viewRef.destroyed) {
                        currentValue.insert(viewRef);
                    }
                    else {
                        _this.renderField(currentValue, f, wps_1);
                    }
                    !firstChange && ref_1.changeDetectorRef.detectChanges();
                }
            });
        }
        else if (f && f.type) {
            var component = this.config.getType(f.type).component;
            var ref = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref, f);
        }
    };
    FormlyField.prototype.triggerHook = function (name, changes) {
        if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
            this.valueChangesUnsubscribe = this.fieldChanges(this.field);
        }
        if (this.field && this.field.hooks && this.field.hooks[name]) {
            if (!changes || changes.field) {
                var r = this.field.hooks[name](this.field);
                if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
                    var sub_1 = r.subscribe();
                    this.hooksObservers.push(function () { return sub_1.unsubscribe(); });
                }
            }
        }
        if (name === 'onChanges' && changes.field) {
            this.renderHostBinding();
            this.resetRefs(changes.field.previousValue);
            this.renderField(this.containerRef, this.field, this.field ? this.field.wrappers : []);
        }
    };
    FormlyField.prototype.attachComponentRef = function (ref, field) {
        this.componentRefs.push(ref);
        field._componentRefs.push(ref);
        Object.assign(ref.instance, { field: field });
    };
    FormlyField.prototype.renderHostBinding = function () {
        var _this = this;
        if (!this.field) {
            return;
        }
        this.hostObservers.forEach(function (hostObserver) { return hostObserver.unsubscribe(); });
        this.hostObservers = [
            observe(this.field, ['hide'], function (_a) {
                var firstChange = _a.firstChange, currentValue = _a.currentValue;
                if (!firstChange || (firstChange && currentValue)) {
                    _this.renderer.setStyle(_this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
                }
            }),
            observe(this.field, ['className'], function (_a) {
                var firstChange = _a.firstChange, currentValue = _a.currentValue;
                if (!firstChange || (firstChange && currentValue)) {
                    _this.renderer.setAttribute(_this.elementRef.nativeElement, 'class', currentValue);
                }
            }),
        ];
    };
    FormlyField.prototype.resetRefs = function (field) {
        var _this = this;
        if (field) {
            if (field._componentRefs) {
                field._componentRefs = field._componentRefs.filter(function (ref) { return _this.componentRefs.indexOf(ref) === -1; });
            }
            else {
                defineHiddenProp(this.field, '_componentRefs', []);
            }
        }
        this.componentRefs = [];
    };
    FormlyField.prototype.fieldChanges = function (field) {
        var e_1, _a;
        this.valueChangesUnsubscribe();
        if (!field) {
            return function () { };
        }
        var subscribes = [
            observeDeep({
                source: field,
                target: field.templateOptions,
                paths: ['templateOptions'],
                setFn: function () { return field.options.detectChanges(field); },
            }),
            observeDeep({
                source: field,
                target: field.options.formState,
                paths: ['options', 'formState'],
                setFn: function () { return field.options.detectChanges(field); },
            }),
        ];
        var _loop_1 = function (path) {
            var fieldObserver = observe(field, path, function (_a) {
                var firstChange = _a.firstChange;
                return !firstChange && field.options.detectChanges(field);
            });
            subscribes.push(function () { return fieldObserver.unsubscribe(); });
        };
        try {
            for (var _b = __values([['template'], ['fieldGroupClassName'], ['validation', 'show']]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var path = _c.value;
                _loop_1(path);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (field.key && !field.fieldGroup) {
            var control_1 = field.formControl;
            var valueChanges = control_1.valueChanges.pipe(distinctUntilChanged());
            if (control_1.value !== getFieldValue(field)) {
                valueChanges = valueChanges.pipe(startWith(control_1.value));
            }
            var _d = field.modelOptions, updateOn = _d.updateOn, debounce = _d.debounce;
            if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
                valueChanges = control_1.valueChanges.pipe(debounceTime(debounce.default));
            }
            var sub_2 = valueChanges.subscribe(function (value) {
                // workaround for https://github.com/angular/angular/issues/13792
                if (control_1 instanceof FormControl && control_1['_fields'] && control_1['_fields'].length > 1) {
                    control_1.patchValue(value, { emitEvent: false, onlySelf: true });
                }
                if (field.parsers && field.parsers.length > 0) {
                    field.parsers.forEach(function (parserFn) { return (value = parserFn(value)); });
                }
                assignFieldValue(field, value, true);
                field.options.fieldChanges.next({ value: value, field: field, type: 'valueChanges' });
            });
            subscribes.push(function () { return sub_2.unsubscribe(); });
        }
        return function () { return subscribes.forEach(function (subscribe) { return subscribe(); }); };
    };
    FormlyField.ctorParameters = function () { return [
        { type: FormlyConfig },
        { type: Renderer2 },
        { type: ComponentFactoryResolver },
        { type: ElementRef }
    ]; };
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
    return FormlyField;
}());

var FormlyAttributes = /** @class */ (function () {
    function FormlyAttributes(renderer, elementRef, _document) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.uiAttributesCache = {};
        this.uiAttributes = __spread(FORMLY_VALIDATORS, ['tabindex', 'placeholder', 'readonly', 'disabled', 'step']);
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
    Object.defineProperty(FormlyAttributes.prototype, "to", {
        get: function () {
            return this.field.templateOptions || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormlyAttributes.prototype, "fieldAttrElements", {
        get: function () {
            return (this.field && this.field['_elementRefs']) || [];
        },
        enumerable: true,
        configurable: true
    });
    FormlyAttributes.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.field) {
            this.field.name && this.setAttribute('name', this.field.name);
            this.uiEvents.listeners.forEach(function (listener) { return listener(); });
            this.uiEvents.events.forEach(function (eventName) {
                var callback = _this.to && _this.to[eventName];
                if (eventName === 'change') {
                    callback = _this.onChange.bind(_this);
                }
                if (callback) {
                    _this.uiEvents.listeners.push(_this.renderer.listen(_this.elementRef.nativeElement, eventName, function (e) { return callback(_this.field, e); }));
                }
            });
            if (this.to && this.to.attributes) {
                observe(this.field, ['templateOptions', 'attributes'], function (_a) {
                    var currentValue = _a.currentValue, previousValue = _a.previousValue;
                    if (previousValue) {
                        Object.keys(previousValue).forEach(function (attr) { return _this.removeAttribute(attr); });
                    }
                    if (currentValue) {
                        Object.keys(currentValue).forEach(function (attr) { return _this.setAttribute(attr, currentValue[attr]); });
                    }
                });
            }
            this.detachElementRef(changes.field.previousValue);
            this.attachElementRef(changes.field.currentValue);
            if (this.fieldAttrElements.length === 1) {
                !this.id && this.field.id && this.setAttribute('id', this.field.id);
                this.focusObserver = observe(this.field, ['focus'], function (_a) {
                    var currentValue = _a.currentValue;
                    _this.toggleFocus(currentValue);
                });
            }
        }
        if (changes.id) {
            this.setAttribute('id', this.id);
        }
    };
    /**
     * We need to re-evaluate all the attributes on every change detection cycle, because
     * by using a HostBinding we run into certain edge cases. This means that whatever logic
     * is in here has to be super lean or we risk seriously damaging or destroying the performance.
     *
     * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
     * Material issue: https://github.com/angular/components/issues/14024
     */
    FormlyAttributes.prototype.ngDoCheck = function () {
        var _this = this;
        this.uiAttributes.forEach(function (attr) {
            var value = _this.to[attr];
            if (_this.uiAttributesCache[attr] !== value) {
                _this.uiAttributesCache[attr] = value;
                if (value || value === 0) {
                    _this.setAttribute(attr, value === true ? attr : "" + value);
                }
                else {
                    _this.removeAttribute(attr);
                }
            }
        });
    };
    FormlyAttributes.prototype.ngOnDestroy = function () {
        this.uiEvents.listeners.forEach(function (listener) { return listener(); });
        this.detachElementRef(this.field);
        this.focusObserver && this.focusObserver.unsubscribe();
    };
    FormlyAttributes.prototype.toggleFocus = function (value) {
        var _this = this;
        var element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
        if (!element || !element.nativeElement.focus) {
            return;
        }
        var isFocused = !!this.document.activeElement &&
            this.fieldAttrElements.some(function (_a) {
                var nativeElement = _a.nativeElement;
                return _this.document.activeElement === nativeElement || nativeElement.contains(_this.document.activeElement);
            });
        if (value && !isFocused) {
            element.nativeElement.focus();
        }
        else if (!value && isFocused) {
            element.nativeElement.blur();
        }
    };
    FormlyAttributes.prototype.onFocus = function ($event) {
        this.focusObserver && this.focusObserver.setValue(true);
        if (this.to.focus) {
            this.to.focus(this.field, $event);
        }
    };
    FormlyAttributes.prototype.onBlur = function ($event) {
        this.focusObserver && this.focusObserver.setValue(false);
        if (this.to.blur) {
            this.to.blur(this.field, $event);
        }
    };
    FormlyAttributes.prototype.onChange = function ($event) {
        if (this.to.change) {
            this.to.change(this.field, $event);
        }
        if (this.field.formControl) {
            this.field.formControl.markAsDirty();
        }
    };
    FormlyAttributes.prototype.attachElementRef = function (f) {
        if (!f) {
            return;
        }
        if (f['_elementRefs'] && f['_elementRefs'].indexOf(this.elementRef) === -1) {
            f['_elementRefs'].push(this.elementRef);
        }
        else {
            defineHiddenProp(f, '_elementRefs', [this.elementRef]);
        }
    };
    FormlyAttributes.prototype.detachElementRef = function (f) {
        var index = f && f['_elementRefs'] ? this.fieldAttrElements.indexOf(this.elementRef) : -1;
        if (index !== -1) {
            this.field['_elementRefs'].splice(index, 1);
        }
    };
    FormlyAttributes.prototype.setAttribute = function (attr, value) {
        this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
    };
    FormlyAttributes.prototype.removeAttribute = function (attr) {
        this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
    };
    FormlyAttributes.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
    return FormlyAttributes;
}());

var FieldType = /** @class */ (function () {
    function FieldType() {
    }
    Object.defineProperty(FieldType.prototype, "model", {
        get: function () {
            return this.field.model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "form", {
        get: function () {
            return this.field.form;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "options", {
        get: function () {
            return this.field.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "key", {
        get: function () {
            return this.field.key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "formControl", {
        get: function () {
            return this.field.formControl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "to", {
        get: function () {
            return this.field.templateOptions || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "showError", {
        get: function () {
            return this.options.showError(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "id", {
        get: function () {
            return this.field.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "formState", {
        get: function () {
            return this.options.formState || {};
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], FieldType.prototype, "field", void 0);
    FieldType = __decorate([
        Directive()
    ], FieldType);
    return FieldType;
}());

var FormlyGroup = /** @class */ (function (_super) {
    __extends(FormlyGroup, _super);
    function FormlyGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormlyGroup = __decorate([
        Component({
            selector: 'formly-group',
            template: "\n    <formly-field *ngFor=\"let f of field.fieldGroup\" [field]=\"f\"></formly-field>\n    <ng-content></ng-content>\n  ",
            host: {
                '[class]': 'field.fieldGroupClassName || ""',
            },
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], FormlyGroup);
    return FormlyGroup;
}(FieldType));

var FormlyValidationMessage = /** @class */ (function () {
    function FormlyValidationMessage(config) {
        this.config = config;
    }
    FormlyValidationMessage.prototype.ngOnChanges = function () {
        var _this = this;
        this.errorMessage$ = this.field.formControl.statusChanges.pipe(startWith(null), switchMap(function () { return (isObservable(_this.errorMessage) ? _this.errorMessage : of(_this.errorMessage)); }));
    };
    Object.defineProperty(FormlyValidationMessage.prototype, "errorMessage", {
        get: function () {
            var fieldForm = this.field.formControl;
            for (var error in fieldForm.errors) {
                if (fieldForm.errors.hasOwnProperty(error)) {
                    var message = this.config.getValidatorMessage(error);
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
        },
        enumerable: true,
        configurable: true
    });
    FormlyValidationMessage.ctorParameters = function () { return [
        { type: FormlyConfig }
    ]; };
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
    return FormlyValidationMessage;
}());

function unregisterControl(field, emitEvent) {
    if (emitEvent === void 0) { emitEvent = false; }
    var form = field.formControl.parent;
    if (!form) {
        return;
    }
    var control = field.formControl;
    var opts = { emitEvent: emitEvent };
    if (form instanceof FormArray) {
        var key_1 = form.controls.findIndex(function (c) { return c === control; });
        if (key_1 !== -1) {
            updateControl(form, opts, function () { return form.removeAt(key_1); });
        }
    }
    else if (form instanceof FormGroup) {
        var paths = getKeyPath(field);
        var key_2 = paths[paths.length - 1];
        if (form.get([key_2]) === control) {
            updateControl(form, opts, function () { return form.removeControl(key_2); });
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
    var form = field.parent.formControl;
    return form ? form.get(getKeyPath(field)) : null;
}
function registerControl(field, control, emitEvent) {
    if (emitEvent === void 0) { emitEvent = false; }
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
        var disabledObserver = observe(field, ['templateOptions', 'disabled'], function (_a) {
            var firstChange = _a.firstChange, currentValue = _a.currentValue;
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
    var form = field.form;
    var paths = getKeyPath(field);
    if (!form['_formlyControls']) {
        defineHiddenProp(form, '_formlyControls', {});
    }
    form['_formlyControls'][paths.join('.')] = control;
    for (var i = 0; i < paths.length - 1; i++) {
        var path = paths[i];
        if (!form.get([path])) {
            registerControl({
                key: path,
                formControl: new FormGroup({}),
                form: form,
                parent: {},
            });
        }
        form = form.get([path]);
    }
    if (field['autoClear'] && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
        assignFieldValue(field, field.defaultValue);
    }
    var value = getFieldValue(field);
    if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
        control.patchValue(value, { emitEvent: false });
    }
    var key = paths[paths.length - 1];
    if (!field._hide && form.get([key]) !== control) {
        updateControl(form, { emitEvent: emitEvent }, function () { return form.setControl(key, control); });
    }
}
function updateValidity(c) {
    var status = c.status;
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
        form._forEachChild = function (cb) {
            Object.keys(form.controls).forEach(function (k) { return form.controls[k] && cb(form.controls[k], k); });
        };
    }
    /**
     * workaround for https://github.com/angular/angular/issues/20439
     */
    var updateValueAndValidity = form.updateValueAndValidity.bind(form);
    if (opts.emitEvent === false) {
        form.updateValueAndValidity = function (opts) {
            updateValueAndValidity(__assign(__assign({}, (opts || {})), { emitEvent: false }));
        };
    }
    action();
    if (opts.emitEvent === false) {
        form.updateValueAndValidity = updateValueAndValidity;
    }
}

var FieldArrayType = /** @class */ (function (_super) {
    __extends(FieldArrayType, _super);
    function FieldArrayType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldArrayType.prototype.onPopulate = function (field) {
        if (!field.formControl && field.key) {
            registerControl(field, new FormArray([], { updateOn: field.modelOptions.updateOn }));
        }
        field.fieldGroup = field.fieldGroup || [];
        var length = field.model ? field.model.length : 0;
        if (field.fieldGroup.length > length) {
            for (var i = field.fieldGroup.length - 1; i >= length; --i) {
                unregisterControl(field.fieldGroup[i]);
                field.fieldGroup.splice(i, 1);
            }
        }
        for (var i = field.fieldGroup.length; i < length; i++) {
            var f = __assign(__assign({}, clone(field.fieldArray)), { key: "" + i });
            field.fieldGroup.push(f);
        }
    };
    FieldArrayType.prototype.add = function (i, initialModel, _a) {
        var markAsDirty = (_a === void 0 ? { markAsDirty: true } : _a).markAsDirty;
        i = i == null ? this.field.fieldGroup.length : i;
        if (!this.model) {
            assignFieldValue(this.field, []);
        }
        this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
        this._build();
        markAsDirty && this.formControl.markAsDirty();
    };
    FieldArrayType.prototype.remove = function (i, _a) {
        var markAsDirty = (_a === void 0 ? { markAsDirty: true } : _a).markAsDirty;
        this.model.splice(i, 1);
        unregisterControl(this.field.fieldGroup[i], true);
        this.field.fieldGroup.splice(i, 1);
        this.field.fieldGroup.forEach(function (f, key) { return (f.key = "" + key); });
        this._build();
        markAsDirty && this.formControl.markAsDirty();
    };
    FieldArrayType.prototype._build = function () {
        this.options.build(this.field);
        this.options.fieldChanges.next({
            field: this.field,
            value: getFieldValue(this.field),
            type: 'valueChanges',
        });
    };
    FieldArrayType = __decorate([
        Directive()
    ], FieldArrayType);
    return FieldArrayType;
}(FieldType));

var FieldWrapper = /** @class */ (function (_super) {
    __extends(FieldWrapper, _super);
    function FieldWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        ViewChild('fieldComponent', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], FieldWrapper.prototype, "fieldComponent", void 0);
    FieldWrapper = __decorate([
        Directive()
    ], FieldWrapper);
    return FieldWrapper;
}(FieldType));

var FormlyTemplateType = /** @class */ (function (_super) {
    __extends(FormlyTemplateType, _super);
    function FormlyTemplateType(sanitizer) {
        var _this = _super.call(this) || this;
        _this.sanitizer = sanitizer;
        _this.innerHtml = { content: null, template: null };
        return _this;
    }
    Object.defineProperty(FormlyTemplateType.prototype, "template", {
        get: function () {
            if (this.field && this.field.template !== this.innerHtml.template) {
                this.innerHtml = {
                    template: this.field.template,
                    content: this.to.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template,
                };
            }
            return this.innerHtml.content;
        },
        enumerable: true,
        configurable: true
    });
    FormlyTemplateType.ctorParameters = function () { return [
        { type: DomSanitizer }
    ]; };
    FormlyTemplateType = __decorate([
        Component({
            selector: 'formly-template',
            template: "<div [innerHtml]=\"template\"></div>",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [DomSanitizer])
    ], FormlyTemplateType);
    return FormlyTemplateType;
}(FieldType));

function evalStringExpression(expression, argNames) {
    try {
        return Function.apply(void 0, __spread(argNames, ["return " + expression + ";"]));
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
var FieldExpressionExtension = /** @class */ (function () {
    function FieldExpressionExtension() {
    }
    FieldExpressionExtension.prototype.onPopulate = function (field) {
        var e_1, _a;
        var _this = this;
        if (field._expressions) {
            return;
        }
        // cache built expression
        defineHiddenProp(field, '_expressions', {});
        field.expressionProperties = field.expressionProperties || {};
        observe(field, ['hide'], function (_a) {
            var currentValue = _a.currentValue, firstChange = _a.firstChange;
            defineHiddenProp(field, '_hide', !!currentValue);
            if (!firstChange || (firstChange && currentValue === true)) {
                field.templateOptions.hidden = currentValue;
                field.options._hiddenFieldsForCheck.push(field);
            }
        });
        if (field.hideExpression) {
            observe(field, ['hideExpression'], function (_a) {
                var expr = _a.currentValue;
                field._expressions.hide = _this.parseExpressions(field, 'hide', typeof expr === 'boolean' ? function () { return expr; } : expr);
            });
        }
        var _loop_1 = function (key) {
            observe(field, ['expressionProperties', key], function (_a) {
                var expr = _a.currentValue;
                if (typeof expr === 'string' || isFunction(expr)) {
                    field._expressions[key] = _this.parseExpressions(field, key, expr);
                }
                else if (expr instanceof Observable) {
                    var subscribe_1 = function () {
                        return expr.subscribe(function (v) {
                            _this.evalExpr(field, key, v);
                        });
                    };
                    var subscription_1 = subscribe_1();
                    var onInit_1 = field.hooks.onInit;
                    field.hooks.onInit = function () {
                        if (subscription_1 === null) {
                            subscription_1 = subscribe_1();
                        }
                        return onInit_1 && onInit_1(field);
                    };
                    var onDestroy_1 = field.hooks.onDestroy;
                    field.hooks.onDestroy = function () {
                        onDestroy_1 && onDestroy_1(field);
                        subscription_1.unsubscribe();
                        subscription_1 = null;
                    };
                }
            });
        };
        try {
            for (var _b = __values(Object.keys(field.expressionProperties)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                _loop_1(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    FieldExpressionExtension.prototype.postPopulate = function (field) {
        var _this = this;
        if (field.parent) {
            return;
        }
        if (!field.options.checkExpressions) {
            field.options.checkExpressions = function (f, ignoreCache) {
                if (ignoreCache === void 0) { ignoreCache = false; }
                reduceFormUpdateValidityCalls(f.form, function () { return _this.checkExpressions(f, ignoreCache); });
                var options = field.options;
                options._hiddenFieldsForCheck.sort(function (f) { return (f.hide ? -1 : 1); }).forEach(function (f) { return _this.changeHideState(f, f.hide); });
                options._hiddenFieldsForCheck = [];
            };
            field.options._checkField = function (f, ignoreCache) {
                console.warn("Formly: 'options._checkField' is deprecated since v6.0, use 'options.checkExpressions' instead.");
                field.options.checkExpressions(f, ignoreCache);
            };
        }
    };
    FieldExpressionExtension.prototype.parseExpressions = function (field, path, expr) {
        var _this = this;
        var parentExpression;
        if (field.parent && ['hide', 'templateOptions.disabled'].includes(path)) {
            parentExpression = evalStringExpression("!!field.parent." + path, ['field']);
        }
        expr = expr || (function () { return false; });
        if (typeof expr === 'string') {
            expr = evalStringExpression(expr, ['model', 'formState', 'field']);
        }
        var currentValue;
        return function (ignoreCache) {
            var exprValue = evalExpression(parentExpression ? function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return parentExpression(field) || expr.apply(void 0, __spread(args));
            } : expr, { field: field }, [field.model, field.options.formState, field]);
            if (ignoreCache ||
                (currentValue !== exprValue &&
                    (!isObject(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue)))) {
                currentValue = exprValue;
                _this.evalExpr(field, path, exprValue);
                return true;
            }
            return false;
        };
    };
    FieldExpressionExtension.prototype.checkExpressions = function (field, ignoreCache) {
        var e_2, _a;
        var _this = this;
        if (ignoreCache === void 0) { ignoreCache = false; }
        if (!field) {
            return;
        }
        if (field._expressions) {
            try {
                for (var _b = __values(Object.keys(field._expressions)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    field._expressions[key](ignoreCache);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (field.fieldGroup) {
            field.fieldGroup.forEach(function (f) { return _this.checkExpressions(f, ignoreCache); });
        }
    };
    FieldExpressionExtension.prototype.changeDisabledState = function (field, value) {
        var _this = this;
        if (field.fieldGroup) {
            field.fieldGroup
                .filter(function (f) { return !f.expressionProperties || !f.expressionProperties.hasOwnProperty('templateOptions.disabled'); })
                .forEach(function (f) { return _this.changeDisabledState(f, value); });
        }
        if (field.key && field.templateOptions.disabled !== value) {
            field.templateOptions.disabled = value;
        }
    };
    FieldExpressionExtension.prototype.changeHideState = function (field, hide) {
        var _this = this;
        if (field.formControl && field.key) {
            defineHiddenProp(field, '_hide', !!(hide || field.hide));
            var c = field.formControl;
            if (c['_fields'].length > 1) {
                updateValidity(c);
            }
            hide === true && c['_fields'].every(function (f) { return !!f._hide; }) ? unregisterControl(field) : registerControl(field);
        }
        if (field.fieldGroup) {
            field.fieldGroup.filter(function (f) { return !f.hideExpression; }).forEach(function (f) { return _this.changeHideState(f, hide); });
        }
        if (field.options.fieldChanges) {
            field.options.fieldChanges.next({ field: field, type: 'hidden', value: hide });
        }
    };
    FieldExpressionExtension.prototype.evalExpr = function (field, prop, value) {
        try {
            var target = field;
            var paths = prop.split('.');
            var lastIndex = paths.length - 1;
            for (var i = 0; i < lastIndex; i++) {
                target = target[paths[i]];
            }
            target[paths[lastIndex]] = value;
        }
        catch (error) {
            error.message = "[Formly Error] [Expression \"" + prop + "\"] " + error.message;
            throw error;
        }
        if (prop === 'templateOptions.disabled' && field.key) {
            this.changeDisabledState(field, value);
        }
        if (prop.indexOf('model.') === 0) {
            var key = prop.replace(/^model\./, ''), control = field.key && field.key === key ? field.formControl : field.form.get(key);
            if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
                control.patchValue(value, { emitEvent: false });
            }
        }
    };
    return FieldExpressionExtension;
}());

/** @experimental */
var FieldValidationExtension = /** @class */ (function () {
    function FieldValidationExtension(config) {
        this.config = config;
    }
    FieldValidationExtension.prototype.onPopulate = function (field) {
        this.initFieldValidation(field, 'validators');
        this.initFieldValidation(field, 'asyncValidators');
    };
    FieldValidationExtension.prototype.initFieldValidation = function (field, type) {
        var e_1, _a;
        var _this = this;
        var validators = [];
        if (type === 'validators' && !(field.hasOwnProperty('fieldGroup') && !field.key)) {
            validators.push(this.getPredefinedFieldValidation(field));
        }
        if (field[type]) {
            try {
                for (var _b = __values(Object.keys(field[type])), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var validatorName = _c.value;
                    validatorName === 'validation'
                        ? validators.push.apply(validators, __spread(field[type].validation.map(function (v) { return _this.wrapNgValidatorFn(field, v); }))) : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        defineHiddenProp(field, '_' + type, validators);
    };
    FieldValidationExtension.prototype.getPredefinedFieldValidation = function (field) {
        var VALIDATORS = [];
        FORMLY_VALIDATORS.forEach(function (opt) {
            return observe(field, ['templateOptions', opt], function (_a) {
                var currentValue = _a.currentValue, firstChange = _a.firstChange;
                VALIDATORS = VALIDATORS.filter(function (o) { return o !== opt; });
                if (currentValue != null && currentValue !== false) {
                    VALIDATORS.push(opt);
                }
                if (!firstChange && field.formControl) {
                    updateValidity(field.formControl);
                }
            });
        });
        return function (control) {
            if (VALIDATORS.length === 0) {
                return null;
            }
            return Validators.compose(VALIDATORS.map(function (opt) { return function () {
                var value = field.templateOptions[opt];
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
            }; }))(control);
        };
    };
    FieldValidationExtension.prototype.wrapNgValidatorFn = function (field, validator, validatorName) {
        var _this = this;
        var validatorOption = null;
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
            var expression = validator.expression, options = __rest(validator, ["expression"]);
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
        return function (control) {
            var errors = validatorOption.validation(control, field, validatorOption.options);
            if (validatorName) {
                if (isPromise(errors)) {
                    return errors.then(function (v) { return _this.handleAsyncResult(field, v, validatorOption); });
                }
                if (isObservable(errors)) {
                    return errors.pipe(map(function (v) { return _this.handleAsyncResult(field, v, validatorOption); }));
                }
                errors = !!errors;
            }
            return _this.handleResult(field, errors, validatorOption);
        };
    };
    FieldValidationExtension.prototype.handleAsyncResult = function (field, isValid, options) {
        // workaround for https://github.com/angular/angular/issues/13200
        field.options.detectChanges(field);
        return this.handleResult(field, !!isValid, options);
    };
    FieldValidationExtension.prototype.handleResult = function (field, errors, _a) {
        var _b, _c;
        var name = _a.name, options = _a.options;
        if (typeof errors === 'boolean') {
            errors = errors ? null : (_b = {}, _b[name] = options ? options : true, _b);
        }
        var ctrl = field.formControl;
        ctrl && ctrl['_childrenErrors'] && ctrl['_childrenErrors'][name] && ctrl['_childrenErrors'][name]();
        if (ctrl && errors && errors[name]) {
            var errorPath = errors[name].errorPath ? errors[name].errorPath : (options || {}).errorPath;
            var childCtrl_1 = errorPath ? field.formControl.get(errorPath) : null;
            if (childCtrl_1) {
                var _d = errors[name], errorPath_1 = _d.errorPath, opts = __rest(_d, ["errorPath"]);
                childCtrl_1.setErrors(__assign(__assign({}, (childCtrl_1.errors || {})), (_c = {}, _c[name] = opts, _c)));
                !ctrl['_childrenErrors'] && defineHiddenProp(ctrl, '_childrenErrors', {});
                ctrl['_childrenErrors'][name] = function () {
                    var _a = childCtrl_1.errors || {}, _b = name, toDelete = _a[_b], childErrors = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    childCtrl_1.setErrors(Object.keys(childErrors).length === 0 ? null : childErrors);
                };
            }
        }
        return errors;
    };
    return FieldValidationExtension;
}());

/** @experimental */
var FieldFormExtension = /** @class */ (function () {
    function FieldFormExtension() {
    }
    FieldFormExtension.prototype.prePopulate = function (field) {
        if (!this.root) {
            this.root = field;
        }
        if (field.parent) {
            Object.defineProperty(field, 'form', {
                get: function () { return field.parent.formControl; },
                configurable: true,
            });
        }
    };
    FieldFormExtension.prototype.onPopulate = function (field) {
        if (field.key) {
            this.addFormControl(field);
        }
        if (field.form && field.hasOwnProperty('fieldGroup') && !field.key) {
            defineHiddenProp(field, 'formControl', field.form);
        }
    };
    FieldFormExtension.prototype.postPopulate = function (field) {
        if (this.root !== field) {
            return;
        }
        this.root = null;
        var updateValidity = this.setValidators(field);
        updateValidity && field.form._updateTreeValidity();
    };
    FieldFormExtension.prototype.addFormControl = function (field) {
        var control = findControl(field);
        if (!control) {
            var controlOptions = { updateOn: field.modelOptions.updateOn };
            control = field.fieldGroup
                ? new FormGroup({}, controlOptions)
                : new FormControl({ value: getFieldValue(field), disabled: false }, controlOptions);
        }
        registerControl(field, control);
    };
    FieldFormExtension.prototype.setValidators = function (field) {
        var _this = this;
        var updateValidity$1 = false;
        if (field.key || !field.parent) {
            var c_1 = field.formControl;
            var disabled = field.templateOptions ? field.templateOptions.disabled : false;
            if (disabled && c_1.enabled) {
                c_1.disable({ emitEvent: false, onlySelf: true });
                updateValidity$1 = true;
            }
            if (null === c_1.validator || null === c_1.asyncValidator) {
                c_1.setValidators(function () {
                    var v = Validators.compose(_this.mergeValidators(field, '_validators'));
                    return v ? v(c_1) : null;
                });
                c_1.setAsyncValidators(function () {
                    var v = Validators.composeAsync(_this.mergeValidators(field, '_asyncValidators'));
                    return v ? v(c_1) : of(null);
                });
                if (!c_1.parent) {
                    updateValidity(c_1);
                }
                else {
                    updateValidity$1 = true;
                }
            }
        }
        (field.fieldGroup || []).forEach(function (f) { return f && _this.setValidators(f) && (updateValidity$1 = true); });
        return updateValidity$1;
    };
    FieldFormExtension.prototype.mergeValidators = function (field, type) {
        var _this = this;
        var validators = [];
        var c = field.formControl;
        if (c && c['_fields'] && c['_fields'].length > 1) {
            c['_fields']
                .filter(function (f) { return !f._hide; })
                .forEach(function (f) { return validators.push.apply(validators, __spread(f[type])); });
        }
        else {
            validators.push.apply(validators, __spread(field[type]));
        }
        if (field.fieldGroup) {
            field.fieldGroup
                .filter(function (f) { return f && !f.key && f.fieldGroup; })
                .forEach(function (f) { return validators.push.apply(validators, __spread(_this.mergeValidators(f, type))); });
        }
        return validators;
    };
    return FieldFormExtension;
}());

/** @experimental */
var CoreExtension = /** @class */ (function () {
    function CoreExtension(config) {
        this.config = config;
        this.formId = 0;
    }
    CoreExtension.prototype.prePopulate = function (field) {
        var root = field.parent;
        this.initRootOptions(field);
        if (root) {
            Object.defineProperty(field, 'options', { get: function () { return root.options; }, configurable: true });
            Object.defineProperty(field, 'model', {
                get: function () { return (field.key && field.fieldGroup ? getFieldValue(field) : root.model); },
                configurable: true,
            });
        }
        this.getFieldComponentInstance(field).prePopulate();
    };
    CoreExtension.prototype.onPopulate = function (field) {
        var _this = this;
        this.initFieldOptions(field);
        this.getFieldComponentInstance(field).onPopulate();
        if (field.fieldGroup) {
            field.fieldGroup.forEach(function (f, index) {
                if (f) {
                    Object.defineProperty(f, 'parent', { get: function () { return field; }, configurable: true });
                    Object.defineProperty(f, 'index', { get: function () { return index; }, configurable: true });
                }
                _this.formId++;
            });
        }
    };
    CoreExtension.prototype.postPopulate = function (field) {
        this.getFieldComponentInstance(field).postPopulate();
    };
    CoreExtension.prototype.initRootOptions = function (field) {
        if (field.parent) {
            return;
        }
        var options = field.options;
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
        options._markForCheck = function (f) {
            console.warn("Formly: 'options._markForCheck' is deprecated since v6.0, use 'options.detectChanges' instead.");
            options.detectChanges(f);
        };
        options.detectChanges = function (f) {
            if (f._componentRefs) {
                f._componentRefs.forEach(function (ref) {
                    // NOTE: we cannot use ref.changeDetectorRef, see https://github.com/ngx-formly/ngx-formly/issues/2191
                    var changeDetectorRef = ref.injector.get(ChangeDetectorRef);
                    changeDetectorRef.markForCheck();
                });
            }
            if (f.fieldGroup) {
                f.fieldGroup.forEach(function (f) { return f && options.detectChanges(f); });
            }
        };
        options.resetModel = function (model) {
            model = clone(model !== null && model !== void 0 ? model : options._initialModel);
            if (field.model) {
                Object.keys(field.model).forEach(function (k) { return delete field.model[k]; });
                Object.assign(field.model, model || {});
            }
            options.build(field);
            field.form.reset(model);
            if (options.parentForm && options.parentForm.control === field.formControl) {
                options.parentForm.submitted = false;
            }
        };
        options.updateInitialValue = function () { return (options._initialModel = clone(field.model)); };
        field.options.updateInitialValue();
    };
    CoreExtension.prototype.initFieldOptions = function (field) {
        reverseDeepMerge(field, {
            id: getFieldId("formly_" + this.formId, field, field['index']),
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
    };
    CoreExtension.prototype.getFieldComponentInstance = function (field) {
        var componentRef = this.config.resolveFieldTypeRef(field);
        var instance = componentRef ? componentRef.instance : {};
        return {
            prePopulate: function () { return instance.prePopulate && instance.prePopulate(field); },
            onPopulate: function () { return instance.onPopulate && instance.onPopulate(field); },
            postPopulate: function () { return instance.postPopulate && instance.postPopulate(field); },
        };
    };
    return CoreExtension;
}());

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
var FormlyModule = /** @class */ (function () {
    function FormlyModule(configService, configs) {
        if (configs === void 0) { configs = []; }
        if (!configs) {
            return;
        }
        configs.forEach(function (config) { return configService.addConfig(config); });
    }
    FormlyModule_1 = FormlyModule;
    FormlyModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: FormlyModule_1,
            providers: [
                { provide: FORMLY_CONFIG, multi: true, useFactory: defaultFormlyConfig, deps: [FormlyConfig] },
                { provide: FORMLY_CONFIG, useValue: config, multi: true },
                FormlyConfig,
                FormlyFormBuilder,
            ],
        };
    };
    FormlyModule.forChild = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: FormlyModule_1,
            providers: [{ provide: FORMLY_CONFIG, useValue: config, multi: true }, FormlyFormBuilder],
        };
    };
    var FormlyModule_1;
    FormlyModule.ctorParameters = function () { return [
        { type: FormlyConfig },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [FORMLY_CONFIG,] }] }
    ]; };
    FormlyModule = FormlyModule_1 = __decorate([
        NgModule({
            declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage, FormlyTemplateType],
            exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
            imports: [CommonModule],
        }),
        __param(1, Optional()), __param(1, Inject(FORMLY_CONFIG)),
        __metadata("design:paramtypes", [FormlyConfig, Array])
    ], FormlyModule);
    return FormlyModule;
}());

/*
 * Public API Surface of core
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FORMLY_CONFIG, FieldArrayType, FieldType, FieldWrapper, FormlyConfig, FormlyField, FormlyForm, FormlyFormBuilder, FormlyModule, FormlyAttributes as ɵFormlyAttributes, FormlyGroup as ɵFormlyGroup, FormlyValidationMessage as ɵFormlyValidationMessage, defaultFormlyConfig as ɵa, FormlyTemplateType as ɵb, CoreExtension as ɵc, FieldValidationExtension as ɵd, defineHiddenProp as ɵdefineHiddenProp, FieldFormExtension as ɵe, FieldExpressionExtension as ɵf, getFieldInitialValue as ɵgetFieldInitialValue, observe as ɵobserve, reverseDeepMerge as ɵreverseDeepMerge };
//# sourceMappingURL=ngx-formly-core.js.map
