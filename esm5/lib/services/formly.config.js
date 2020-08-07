import { __assign, __decorate, __read, __spread } from "tslib";
import { Injectable, InjectionToken } from '@angular/core';
import { reverseDeepMerge, defineHiddenProp } from './../utils';
import * as i0 from "@angular/core";
export var FORMLY_CONFIG = new InjectionToken('FORMLY_CONFIG');
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
    FormlyConfig.ɵprov = i0.ɵɵdefineInjectable({ factory: function FormlyConfig_Factory() { return new FormlyConfig(); }, token: FormlyConfig, providedIn: "root" });
    FormlyConfig = __decorate([
        Injectable({ providedIn: 'root' })
    ], FormlyConfig);
    return FormlyConfig;
}());
export { FormlyConfig };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZm9ybWx5LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBRXpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFlBQVksQ0FBQzs7QUFZaEUsTUFBTSxDQUFDLElBQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUFpQixlQUFlLENBQUMsQ0FBQztBQUVqRjs7R0FFRztBQUVIO0lBQUE7UUFDRSxVQUFLLEdBQW1DLEVBQUUsQ0FBQztRQUMzQyxlQUFVLEdBQXdDLEVBQUUsQ0FBQztRQUNyRCxhQUFRLEdBQXNDLEVBQUUsQ0FBQztRQUNqRCxhQUFRLEdBQTJELEVBQUUsQ0FBQztRQUN0RSxXQUFNLEdBQTJCO1lBQy9CLGlCQUFpQixFQUFFLHNCQUFzQjtZQUN6QyxTQUFTLEVBQVQsVUFBVSxLQUFnQjtnQkFDeEIsT0FBTyxDQUNMLEtBQUssQ0FBQyxXQUFXO29CQUNqQixLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU87b0JBQ3pCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPO3dCQUN4QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzt3QkFDaEUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDN0QsQ0FBQztZQUNKLENBQUM7U0FDRixDQUFDO1FBQ0YsZUFBVSxHQUF3QyxFQUFFLENBQUM7S0FpTHREO0lBL0tDLGdDQUFTLEdBQVQsVUFBVSxNQUFvQjtRQUE5QixpQkFtQkM7UUFs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Qjt1QkF0TkQ7Q0FzTkMsQUFsTUQsSUFrTUM7U0FsTVksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBDb21wb25lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZpZWxkVHlwZSB9IGZyb20gJy4vLi4vdGVtcGxhdGVzL2ZpZWxkLnR5cGUnO1xuaW1wb3J0IHsgcmV2ZXJzZURlZXBNZXJnZSwgZGVmaW5lSGlkZGVuUHJvcCB9IGZyb20gJy4vLi4vdXRpbHMnO1xuaW1wb3J0IHtcbiAgRm9ybWx5RmllbGRDb25maWcsXG4gIEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUsXG4gIENvbmZpZ09wdGlvbixcbiAgVHlwZU9wdGlvbixcbiAgVmFsaWRhdG9yT3B0aW9uLFxuICBXcmFwcGVyT3B0aW9uLFxuICBGb3JtbHlFeHRlbnNpb24sXG4gIFZhbGlkYXRpb25NZXNzYWdlT3B0aW9uLFxufSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgRk9STUxZX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxDb25maWdPcHRpb25bXT4oJ0ZPUk1MWV9DT05GSUcnKTtcblxuLyoqXG4gKiBNYWludGFpbnMgbGlzdCBvZiBmb3JtbHkgZmllbGQgZGlyZWN0aXZlIHR5cGVzLiBUaGlzIGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIG5ldyBmaWVsZCB0ZW1wbGF0ZXMuXG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRm9ybWx5Q29uZmlnIHtcbiAgdHlwZXM6IHsgW25hbWU6IHN0cmluZ106IFR5cGVPcHRpb24gfSA9IHt9O1xuICB2YWxpZGF0b3JzOiB7IFtuYW1lOiBzdHJpbmddOiBWYWxpZGF0b3JPcHRpb24gfSA9IHt9O1xuICB3cmFwcGVyczogeyBbbmFtZTogc3RyaW5nXTogV3JhcHBlck9wdGlvbiB9ID0ge307XG4gIG1lc3NhZ2VzOiB7IFtuYW1lOiBzdHJpbmddOiBWYWxpZGF0aW9uTWVzc2FnZU9wdGlvblsnbWVzc2FnZSddIH0gPSB7fTtcbiAgZXh0cmFzOiBDb25maWdPcHRpb25bJ2V4dHJhcyddID0ge1xuICAgIGNoZWNrRXhwcmVzc2lvbk9uOiAnY2hhbmdlRGV0ZWN0aW9uQ2hlY2snLFxuICAgIHNob3dFcnJvcihmaWVsZDogRmllbGRUeXBlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBmaWVsZC5mb3JtQ29udHJvbCAmJlxuICAgICAgICBmaWVsZC5mb3JtQ29udHJvbC5pbnZhbGlkICYmXG4gICAgICAgIChmaWVsZC5mb3JtQ29udHJvbC50b3VjaGVkIHx8XG4gICAgICAgICAgKGZpZWxkLm9wdGlvbnMucGFyZW50Rm9ybSAmJiBmaWVsZC5vcHRpb25zLnBhcmVudEZvcm0uc3VibWl0dGVkKSB8fFxuICAgICAgICAgICEhKGZpZWxkLmZpZWxkLnZhbGlkYXRpb24gJiYgZmllbGQuZmllbGQudmFsaWRhdGlvbi5zaG93KSlcbiAgICAgICk7XG4gICAgfSxcbiAgfTtcbiAgZXh0ZW5zaW9uczogeyBbbmFtZTogc3RyaW5nXTogRm9ybWx5RXh0ZW5zaW9uIH0gPSB7fTtcblxuICBhZGRDb25maWcoY29uZmlnOiBDb25maWdPcHRpb24pIHtcbiAgICBpZiAoY29uZmlnLnR5cGVzKSB7XG4gICAgICBjb25maWcudHlwZXMuZm9yRWFjaCgodHlwZSkgPT4gdGhpcy5zZXRUeXBlKHR5cGUpKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy52YWxpZGF0b3JzKSB7XG4gICAgICBjb25maWcudmFsaWRhdG9ycy5mb3JFYWNoKCh2YWxpZGF0b3IpID0+IHRoaXMuc2V0VmFsaWRhdG9yKHZhbGlkYXRvcikpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLndyYXBwZXJzKSB7XG4gICAgICBjb25maWcud3JhcHBlcnMuZm9yRWFjaCgod3JhcHBlcikgPT4gdGhpcy5zZXRXcmFwcGVyKHdyYXBwZXIpKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy52YWxpZGF0aW9uTWVzc2FnZXMpIHtcbiAgICAgIGNvbmZpZy52YWxpZGF0aW9uTWVzc2FnZXMuZm9yRWFjaCgodmFsaWRhdGlvbikgPT4gdGhpcy5hZGRWYWxpZGF0b3JNZXNzYWdlKHZhbGlkYXRpb24ubmFtZSwgdmFsaWRhdGlvbi5tZXNzYWdlKSk7XG4gICAgfVxuICAgIGlmIChjb25maWcuZXh0ZW5zaW9ucykge1xuICAgICAgY29uZmlnLmV4dGVuc2lvbnMuZm9yRWFjaCgoYykgPT4gKHRoaXMuZXh0ZW5zaW9uc1tjLm5hbWVdID0gYy5leHRlbnNpb24pKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5leHRyYXMpIHtcbiAgICAgIHRoaXMuZXh0cmFzID0geyAuLi50aGlzLmV4dHJhcywgLi4uY29uZmlnLmV4dHJhcyB9O1xuICAgIH1cbiAgfVxuXG4gIHNldFR5cGUob3B0aW9uczogVHlwZU9wdGlvbiB8IFR5cGVPcHRpb25bXSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4gdGhpcy5zZXRUeXBlKG9wdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXRoaXMudHlwZXNbb3B0aW9ucy5uYW1lXSkge1xuICAgICAgICB0aGlzLnR5cGVzW29wdGlvbnMubmFtZV0gPSA8VHlwZU9wdGlvbj57IG5hbWU6IG9wdGlvbnMubmFtZSB9O1xuICAgICAgfVxuXG4gICAgICBbJ2NvbXBvbmVudCcsICdleHRlbmRzJywgJ2RlZmF1bHRPcHRpb25zJ10uZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHRoaXMudHlwZXNbb3B0aW9ucy5uYW1lXVtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAob3B0aW9ucy53cmFwcGVycykge1xuICAgICAgICBvcHRpb25zLndyYXBwZXJzLmZvckVhY2goKHdyYXBwZXIpID0+IHRoaXMuc2V0VHlwZVdyYXBwZXIob3B0aW9ucy5uYW1lLCB3cmFwcGVyKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0VHlwZShuYW1lOiBzdHJpbmcpOiBUeXBlT3B0aW9uIHtcbiAgICBpZiAoIXRoaXMudHlwZXNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFtGb3JtbHkgRXJyb3JdIFRoZSB0eXBlIFwiJHtuYW1lfVwiIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IGlzIHJlZ2lzdGVyZWQgdGhyb3VnaCB0aGUgRm9ybWx5TW9kdWxlIGRlY2xhcmF0aW9uLmAsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMubWVyZ2VFeHRlbmRlZFR5cGUobmFtZSk7XG5cbiAgICByZXR1cm4gdGhpcy50eXBlc1tuYW1lXTtcbiAgfVxuXG4gIGdldE1lcmdlZEZpZWxkKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZyA9IHt9KTogYW55IHtcbiAgICBjb25zdCB0eXBlID0gdGhpcy5nZXRUeXBlKGZpZWxkLnR5cGUpO1xuICAgIGlmICh0eXBlLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICByZXZlcnNlRGVlcE1lcmdlKGZpZWxkLCB0eXBlLmRlZmF1bHRPcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zdCBleHRlbmREZWZhdWx0cyA9IHR5cGUuZXh0ZW5kcyAmJiB0aGlzLmdldFR5cGUodHlwZS5leHRlbmRzKS5kZWZhdWx0T3B0aW9ucztcbiAgICBpZiAoZXh0ZW5kRGVmYXVsdHMpIHtcbiAgICAgIHJldmVyc2VEZWVwTWVyZ2UoZmllbGQsIGV4dGVuZERlZmF1bHRzKTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQgJiYgZmllbGQub3B0aW9uc1R5cGVzKSB7XG4gICAgICBmaWVsZC5vcHRpb25zVHlwZXMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0gdGhpcy5nZXRUeXBlKG9wdGlvbikuZGVmYXVsdE9wdGlvbnM7XG4gICAgICAgIGlmIChkZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgIHJldmVyc2VEZWVwTWVyZ2UoZmllbGQsIGRlZmF1bHRPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy5yZXNvbHZlRmllbGRUeXBlUmVmKGZpZWxkKTtcbiAgICBpZiAoY29tcG9uZW50UmVmICYmIGNvbXBvbmVudFJlZi5pbnN0YW5jZSAmJiBjb21wb25lbnRSZWYuaW5zdGFuY2UuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHJldmVyc2VEZWVwTWVyZ2UoZmllbGQsIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5kZWZhdWx0T3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWVsZC53cmFwcGVycyAmJiB0eXBlLndyYXBwZXJzKSB7XG4gICAgICBmaWVsZC53cmFwcGVycyA9IFsuLi50eXBlLndyYXBwZXJzXTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHJlc29sdmVGaWVsZFR5cGVSZWYoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUgPSB7fSk6IENvbXBvbmVudFJlZjxGaWVsZFR5cGU+IHtcbiAgICBpZiAoIWZpZWxkLnR5cGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLmdldFR5cGUoZmllbGQudHlwZSk7XG4gICAgaWYgKCF0eXBlLmNvbXBvbmVudCB8fCB0eXBlWydfY29tcG9uZW50UmVmJ10pIHtcbiAgICAgIHJldHVybiB0eXBlWydfY29tcG9uZW50UmVmJ107XG4gICAgfVxuXG4gICAgY29uc3QgeyBfcmVzb2x2ZXIsIF9pbmplY3RvciB9ID0gZmllbGQub3B0aW9ucztcbiAgICBpZiAoIV9yZXNvbHZlciB8fCAhX2luamVjdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBkZWZpbmVIaWRkZW5Qcm9wKFxuICAgICAgdHlwZSxcbiAgICAgICdfY29tcG9uZW50UmVmJyxcbiAgICAgIF9yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeTxGaWVsZFR5cGU+KHR5cGUuY29tcG9uZW50KS5jcmVhdGUoX2luamVjdG9yKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHR5cGVbJ19jb21wb25lbnRSZWYnXTtcbiAgfVxuXG4gIHNldFdyYXBwZXIob3B0aW9uczogV3JhcHBlck9wdGlvbikge1xuICAgIHRoaXMud3JhcHBlcnNbb3B0aW9ucy5uYW1lXSA9IG9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMudHlwZXMpIHtcbiAgICAgIG9wdGlvbnMudHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFR5cGVXcmFwcGVyKHR5cGUsIG9wdGlvbnMubmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRXcmFwcGVyKG5hbWU6IHN0cmluZyk6IFdyYXBwZXJPcHRpb24ge1xuICAgIGlmICghdGhpcy53cmFwcGVyc1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgW0Zvcm1seSBFcnJvcl0gVGhlIHdyYXBwZXIgXCIke25hbWV9XCIgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgaXMgcmVnaXN0ZXJlZCB0aHJvdWdoIHRoZSBGb3JtbHlNb2R1bGUgZGVjbGFyYXRpb24uYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcnNbbmFtZV07XG4gIH1cblxuICBzZXRUeXBlV3JhcHBlcih0eXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy50eXBlc1t0eXBlXSkge1xuICAgICAgdGhpcy50eXBlc1t0eXBlXSA9IDxUeXBlT3B0aW9uPnt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMudHlwZXNbdHlwZV0ud3JhcHBlcnMpIHtcbiAgICAgIHRoaXMudHlwZXNbdHlwZV0ud3JhcHBlcnMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZXNbdHlwZV0ud3JhcHBlcnMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMudHlwZXNbdHlwZV0ud3JhcHBlcnMucHVzaChuYW1lKTtcbiAgICB9XG4gIH1cblxuICBzZXRWYWxpZGF0b3Iob3B0aW9uczogVmFsaWRhdG9yT3B0aW9uKSB7XG4gICAgdGhpcy52YWxpZGF0b3JzW29wdGlvbnMubmFtZV0gPSBvcHRpb25zO1xuICB9XG5cbiAgZ2V0VmFsaWRhdG9yKG5hbWU6IHN0cmluZyk6IFZhbGlkYXRvck9wdGlvbiB7XG4gICAgaWYgKCF0aGlzLnZhbGlkYXRvcnNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFtGb3JtbHkgRXJyb3JdIFRoZSB2YWxpZGF0b3IgXCIke25hbWV9XCIgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgaXMgcmVnaXN0ZXJlZCB0aHJvdWdoIHRoZSBGb3JtbHlNb2R1bGUgZGVjbGFyYXRpb24uYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yc1tuYW1lXTtcbiAgfVxuXG4gIGFkZFZhbGlkYXRvck1lc3NhZ2UobmFtZTogc3RyaW5nLCBtZXNzYWdlOiBWYWxpZGF0aW9uTWVzc2FnZU9wdGlvblsnbWVzc2FnZSddKSB7XG4gICAgdGhpcy5tZXNzYWdlc1tuYW1lXSA9IG1lc3NhZ2U7XG4gIH1cblxuICBnZXRWYWxpZGF0b3JNZXNzYWdlKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzW25hbWVdO1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZUV4dGVuZGVkVHlwZShuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMudHlwZXNbbmFtZV0uZXh0ZW5kcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV4dGVuZGVkVHlwZSA9IHRoaXMuZ2V0VHlwZSh0aGlzLnR5cGVzW25hbWVdLmV4dGVuZHMpO1xuICAgIGlmICghdGhpcy50eXBlc1tuYW1lXS5jb21wb25lbnQpIHtcbiAgICAgIHRoaXMudHlwZXNbbmFtZV0uY29tcG9uZW50ID0gZXh0ZW5kZWRUeXBlLmNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudHlwZXNbbmFtZV0ud3JhcHBlcnMpIHtcbiAgICAgIHRoaXMudHlwZXNbbmFtZV0ud3JhcHBlcnMgPSBleHRlbmRlZFR5cGUud3JhcHBlcnM7XG4gICAgfVxuICB9XG59XG4iXX0=