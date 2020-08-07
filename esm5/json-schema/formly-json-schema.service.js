import { __assign, __decorate, __read, __rest, __spread } from "tslib";
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ɵdefineHiddenProp as defineHiddenProp, ɵreverseDeepMerge as reverseDeepMerge, ɵgetFieldInitialValue as getFieldInitialValue, } from '@ngx-formly/core';
import * as i0 from "@angular/core";
function isEmpty(v) {
    return v === '' || v == null;
}
function isConst(schema) {
    return schema.hasOwnProperty('const') || (schema.enum && schema.enum.length === 1);
}
function totalMatchedFields(field) {
    if (field.key && !field.fieldGroup) {
        return getFieldInitialValue(field) !== undefined ? 1 : 0;
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
            field = reverseDeepMerge(schema['widget'].formlyConfig, field);
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
            return reverseDeepMerge(base, schema);
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
                                defineHiddenProp(selectField, 'formControl', new FormControl(formattedValue));
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
    FormlyJsonschema.ɵprov = i0.ɵɵdefineInjectable({ factory: function FormlyJsonschema_Factory() { return new FormlyJsonschema(); }, token: FormlyJsonschema, providedIn: "root" });
    FormlyJsonschema = __decorate([
        Injectable({ providedIn: 'root' })
    ], FormlyJsonschema);
    return FormlyJsonschema;
}());
export { FormlyJsonschema };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LWpzb24tc2NoZW1hLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlL2pzb24tc2NoZW1hLyIsInNvdXJjZXMiOlsiZm9ybWx5LWpzb24tc2NoZW1hLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFtQixXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLElBQUksZ0JBQWdCLEVBQ3JDLGlCQUFpQixJQUFJLGdCQUFnQixFQUNyQyxxQkFBcUIsSUFBSSxvQkFBb0IsR0FDOUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFXMUIsU0FBUyxPQUFPLENBQUMsQ0FBTTtJQUNyQixPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUMvQixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsTUFBbUI7SUFDbEMsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxLQUF3QjtJQUNsRCxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ2xDLE9BQU8sb0JBQW9CLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRDtJQUVELE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUF6QixDQUF5QixFQUFF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RCxPQUFPLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLENBQUM7UUFDNUMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQztRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBYyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7SUFoWlUsZ0JBQWdCO1FBRDVCLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQztPQUN0QixnQkFBZ0IsQ0FpWjVCOzJCQWxjRDtDQWtjQyxBQWpaRCxJQWlaQztTQWpaWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtbHlGaWVsZENvbmZpZyB9IGZyb20gJ0BuZ3gtZm9ybWx5L2NvcmUnO1xuaW1wb3J0IHsgSlNPTlNjaGVtYTcsIEpTT05TY2hlbWE3VHlwZU5hbWUgfSBmcm9tICdqc29uLXNjaGVtYSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgybVkZWZpbmVIaWRkZW5Qcm9wIGFzIGRlZmluZUhpZGRlblByb3AsXG4gIMm1cmV2ZXJzZURlZXBNZXJnZSBhcyByZXZlcnNlRGVlcE1lcmdlLFxuICDJtWdldEZpZWxkSW5pdGlhbFZhbHVlIGFzIGdldEZpZWxkSW5pdGlhbFZhbHVlLFxufSBmcm9tICdAbmd4LWZvcm1seS9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBGb3JtbHlKc29uc2NoZW1hT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBhbGxvd3MgdG8gaW50ZXJjZXB0IHRoZSBtYXBwaW5nLCB0YWtpbmcgdGhlIGFscmVhZHkgbWFwcGVkXG4gICAqIGZvcm1seSBmaWVsZCBhbmQgdGhlIG9yaWdpbmFsIEpTT05TY2hlbWEgc291cmNlIGZyb20gd2hpY2ggaXRcbiAgICogd2FzIG1hcHBlZC5cbiAgICovXG4gIG1hcD86IChtYXBwZWRGaWVsZDogRm9ybWx5RmllbGRDb25maWcsIG1hcFNvdXJjZTogSlNPTlNjaGVtYTcpID0+IEZvcm1seUZpZWxkQ29uZmlnO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5KHY6IGFueSkge1xuICByZXR1cm4gdiA9PT0gJycgfHwgdiA9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0NvbnN0KHNjaGVtYTogSlNPTlNjaGVtYTcpIHtcbiAgcmV0dXJuIHNjaGVtYS5oYXNPd25Qcm9wZXJ0eSgnY29uc3QnKSB8fCAoc2NoZW1hLmVudW0gJiYgc2NoZW1hLmVudW0ubGVuZ3RoID09PSAxKTtcbn1cblxuZnVuY3Rpb24gdG90YWxNYXRjaGVkRmllbGRzKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZyk6IG51bWJlciB7XG4gIGlmIChmaWVsZC5rZXkgJiYgIWZpZWxkLmZpZWxkR3JvdXApIHtcbiAgICByZXR1cm4gZ2V0RmllbGRJbml0aWFsVmFsdWUoZmllbGQpICE9PSB1bmRlZmluZWQgPyAxIDogMDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZC5maWVsZEdyb3VwLnJlZHVjZSgocywgZikgPT4gdG90YWxNYXRjaGVkRmllbGRzKGYpICsgcywgMCk7XG59XG5cbmZ1bmN0aW9uIGlzRmllbGRWYWxpZChmaWVsZDogRm9ybWx5RmllbGRDb25maWcpOiBib29sZWFuIHtcbiAgaWYgKGZpZWxkLmtleSkge1xuICAgIHJldHVybiBmaWVsZC5mb3JtQ29udHJvbC52YWxpZDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZC5maWVsZEdyb3VwLmV2ZXJ5KChmKSA9PiBpc0ZpZWxkVmFsaWQoZikpO1xufVxuXG5pbnRlcmZhY2UgSU9wdGlvbnMgZXh0ZW5kcyBGb3JtbHlKc29uc2NoZW1hT3B0aW9ucyB7XG4gIHNjaGVtYTogSlNPTlNjaGVtYTc7XG4gIGF1dG9DbGVhcj86IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRm9ybWx5SnNvbnNjaGVtYSB7XG4gIHRvRmllbGRDb25maWcoc2NoZW1hOiBKU09OU2NoZW1hNywgb3B0aW9ucz86IEZvcm1seUpzb25zY2hlbWFPcHRpb25zKTogRm9ybWx5RmllbGRDb25maWcge1xuICAgIHJldHVybiB0aGlzLl90b0ZpZWxkQ29uZmlnKHNjaGVtYSwgeyBzY2hlbWEsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvRmllbGRDb25maWcoc2NoZW1hOiBKU09OU2NoZW1hNywgb3B0aW9uczogSU9wdGlvbnMpOiBGb3JtbHlGaWVsZENvbmZpZyB7XG4gICAgc2NoZW1hID0gdGhpcy5yZXNvbHZlU2NoZW1hKHNjaGVtYSwgb3B0aW9ucyk7XG5cbiAgICBsZXQgZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnID0ge1xuICAgICAgdHlwZTogdGhpcy5ndWVzc1R5cGUoc2NoZW1hKSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogc2NoZW1hLmRlZmF1bHQsXG4gICAgICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICAgICAgbGFiZWw6IHNjaGVtYS50aXRsZSxcbiAgICAgICAgcmVhZG9ubHk6IHNjaGVtYS5yZWFkT25seSxcbiAgICAgICAgZGVzY3JpcHRpb246IHNjaGVtYS5kZXNjcmlwdGlvbixcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zLmF1dG9DbGVhcikge1xuICAgICAgZmllbGRbJ2F1dG9DbGVhciddID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICAgIGNhc2UgJ251bGwnOiB7XG4gICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKGZpZWxkLCAnbnVsbCcsICh7IHZhbHVlIH0pID0+IHZhbHVlID09PSBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnaW50ZWdlcic6IHtcbiAgICAgICAgZmllbGQucGFyc2VycyA9IFsodikgPT4gKGlzRW1wdHkodikgPyBudWxsIDogTnVtYmVyKHYpKV07XG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ21pbmltdW0nKSkge1xuICAgICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5taW4gPSBzY2hlbWEubWluaW11bTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ21heGltdW0nKSkge1xuICAgICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5tYXggPSBzY2hlbWEubWF4aW11bTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ2V4Y2x1c2l2ZU1pbmltdW0nKSkge1xuICAgICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5leGNsdXNpdmVNaW5pbXVtID0gc2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW07XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoXG4gICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICdleGNsdXNpdmVNaW5pbXVtJyxcbiAgICAgICAgICAgICh7IHZhbHVlIH0pID0+IGlzRW1wdHkodmFsdWUpIHx8IHZhbHVlID4gc2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ2V4Y2x1c2l2ZU1heGltdW0nKSkge1xuICAgICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5leGNsdXNpdmVNYXhpbXVtID0gc2NoZW1hLmV4Y2x1c2l2ZU1heGltdW07XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoXG4gICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICdleGNsdXNpdmVNYXhpbXVtJyxcbiAgICAgICAgICAgICh7IHZhbHVlIH0pID0+IGlzRW1wdHkodmFsdWUpIHx8IHZhbHVlIDwgc2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ211bHRpcGxlT2YnKSkge1xuICAgICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5zdGVwID0gc2NoZW1hLm11bHRpcGxlT2Y7XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoZmllbGQsICdtdWx0aXBsZU9mJywgKHsgdmFsdWUgfSkgPT4gaXNFbXB0eSh2YWx1ZSkgfHwgKE1hdGguZmxvb3IodmFsdWUqMTAwMCkgJSBNYXRoLmZsb29yKHNjaGVtYS5tdWx0aXBsZU9mKjEwMDApKSA9PT0gMCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdzdHJpbmcnOiB7XG4gICAgICAgIGNvbnN0IHNjaGVtYVR5cGUgPSBzY2hlbWEudHlwZSBhcyBKU09OU2NoZW1hN1R5cGVOYW1lO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWFUeXBlKSAmJiBzY2hlbWFUeXBlLmluZGV4T2YoJ251bGwnKSAhPT0gLTEpIHtcbiAgICAgICAgICBmaWVsZC5wYXJzZXJzID0gWyh2KSA9PiAoaXNFbXB0eSh2KSA/IG51bGwgOiB2KV07XG4gICAgICAgIH1cblxuICAgICAgICBbJ21pbkxlbmd0aCcsICdtYXhMZW5ndGgnLCAncGF0dGVybiddLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnNbcHJvcF0gPSBzY2hlbWFbcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICAgIGZpZWxkLmZpZWxkR3JvdXAgPSBbXTtcblxuICAgICAgICBjb25zdCBbcHJvcERlcHMsIHNjaGVtYURlcHNdID0gdGhpcy5yZXNvbHZlRGVwZW5kZW5jaWVzKHNjaGVtYSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzIHx8IHt9KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCBmID0gdGhpcy5fdG9GaWVsZENvbmZpZyg8SlNPTlNjaGVtYTc+c2NoZW1hLnByb3BlcnRpZXNba2V5XSwgb3B0aW9ucyk7XG4gICAgICAgICAgZmllbGQuZmllbGRHcm91cC5wdXNoKGYpO1xuICAgICAgICAgIGYua2V5ID0ga2V5O1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNjaGVtYS5yZXF1aXJlZCkgJiYgc2NoZW1hLnJlcXVpcmVkLmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGYudGVtcGxhdGVPcHRpb25zLnJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGYudGVtcGxhdGVPcHRpb25zICYmICFmLnRlbXBsYXRlT3B0aW9ucy5yZXF1aXJlZCAmJiBwcm9wRGVwc1trZXldKSB7XG4gICAgICAgICAgICBmLmV4cHJlc3Npb25Qcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgICAndGVtcGxhdGVPcHRpb25zLnJlcXVpcmVkJzogKG0pID0+IG0gJiYgcHJvcERlcHNba2V5XS5zb21lKChrKSA9PiAhaXNFbXB0eShtW2tdKSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzY2hlbWFEZXBzW2tleV0pIHtcbiAgICAgICAgICAgIGNvbnN0IGdldENvbnN0VmFsdWUgPSAoczogSlNPTlNjaGVtYTcpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHMuaGFzT3duUHJvcGVydHkoJ2NvbnN0JykgPyBzLmNvbnN0IDogcy5lbnVtWzBdO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qgb25lT2ZTY2hlbWEgPSBzY2hlbWFEZXBzW2tleV0ub25lT2Y7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIG9uZU9mU2NoZW1hICYmXG4gICAgICAgICAgICAgIG9uZU9mU2NoZW1hLmV2ZXJ5KChvKSA9PiBvLnByb3BlcnRpZXMgJiYgby5wcm9wZXJ0aWVzW2tleV0gJiYgaXNDb25zdChvLnByb3BlcnRpZXNba2V5XSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgb25lT2ZTY2hlbWEuZm9yRWFjaCgob25lT2ZTY2hlbWFJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBba2V5XTogY29uc3RTY2hlbWEsIC4uLnByb3BlcnRpZXMgfSA9IG9uZU9mU2NoZW1hSXRlbS5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgICAgIGZpZWxkLmZpZWxkR3JvdXAucHVzaCh7XG4gICAgICAgICAgICAgICAgICAuLi50aGlzLl90b0ZpZWxkQ29uZmlnKHsgLi4ub25lT2ZTY2hlbWFJdGVtLCBwcm9wZXJ0aWVzIH0sIHsgLi4ub3B0aW9ucywgYXV0b0NsZWFyOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgaGlkZUV4cHJlc3Npb246IChtKSA9PiAhbSB8fCBnZXRDb25zdFZhbHVlKGNvbnN0U2NoZW1hKSAhPT0gbVtrZXldLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLmZpZWxkR3JvdXAucHVzaCh7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5fdG9GaWVsZENvbmZpZyhzY2hlbWFEZXBzW2tleV0sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgIGhpZGVFeHByZXNzaW9uOiAobSkgPT4gIW0gfHwgaXNFbXB0eShtW2tleV0pLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzY2hlbWEub25lT2YpIHtcbiAgICAgICAgICBmaWVsZC5maWVsZEdyb3VwLnB1c2godGhpcy5yZXNvbHZlTXVsdGlTY2hlbWEoJ29uZU9mJywgPEpTT05TY2hlbWE3W10+c2NoZW1hLm9uZU9mLCBvcHRpb25zKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NoZW1hLmFueU9mKSB7XG4gICAgICAgICAgZmllbGQuZmllbGRHcm91cC5wdXNoKHRoaXMucmVzb2x2ZU11bHRpU2NoZW1hKCdhbnlPZicsIDxKU09OU2NoZW1hN1tdPnNjaGVtYS5hbnlPZiwgb3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnYXJyYXknOiB7XG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ21pbkl0ZW1zJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMubWluSXRlbXMgPSBzY2hlbWEubWluSXRlbXM7XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoZmllbGQsICdtaW5JdGVtcycsICh7IHZhbHVlIH0pID0+IGlzRW1wdHkodmFsdWUpIHx8IHZhbHVlLmxlbmd0aCA+PSBzY2hlbWEubWluSXRlbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ21heEl0ZW1zJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMubWF4SXRlbXMgPSBzY2hlbWEubWF4SXRlbXM7XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoZmllbGQsICdtYXhJdGVtcycsICh7IHZhbHVlIH0pID0+IGlzRW1wdHkodmFsdWUpIHx8IHZhbHVlLmxlbmd0aCA8PSBzY2hlbWEubWF4SXRlbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkoJ3VuaXF1ZUl0ZW1zJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMudW5pcXVlSXRlbXMgPSBzY2hlbWEudW5pcXVlSXRlbXM7XG4gICAgICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoZmllbGQsICd1bmlxdWVJdGVtcycsICh7IHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChpc0VtcHR5KHZhbHVlKSB8fCAhc2NoZW1hLnVuaXF1ZUl0ZW1zKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB1bmlxdWVJdGVtcyA9IEFycmF5LmZyb20obmV3IFNldCh2YWx1ZS5tYXAoKHY6IGFueSkgPT4gSlNPTi5zdHJpbmdpZnkodikpKSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1bmlxdWVJdGVtcy5sZW5ndGggPT09IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc29sdmUgaXRlbXMgc2NoZW1hIG5lZWRlZCBmb3IgaXNFbnVtIGNoZWNrXG4gICAgICAgIGlmIChzY2hlbWEuaXRlbXMgJiYgIUFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIHNjaGVtYS5pdGVtcyA9IHRoaXMucmVzb2x2ZVNjaGVtYSg8SlNPTlNjaGVtYTc+c2NoZW1hLml0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBpc0VudW0gY2hlY2sgb25jZSBhZGRpbmcgYW4gb3B0aW9uIHRvIHNraXAgZXh0ZW5zaW9uXG4gICAgICAgIGlmICghdGhpcy5pc0VudW0oc2NoZW1hKSkge1xuICAgICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZmllbGQsICdmaWVsZEFycmF5Jywge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gaXRlbXMgaXMgYSBzaW5nbGUgc2NoZW1hLCB0aGUgYWRkaXRpb25hbEl0ZW1zIGtleXdvcmQgaXMgbWVhbmluZ2xlc3MsIGFuZCBpdCBzaG91bGQgbm90IGJlIHVzZWQuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl90b0ZpZWxkQ29uZmlnKDxKU09OU2NoZW1hNz5zY2hlbWEuaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5maWVsZEdyb3VwID8gdGhpcy5maWVsZEdyb3VwLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgIGNvbnN0IGl0ZW1TY2hlbWEgPSBzY2hlbWEuaXRlbXNbbGVuZ3RoXSA/IHNjaGVtYS5pdGVtc1tsZW5ndGhdIDogc2NoZW1hLmFkZGl0aW9uYWxJdGVtcztcblxuICAgICAgICAgICAgICByZXR1cm4gaXRlbVNjaGVtYSA/IF90aGlzLl90b0ZpZWxkQ29uZmlnKDxKU09OU2NoZW1hNz5pdGVtU2NoZW1hLCBvcHRpb25zKSA6IHt9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdjb25zdCcpKSB7XG4gICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMuY29uc3QgPSBzY2hlbWEuY29uc3Q7XG4gICAgICB0aGlzLmFkZFZhbGlkYXRvcihmaWVsZCwgJ2NvbnN0JywgKHsgdmFsdWUgfSkgPT4gdmFsdWUgPT09IHNjaGVtYS5jb25zdCk7XG4gICAgICBpZiAoIWZpZWxkLnR5cGUpIHtcbiAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gc2NoZW1hLmNvbnN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRW51bShzY2hlbWEpKSB7XG4gICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMubXVsdGlwbGUgPSBmaWVsZC50eXBlID09PSAnYXJyYXknO1xuICAgICAgZmllbGQudHlwZSA9ICdlbnVtJztcbiAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5vcHRpb25zID0gdGhpcy50b0VudW1PcHRpb25zKHNjaGVtYSk7XG4gICAgfVxuXG4gICAgLy8gbWFwIGluIHBvc3NpYmxlIGZvcm1seUNvbmZpZyBvcHRpb25zIGZyb20gdGhlIHdpZGdldCBwcm9wZXJ0eVxuICAgIGlmIChzY2hlbWFbJ3dpZGdldCddICYmIHNjaGVtYVsnd2lkZ2V0J10uZm9ybWx5Q29uZmlnKSB7XG4gICAgICBmaWVsZCA9IHJldmVyc2VEZWVwTWVyZ2Uoc2NoZW1hWyd3aWRnZXQnXS5mb3JtbHlDb25maWcsIGZpZWxkKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBhIG1hcCBmdW5jdGlvbiBwYXNzZWQgaW4sIHVzZSBpdCB0byBhbGxvdyB0aGUgdXNlciB0b1xuICAgIC8vIGZ1cnRoZXIgY3VzdG9taXplIGhvdyBmaWVsZHMgYXJlIGJlaW5nIG1hcHBlZFxuICAgIHJldHVybiBvcHRpb25zLm1hcCA/IG9wdGlvbnMubWFwKGZpZWxkLCBzY2hlbWEpIDogZmllbGQ7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVTY2hlbWEoc2NoZW1hOiBKU09OU2NoZW1hNywgb3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICBpZiAoc2NoZW1hLiRyZWYpIHtcbiAgICAgIHNjaGVtYSA9IHRoaXMucmVzb2x2ZURlZmluaXRpb24oc2NoZW1hLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoc2NoZW1hLmFsbE9mKSB7XG4gICAgICBzY2hlbWEgPSB0aGlzLnJlc29sdmVBbGxPZihzY2hlbWEsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVBbGxPZih7IGFsbE9mLCAuLi5iYXNlU2NoZW1hIH06IEpTT05TY2hlbWE3LCBvcHRpb25zOiBJT3B0aW9ucykge1xuICAgIGlmICghYWxsT2YubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgYWxsT2YgYXJyYXkgY2FuIG5vdCBiZSBlbXB0eSAke2FsbE9mfS5gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWxsT2YucmVkdWNlKChiYXNlOiBKU09OU2NoZW1hNywgc2NoZW1hOiBKU09OU2NoZW1hNykgPT4ge1xuICAgICAgc2NoZW1hID0gdGhpcy5yZXNvbHZlU2NoZW1hKHNjaGVtYSwgb3B0aW9ucyk7XG4gICAgICBpZiAoYmFzZS5yZXF1aXJlZCAmJiBzY2hlbWEucmVxdWlyZWQpIHtcbiAgICAgICAgYmFzZS5yZXF1aXJlZCA9IFsuLi5iYXNlLnJlcXVpcmVkLCAuLi5zY2hlbWEucmVxdWlyZWRdO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NoZW1hLnVuaXF1ZUl0ZW1zKSB7XG4gICAgICAgIGJhc2UudW5pcXVlSXRlbXMgPSBzY2hlbWEudW5pcXVlSXRlbXM7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlc29sdmUgdG8gbWluIHZhbHVlXG4gICAgICBbJ21heExlbmd0aCcsICdtYXhpbXVtJywgJ2V4Y2x1c2l2ZU1heGltdW0nLCAnbWF4SXRlbXMnLCAnbWF4UHJvcGVydGllcyddLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGJhc2VbcHJvcF0pICYmICFpc0VtcHR5KHNjaGVtYVtwcm9wXSkpIHtcbiAgICAgICAgICBiYXNlW3Byb3BdID0gYmFzZVtwcm9wXSA8IHNjaGVtYVtwcm9wXSA/IGJhc2VbcHJvcF0gOiBzY2hlbWFbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyByZXNvbHZlIHRvIG1heCB2YWx1ZVxuICAgICAgWydtaW5MZW5ndGgnLCAnbWluaW11bScsICdleGNsdXNpdmVNaW5pbXVtJywgJ21pbkl0ZW1zJywgJ21pblByb3BlcnRpZXMnXS5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgIGlmICghaXNFbXB0eShiYXNlW3Byb3BdKSAmJiAhaXNFbXB0eShzY2hlbWFbcHJvcF0pKSB7XG4gICAgICAgICAgYmFzZVtwcm9wXSA9IGJhc2VbcHJvcF0gPiBzY2hlbWFbcHJvcF0gPyBiYXNlW3Byb3BdIDogc2NoZW1hW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJldmVyc2VEZWVwTWVyZ2UoYmFzZSwgc2NoZW1hKTtcbiAgICB9LCBiYXNlU2NoZW1hKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZU11bHRpU2NoZW1hKG1vZGU6ICdvbmVPZicgfCAnYW55T2YnLCBzY2hlbWFzOiBKU09OU2NoZW1hN1tdLCBvcHRpb25zOiBJT3B0aW9ucyk6IEZvcm1seUZpZWxkQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ211bHRpc2NoZW1hJyxcbiAgICAgIGZpZWxkR3JvdXA6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdlbnVtJyxcbiAgICAgICAgICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIG11bHRpcGxlOiBtb2RlID09PSAnYW55T2YnLFxuICAgICAgICAgICAgb3B0aW9uczogc2NoZW1hcy5tYXAoKHMsIGkpID0+ICh7IGxhYmVsOiBzLnRpdGxlLCB2YWx1ZTogaSB9KSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkR3JvdXA6IHNjaGVtYXMubWFwKChzLCBpKSA9PiAoe1xuICAgICAgICAgICAgLi4udGhpcy5fdG9GaWVsZENvbmZpZyhzLCB7IC4uLm9wdGlvbnMsIGF1dG9DbGVhcjogdHJ1ZSB9KSxcbiAgICAgICAgICAgIGhpZGVFeHByZXNzaW9uOiAobSwgZnMsIGYpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0RmllbGQgPSBmLnBhcmVudC5wYXJlbnQuZmllbGRHcm91cFswXTtcbiAgICAgICAgICAgICAgaWYgKCFzZWxlY3RGaWVsZC5mb3JtQ29udHJvbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZi5wYXJlbnQuZmllbGRHcm91cFxuICAgICAgICAgICAgICAgICAgLm1hcCgoZiwgaSkgPT4gW2YsIGldIGFzIFtGb3JtbHlGaWVsZENvbmZpZywgbnVtYmVyXSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKFtmXSkgPT4gaXNGaWVsZFZhbGlkKGYpKVxuICAgICAgICAgICAgICAgICAgLnNvcnQoKFtmMV0sIFtmMl0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlZEZpZWxkczEgPSB0b3RhbE1hdGNoZWRGaWVsZHMoZjEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaGVkRmllbGRzMiA9IHRvdGFsTWF0Y2hlZEZpZWxkcyhmMik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVkRmllbGRzMSA9PT0gbWF0Y2hlZEZpZWxkczIpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaGVkRmllbGRzMiA+IG1hdGNoZWRGaWVsZHMxID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5tYXAoKFssIGldKSA9PiBpKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IFt2YWx1ZS5sZW5ndGggPT09IDAgPyAwIDogdmFsdWVbMF1dO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFZhbHVlID0gbW9kZSA9PT0gJ2FueU9mJyA/IG5vcm1hbGl6ZWRWYWx1ZSA6IG5vcm1hbGl6ZWRWYWx1ZVswXTtcbiAgICAgICAgICAgICAgICBkZWZpbmVIaWRkZW5Qcm9wKHNlbGVjdEZpZWxkLCAnZm9ybUNvbnRyb2wnLCBuZXcgRm9ybUNvbnRyb2woZm9ybWF0dGVkVmFsdWUpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2wgPSBzZWxlY3RGaWVsZC5mb3JtQ29udHJvbDtcblxuICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjb250cm9sLnZhbHVlKSA/IGNvbnRyb2wudmFsdWUuaW5kZXhPZihpKSA9PT0gLTEgOiBjb250cm9sLnZhbHVlICE9PSBpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVEZWZpbml0aW9uKHNjaGVtYTogSlNPTlNjaGVtYTcsIG9wdGlvbnM6IElPcHRpb25zKTogSlNPTlNjaGVtYTcge1xuICAgIGNvbnN0IFt1cmksIHBvaW50ZXJdID0gc2NoZW1hLiRyZWYuc3BsaXQoJyMvJyk7XG4gICAgaWYgKHVyaSkge1xuICAgICAgdGhyb3cgRXJyb3IoYFJlbW90ZSBzY2hlbWFzIGZvciAke3NjaGVtYS4kcmVmfSBub3Qgc3VwcG9ydGVkIHlldC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gIXBvaW50ZXJcbiAgICAgID8gbnVsbFxuICAgICAgOiBwb2ludGVyLnNwbGl0KCcvJykucmVkdWNlKChkZWYsIHBhdGgpID0+IChkZWYgJiYgZGVmLmhhc093blByb3BlcnR5KHBhdGgpID8gZGVmW3BhdGhdIDogbnVsbCksIG9wdGlvbnMuc2NoZW1hKTtcblxuICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmaW5kIGEgZGVmaW5pdGlvbiBmb3IgJHtzY2hlbWEuJHJlZn0uYCk7XG4gICAgfVxuXG4gICAgaWYgKGRlZmluaXRpb24uJHJlZikge1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZURlZmluaXRpb24oZGVmaW5pdGlvbiwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmRlZmluaXRpb24sXG4gICAgICAuLi5bJ3RpdGxlJywgJ2Rlc2NyaXB0aW9uJywgJ2RlZmF1bHQnXS5yZWR1Y2UoKGFubm90YXRpb24sIHApID0+IHtcbiAgICAgICAgaWYgKHNjaGVtYS5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgIGFubm90YXRpb25bcF0gPSBzY2hlbWFbcF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYW5ub3RhdGlvbjtcbiAgICAgIH0sIHt9KSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlRGVwZW5kZW5jaWVzKHNjaGVtYTogSlNPTlNjaGVtYTcpIHtcbiAgICBjb25zdCBkZXBzID0ge307XG4gICAgY29uc3Qgc2NoZW1hRGVwcyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLmRlcGVuZGVuY2llcyB8fCB7fSkuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IHNjaGVtYS5kZXBlbmRlbmNpZXNbcHJvcF0gYXMgSlNPTlNjaGVtYTc7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkZXBlbmRlbmN5KSkge1xuICAgICAgICAvLyBQcm9wZXJ0eSBkZXBlbmRlbmNpZXNcbiAgICAgICAgZGVwZW5kZW5jeS5mb3JFYWNoKChkZXApID0+IHtcbiAgICAgICAgICBpZiAoIWRlcHNbZGVwXSkge1xuICAgICAgICAgICAgZGVwc1tkZXBdID0gW3Byb3BdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXBzW2RlcF0ucHVzaChwcm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2NoZW1hIGRlcGVuZGVuY2llc1xuICAgICAgICBzY2hlbWFEZXBzW3Byb3BdID0gZGVwZW5kZW5jeTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBbZGVwcywgc2NoZW1hRGVwc107XG4gIH1cblxuICBwcml2YXRlIGd1ZXNzVHlwZShzY2hlbWE6IEpTT05TY2hlbWE3KSB7XG4gICAgY29uc3QgdHlwZSA9IHNjaGVtYS50eXBlIGFzIEpTT05TY2hlbWE3VHlwZU5hbWU7XG4gICAgaWYgKCF0eXBlICYmIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIGlmICh0eXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdHlwZVswXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUubGVuZ3RoID09PSAyICYmIHR5cGUuaW5kZXhPZignbnVsbCcpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gdHlwZVt0eXBlWzBdID09PSAnbnVsbCcgPyAxIDogMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGFkZFZhbGlkYXRvcihmaWVsZDogRm9ybWx5RmllbGRDb25maWcsIG5hbWU6IHN0cmluZywgdmFsaWRhdG9yOiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKSB7XG4gICAgZmllbGQudmFsaWRhdG9ycyA9IGZpZWxkLnZhbGlkYXRvcnMgfHwge307XG4gICAgZmllbGQudmFsaWRhdG9yc1tuYW1lXSA9IHZhbGlkYXRvcjtcbiAgfVxuXG4gIHByaXZhdGUgaXNFbnVtKHNjaGVtYTogSlNPTlNjaGVtYTcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgc2NoZW1hLmVudW0gfHxcbiAgICAgIChzY2hlbWEuYW55T2YgJiYgc2NoZW1hLmFueU9mLmV2ZXJ5KGlzQ29uc3QpKSB8fFxuICAgICAgKHNjaGVtYS5vbmVPZiAmJiBzY2hlbWEub25lT2YuZXZlcnkoaXNDb25zdCkpIHx8XG4gICAgICAoc2NoZW1hLnVuaXF1ZUl0ZW1zICYmIHNjaGVtYS5pdGVtcyAmJiAhQXJyYXkuaXNBcnJheShzY2hlbWEuaXRlbXMpICYmIHRoaXMuaXNFbnVtKDxKU09OU2NoZW1hNz5zY2hlbWEuaXRlbXMpKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvRW51bU9wdGlvbnMoc2NoZW1hOiBKU09OU2NoZW1hNykge1xuICAgIGlmIChzY2hlbWEuZW51bSkge1xuICAgICAgcmV0dXJuIHNjaGVtYS5lbnVtLm1hcCgodmFsdWUpID0+ICh7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvRW51bSA9IChzOiBKU09OU2NoZW1hNykgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBzLmhhc093blByb3BlcnR5KCdjb25zdCcpID8gcy5jb25zdCA6IHMuZW51bVswXTtcblxuICAgICAgcmV0dXJuIHsgdmFsdWUsIGxhYmVsOiBzLnRpdGxlIHx8IHZhbHVlIH07XG4gICAgfTtcblxuICAgIGlmIChzY2hlbWEuYW55T2YpIHtcbiAgICAgIHJldHVybiBzY2hlbWEuYW55T2YubWFwKHRvRW51bSk7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVtYS5vbmVPZikge1xuICAgICAgcmV0dXJuIHNjaGVtYS5vbmVPZi5tYXAodG9FbnVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50b0VudW1PcHRpb25zKDxKU09OU2NoZW1hNz5zY2hlbWEuaXRlbXMpO1xuICB9XG59XG4iXX0=