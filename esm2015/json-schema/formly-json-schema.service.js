import { __decorate, __rest } from "tslib";
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
            field = reverseDeepMerge(schema['widget'].formlyConfig, field);
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
            return reverseDeepMerge(base, schema);
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
                                defineHiddenProp(selectField, 'formControl', new FormControl(formattedValue));
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
FormlyJsonschema.ɵprov = i0.ɵɵdefineInjectable({ factory: function FormlyJsonschema_Factory() { return new FormlyJsonschema(); }, token: FormlyJsonschema, providedIn: "root" });
FormlyJsonschema = __decorate([
    Injectable({ providedIn: 'root' })
], FormlyJsonschema);
export { FormlyJsonschema };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LWpzb24tc2NoZW1hLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlL2pzb24tc2NoZW1hLyIsInNvdXJjZXMiOlsiZm9ybWx5LWpzb24tc2NoZW1hLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFtQixXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLElBQUksZ0JBQWdCLEVBQ3JDLGlCQUFpQixJQUFJLGdCQUFnQixFQUNyQyxxQkFBcUIsSUFBSSxvQkFBb0IsR0FDOUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFXMUIsU0FBUyxPQUFPLENBQUMsQ0FBTTtJQUNyQixPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUMvQixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsTUFBbUI7SUFDbEMsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxLQUF3QjtJQUNsRCxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ2xDLE9BQU8sb0JBQW9CLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRDtJQUVELE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQXdCO0lBQzVDLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7S0FDaEM7SUFFRCxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBUUQsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFDM0IsYUFBYSxDQUFDLE1BQW1CLEVBQUUsT0FBaUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sa0JBQUksTUFBTSxJQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFHLENBQUM7SUFDckUsQ0FBQztJQUVPLGNBQWMsQ0FBQyxNQUFtQixFQUFFLE9BQWlCO1FBQzNELE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU3QyxJQUFJLEtBQUssR0FBc0I7WUFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQzVCLFlBQVksRUFBRSxNQUFNLENBQUMsT0FBTztZQUM1QixlQUFlLEVBQUU7Z0JBQ2YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2dCQUNuQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7Z0JBQ3pCLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVzthQUNoQztTQUNGLENBQUM7UUFFRixJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDckIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMzQjtRQUVELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNsQixLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDaEUsTUFBTTthQUNQO1lBQ0QsS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFNBQVMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUNwQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2lCQUM1QztnQkFFRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ3BDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7aUJBQzVDO2dCQUVELElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO29CQUM3QyxLQUFLLENBQUMsZUFBZSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDakUsSUFBSSxDQUFDLFlBQVksQ0FDZixLQUFLLEVBQ0wsa0JBQWtCLEVBQ2xCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQ2pFLENBQUM7aUJBQ0g7Z0JBRUQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7b0JBQzdDLEtBQUssQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO29CQUNqRSxJQUFJLENBQUMsWUFBWSxDQUNmLEtBQUssRUFDTCxrQkFBa0IsRUFDbEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FDakUsQ0FBQztpQkFDSDtnQkFFRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQ3ZDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUM5STtnQkFDRCxNQUFNO2FBQ1A7WUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUEyQixDQUFDO2dCQUN0RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDbEUsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDtnQkFFRCxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3JELElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzVDO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU07YUFDUDtZQUNELEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBRXRCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ25ELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQWMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDNUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO29CQUNaLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ3pFLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztxQkFDbkM7b0JBQ0QsSUFBSSxDQUFDLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNyRSxDQUFDLENBQUMsb0JBQW9CLEdBQUc7NEJBQ3ZCLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2xGLENBQUM7cUJBQ0g7b0JBRUQsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ25CLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBYyxFQUFFLEVBQUU7NEJBQ3ZDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsQ0FBQyxDQUFDO3dCQUVGLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQzFDLElBQ0UsV0FBVzs0QkFDWCxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUN6Rjs0QkFDQSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0NBQ3RDLE1BQThDLCtCQUEwQixFQUFoRSxRQUFLLEVBQUwsb0JBQWtCLEVBQUUsZ0VBQTRDLENBQUM7Z0NBQ3pFLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxpQ0FDaEIsSUFBSSxDQUFDLGNBQWMsaUNBQU0sZUFBZSxLQUFFLFVBQVUscUNBQVMsT0FBTyxLQUFFLFNBQVMsRUFBRSxJQUFJLElBQUcsS0FDM0YsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUNsRSxDQUFDOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3lCQUNKOzZCQUFNOzRCQUNMLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxpQ0FDaEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQ2hELGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUM1QyxDQUFDO3lCQUNKO3FCQUNGO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtvQkFDaEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBaUIsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUMvRjtnQkFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQ2hCLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQWlCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDL0Y7Z0JBQ0QsTUFBTTthQUNQO1lBQ0QsS0FBSyxPQUFPLENBQUMsQ0FBQztnQkFDWixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3JDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDeEc7Z0JBQ0QsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3hHO2dCQUNELElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDeEMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO3dCQUNwRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7NEJBQ3pDLE9BQU8sSUFBSSxDQUFDO3lCQUNiO3dCQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFbEYsT0FBTyxXQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQzdDLENBQUMsQ0FBQyxDQUFDO2lCQUNKO2dCQUVELCtDQUErQztnQkFDL0MsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBYyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUN2RTtnQkFFRCxvRUFBb0U7Z0JBQ3BFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ25CLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTt3QkFDekMsR0FBRzs0QkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ2hDLHdHQUF3RztnQ0FDeEcsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFjLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7NkJBQ2pFOzRCQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzVELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7NEJBRXhGLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFjLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO3dCQUNsRixDQUFDO3dCQUNELFVBQVUsRUFBRSxJQUFJO3dCQUNoQixZQUFZLEVBQUUsSUFBSTtxQkFDbkIsQ0FBQyxDQUFDO2lCQUNKO2dCQUVELE1BQU07YUFDUDtTQUNGO1FBRUQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2xDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDZixLQUFLLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDbkM7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN2QixLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQztZQUN4RCxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNwQixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVEO1FBRUQsZ0VBQWdFO1FBQ2hFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDckQsS0FBSyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEU7UUFFRCxvRUFBb0U7UUFDcEUsZ0RBQWdEO1FBQ2hELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMxRCxDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQW1CLEVBQUUsT0FBaUI7UUFDMUQsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2YsTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEIsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLFlBQVksQ0FBQyxFQUFxQyxFQUFFLE9BQWlCO1lBQXhELEVBQUUsS0FBSyxPQUE4QixFQUE1QixrQ0FBYTtRQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLEtBQUssQ0FBQyxnQ0FBZ0MsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN2RDtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQWlCLEVBQUUsTUFBbUIsRUFBRSxFQUFFO1lBQzdELE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3QyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN4RDtZQUVELElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2FBQ3ZDO1lBRUQsdUJBQXVCO1lBQ3ZCLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3pGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEU7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILHVCQUF1QjtZQUN2QixDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUN6RixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3BFO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLGdCQUFnQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVPLGtCQUFrQixDQUFDLElBQXVCLEVBQUUsT0FBc0IsRUFBRSxPQUFpQjtRQUMzRixPQUFPO1lBQ0wsSUFBSSxFQUFFLGFBQWE7WUFDbkIsVUFBVSxFQUFFO2dCQUNWO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLGVBQWUsRUFBRTt3QkFDZixRQUFRLEVBQUUsSUFBSSxLQUFLLE9BQU87d0JBQzFCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMvRDtpQkFDRjtnQkFDRDtvQkFDRSxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUM3QixJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsa0NBQU8sT0FBTyxLQUFFLFNBQVMsRUFBRSxJQUFJLElBQUcsS0FDMUQsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDM0IsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQ0FDNUIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVO3FDQUM5QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQWdDLENBQUM7cUNBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQ0FDaEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0NBQ25CLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO29DQUM5QyxNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQ0FDOUMsSUFBSSxjQUFjLEtBQUssY0FBYyxFQUFFO3dDQUNyQyxPQUFPLENBQUMsQ0FBQztxQ0FDVjtvQ0FFRCxPQUFPLGNBQWMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELENBQUMsQ0FBQztxQ0FDRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUVyQixNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM1RCxNQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDL0UsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxJQUFJLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzZCQUMvRTs0QkFFRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDOzRCQUV4QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7d0JBQzlGLENBQUMsSUFDRCxDQUFDO2lCQUNKO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVPLGlCQUFpQixDQUFDLE1BQW1CLEVBQUUsT0FBaUI7UUFDOUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsRUFBRTtZQUNQLE1BQU0sS0FBSyxDQUFDLHNCQUFzQixNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3JFO1FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPO1lBQ3pCLENBQUMsQ0FBQyxJQUFJO1lBQ04sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkgsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sS0FBSyxDQUFDLGdDQUFnQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUM3RDtRQUVELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDcEQ7UUFFRCx1Q0FDSyxVQUFVLEdBQ1YsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5RCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzVCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFFRCxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ047SUFDSixDQUFDO0lBRU8sbUJBQW1CLENBQUMsTUFBbUI7UUFDN0MsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUV0QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQWdCLENBQUM7WUFDNUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM3Qix3QkFBd0I7Z0JBQ3hCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxzQkFBc0I7Z0JBQ3RCLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7YUFDL0I7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVPLFNBQVMsQ0FBQyxNQUFtQjtRQUNuQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBMkIsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDOUIsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEI7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekM7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLFlBQVksQ0FBQyxLQUF3QixFQUFFLElBQVksRUFBRSxTQUFnRDtRQUMzRyxLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQzFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxNQUFNLENBQUMsTUFBbUI7UUFDaEMsT0FBTyxDQUNMLE1BQU0sQ0FBQyxJQUFJO1lBQ1gsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQWMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQy9HLENBQUM7SUFDSixDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQW1CO1FBQ3ZDLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNmLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUVELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBYyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RCxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzVDLENBQUMsQ0FBQztRQUVGLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNoQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFFRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQWMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDRixDQUFBOztBQWpaWSxnQkFBZ0I7SUFENUIsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDO0dBQ3RCLGdCQUFnQixDQWlaNUI7U0FqWlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybWx5RmllbGRDb25maWcgfSBmcm9tICdAbmd4LWZvcm1seS9jb3JlJztcbmltcG9ydCB7IEpTT05TY2hlbWE3LCBKU09OU2NoZW1hN1R5cGVOYW1lIH0gZnJvbSAnanNvbi1zY2hlbWEnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIMm1ZGVmaW5lSGlkZGVuUHJvcCBhcyBkZWZpbmVIaWRkZW5Qcm9wLFxuICDJtXJldmVyc2VEZWVwTWVyZ2UgYXMgcmV2ZXJzZURlZXBNZXJnZSxcbiAgybVnZXRGaWVsZEluaXRpYWxWYWx1ZSBhcyBnZXRGaWVsZEluaXRpYWxWYWx1ZSxcbn0gZnJvbSAnQG5neC1mb3JtbHkvY29yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9ybWx5SnNvbnNjaGVtYU9wdGlvbnMge1xuICAvKipcbiAgICogYWxsb3dzIHRvIGludGVyY2VwdCB0aGUgbWFwcGluZywgdGFraW5nIHRoZSBhbHJlYWR5IG1hcHBlZFxuICAgKiBmb3JtbHkgZmllbGQgYW5kIHRoZSBvcmlnaW5hbCBKU09OU2NoZW1hIHNvdXJjZSBmcm9tIHdoaWNoIGl0XG4gICAqIHdhcyBtYXBwZWQuXG4gICAqL1xuICBtYXA/OiAobWFwcGVkRmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnLCBtYXBTb3VyY2U6IEpTT05TY2hlbWE3KSA9PiBGb3JtbHlGaWVsZENvbmZpZztcbn1cblxuZnVuY3Rpb24gaXNFbXB0eSh2OiBhbnkpIHtcbiAgcmV0dXJuIHYgPT09ICcnIHx8IHYgPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNDb25zdChzY2hlbWE6IEpTT05TY2hlbWE3KSB7XG4gIHJldHVybiBzY2hlbWEuaGFzT3duUHJvcGVydHkoJ2NvbnN0JykgfHwgKHNjaGVtYS5lbnVtICYmIHNjaGVtYS5lbnVtLmxlbmd0aCA9PT0gMSk7XG59XG5cbmZ1bmN0aW9uIHRvdGFsTWF0Y2hlZEZpZWxkcyhmaWVsZDogRm9ybWx5RmllbGRDb25maWcpOiBudW1iZXIge1xuICBpZiAoZmllbGQua2V5ICYmICFmaWVsZC5maWVsZEdyb3VwKSB7XG4gICAgcmV0dXJuIGdldEZpZWxkSW5pdGlhbFZhbHVlKGZpZWxkKSAhPT0gdW5kZWZpbmVkID8gMSA6IDA7XG4gIH1cblxuICByZXR1cm4gZmllbGQuZmllbGRHcm91cC5yZWR1Y2UoKHMsIGYpID0+IHRvdGFsTWF0Y2hlZEZpZWxkcyhmKSArIHMsIDApO1xufVxuXG5mdW5jdGlvbiBpc0ZpZWxkVmFsaWQoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnKTogYm9vbGVhbiB7XG4gIGlmIChmaWVsZC5rZXkpIHtcbiAgICByZXR1cm4gZmllbGQuZm9ybUNvbnRyb2wudmFsaWQ7XG4gIH1cblxuICByZXR1cm4gZmllbGQuZmllbGRHcm91cC5ldmVyeSgoZikgPT4gaXNGaWVsZFZhbGlkKGYpKTtcbn1cblxuaW50ZXJmYWNlIElPcHRpb25zIGV4dGVuZHMgRm9ybWx5SnNvbnNjaGVtYU9wdGlvbnMge1xuICBzY2hlbWE6IEpTT05TY2hlbWE3O1xuICBhdXRvQ2xlYXI/OiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEZvcm1seUpzb25zY2hlbWEge1xuICB0b0ZpZWxkQ29uZmlnKHNjaGVtYTogSlNPTlNjaGVtYTcsIG9wdGlvbnM/OiBGb3JtbHlKc29uc2NoZW1hT3B0aW9ucyk6IEZvcm1seUZpZWxkQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5fdG9GaWVsZENvbmZpZyhzY2hlbWEsIHsgc2NoZW1hLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBwcml2YXRlIF90b0ZpZWxkQ29uZmlnKHNjaGVtYTogSlNPTlNjaGVtYTcsIG9wdGlvbnM6IElPcHRpb25zKTogRm9ybWx5RmllbGRDb25maWcge1xuICAgIHNjaGVtYSA9IHRoaXMucmVzb2x2ZVNjaGVtYShzY2hlbWEsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZyA9IHtcbiAgICAgIHR5cGU6IHRoaXMuZ3Vlc3NUeXBlKHNjaGVtYSksXG4gICAgICBkZWZhdWx0VmFsdWU6IHNjaGVtYS5kZWZhdWx0LFxuICAgICAgdGVtcGxhdGVPcHRpb25zOiB7XG4gICAgICAgIGxhYmVsOiBzY2hlbWEudGl0bGUsXG4gICAgICAgIHJlYWRvbmx5OiBzY2hlbWEucmVhZE9ubHksXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzY2hlbWEuZGVzY3JpcHRpb24sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucy5hdXRvQ2xlYXIpIHtcbiAgICAgIGZpZWxkWydhdXRvQ2xlYXInXSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgICBjYXNlICdudWxsJzoge1xuICAgICAgICB0aGlzLmFkZFZhbGlkYXRvcihmaWVsZCwgJ251bGwnLCAoeyB2YWx1ZSB9KSA9PiB2YWx1ZSA9PT0gbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ2ludGVnZXInOiB7XG4gICAgICAgIGZpZWxkLnBhcnNlcnMgPSBbKHYpID0+IChpc0VtcHR5KHYpID8gbnVsbCA6IE51bWJlcih2KSldO1xuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdtaW5pbXVtJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMubWluID0gc2NoZW1hLm1pbmltdW07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdtYXhpbXVtJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMubWF4ID0gc2NoZW1hLm1heGltdW07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdleGNsdXNpdmVNaW5pbXVtJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMuZXhjbHVzaXZlTWluaW11bSA9IHNjaGVtYS5leGNsdXNpdmVNaW5pbXVtO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKFxuICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICAnZXhjbHVzaXZlTWluaW11bScsXG4gICAgICAgICAgICAoeyB2YWx1ZSB9KSA9PiBpc0VtcHR5KHZhbHVlKSB8fCB2YWx1ZSA+IHNjaGVtYS5leGNsdXNpdmVNaW5pbXVtLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdleGNsdXNpdmVNYXhpbXVtJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMuZXhjbHVzaXZlTWF4aW11bSA9IHNjaGVtYS5leGNsdXNpdmVNYXhpbXVtO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKFxuICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICAnZXhjbHVzaXZlTWF4aW11bScsXG4gICAgICAgICAgICAoeyB2YWx1ZSB9KSA9PiBpc0VtcHR5KHZhbHVlKSB8fCB2YWx1ZSA8IHNjaGVtYS5leGNsdXNpdmVNYXhpbXVtLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdtdWx0aXBsZU9mJykpIHtcbiAgICAgICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMuc3RlcCA9IHNjaGVtYS5tdWx0aXBsZU9mO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKGZpZWxkLCAnbXVsdGlwbGVPZicsICh7IHZhbHVlIH0pID0+IGlzRW1wdHkodmFsdWUpIHx8IChNYXRoLmZsb29yKHZhbHVlKjEwMDApICUgTWF0aC5mbG9vcihzY2hlbWEubXVsdGlwbGVPZioxMDAwKSkgPT09IDApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnc3RyaW5nJzoge1xuICAgICAgICBjb25zdCBzY2hlbWFUeXBlID0gc2NoZW1hLnR5cGUgYXMgSlNPTlNjaGVtYTdUeXBlTmFtZTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hVHlwZSkgJiYgc2NoZW1hVHlwZS5pbmRleE9mKCdudWxsJykgIT09IC0xKSB7XG4gICAgICAgICAgZmllbGQucGFyc2VycyA9IFsodikgPT4gKGlzRW1wdHkodikgPyBudWxsIDogdildO1xuICAgICAgICB9XG5cbiAgICAgICAgWydtaW5MZW5ndGgnLCAnbWF4TGVuZ3RoJywgJ3BhdHRlcm4nXS5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKHNjaGVtYS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zW3Byb3BdID0gc2NoZW1hW3Byb3BdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgICBmaWVsZC5maWVsZEdyb3VwID0gW107XG5cbiAgICAgICAgY29uc3QgW3Byb3BEZXBzLCBzY2hlbWFEZXBzXSA9IHRoaXMucmVzb2x2ZURlcGVuZGVuY2llcyhzY2hlbWEpO1xuICAgICAgICBPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcyB8fCB7fSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgZiA9IHRoaXMuX3RvRmllbGRDb25maWcoPEpTT05TY2hlbWE3PnNjaGVtYS5wcm9wZXJ0aWVzW2tleV0sIG9wdGlvbnMpO1xuICAgICAgICAgIGZpZWxkLmZpZWxkR3JvdXAucHVzaChmKTtcbiAgICAgICAgICBmLmtleSA9IGtleTtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEucmVxdWlyZWQpICYmIHNjaGVtYS5yZXF1aXJlZC5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICAgICAgICBmLnRlbXBsYXRlT3B0aW9ucy5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmLnRlbXBsYXRlT3B0aW9ucyAmJiAhZi50ZW1wbGF0ZU9wdGlvbnMucmVxdWlyZWQgJiYgcHJvcERlcHNba2V5XSkge1xuICAgICAgICAgICAgZi5leHByZXNzaW9uUHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgICAgJ3RlbXBsYXRlT3B0aW9ucy5yZXF1aXJlZCc6IChtKSA9PiBtICYmIHByb3BEZXBzW2tleV0uc29tZSgoaykgPT4gIWlzRW1wdHkobVtrXSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2NoZW1hRGVwc1trZXldKSB7XG4gICAgICAgICAgICBjb25zdCBnZXRDb25zdFZhbHVlID0gKHM6IEpTT05TY2hlbWE3KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBzLmhhc093blByb3BlcnR5KCdjb25zdCcpID8gcy5jb25zdCA6IHMuZW51bVswXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG9uZU9mU2NoZW1hID0gc2NoZW1hRGVwc1trZXldLm9uZU9mO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBvbmVPZlNjaGVtYSAmJlxuICAgICAgICAgICAgICBvbmVPZlNjaGVtYS5ldmVyeSgobykgPT4gby5wcm9wZXJ0aWVzICYmIG8ucHJvcGVydGllc1trZXldICYmIGlzQ29uc3Qoby5wcm9wZXJ0aWVzW2tleV0pKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG9uZU9mU2NoZW1hLmZvckVhY2goKG9uZU9mU2NoZW1hSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgW2tleV06IGNvbnN0U2NoZW1hLCAuLi5wcm9wZXJ0aWVzIH0gPSBvbmVPZlNjaGVtYUl0ZW0ucHJvcGVydGllcztcbiAgICAgICAgICAgICAgICBmaWVsZC5maWVsZEdyb3VwLnB1c2goe1xuICAgICAgICAgICAgICAgICAgLi4udGhpcy5fdG9GaWVsZENvbmZpZyh7IC4uLm9uZU9mU2NoZW1hSXRlbSwgcHJvcGVydGllcyB9LCB7IC4uLm9wdGlvbnMsIGF1dG9DbGVhcjogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgIGhpZGVFeHByZXNzaW9uOiAobSkgPT4gIW0gfHwgZ2V0Q29uc3RWYWx1ZShjb25zdFNjaGVtYSkgIT09IG1ba2V5XSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC5maWVsZEdyb3VwLnB1c2goe1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX3RvRmllbGRDb25maWcoc2NoZW1hRGVwc1trZXldLCBvcHRpb25zKSxcbiAgICAgICAgICAgICAgICBoaWRlRXhwcmVzc2lvbjogKG0pID0+ICFtIHx8IGlzRW1wdHkobVtrZXldKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2NoZW1hLm9uZU9mKSB7XG4gICAgICAgICAgZmllbGQuZmllbGRHcm91cC5wdXNoKHRoaXMucmVzb2x2ZU11bHRpU2NoZW1hKCdvbmVPZicsIDxKU09OU2NoZW1hN1tdPnNjaGVtYS5vbmVPZiwgb3B0aW9ucykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjaGVtYS5hbnlPZikge1xuICAgICAgICAgIGZpZWxkLmZpZWxkR3JvdXAucHVzaCh0aGlzLnJlc29sdmVNdWx0aVNjaGVtYSgnYW55T2YnLCA8SlNPTlNjaGVtYTdbXT5zY2hlbWEuYW55T2YsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2FycmF5Jzoge1xuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdtaW5JdGVtcycpKSB7XG4gICAgICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLm1pbkl0ZW1zID0gc2NoZW1hLm1pbkl0ZW1zO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKGZpZWxkLCAnbWluSXRlbXMnLCAoeyB2YWx1ZSB9KSA9PiBpc0VtcHR5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPj0gc2NoZW1hLm1pbkl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCdtYXhJdGVtcycpKSB7XG4gICAgICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLm1heEl0ZW1zID0gc2NoZW1hLm1heEl0ZW1zO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKGZpZWxkLCAnbWF4SXRlbXMnLCAoeyB2YWx1ZSB9KSA9PiBpc0VtcHR5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPD0gc2NoZW1hLm1heEl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NoZW1hLmhhc093blByb3BlcnR5KCd1bmlxdWVJdGVtcycpKSB7XG4gICAgICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLnVuaXF1ZUl0ZW1zID0gc2NoZW1hLnVuaXF1ZUl0ZW1zO1xuICAgICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKGZpZWxkLCAndW5pcXVlSXRlbXMnLCAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNFbXB0eSh2YWx1ZSkgfHwgIXNjaGVtYS51bmlxdWVJdGVtcykge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdW5pcXVlSXRlbXMgPSBBcnJheS5mcm9tKG5ldyBTZXQodmFsdWUubWFwKCh2OiBhbnkpID0+IEpTT04uc3RyaW5naWZ5KHYpKSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdW5pcXVlSXRlbXMubGVuZ3RoID09PSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNvbHZlIGl0ZW1zIHNjaGVtYSBuZWVkZWQgZm9yIGlzRW51bSBjaGVja1xuICAgICAgICBpZiAoc2NoZW1hLml0ZW1zICYmICFBcnJheS5pc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB0aGlzLnJlc29sdmVTY2hlbWEoPEpTT05TY2hlbWE3PnNjaGVtYS5pdGVtcywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgaXNFbnVtIGNoZWNrIG9uY2UgYWRkaW5nIGFuIG9wdGlvbiB0byBza2lwIGV4dGVuc2lvblxuICAgICAgICBpZiAoIXRoaXMuaXNFbnVtKHNjaGVtYSkpIHtcbiAgICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZpZWxkLCAnZmllbGRBcnJheScsIHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGl0ZW1zIGlzIGEgc2luZ2xlIHNjaGVtYSwgdGhlIGFkZGl0aW9uYWxJdGVtcyBrZXl3b3JkIGlzIG1lYW5pbmdsZXNzLCBhbmQgaXQgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5fdG9GaWVsZENvbmZpZyg8SlNPTlNjaGVtYTc+c2NoZW1hLml0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZmllbGRHcm91cCA/IHRoaXMuZmllbGRHcm91cC5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICBjb25zdCBpdGVtU2NoZW1hID0gc2NoZW1hLml0ZW1zW2xlbmd0aF0gPyBzY2hlbWEuaXRlbXNbbGVuZ3RoXSA6IHNjaGVtYS5hZGRpdGlvbmFsSXRlbXM7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1TY2hlbWEgPyBfdGhpcy5fdG9GaWVsZENvbmZpZyg8SlNPTlNjaGVtYTc+aXRlbVNjaGVtYSwgb3B0aW9ucykgOiB7fTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNjaGVtYS5oYXNPd25Qcm9wZXJ0eSgnY29uc3QnKSkge1xuICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLmNvbnN0ID0gc2NoZW1hLmNvbnN0O1xuICAgICAgdGhpcy5hZGRWYWxpZGF0b3IoZmllbGQsICdjb25zdCcsICh7IHZhbHVlIH0pID0+IHZhbHVlID09PSBzY2hlbWEuY29uc3QpO1xuICAgICAgaWYgKCFmaWVsZC50eXBlKSB7XG4gICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHNjaGVtYS5jb25zdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0VudW0oc2NoZW1hKSkge1xuICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLm11bHRpcGxlID0gZmllbGQudHlwZSA9PT0gJ2FycmF5JztcbiAgICAgIGZpZWxkLnR5cGUgPSAnZW51bSc7XG4gICAgICBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMub3B0aW9ucyA9IHRoaXMudG9FbnVtT3B0aW9ucyhzY2hlbWEpO1xuICAgIH1cblxuICAgIC8vIG1hcCBpbiBwb3NzaWJsZSBmb3JtbHlDb25maWcgb3B0aW9ucyBmcm9tIHRoZSB3aWRnZXQgcHJvcGVydHlcbiAgICBpZiAoc2NoZW1hWyd3aWRnZXQnXSAmJiBzY2hlbWFbJ3dpZGdldCddLmZvcm1seUNvbmZpZykge1xuICAgICAgZmllbGQgPSByZXZlcnNlRGVlcE1lcmdlKHNjaGVtYVsnd2lkZ2V0J10uZm9ybWx5Q29uZmlnLCBmaWVsZCk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlcmUgaXMgYSBtYXAgZnVuY3Rpb24gcGFzc2VkIGluLCB1c2UgaXQgdG8gYWxsb3cgdGhlIHVzZXIgdG9cbiAgICAvLyBmdXJ0aGVyIGN1c3RvbWl6ZSBob3cgZmllbGRzIGFyZSBiZWluZyBtYXBwZWRcbiAgICByZXR1cm4gb3B0aW9ucy5tYXAgPyBvcHRpb25zLm1hcChmaWVsZCwgc2NoZW1hKSA6IGZpZWxkO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlU2NoZW1hKHNjaGVtYTogSlNPTlNjaGVtYTcsIG9wdGlvbnM6IElPcHRpb25zKSB7XG4gICAgaWYgKHNjaGVtYS4kcmVmKSB7XG4gICAgICBzY2hlbWEgPSB0aGlzLnJlc29sdmVEZWZpbml0aW9uKHNjaGVtYSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVtYS5hbGxPZikge1xuICAgICAgc2NoZW1hID0gdGhpcy5yZXNvbHZlQWxsT2Yoc2NoZW1hLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlQWxsT2YoeyBhbGxPZiwgLi4uYmFzZVNjaGVtYSB9OiBKU09OU2NoZW1hNywgb3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICBpZiAoIWFsbE9mLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYGFsbE9mIGFycmF5IGNhbiBub3QgYmUgZW1wdHkgJHthbGxPZn0uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbE9mLnJlZHVjZSgoYmFzZTogSlNPTlNjaGVtYTcsIHNjaGVtYTogSlNPTlNjaGVtYTcpID0+IHtcbiAgICAgIHNjaGVtYSA9IHRoaXMucmVzb2x2ZVNjaGVtYShzY2hlbWEsIG9wdGlvbnMpO1xuICAgICAgaWYgKGJhc2UucmVxdWlyZWQgJiYgc2NoZW1hLnJlcXVpcmVkKSB7XG4gICAgICAgIGJhc2UucmVxdWlyZWQgPSBbLi4uYmFzZS5yZXF1aXJlZCwgLi4uc2NoZW1hLnJlcXVpcmVkXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjaGVtYS51bmlxdWVJdGVtcykge1xuICAgICAgICBiYXNlLnVuaXF1ZUl0ZW1zID0gc2NoZW1hLnVuaXF1ZUl0ZW1zO1xuICAgICAgfVxuXG4gICAgICAvLyByZXNvbHZlIHRvIG1pbiB2YWx1ZVxuICAgICAgWydtYXhMZW5ndGgnLCAnbWF4aW11bScsICdleGNsdXNpdmVNYXhpbXVtJywgJ21heEl0ZW1zJywgJ21heFByb3BlcnRpZXMnXS5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgIGlmICghaXNFbXB0eShiYXNlW3Byb3BdKSAmJiAhaXNFbXB0eShzY2hlbWFbcHJvcF0pKSB7XG4gICAgICAgICAgYmFzZVtwcm9wXSA9IGJhc2VbcHJvcF0gPCBzY2hlbWFbcHJvcF0gPyBiYXNlW3Byb3BdIDogc2NoZW1hW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gcmVzb2x2ZSB0byBtYXggdmFsdWVcbiAgICAgIFsnbWluTGVuZ3RoJywgJ21pbmltdW0nLCAnZXhjbHVzaXZlTWluaW11bScsICdtaW5JdGVtcycsICdtaW5Qcm9wZXJ0aWVzJ10uZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICBpZiAoIWlzRW1wdHkoYmFzZVtwcm9wXSkgJiYgIWlzRW1wdHkoc2NoZW1hW3Byb3BdKSkge1xuICAgICAgICAgIGJhc2VbcHJvcF0gPSBiYXNlW3Byb3BdID4gc2NoZW1hW3Byb3BdID8gYmFzZVtwcm9wXSA6IHNjaGVtYVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXZlcnNlRGVlcE1lcmdlKGJhc2UsIHNjaGVtYSk7XG4gICAgfSwgYmFzZVNjaGVtYSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVNdWx0aVNjaGVtYShtb2RlOiAnb25lT2YnIHwgJ2FueU9mJywgc2NoZW1hczogSlNPTlNjaGVtYTdbXSwgb3B0aW9uczogSU9wdGlvbnMpOiBGb3JtbHlGaWVsZENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdtdWx0aXNjaGVtYScsXG4gICAgICBmaWVsZEdyb3VwOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnZW51bScsXG4gICAgICAgICAgdGVtcGxhdGVPcHRpb25zOiB7XG4gICAgICAgICAgICBtdWx0aXBsZTogbW9kZSA9PT0gJ2FueU9mJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHNjaGVtYXMubWFwKChzLCBpKSA9PiAoeyBsYWJlbDogcy50aXRsZSwgdmFsdWU6IGkgfSkpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZEdyb3VwOiBzY2hlbWFzLm1hcCgocywgaSkgPT4gKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX3RvRmllbGRDb25maWcocywgeyAuLi5vcHRpb25zLCBhdXRvQ2xlYXI6IHRydWUgfSksXG4gICAgICAgICAgICBoaWRlRXhwcmVzc2lvbjogKG0sIGZzLCBmKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHNlbGVjdEZpZWxkID0gZi5wYXJlbnQucGFyZW50LmZpZWxkR3JvdXBbMF07XG4gICAgICAgICAgICAgIGlmICghc2VsZWN0RmllbGQuZm9ybUNvbnRyb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGYucGFyZW50LmZpZWxkR3JvdXBcbiAgICAgICAgICAgICAgICAgIC5tYXAoKGYsIGkpID0+IFtmLCBpXSBhcyBbRm9ybWx5RmllbGRDb25maWcsIG51bWJlcl0pXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKChbZl0pID0+IGlzRmllbGRWYWxpZChmKSlcbiAgICAgICAgICAgICAgICAgIC5zb3J0KChbZjFdLCBbZjJdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRGaWVsZHMxID0gdG90YWxNYXRjaGVkRmllbGRzKGYxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlZEZpZWxkczIgPSB0b3RhbE1hdGNoZWRGaWVsZHMoZjIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hlZEZpZWxkczEgPT09IG1hdGNoZWRGaWVsZHMyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hlZEZpZWxkczIgPiBtYXRjaGVkRmllbGRzMSA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAubWFwKChbLCBpXSkgPT4gaSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBbdmFsdWUubGVuZ3RoID09PSAwID8gMCA6IHZhbHVlWzBdXTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRWYWx1ZSA9IG1vZGUgPT09ICdhbnlPZicgPyBub3JtYWxpemVkVmFsdWUgOiBub3JtYWxpemVkVmFsdWVbMF07XG4gICAgICAgICAgICAgICAgZGVmaW5lSGlkZGVuUHJvcChzZWxlY3RGaWVsZCwgJ2Zvcm1Db250cm9sJywgbmV3IEZvcm1Db250cm9sKGZvcm1hdHRlZFZhbHVlKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCBjb250cm9sID0gc2VsZWN0RmllbGQuZm9ybUNvbnRyb2w7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmluZGV4T2YoaSkgPT09IC0xIDogY29udHJvbC52YWx1ZSAhPT0gaTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlRGVmaW5pdGlvbihzY2hlbWE6IEpTT05TY2hlbWE3LCBvcHRpb25zOiBJT3B0aW9ucyk6IEpTT05TY2hlbWE3IHtcbiAgICBjb25zdCBbdXJpLCBwb2ludGVyXSA9IHNjaGVtYS4kcmVmLnNwbGl0KCcjLycpO1xuICAgIGlmICh1cmkpIHtcbiAgICAgIHRocm93IEVycm9yKGBSZW1vdGUgc2NoZW1hcyBmb3IgJHtzY2hlbWEuJHJlZn0gbm90IHN1cHBvcnRlZCB5ZXQuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9ICFwb2ludGVyXG4gICAgICA/IG51bGxcbiAgICAgIDogcG9pbnRlci5zcGxpdCgnLycpLnJlZHVjZSgoZGVmLCBwYXRoKSA9PiAoZGVmICYmIGRlZi5oYXNPd25Qcm9wZXJ0eShwYXRoKSA/IGRlZltwYXRoXSA6IG51bGwpLCBvcHRpb25zLnNjaGVtYSk7XG5cbiAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW5ub3QgZmluZCBhIGRlZmluaXRpb24gZm9yICR7c2NoZW1hLiRyZWZ9LmApO1xuICAgIH1cblxuICAgIGlmIChkZWZpbml0aW9uLiRyZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVEZWZpbml0aW9uKGRlZmluaXRpb24sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5kZWZpbml0aW9uLFxuICAgICAgLi4uWyd0aXRsZScsICdkZXNjcmlwdGlvbicsICdkZWZhdWx0J10ucmVkdWNlKChhbm5vdGF0aW9uLCBwKSA9PiB7XG4gICAgICAgIGlmIChzY2hlbWEuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICBhbm5vdGF0aW9uW3BdID0gc2NoZW1hW3BdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFubm90YXRpb247XG4gICAgICB9LCB7fSksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZURlcGVuZGVuY2llcyhzY2hlbWE6IEpTT05TY2hlbWE3KSB7XG4gICAgY29uc3QgZGVwcyA9IHt9O1xuICAgIGNvbnN0IHNjaGVtYURlcHMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHNjaGVtYS5kZXBlbmRlbmNpZXMgfHwge30pLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY3kgPSBzY2hlbWEuZGVwZW5kZW5jaWVzW3Byb3BdIGFzIEpTT05TY2hlbWE3O1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVwZW5kZW5jeSkpIHtcbiAgICAgICAgLy8gUHJvcGVydHkgZGVwZW5kZW5jaWVzXG4gICAgICAgIGRlcGVuZGVuY3kuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgICAgICAgaWYgKCFkZXBzW2RlcF0pIHtcbiAgICAgICAgICAgIGRlcHNbZGVwXSA9IFtwcm9wXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVwc1tkZXBdLnB1c2gocHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNjaGVtYSBkZXBlbmRlbmNpZXNcbiAgICAgICAgc2NoZW1hRGVwc1twcm9wXSA9IGRlcGVuZGVuY3k7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW2RlcHMsIHNjaGVtYURlcHNdO1xuICB9XG5cbiAgcHJpdmF0ZSBndWVzc1R5cGUoc2NoZW1hOiBKU09OU2NoZW1hNykge1xuICAgIGNvbnN0IHR5cGUgPSBzY2hlbWEudHlwZSBhcyBKU09OU2NoZW1hN1R5cGVOYW1lO1xuICAgIGlmICghdHlwZSAmJiBzY2hlbWEucHJvcGVydGllcykge1xuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICBpZiAodHlwZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVbMF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLmxlbmd0aCA9PT0gMiAmJiB0eXBlLmluZGV4T2YoJ251bGwnKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVbdHlwZVswXSA9PT0gJ251bGwnID8gMSA6IDBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRWYWxpZGF0b3IoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnLCBuYW1lOiBzdHJpbmcsIHZhbGlkYXRvcjogKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbikge1xuICAgIGZpZWxkLnZhbGlkYXRvcnMgPSBmaWVsZC52YWxpZGF0b3JzIHx8IHt9O1xuICAgIGZpZWxkLnZhbGlkYXRvcnNbbmFtZV0gPSB2YWxpZGF0b3I7XG4gIH1cblxuICBwcml2YXRlIGlzRW51bShzY2hlbWE6IEpTT05TY2hlbWE3KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHNjaGVtYS5lbnVtIHx8XG4gICAgICAoc2NoZW1hLmFueU9mICYmIHNjaGVtYS5hbnlPZi5ldmVyeShpc0NvbnN0KSkgfHxcbiAgICAgIChzY2hlbWEub25lT2YgJiYgc2NoZW1hLm9uZU9mLmV2ZXJ5KGlzQ29uc3QpKSB8fFxuICAgICAgKHNjaGVtYS51bmlxdWVJdGVtcyAmJiBzY2hlbWEuaXRlbXMgJiYgIUFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSAmJiB0aGlzLmlzRW51bSg8SlNPTlNjaGVtYTc+c2NoZW1hLml0ZW1zKSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0VudW1PcHRpb25zKHNjaGVtYTogSlNPTlNjaGVtYTcpIHtcbiAgICBpZiAoc2NoZW1hLmVudW0pIHtcbiAgICAgIHJldHVybiBzY2hlbWEuZW51bS5tYXAoKHZhbHVlKSA9PiAoeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b0VudW0gPSAoczogSlNPTlNjaGVtYTcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3QnKSA/IHMuY29uc3QgOiBzLmVudW1bMF07XG5cbiAgICAgIHJldHVybiB7IHZhbHVlLCBsYWJlbDogcy50aXRsZSB8fCB2YWx1ZSB9O1xuICAgIH07XG5cbiAgICBpZiAoc2NoZW1hLmFueU9mKSB7XG4gICAgICByZXR1cm4gc2NoZW1hLmFueU9mLm1hcCh0b0VudW0pO1xuICAgIH1cblxuICAgIGlmIChzY2hlbWEub25lT2YpIHtcbiAgICAgIHJldHVybiBzY2hlbWEub25lT2YubWFwKHRvRW51bSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudG9FbnVtT3B0aW9ucyg8SlNPTlNjaGVtYTc+c2NoZW1hLml0ZW1zKTtcbiAgfVxufVxuIl19