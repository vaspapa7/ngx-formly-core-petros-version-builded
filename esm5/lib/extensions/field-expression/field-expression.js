import { __read, __spread, __values } from "tslib";
import { isObject, isNil, isFunction, defineHiddenProp, observe, reduceFormUpdateValidityCalls } from '../../utils';
import { evalExpression, evalStringExpression } from './utils';
import { Observable } from 'rxjs';
import { unregisterControl, registerControl, updateValidity } from '../field-form/utils';
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
export { FieldExpressionExtension };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5zaW9ucy9maWVsZC1leHByZXNzaW9uL2ZpZWxkLWV4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEgsT0FBTyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVoRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXpGLG9CQUFvQjtBQUNwQjtJQUFBO0lBeUxBLENBQUM7SUF4TEMsNkNBQVUsR0FBVixVQUFXLEtBQTZCOztRQUF4QyxpQkFtREM7UUFsREMsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUVELHlCQUF5QjtRQUN6QixnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsb0JBQW9CLElBQUksRUFBRSxDQUFDO1FBRTlELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFDLEVBQTZCO2dCQUEzQiw4QkFBWSxFQUFFLDRCQUFXO1lBQ25ELGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxFQUFFO2dCQUMxRCxLQUFLLENBQUMs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Q0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO2dCQUNqRixPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ2pEO1NBQ0Y7SUFDSCxDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBekxELElBeUxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9ybWx5RmllbGRDb25maWcsIEZvcm1seVZhbHVlQ2hhbmdlRXZlbnQsIEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUgfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuaW1wb3J0IHsgaXNPYmplY3QsIGlzTmlsLCBpc0Z1bmN0aW9uLCBkZWZpbmVIaWRkZW5Qcm9wLCBvYnNlcnZlLCByZWR1Y2VGb3JtVXBkYXRlVmFsaWRpdHlDYWxscyB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IGV2YWxFeHByZXNzaW9uLCBldmFsU3RyaW5nRXhwcmVzc2lvbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBGb3JtbHlFeHRlbnNpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuaW1wb3J0IHsgdW5yZWdpc3RlckNvbnRyb2wsIHJlZ2lzdGVyQ29udHJvbCwgdXBkYXRlVmFsaWRpdHkgfSBmcm9tICcuLi9maWVsZC1mb3JtL3V0aWxzJztcblxuLyoqIEBleHBlcmltZW50YWwgKi9cbmV4cG9ydCBjbGFzcyBGaWVsZEV4cHJlc3Npb25FeHRlbnNpb24gaW1wbGVtZW50cyBGb3JtbHlFeHRlbnNpb24ge1xuICBvblBvcHVsYXRlKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlKSB7XG4gICAgaWYgKGZpZWxkLl9leHByZXNzaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNhY2hlIGJ1aWx0IGV4cHJlc3Npb25cbiAgICBkZWZpbmVIaWRkZW5Qcm9wKGZpZWxkLCAnX2V4cHJlc3Npb25zJywge30pO1xuICAgIGZpZWxkLmV4cHJlc3Npb25Qcm9wZXJ0aWVzID0gZmllbGQuZXhwcmVzc2lvblByb3BlcnRpZXMgfHwge307XG5cbiAgICBvYnNlcnZlKGZpZWxkLCBbJ2hpZGUnXSwgKHsgY3VycmVudFZhbHVlLCBmaXJzdENoYW5nZSB9KSA9PiB7XG4gICAgICBkZWZpbmVIaWRkZW5Qcm9wKGZpZWxkLCAnX2hpZGUnLCAhIWN1cnJlbnRWYWx1ZSk7XG4gICAgICBpZiAoIWZpcnN0Q2hhbmdlIHx8IChmaXJzdENoYW5nZSAmJiBjdXJyZW50VmFsdWUgPT09IHRydWUpKSB7XG4gICAgICAgIGZpZWxkLnRlbXBsYXRlT3B0aW9ucy5oaWRkZW4gPSBjdXJyZW50VmFsdWU7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMuX2hpZGRlbkZpZWxkc0ZvckNoZWNrLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGZpZWxkLmhpZGVFeHByZXNzaW9uKSB7XG4gICAgICBvYnNlcnZlKGZpZWxkLCBbJ2hpZGVFeHByZXNzaW9uJ10sICh7IGN1cnJlbnRWYWx1ZTogZXhwciB9KSA9PiB7XG4gICAgICAgIGZpZWxkLl9leHByZXNzaW9ucy5oaWRlID0gdGhpcy5wYXJzZUV4cHJlc3Npb25zKGZpZWxkLCAnaGlkZScsIHR5cGVvZiBleHByID09PSAnYm9vbGVhbicgPyAoKSA9PiBleHByIDogZXhwcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhmaWVsZC5leHByZXNzaW9uUHJvcGVydGllcykpIHtcbiAgICAgIG9ic2VydmUoZmllbGQsIFsnZXhwcmVzc2lvblByb3BlcnRpZXMnLCBrZXldLCAoeyBjdXJyZW50VmFsdWU6IGV4cHIgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGV4cHIgPT09ICdzdHJpbmcnIHx8IGlzRnVuY3Rpb24oZXhwcikpIHtcbiAgICAgICAgICBmaWVsZC5fZXhwcmVzc2lvbnNba2V5XSA9IHRoaXMucGFyc2VFeHByZXNzaW9ucyhmaWVsZCwga2V5LCBleHByKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICAgIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+XG4gICAgICAgICAgICAoZXhwciBhcyBPYnNlcnZhYmxlPGFueT4pLnN1YnNjcmliZSgodikgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmV2YWxFeHByKGZpZWxkLCBrZXksIHYpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmUoKTtcbiAgICAgICAgICBjb25zdCBvbkluaXQgPSBmaWVsZC5ob29rcy5vbkluaXQ7XG4gICAgICAgICAgZmllbGQuaG9va3Mub25Jbml0ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBzdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvbkluaXQgJiYgb25Jbml0KGZpZWxkKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3Qgb25EZXN0cm95ID0gZmllbGQuaG9va3Mub25EZXN0cm95O1xuICAgICAgICAgIGZpZWxkLmhvb2tzLm9uRGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIG9uRGVzdHJveSAmJiBvbkRlc3Ryb3koZmllbGQpO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBudWxsO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHBvc3RQb3B1bGF0ZShmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSkge1xuICAgIGlmIChmaWVsZC5wYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWZpZWxkLm9wdGlvbnMuY2hlY2tFeHByZXNzaW9ucykge1xuICAgICAgZmllbGQub3B0aW9ucy5jaGVja0V4cHJlc3Npb25zID0gKGYsIGlnbm9yZUNhY2hlID0gZmFsc2UpID0+IHtcbiAgICAgICAgcmVkdWNlRm9ybVVwZGF0ZVZhbGlkaXR5Q2FsbHMoZi5mb3JtLCAoKSA9PiB0aGlzLmNoZWNrRXhwcmVzc2lvbnMoZiwgaWdub3JlQ2FjaGUpKTtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgb3B0aW9ucy5faGlkZGVuRmllbGRzRm9yQ2hlY2suc29ydCgoZikgPT4gKGYuaGlkZSA/IC0xIDogMSkpLmZvckVhY2goKGYpID0+IHRoaXMuY2hhbmdlSGlkZVN0YXRlKGYsIGYuaGlkZSkpO1xuICAgICAgICBvcHRpb25zLl9oaWRkZW5GaWVsZHNGb3JDaGVjayA9IFtdO1xuICAgICAgfTtcbiAgICAgIGZpZWxkLm9wdGlvbnMuX2NoZWNrRmllbGQgPSAoZiwgaWdub3JlQ2FjaGUpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKGBGb3JtbHk6ICdvcHRpb25zLl9jaGVja0ZpZWxkJyBpcyBkZXByZWNhdGVkIHNpbmNlIHY2LjAsIHVzZSAnb3B0aW9ucy5jaGVja0V4cHJlc3Npb25zJyBpbnN0ZWFkLmApO1xuICAgICAgICBmaWVsZC5vcHRpb25zLmNoZWNrRXhwcmVzc2lvbnMoZiwgaWdub3JlQ2FjaGUpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRXhwcmVzc2lvbnMoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUsIHBhdGg6IHN0cmluZywgZXhwcjogYW55KSB7XG4gICAgbGV0IHBhcmVudEV4cHJlc3Npb246IGFueTtcbiAgICBpZiAoZmllbGQucGFyZW50ICYmIFsnaGlkZScsICd0ZW1wbGF0ZU9wdGlvbnMuZGlzYWJsZWQnXS5pbmNsdWRlcyhwYXRoKSkge1xuICAgICAgcGFyZW50RXhwcmVzc2lvbiA9IGV2YWxTdHJpbmdFeHByZXNzaW9uKGAhIWZpZWxkLnBhcmVudC4ke3BhdGh9YCwgWydmaWVsZCddKTtcbiAgICB9XG5cbiAgICBleHByID0gZXhwciB8fCAoKCkgPT4gZmFsc2UpO1xuICAgIGlmICh0eXBlb2YgZXhwciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGV4cHIgPSBldmFsU3RyaW5nRXhwcmVzc2lvbihleHByLCBbJ21vZGVsJywgJ2Zvcm1TdGF0ZScsICdmaWVsZCddKTtcbiAgICB9XG5cbiAgICBsZXQgY3VycmVudFZhbHVlOiBhbnk7XG5cbiAgICByZXR1cm4gKGlnbm9yZUNhY2hlPzogYm9vbGVhbikgPT4ge1xuICAgICAgY29uc3QgZXhwclZhbHVlID0gZXZhbEV4cHJlc3Npb24oXG4gICAgICAgIHBhcmVudEV4cHJlc3Npb24gPyAoLi4uYXJncykgPT4gcGFyZW50RXhwcmVzc2lvbihmaWVsZCkgfHwgZXhwciguLi5hcmdzKSA6IGV4cHIsXG4gICAgICAgIHsgZmllbGQgfSxcbiAgICAgICAgW2ZpZWxkLm1vZGVsLCBmaWVsZC5vcHRpb25zLmZvcm1TdGF0ZSwgZmllbGRdLFxuICAgICAgKTtcblxuICAgICAgaWYgKFxuICAgICAgICBpZ25vcmVDYWNoZSB8fFxuICAgICAgICAoY3VycmVudFZhbHVlICE9PSBleHByVmFsdWUgJiZcbiAgICAgICAgICAoIWlzT2JqZWN0KGV4cHJWYWx1ZSkgfHwgSlNPTi5zdHJpbmdpZnkoZXhwclZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY3VycmVudFZhbHVlKSkpXG4gICAgICApIHtcbiAgICAgICAgY3VycmVudFZhbHVlID0gZXhwclZhbHVlO1xuICAgICAgICB0aGlzLmV2YWxFeHByKGZpZWxkLCBwYXRoLCBleHByVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tFeHByZXNzaW9ucyhmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSwgaWdub3JlQ2FjaGUgPSBmYWxzZSkge1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQuX2V4cHJlc3Npb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhmaWVsZC5fZXhwcmVzc2lvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9leHByZXNzaW9uc1trZXldKGlnbm9yZUNhY2hlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmllbGQuZmllbGRHcm91cCkge1xuICAgICAgZmllbGQuZmllbGRHcm91cC5mb3JFYWNoKChmKSA9PiB0aGlzLmNoZWNrRXhwcmVzc2lvbnMoZiwgaWdub3JlQ2FjaGUpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoYW5nZURpc2FibGVkU3RhdGUoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnLCB2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmIChmaWVsZC5maWVsZEdyb3VwKSB7XG4gICAgICBmaWVsZC5maWVsZEdyb3VwXG4gICAgICAgIC5maWx0ZXIoKGYpID0+ICFmLmV4cHJlc3Npb25Qcm9wZXJ0aWVzIHx8ICFmLmV4cHJlc3Npb25Qcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZU9wdGlvbnMuZGlzYWJsZWQnKSlcbiAgICAgICAgLmZvckVhY2goKGYpID0+IHRoaXMuY2hhbmdlRGlzYWJsZWRTdGF0ZShmLCB2YWx1ZSkpO1xuICAgIH1cblxuICAgIGlmIChmaWVsZC5rZXkgJiYgZmllbGQudGVtcGxhdGVPcHRpb25zLmRpc2FibGVkICE9PSB2YWx1ZSkge1xuICAgICAgZmllbGQudGVtcGxhdGVPcHRpb25zLmRpc2FibGVkID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGFuZ2VIaWRlU3RhdGUoZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnLCBoaWRlOiBib29sZWFuKSB7XG4gICAgaWYgKGZpZWxkLmZvcm1Db250cm9sICYmIGZpZWxkLmtleSkge1xuICAgICAgZGVmaW5lSGlkZGVuUHJvcChmaWVsZCwgJ19oaWRlJywgISEoaGlkZSB8fCBmaWVsZC5oaWRlKSk7XG4gICAgICBjb25zdCBjID0gZmllbGQuZm9ybUNvbnRyb2w7XG4gICAgICBpZiAoY1snX2ZpZWxkcyddLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdXBkYXRlVmFsaWRpdHkoYyk7XG4gICAgICB9XG5cbiAgICAgIGhpZGUgPT09IHRydWUgJiYgY1snX2ZpZWxkcyddLmV2ZXJ5KChmKSA9PiAhIWYuX2hpZGUpID8gdW5yZWdpc3RlckNvbnRyb2woZmllbGQpIDogcmVnaXN0ZXJDb250cm9sKGZpZWxkKTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQuZmllbGRHcm91cCkge1xuICAgICAgZmllbGQuZmllbGRHcm91cC5maWx0ZXIoKGYpID0+ICFmLmhpZGVFeHByZXNzaW9uKS5mb3JFYWNoKChmKSA9PiB0aGlzLmNoYW5nZUhpZGVTdGF0ZShmLCBoaWRlKSk7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkLm9wdGlvbnMuZmllbGRDaGFuZ2VzKSB7XG4gICAgICBmaWVsZC5vcHRpb25zLmZpZWxkQ2hhbmdlcy5uZXh0KDxGb3JtbHlWYWx1ZUNoYW5nZUV2ZW50PnsgZmllbGQsIHR5cGU6ICdoaWRkZW4nLCB2YWx1ZTogaGlkZSB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV2YWxFeHByKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlLCBwcm9wOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IHRhcmdldCA9IGZpZWxkO1xuICAgICAgY29uc3QgcGF0aHMgPSBwcm9wLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsYXN0SW5kZXggPSBwYXRocy5sZW5ndGggLSAxO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0SW5kZXg7IGkrKykge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbcGF0aHNbaV1dO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRbcGF0aHNbbGFzdEluZGV4XV0gPSB2YWx1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZXJyb3IubWVzc2FnZSA9IGBbRm9ybWx5IEVycm9yXSBbRXhwcmVzc2lvbiBcIiR7cHJvcH1cIl0gJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICBpZiAocHJvcCA9PT0gJ3RlbXBsYXRlT3B0aW9ucy5kaXNhYmxlZCcgJiYgZmllbGQua2V5KSB7XG4gICAgICB0aGlzLmNoYW5nZURpc2FibGVkU3RhdGUoZmllbGQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcC5pbmRleE9mKCdtb2RlbC4nKSA9PT0gMCkge1xuICAgICAgY29uc3Qga2V5ID0gcHJvcC5yZXBsYWNlKC9ebW9kZWxcXC4vLCAnJyksXG4gICAgICAgIGNvbnRyb2wgPSBmaWVsZC5rZXkgJiYgZmllbGQua2V5ID09PSBrZXkgPyBmaWVsZC5mb3JtQ29udHJvbCA6IGZpZWxkLmZvcm0uZ2V0KGtleSk7XG5cbiAgICAgIGlmIChjb250cm9sICYmICEoaXNOaWwoY29udHJvbC52YWx1ZSkgJiYgaXNOaWwodmFsdWUpKSAmJiBjb250cm9sLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICBjb250cm9sLnBhdGNoVmFsdWUodmFsdWUsIHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==