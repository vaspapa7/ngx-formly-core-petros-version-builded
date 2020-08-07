import { __assign, __read, __rest, __spread, __values } from "tslib";
import { Validators } from '@angular/forms';
import { FORMLY_VALIDATORS, defineHiddenProp, isPromise, observe, clone } from '../../utils';
import { updateValidity } from '../field-form/utils';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export { FieldValidationExtension };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtdmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5zaW9ucy9maWVsZC12YWxpZGF0aW9uL2ZpZWxkLXZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBbUIsVUFBVSxFQUFlLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxvQkFBb0I7QUFDcEI7SUFDRSxrQ0FBb0IsTUFBb0I7UUFBcEIsV0FBTSxHQUFOLE1BQU0sQ0FBYztJQUFHLENBQUM7SUFFNUMsNkNBQVUsR0FBVixVQUFXLEtBQTZCO1FBQ3RDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTyxzREFBbUIsR0FBM0IsVUFBNEIsS0FBNkIsRUFBRSxJQUFzQzs7UUFBakcsaUJBZUM7UUFkQyxJQUFNLFVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoRixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7O2dCQUNmLEtBQTRCLElBQUEsS0FBQSxTQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7b0JBQWpELElBQU0sYUFBYSxXQUFBO29CQUN0QixhQUFhLEtBQUssWUFBWTt3QkFDNUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQWYsVUFBVSxXQUFTLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxHQUN4RixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO2lCQUMvRjs7Ozs7Ozs7O1NBQ0Y7UUFFRCxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sK0RBQTRCLEdBQXBDLFVBQXFDLEtBQTZCO1FBQ2hFLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQzVCLE9BQUEsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQUMsRUFBNkI7b0JBQTNCLDhCQUFZLEVBQUUsNEJBQVc7Z0JBQ25FLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQUMsQ0FBQztnQkFDakQsSUFBSSxZQUFZLElBQUksSUFBSSxJQUFJLFlBQVksS0FBSyxLQUFLLEVBQUU7b0JBQ2xELFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3RCO2dCQUNELElBQUksQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtvQkFDckMsY0FBYyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDbkM7WUFDSCxDQUFDLENBQUM7UUFSRixDQVFFLENBQ0gsQ0FBQztRQUVGLE9BQU8sVUFBQyxPQUF3QjtZQUM5QixJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMzQixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUN2QixVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUE7Z0JBQ3RCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLFFBQVEsR0FBRyxFQUFFO29CQUNYLEtBQUssVUFBVTt3QkFDYixPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3RDLEtBQUssU0FBUzt3QkFDWixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVDLEtBQUssV0FBVzt3QkFDZCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlDLEtBQUssV0FBVzt3QkFDZCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlDLEtBQUssS0FBSzt3QkFDUixPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3hDLEtBQUssS0FBSzt3QkFDUixPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3pDO1lBQ0gsQ0FBQyxFQWhCdUIsQ0FnQnZCLENBQUMsQ0FDSCxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLG9EQUFpQixHQUF6QixVQUEwQixLQUE2QixFQUFFLFNBQWMsRUFBRSxhQUFzQjtRQUEvRixpQkE2Q0M7UUE1Q0MsSUFBSSxlQUFlLEdBQW9CLElBQUksQ0FBQztRQUM1QyxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNqQyxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ25ELGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUNyQixlQUFlLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7YUFDN0M7U0FDRjtRQUVELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDakQsSUFBQSxpQ0FBVSxFQUFFLDJDQUFVLENBQWU7WUFDN0MsZUFBZSxHQUFHO2dCQUNoQixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSTthQUMxRCxDQUFDO1NBQ0g7UUFFRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFVBQVUsRUFBRTtZQUNuQyxlQUFlLEdBQUc7Z0JBQ2hCLElBQUksRUFBRSxhQUFhO2dCQUNuQixVQUFVLEVBQUUsU0FBUzthQUN0QixDQUFDO1NBQ0g7UUFFRCxPQUFPLFVBQUMsT0FBd0I7WUFDOUIsSUFBSSxNQUFNLEdBQVEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3JCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7aUJBQzlFO2dCQUVELElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN4QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDLEVBQWpELENBQWlELENBQUMsQ0FBQyxDQUFDO2lCQUNuRjtnQkFFRCxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNuQjtZQUVELE9BQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTyxvREFBaUIsR0FBekIsVUFBMEIsS0FBNkIsRUFBRSxPQUFPLEVBQUUsT0FBd0I7UUFDeEYsaUVBQWlFO1FBQ2pFLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5DLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU8sK0NBQVksR0FBcEIsVUFBcUIsS0FBNkIsRUFBRSxNQUFXLEVBQUUsRUFBa0M7O1lBQWhDLGNBQUksRUFBRSxvQkFBTztRQUM5RSxJQUFJLE9BQU8sTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMvQixNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFHLEdBQUMsSUFBSSxJQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUUsQ0FBQztTQUMvRDtRQUVELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDL0IsSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFcEcsSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFOUYsSUFBTSxXQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3RFLElBQUksV0FBUyxFQUFFO2dCQUNiLElBQU0saUJBQXFDLEVBQW5DLDBCQUFTLEVBQUUsZ0NBQXdCLENBQUM7Z0JBQzVDLFdBQVMsQ0FBQyxTQUFTLHVCQUFNLENBQUMsV0FBUyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsZ0JBQUcsSUFBSSxJQUFHLElBQUksT0FBRyxDQUFDO2dCQUVuRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzlCLElBQTZDLDZCQUFzQixFQUEzRCxTQUFNLEVBQU4saUJBQWdCLEVBQUUsaUVBQXlDLENBQUM7b0JBQ3BFLFdBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNsRixDQUFDLENBQUM7YUFDSDtTQUNGO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0FBQyxBQWxKRCxJQWtKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZvcm1seUNvbmZpZyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1seS5jb25maWcnO1xuaW1wb3J0IHsgRm9ybWx5RXh0ZW5zaW9uLCBWYWxpZGF0b3JPcHRpb24sIEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUgfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBWYWxpZGF0b3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEZPUk1MWV9WQUxJREFUT1JTLCBkZWZpbmVIaWRkZW5Qcm9wLCBpc1Byb21pc2UsIG9ic2VydmUsIGNsb25lIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgdXBkYXRlVmFsaWRpdHkgfSBmcm9tICcuLi9maWVsZC1mb3JtL3V0aWxzJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogQGV4cGVyaW1lbnRhbCAqL1xuZXhwb3J0IGNsYXNzIEZpZWxkVmFsaWRhdGlvbkV4dGVuc2lvbiBpbXBsZW1lbnRzIEZvcm1seUV4dGVuc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBGb3JtbHlDb25maWcpIHt9XG5cbiAgb25Qb3B1bGF0ZShmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSkge1xuICAgIHRoaXMuaW5pdEZpZWxkVmFsaWRhdGlvbihmaWVsZCwgJ3ZhbGlkYXRvcnMnKTtcbiAgICB0aGlzLmluaXRGaWVsZFZhbGlkYXRpb24oZmllbGQsICdhc3luY1ZhbGlkYXRvcnMnKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEZpZWxkVmFsaWRhdGlvbihmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSwgdHlwZTogJ3ZhbGlkYXRvcnMnIHwgJ2FzeW5jVmFsaWRhdG9ycycpIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gW107XG4gICAgaWYgKHR5cGUgPT09ICd2YWxpZGF0b3JzJyAmJiAhKGZpZWxkLmhhc093blByb3BlcnR5KCdmaWVsZEdyb3VwJykgJiYgIWZpZWxkLmtleSkpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLmdldFByZWRlZmluZWRGaWVsZFZhbGlkYXRpb24oZmllbGQpKTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGRbdHlwZV0pIHtcbiAgICAgIGZvciAoY29uc3QgdmFsaWRhdG9yTmFtZSBvZiBPYmplY3Qua2V5cyhmaWVsZFt0eXBlXSkpIHtcbiAgICAgICAgdmFsaWRhdG9yTmFtZSA9PT0gJ3ZhbGlkYXRpb24nXG4gICAgICAgICAgPyB2YWxpZGF0b3JzLnB1c2goLi4uZmllbGRbdHlwZV0udmFsaWRhdGlvbi5tYXAoKHYpID0+IHRoaXMud3JhcE5nVmFsaWRhdG9yRm4oZmllbGQsIHYpKSlcbiAgICAgICAgICA6IHZhbGlkYXRvcnMucHVzaCh0aGlzLndyYXBOZ1ZhbGlkYXRvckZuKGZpZWxkLCBmaWVsZFt0eXBlXVt2YWxpZGF0b3JOYW1lXSwgdmFsaWRhdG9yTmFtZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluZUhpZGRlblByb3AoZmllbGQsICdfJyArIHR5cGUsIHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcmVkZWZpbmVkRmllbGRWYWxpZGF0aW9uKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlKTogVmFsaWRhdG9yRm4ge1xuICAgIGxldCBWQUxJREFUT1JTID0gW107XG4gICAgRk9STUxZX1ZBTElEQVRPUlMuZm9yRWFjaCgob3B0KSA9PlxuICAgICAgb2JzZXJ2ZShmaWVsZCwgWyd0ZW1wbGF0ZU9wdGlvbnMnLCBvcHRdLCAoeyBjdXJyZW50VmFsdWUsIGZpcnN0Q2hhbmdlIH0pID0+IHtcbiAgICAgICAgVkFMSURBVE9SUyA9IFZBTElEQVRPUlMuZmlsdGVyKChvKSA9PiBvICE9PSBvcHQpO1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlICE9IG51bGwgJiYgY3VycmVudFZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIFZBTElEQVRPUlMucHVzaChvcHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZmlyc3RDaGFuZ2UgJiYgZmllbGQuZm9ybUNvbnRyb2wpIHtcbiAgICAgICAgICB1cGRhdGVWYWxpZGl0eShmaWVsZC5mb3JtQ29udHJvbCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgaWYgKFZBTElEQVRPUlMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gVmFsaWRhdG9ycy5jb21wb3NlKFxuICAgICAgICBWQUxJREFUT1JTLm1hcCgob3B0KSA9PiAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZC50ZW1wbGF0ZU9wdGlvbnNbb3B0XTtcbiAgICAgICAgICBzd2l0Y2ggKG9wdCkge1xuICAgICAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICAgICAgICByZXR1cm4gVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKTtcbiAgICAgICAgICAgIGNhc2UgJ3BhdHRlcm4nOlxuICAgICAgICAgICAgICByZXR1cm4gVmFsaWRhdG9ycy5wYXR0ZXJuKHZhbHVlKShjb250cm9sKTtcbiAgICAgICAgICAgIGNhc2UgJ21pbkxlbmd0aCc6XG4gICAgICAgICAgICAgIHJldHVybiBWYWxpZGF0b3JzLm1pbkxlbmd0aCh2YWx1ZSkoY29udHJvbCk7XG4gICAgICAgICAgICBjYXNlICdtYXhMZW5ndGgnOlxuICAgICAgICAgICAgICByZXR1cm4gVmFsaWRhdG9ycy5tYXhMZW5ndGgodmFsdWUpKGNvbnRyb2wpO1xuICAgICAgICAgICAgY2FzZSAnbWluJzpcbiAgICAgICAgICAgICAgcmV0dXJuIFZhbGlkYXRvcnMubWluKHZhbHVlKShjb250cm9sKTtcbiAgICAgICAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgICAgICAgIHJldHVybiBWYWxpZGF0b3JzLm1heCh2YWx1ZSkoY29udHJvbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICkoY29udHJvbCk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgd3JhcE5nVmFsaWRhdG9yRm4oZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUsIHZhbGlkYXRvcjogYW55LCB2YWxpZGF0b3JOYW1lPzogc3RyaW5nKSB7XG4gICAgbGV0IHZhbGlkYXRvck9wdGlvbjogVmFsaWRhdG9yT3B0aW9uID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIHZhbGlkYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbGlkYXRvck9wdGlvbiA9IGNsb25lKHRoaXMuY29uZmlnLmdldFZhbGlkYXRvcih2YWxpZGF0b3IpKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbGlkYXRvciA9PT0gJ29iamVjdCcgJiYgdmFsaWRhdG9yLm5hbWUpIHtcbiAgICAgIHZhbGlkYXRvck9wdGlvbiA9IGNsb25lKHRoaXMuY29uZmlnLmdldFZhbGlkYXRvcih2YWxpZGF0b3IubmFtZSkpO1xuICAgICAgaWYgKHZhbGlkYXRvci5vcHRpb25zKSB7XG4gICAgICAgIHZhbGlkYXRvck9wdGlvbi5vcHRpb25zID0gdmFsaWRhdG9yLm9wdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09ICdvYmplY3QnICYmIHZhbGlkYXRvci5leHByZXNzaW9uKSB7XG4gICAgICBjb25zdCB7IGV4cHJlc3Npb24sIC4uLm9wdGlvbnMgfSA9IHZhbGlkYXRvcjtcbiAgICAgIHZhbGlkYXRvck9wdGlvbiA9IHtcbiAgICAgICAgbmFtZTogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgdmFsaWRhdGlvbjogZXhwcmVzc2lvbixcbiAgICAgICAgb3B0aW9uczogT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID4gMCA/IG9wdGlvbnMgOiBudWxsLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbGlkYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsaWRhdG9yT3B0aW9uID0ge1xuICAgICAgICBuYW1lOiB2YWxpZGF0b3JOYW1lLFxuICAgICAgICB2YWxpZGF0aW9uOiB2YWxpZGF0b3IsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBsZXQgZXJyb3JzOiBhbnkgPSB2YWxpZGF0b3JPcHRpb24udmFsaWRhdGlvbihjb250cm9sLCBmaWVsZCwgdmFsaWRhdG9yT3B0aW9uLm9wdGlvbnMpO1xuICAgICAgaWYgKHZhbGlkYXRvck5hbWUpIHtcbiAgICAgICAgaWYgKGlzUHJvbWlzZShlcnJvcnMpKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ycy50aGVuKCh2KSA9PiB0aGlzLmhhbmRsZUFzeW5jUmVzdWx0KGZpZWxkLCB2LCB2YWxpZGF0b3JPcHRpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc09ic2VydmFibGUoZXJyb3JzKSkge1xuICAgICAgICAgIHJldHVybiBlcnJvcnMucGlwZShtYXAoKHYpID0+IHRoaXMuaGFuZGxlQXN5bmNSZXN1bHQoZmllbGQsIHYsIHZhbGlkYXRvck9wdGlvbikpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9ycyA9ICEhZXJyb3JzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXN1bHQoZmllbGQsIGVycm9ycywgdmFsaWRhdG9yT3B0aW9uKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVBc3luY1Jlc3VsdChmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSwgaXNWYWxpZCwgb3B0aW9uczogVmFsaWRhdG9yT3B0aW9uKSB7XG4gICAgLy8gd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTMyMDBcbiAgICBmaWVsZC5vcHRpb25zLmRldGVjdENoYW5nZXMoZmllbGQpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVzdWx0KGZpZWxkLCAhIWlzVmFsaWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVSZXN1bHQoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUsIGVycm9yczogYW55LCB7IG5hbWUsIG9wdGlvbnMgfTogVmFsaWRhdG9yT3B0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBlcnJvcnMgPT09ICdib29sZWFuJykge1xuICAgICAgZXJyb3JzID0gZXJyb3JzID8gbnVsbCA6IHsgW25hbWVdOiBvcHRpb25zID8gb3B0aW9ucyA6IHRydWUgfTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJsID0gZmllbGQuZm9ybUNvbnRyb2w7XG4gICAgY3RybCAmJiBjdHJsWydfY2hpbGRyZW5FcnJvcnMnXSAmJiBjdHJsWydfY2hpbGRyZW5FcnJvcnMnXVtuYW1lXSAmJiBjdHJsWydfY2hpbGRyZW5FcnJvcnMnXVtuYW1lXSgpO1xuXG4gICAgaWYgKGN0cmwgJiYgZXJyb3JzICYmIGVycm9yc1tuYW1lXSkge1xuICAgICAgY29uc3QgZXJyb3JQYXRoID0gZXJyb3JzW25hbWVdLmVycm9yUGF0aCA/IGVycm9yc1tuYW1lXS5lcnJvclBhdGggOiAob3B0aW9ucyB8fCB7fSkuZXJyb3JQYXRoO1xuXG4gICAgICBjb25zdCBjaGlsZEN0cmwgPSBlcnJvclBhdGggPyBmaWVsZC5mb3JtQ29udHJvbC5nZXQoZXJyb3JQYXRoKSA6IG51bGw7XG4gICAgICBpZiAoY2hpbGRDdHJsKSB7XG4gICAgICAgIGNvbnN0IHsgZXJyb3JQYXRoLCAuLi5vcHRzIH0gPSBlcnJvcnNbbmFtZV07XG4gICAgICAgIGNoaWxkQ3RybC5zZXRFcnJvcnMoeyAuLi4oY2hpbGRDdHJsLmVycm9ycyB8fCB7fSksIFtuYW1lXTogb3B0cyB9KTtcblxuICAgICAgICAhY3RybFsnX2NoaWxkcmVuRXJyb3JzJ10gJiYgZGVmaW5lSGlkZGVuUHJvcChjdHJsLCAnX2NoaWxkcmVuRXJyb3JzJywge30pO1xuICAgICAgICBjdHJsWydfY2hpbGRyZW5FcnJvcnMnXVtuYW1lXSA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IFtuYW1lXTogdG9EZWxldGUsIC4uLmNoaWxkRXJyb3JzIH0gPSBjaGlsZEN0cmwuZXJyb3JzIHx8IHt9O1xuICAgICAgICAgIGNoaWxkQ3RybC5zZXRFcnJvcnMoT2JqZWN0LmtleXMoY2hpbGRFcnJvcnMpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBjaGlsZEVycm9ycyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxufVxuIl19