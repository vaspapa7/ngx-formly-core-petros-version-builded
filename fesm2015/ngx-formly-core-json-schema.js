import { __rest, __decorate } from 'tslib';
import { ɵɵdefineInjectable, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ɵgetFieldInitialValue, ɵreverseDeepMerge, ɵdefineHiddenProp } from '@ngx-formly/core';

function isEmpty(v) {
    return v === '' || v == null;
}
function isConst(schema) {
    return schema.hasOwnProperty('const') || (schema.enum && schema.enum.length === 1);
}
function totalMatchedFields(field) {
    if (field.key && !field.fieldGroup) {
        return ɵgetFieldInitialValue(field) !== undefined ? 1 : 0;
    }
    return field.fieldGroup.reduce((s, f) => totalMatchedFields(f) + s, 0);
}
function isFieldValid(field) {
    if (field.key) {
        return field.formControl.valid;
    }
    return field.fieldGroup.every((f) => isFieldValid(f));
}
let FormlyJsonschema = class FormlyJsonschema {
    toFieldConfig(schema, options) {
        return this._toFieldConfig(schema, Object.assign({ schema }, (options || {})));
    }
    _toFieldConfig(schema, options) {
        schema = this.resolveSchema(schema, options);
        let field = {
            type: this.guessType(schema),
            defaultValue: schema.default,
            templateOptions: {
                label: schema.title,
                readonly: schema.readOnly,
                description: schema.description,
            },
        };
        if (options.autoClear) {
            field['autoClear'] = true;
        }
        switch (field.type) {
            case 'null': {
                this.addValidator(field, 'null', ({ value }) => value === null);
                break;
            }
            case 'number':
            case 'integer': {
                field.parsers = [(v) => (isEmpty(v) ? null : Number(v))];
                if (schema.hasOwnProperty('minimum')) {
                    field.templateOptions.min = schema.minimum;
                }
                if (schema.hasOwnProperty('maximum')) {
                    field.templateOptions.max = schema.maximum;
                }
                if (schema.hasOwnProperty('exclusiveMinimum')) {
                    field.templateOptions.exclusiveMinimum = schema.exclusiveMinimum;
                    this.addValidator(field, 'exclusiveMinimum', ({ value }) => isEmpty(value) || value > schema.exclusiveMinimum);
                }
                if (schema.hasOwnProperty('exclusiveMaximum')) {
                    field.templateOptions.exclusiveMaximum = schema.exclusiveMaximum;
                    this.addValidator(field, 'exclusiveMaximum', ({ value }) => isEmpty(value) || value < schema.exclusiveMaximum);
                }
                if (schema.hasOwnProperty('multipleOf')) {
                    field.templateOptions.step = schema.multipleOf;
                    this.addValidator(field, 'multipleOf', ({ value }) => isEmpty(value) || (Math.floor(value * 1000) % Math.floor(schema.multipleOf * 1000)) === 0);
                }
                break;
            }
            case 'string': {
                const schemaType = schema.type;
                if (Array.isArray(schemaType) && schemaType.indexOf('null') !== -1) {
                    field.parsers = [(v) => (isEmpty(v) ? null : v)];
                }
                ['minLength', 'maxLength', 'pattern'].forEach((prop) => {
                    if (schema.hasOwnProperty(prop)) {
                        field.templateOptions[prop] = schema[prop];
                    }
                });
                break;
            }
            case 'object': {
                field.fieldGroup = [];
                const [propDeps, schemaDeps] = this.resolveDependencies(schema);
                Object.keys(schema.properties || {}).forEach((key) => {
                    const f = this._toFieldConfig(schema.properties[key], options);
                    field.fieldGroup.push(f);
                    f.key = key;
                    if (Array.isArray(schema.required) && schema.required.indexOf(key) !== -1) {
                        f.templateOptions.required = true;
                    }
                    if (f.templateOptions && !f.templateOptions.required && propDeps[key]) {
                        f.expressionProperties = {
                            'templateOptions.required': (m) => m && propDeps[key].some((k) => !isEmpty(m[k])),
                        };
                    }
                    if (schemaDeps[key]) {
                        const getConstValue = (s) => {
                            return s.hasOwnProperty('const') ? s.const : s.enum[0];
                        };
                        const oneOfSchema = schemaDeps[key].oneOf;
                        if (oneOfSchema &&
                            oneOfSchema.every((o) => o.properties && o.properties[key] && isConst(o.properties[key]))) {
                            oneOfSchema.forEach((oneOfSchemaItem) => {
                                const _a = oneOfSchemaItem.properties, _b = key, constSchema = _a[_b], properties = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                                field.fieldGroup.push(Object.assign(Object.assign({}, this._toFieldConfig(Object.assign(Object.assign({}, oneOfSchemaItem), { properties }), Object.assign(Object.assign({}, options), { autoClear: true }))), { hideExpression: (m) => !m || getConstValue(constSchema) !== m[key] }));
                            });
                        }
                        else {
                            field.fieldGroup.push(Object.assign(Object.assign({}, this._toFieldConfig(schemaDeps[key], options)), { hideExpression: (m) => !m || isEmpty(m[key]) }));
                        }
                    }
                });
                if (schema.oneOf) {
                    field.fieldGroup.push(this.resolveMultiSchema('oneOf', schema.oneOf, options));
                }
                if (schema.anyOf) {
                    field.fieldGroup.push(this.resolveMultiSchema('anyOf', schema.anyOf, options));
                }
                break;
            }
            case 'array': {
                if (schema.hasOwnProperty('minItems')) {
                    field.templateOptions.minItems = schema.minItems;
                    this.addValidator(field, 'minItems', ({ value }) => isEmpty(value) || value.length >= schema.minItems);
                }
                if (schema.hasOwnProperty('maxItems')) {
                    field.templateOptions.maxItems = schema.maxItems;
                    this.addValidator(field, 'maxItems', ({ value }) => isEmpty(value) || value.length <= schema.maxItems);
                }
                if (schema.hasOwnProperty('uniqueItems')) {
                    field.templateOptions.uniqueItems = schema.uniqueItems;
                    this.addValidator(field, 'uniqueItems', ({ value }) => {
                        if (isEmpty(value) || !schema.uniqueItems) {
                            return true;
                        }
                        const uniqueItems = Array.from(new Set(value.map((v) => JSON.stringify(v))));
                        return uniqueItems.length === value.length;
                    });
                }
                // resolve items schema needed for isEnum check
                if (schema.items && !Array.isArray(schema.items)) {
                    schema.items = this.resolveSchema(schema.items, options);
                }
                // TODO: remove isEnum check once adding an option to skip extension
                if (!this.isEnum(schema)) {
                    const _this = this;
                    Object.defineProperty(field, 'fieldArray', {
                        get() {
                            if (!Array.isArray(schema.items)) {
                                // When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
                                return _this._toFieldConfig(schema.items, options);
                            }
                            const length = this.fieldGroup ? this.fieldGroup.length : 0;
                            const itemSchema = schema.items[length] ? schema.items[length] : schema.additionalItems;
                            return itemSchema ? _this._toFieldConfig(itemSchema, options) : {};
                        },
                        enumerable: true,
                        configurable: true,
                    });
                }
                break;
            }
        }
        if (schema.hasOwnProperty('const')) {
            field.templateOptions.const = schema.const;
            this.addValidator(field, 'const', ({ value }) => value === schema.const);
            if (!field.type) {
                field.defaultValue = schema.const;
            }
        }
        if (this.isEnum(schema)) {
            field.templateOptions.multiple = field.type === 'array';
            field.type = 'enum';
            field.templateOptions.options = this.toEnumOptions(schema);
        }
        // map in possible formlyConfig options from the widget property
        if (schema['widget'] && schema['widget'].formlyConfig) {
            field = ɵreverseDeepMerge(schema['widget'].formlyConfig, field);
        }
        // if there is a map function passed in, use it to allow the user to
        // further customize how fields are being mapped
        return options.map ? options.map(field, schema) : field;
    }
    resolveSchema(schema, options) {
        if (schema.$ref) {
            schema = this.resolveDefinition(schema, options);
        }
        if (schema.allOf) {
            schema = this.resolveAllOf(schema, options);
        }
        return schema;
    }
    resolveAllOf(_a, options) {
        var { allOf } = _a, baseSchema = __rest(_a, ["allOf"]);
        if (!allOf.length) {
            throw Error(`allOf array can not be empty ${allOf}.`);
        }
        return allOf.reduce((base, schema) => {
            schema = this.resolveSchema(schema, options);
            if (base.required && schema.required) {
                base.required = [...base.required, ...schema.required];
            }
            if (schema.uniqueItems) {
                base.uniqueItems = schema.uniqueItems;
            }
            // resolve to min value
            ['maxLength', 'maximum', 'exclusiveMaximum', 'maxItems', 'maxProperties'].forEach((prop) => {
                if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
                    base[prop] = base[prop] < schema[prop] ? base[prop] : schema[prop];
                }
            });
            // resolve to max value
            ['minLength', 'minimum', 'exclusiveMinimum', 'minItems', 'minProperties'].forEach((prop) => {
                if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
                    base[prop] = base[prop] > schema[prop] ? base[prop] : schema[prop];
                }
            });
            return ɵreverseDeepMerge(base, schema);
        }, baseSchema);
    }
    resolveMultiSchema(mode, schemas, options) {
        return {
            type: 'multischema',
            fieldGroup: [
                {
                    type: 'enum',
                    templateOptions: {
                        multiple: mode === 'anyOf',
                        options: schemas.map((s, i) => ({ label: s.title, value: i })),
                    },
                },
                {
                    fieldGroup: schemas.map((s, i) => (Object.assign(Object.assign({}, this._toFieldConfig(s, Object.assign(Object.assign({}, options), { autoClear: true }))), { hideExpression: (m, fs, f) => {
                            const selectField = f.parent.parent.fieldGroup[0];
                            if (!selectField.formControl) {
                                const value = f.parent.fieldGroup
                                    .map((f, i) => [f, i])
                                    .filter(([f]) => isFieldValid(f))
                                    .sort(([f1], [f2]) => {
                                    const matchedFields1 = totalMatchedFields(f1);
                                    const matchedFields2 = totalMatchedFields(f2);
                                    if (matchedFields1 === matchedFields2) {
                                        return 0;
                                    }
                                    return matchedFields2 > matchedFields1 ? 1 : -1;
                                })
                                    .map(([, i]) => i);
                                const normalizedValue = [value.length === 0 ? 0 : value[0]];
                                const formattedValue = mode === 'anyOf' ? normalizedValue : normalizedValue[0];
                                ɵdefineHiddenProp(selectField, 'formControl', new FormControl(formattedValue));
                            }
                            const control = selectField.formControl;
                            return Array.isArray(control.value) ? control.value.indexOf(i) === -1 : control.value !== i;
                        } }))),
                },
            ],
        };
    }
    resolveDefinition(schema, options) {
        const [uri, pointer] = schema.$ref.split('#/');
        if (uri) {
            throw Error(`Remote schemas for ${schema.$ref} not supported yet.`);
        }
        const definition = !pointer
            ? null
            : pointer.split('/').reduce((def, path) => (def && def.hasOwnProperty(path) ? def[path] : null), options.schema);
        if (!definition) {
            throw Error(`Cannot find a definition for ${schema.$ref}.`);
        }
        if (definition.$ref) {
            return this.resolveDefinition(definition, options);
        }
        return Object.assign(Object.assign({}, definition), ['title', 'description', 'default'].reduce((annotation, p) => {
            if (schema.hasOwnProperty(p)) {
                annotation[p] = schema[p];
            }
            return annotation;
        }, {}));
    }
    resolveDependencies(schema) {
        const deps = {};
        const schemaDeps = {};
        Object.keys(schema.dependencies || {}).forEach((prop) => {
            const dependency = schema.dependencies[prop];
            if (Array.isArray(dependency)) {
                // Property dependencies
                dependency.forEach((dep) => {
                    if (!deps[dep]) {
                        deps[dep] = [prop];
                    }
                    else {
                        deps[dep].push(prop);
                    }
                });
            }
            else {
                // schema dependencies
                schemaDeps[prop] = dependency;
            }
        });
        return [deps, schemaDeps];
    }
    guessType(schema) {
        const type = schema.type;
        if (!type && schema.properties) {
            return 'object';
        }
        if (Array.isArray(type)) {
            if (type.length === 1) {
                return type[0];
            }
            if (type.length === 2 && type.indexOf('null') !== -1) {
                return type[type[0] === 'null' ? 1 : 0];
            }
        }
        return type;
    }
    addValidator(field, name, validator) {
        field.validators = field.validators || {};
        field.validators[name] = validator;
    }
    isEnum(schema) {
        return (schema.enum ||
            (schema.anyOf && schema.anyOf.every(isConst)) ||
            (schema.oneOf && schema.oneOf.every(isConst)) ||
            (schema.uniqueItems && schema.items && !Array.isArray(schema.items) && this.isEnum(schema.items)));
    }
    toEnumOptions(schema) {
        if (schema.enum) {
            return schema.enum.map((value) => ({ value, label: value }));
        }
        const toEnum = (s) => {
            const value = s.hasOwnProperty('const') ? s.const : s.enum[0];
            return { value, label: s.title || value };
        };
        if (schema.anyOf) {
            return schema.anyOf.map(toEnum);
        }
        if (schema.oneOf) {
            return schema.oneOf.map(toEnum);
        }
        return this.toEnumOptions(schema.items);
    }
};
FormlyJsonschema.ɵprov = ɵɵdefineInjectable({ factory: function FormlyJsonschema_Factory() { return new FormlyJsonschema(); }, token: FormlyJsonschema, providedIn: "root" });
FormlyJsonschema = __decorate([
    Injectable({ providedIn: 'root' })
], FormlyJsonschema);

/**
 * Generated bundle index. Do not edit.
 */

export { FormlyJsonschema };
//# sourceMappingURL=ngx-formly-core-json-schema.js.map
