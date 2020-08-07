import { __assign, __read, __rest, __spread, __decorate } from 'tslib';
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
    return field.fieldGroup.reduce(function (s, f) { return totalMatchedFields(f) + s; }, 0);
}
function isFieldValid(field) {
    if (field.key) {
        return field.formControl.valid;
    }
    return field.fieldGroup.every(function (f) { return isFieldValid(f); });
}
var FormlyJsonschema = /** @class */ (function () {
    function FormlyJsonschema() {
    }
    FormlyJsonschema.prototype.toFieldConfig = function (schema, options) {
        return this._toFieldConfig(schema, __assign({ schema: schema }, (options || {})));
    };
    FormlyJsonschema.prototype._toFieldConfig = function (schema, options) {
        var _this_1 = this;
        schema = this.resolveSchema(schema, options);
        var field = {
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
                this.addValidator(field, 'null', function (_a) {
                    var value = _a.value;
                    return value === null;
                });
                break;
            }
            case 'number':
            case 'integer': {
                field.parsers = [function (v) { return (isEmpty(v) ? null : Number(v)); }];
                if (schema.hasOwnProperty('minimum')) {
                    field.templateOptions.min = schema.minimum;
                }
                if (schema.hasOwnProperty('maximum')) {
                    field.templateOptions.max = schema.maximum;
                }
                if (schema.hasOwnProperty('exclusiveMinimum')) {
                    field.templateOptions.exclusiveMinimum = schema.exclusiveMinimum;
                    this.addValidator(field, 'exclusiveMinimum', function (_a) {
                        var value = _a.value;
                        return isEmpty(value) || value > schema.exclusiveMinimum;
                    });
                }
                if (schema.hasOwnProperty('exclusiveMaximum')) {
                    field.templateOptions.exclusiveMaximum = schema.exclusiveMaximum;
                    this.addValidator(field, 'exclusiveMaximum', function (_a) {
                        var value = _a.value;
                        return isEmpty(value) || value < schema.exclusiveMaximum;
                    });
                }
                if (schema.hasOwnProperty('multipleOf')) {
                    field.templateOptions.step = schema.multipleOf;
                    this.addValidator(field, 'multipleOf', function (_a) {
                        var value = _a.value;
                        return isEmpty(value) || (Math.floor(value * 1000) % Math.floor(schema.multipleOf * 1000)) === 0;
                    });
                }
                break;
            }
            case 'string': {
                var schemaType = schema.type;
                if (Array.isArray(schemaType) && schemaType.indexOf('null') !== -1) {
                    field.parsers = [function (v) { return (isEmpty(v) ? null : v); }];
                }
                ['minLength', 'maxLength', 'pattern'].forEach(function (prop) {
                    if (schema.hasOwnProperty(prop)) {
                        field.templateOptions[prop] = schema[prop];
                    }
                });
                break;
            }
            case 'object': {
                field.fieldGroup = [];
                var _a = __read(this.resolveDependencies(schema), 2), propDeps_1 = _a[0], schemaDeps_1 = _a[1];
                Object.keys(schema.properties || {}).forEach(function (key) {
                    var f = _this_1._toFieldConfig(schema.properties[key], options);
                    field.fieldGroup.push(f);
                    f.key = key;
                    if (Array.isArray(schema.required) && schema.required.indexOf(key) !== -1) {
                        f.templateOptions.required = true;
                    }
                    if (f.templateOptions && !f.templateOptions.required && propDeps_1[key]) {
                        f.expressionProperties = {
                            'templateOptions.required': function (m) { return m && propDeps_1[key].some(function (k) { return !isEmpty(m[k]); }); },
                        };
                    }
                    if (schemaDeps_1[key]) {
                        var getConstValue_1 = function (s) {
                            return s.hasOwnProperty('const') ? s.const : s.enum[0];
                        };
                        var oneOfSchema = schemaDeps_1[key].oneOf;
                        if (oneOfSchema &&
                            oneOfSchema.every(function (o) { return o.properties && o.properties[key] && isConst(o.properties[key]); })) {
                            oneOfSchema.forEach(function (oneOfSchemaItem) {
                                var _a = oneOfSchemaItem.properties, _b = key, constSchema = _a[_b], properties = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                                field.fieldGroup.push(__assign(__assign({}, _this_1._toFieldConfig(__assign(__assign({}, oneOfSchemaItem), { properties: properties }), __assign(__assign({}, options), { autoClear: true }))), { hideExpression: function (m) { return !m || getConstValue_1(constSchema) !== m[key]; } }));
                            });
                        }
                        else {
                            field.fieldGroup.push(__assign(__assign({}, _this_1._toFieldConfig(schemaDeps_1[key], options)), { hideExpression: function (m) { return !m || isEmpty(m[key]); } }));
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
                    this.addValidator(field, 'minItems', function (_a) {
                        var value = _a.value;
                        return isEmpty(value) || value.length >= schema.minItems;
                    });
                }
                if (schema.hasOwnProperty('maxItems')) {
                    field.templateOptions.maxItems = schema.maxItems;
                    this.addValidator(field, 'maxItems', function (_a) {
                        var value = _a.value;
                        return isEmpty(value) || value.length <= schema.maxItems;
                    });
                }
                if (schema.hasOwnProperty('uniqueItems')) {
                    field.templateOptions.uniqueItems = schema.uniqueItems;
                    this.addValidator(field, 'uniqueItems', function (_a) {
                        var value = _a.value;
                        if (isEmpty(value) || !schema.uniqueItems) {
                            return true;
                        }
                        var uniqueItems = Array.from(new Set(value.map(function (v) { return JSON.stringify(v); })));
                        return uniqueItems.length === value.length;
                    });
                }
                // resolve items schema needed for isEnum check
                if (schema.items && !Array.isArray(schema.items)) {
                    schema.items = this.resolveSchema(schema.items, options);
                }
                // TODO: remove isEnum check once adding an option to skip extension
                if (!this.isEnum(schema)) {
                    var _this_2 = this;
                    Object.defineProperty(field, 'fieldArray', {
                        get: function () {
                            if (!Array.isArray(schema.items)) {
                                // When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
                                return _this_2._toFieldConfig(schema.items, options);
                            }
                            var length = this.fieldGroup ? this.fieldGroup.length : 0;
                            var itemSchema = schema.items[length] ? schema.items[length] : schema.additionalItems;
                            return itemSchema ? _this_2._toFieldConfig(itemSchema, options) : {};
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
            this.addValidator(field, 'const', function (_a) {
                var value = _a.value;
                return value === schema.const;
            });
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
    };
    FormlyJsonschema.prototype.resolveSchema = function (schema, options) {
        if (schema.$ref) {
            schema = this.resolveDefinition(schema, options);
        }
        if (schema.allOf) {
            schema = this.resolveAllOf(schema, options);
        }
        return schema;
    };
    FormlyJsonschema.prototype.resolveAllOf = function (_a, options) {
        var _this_1 = this;
        var allOf = _a.allOf, baseSchema = __rest(_a, ["allOf"]);
        if (!allOf.length) {
            throw Error("allOf array can not be empty " + allOf + ".");
        }
        return allOf.reduce(function (base, schema) {
            schema = _this_1.resolveSchema(schema, options);
            if (base.required && schema.required) {
                base.required = __spread(base.required, schema.required);
            }
            if (schema.uniqueItems) {
                base.uniqueItems = schema.uniqueItems;
            }
            // resolve to min value
            ['maxLength', 'maximum', 'exclusiveMaximum', 'maxItems', 'maxProperties'].forEach(function (prop) {
                if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
                    base[prop] = base[prop] < schema[prop] ? base[prop] : schema[prop];
                }
            });
            // resolve to max value
            ['minLength', 'minimum', 'exclusiveMinimum', 'minItems', 'minProperties'].forEach(function (prop) {
                if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
                    base[prop] = base[prop] > schema[prop] ? base[prop] : schema[prop];
                }
            });
            return ɵreverseDeepMerge(base, schema);
        }, baseSchema);
    };
    FormlyJsonschema.prototype.resolveMultiSchema = function (mode, schemas, options) {
        var _this_1 = this;
        return {
            type: 'multischema',
            fieldGroup: [
                {
                    type: 'enum',
                    templateOptions: {
                        multiple: mode === 'anyOf',
                        options: schemas.map(function (s, i) { return ({ label: s.title, value: i }); }),
                    },
                },
                {
                    fieldGroup: schemas.map(function (s, i) { return (__assign(__assign({}, _this_1._toFieldConfig(s, __assign(__assign({}, options), { autoClear: true }))), { hideExpression: function (m, fs, f) {
                            var selectField = f.parent.parent.fieldGroup[0];
                            if (!selectField.formControl) {
                                var value = f.parent.fieldGroup
                                    .map(function (f, i) { return [f, i]; })
                                    .filter(function (_a) {
                                    var _b = __read(_a, 1), f = _b[0];
                                    return isFieldValid(f);
                                })
                                    .sort(function (_a, _b) {
                                    var _c = __read(_a, 1), f1 = _c[0];
                                    var _d = __read(_b, 1), f2 = _d[0];
                                    var matchedFields1 = totalMatchedFields(f1);
                                    var matchedFields2 = totalMatchedFields(f2);
                                    if (matchedFields1 === matchedFields2) {
                                        return 0;
                                    }
                                    return matchedFields2 > matchedFields1 ? 1 : -1;
                                })
                                    .map(function (_a) {
                                    var _b = __read(_a, 2), i = _b[1];
                                    return i;
                                });
                                var normalizedValue = [value.length === 0 ? 0 : value[0]];
                                var formattedValue = mode === 'anyOf' ? normalizedValue : normalizedValue[0];
                                ɵdefineHiddenProp(selectField, 'formControl', new FormControl(formattedValue));
                            }
                            var control = selectField.formControl;
                            return Array.isArray(control.value) ? control.value.indexOf(i) === -1 : control.value !== i;
                        } })); }),
                },
            ],
        };
    };
    FormlyJsonschema.prototype.resolveDefinition = function (schema, options) {
        var _a = __read(schema.$ref.split('#/'), 2), uri = _a[0], pointer = _a[1];
        if (uri) {
            throw Error("Remote schemas for " + schema.$ref + " not supported yet.");
        }
        var definition = !pointer
            ? null
            : pointer.split('/').reduce(function (def, path) { return (def && def.hasOwnProperty(path) ? def[path] : null); }, options.schema);
        if (!definition) {
            throw Error("Cannot find a definition for " + schema.$ref + ".");
        }
        if (definition.$ref) {
            return this.resolveDefinition(definition, options);
        }
        return __assign(__assign({}, definition), ['title', 'description', 'default'].reduce(function (annotation, p) {
            if (schema.hasOwnProperty(p)) {
                annotation[p] = schema[p];
            }
            return annotation;
        }, {}));
    };
    FormlyJsonschema.prototype.resolveDependencies = function (schema) {
        var deps = {};
        var schemaDeps = {};
        Object.keys(schema.dependencies || {}).forEach(function (prop) {
            var dependency = schema.dependencies[prop];
            if (Array.isArray(dependency)) {
                // Property dependencies
                dependency.forEach(function (dep) {
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
    };
    FormlyJsonschema.prototype.guessType = function (schema) {
        var type = schema.type;
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
    };
    FormlyJsonschema.prototype.addValidator = function (field, name, validator) {
        field.validators = field.validators || {};
        field.validators[name] = validator;
    };
    FormlyJsonschema.prototype.isEnum = function (schema) {
        return (schema.enum ||
            (schema.anyOf && schema.anyOf.every(isConst)) ||
            (schema.oneOf && schema.oneOf.every(isConst)) ||
            (schema.uniqueItems && schema.items && !Array.isArray(schema.items) && this.isEnum(schema.items)));
    };
    FormlyJsonschema.prototype.toEnumOptions = function (schema) {
        if (schema.enum) {
            return schema.enum.map(function (value) { return ({ value: value, label: value }); });
        }
        var toEnum = function (s) {
            var value = s.hasOwnProperty('const') ? s.const : s.enum[0];
            return { value: value, label: s.title || value };
        };
        if (schema.anyOf) {
            return schema.anyOf.map(toEnum);
        }
        if (schema.oneOf) {
            return schema.oneOf.map(toEnum);
        }
        return this.toEnumOptions(schema.items);
    };
    FormlyJsonschema.ɵprov = ɵɵdefineInjectable({ factory: function FormlyJsonschema_Factory() { return new FormlyJsonschema(); }, token: FormlyJsonschema, providedIn: "root" });
    FormlyJsonschema = __decorate([
        Injectable({ providedIn: 'root' })
    ], FormlyJsonschema);
    return FormlyJsonschema;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { FormlyJsonschema };
//# sourceMappingURL=ngx-formly-core-json-schema.js.map
