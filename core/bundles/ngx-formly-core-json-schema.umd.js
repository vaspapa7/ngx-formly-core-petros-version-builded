(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@ngx-formly/core')) :
    typeof define === 'function' && define.amd ? define('@ngx-formly/core/json-schema', ['exports', '@angular/core', '@angular/forms', '@ngx-formly/core'], factory) :
    (global = global || self, factory((global['ngx-formly'] = global['ngx-formly'] || {}, global['ngx-formly'].core = global['ngx-formly'].core || {}, global['ngx-formly'].core['json-schema'] = {}), global.ng.core, global.ng.forms, global['ngx-formly'].core));
}(this, (function (exports, core, forms, core$1) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    function __exportStar(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    function isEmpty(v) {
        return v === '' || v == null;
    }
    function isConst(schema) {
        return schema.hasOwnProperty('const') || (schema.enum && schema.enum.length === 1);
    }
    function totalMatchedFields(field) {
        if (field.key && !field.fieldGroup) {
            return core$1.ɵgetFieldInitialValue(field) !== undefined ? 1 : 0;
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
                field = core$1.ɵreverseDeepMerge(schema['widget'].formlyConfig, field);
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
                return core$1.ɵreverseDeepMerge(base, schema);
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
                                    core$1.ɵdefineHiddenProp(selectField, 'formControl', new forms.FormControl(formattedValue));
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
        FormlyJsonschema.ɵprov = core.ɵɵdefineInjectable({ factory: function FormlyJsonschema_Factory() { return new FormlyJsonschema(); }, token: FormlyJsonschema, providedIn: "root" });
        FormlyJsonschema = __decorate([
            core.Injectable({ providedIn: 'root' })
        ], FormlyJsonschema);
        return FormlyJsonschema;
    }());

    exports.FormlyJsonschema = FormlyJsonschema;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-formly-core-json-schema.umd.js.map
