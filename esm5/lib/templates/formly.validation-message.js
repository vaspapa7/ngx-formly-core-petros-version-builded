import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { isObject } from '../utils';
import { isObservable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
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
export { FormlyValidationMessage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LnZhbGlkYXRpb24tbWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2Zvcm1seS52YWxpZGF0aW9uLW1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBYyxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPdEQ7SUFJRSxpQ0FBb0IsTUFBb0I7UUFBcEIsV0FBTSxHQUFOLE1BQU0sQ0FBYztJQUFHLENBQUM7SUFFNUMsNkNBQVcsR0FBWDtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUM1RCxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQ2YsU0FBUyxDQUFDLGNBQU0sT0FBQSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBN0UsQ0FBNkUsQ0FBQyxDQUMvRixDQUFDO0lBQ0osQ0FBQztJQUVELHNCQUFJLGlEQUFZO2FBQWhCO1lBQ0UsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDekMsS0FBSyxJQUFNLEtBQUssSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNwQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMxQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUVyRCxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ3JDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUU7NEJBQ3JDLE9BQU87eUJBQ1I7d0JBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRTs0QkFDbkMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO3lCQUMzQztxQkFDRjtvQkFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3BHLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2pEO29CQUVELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUNqRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO3FCQUNoRDtvQkFFRCxJQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZTt3QkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO3dCQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQ3pDO3dCQUNBLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7cUJBQ3JEO29CQUVELElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO3dCQUNqQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDckQ7b0JBRUQsT0FBTyxPQUFPLENBQUM7aUJBQ2hCO2FBQ0Y7UUFDSCxDQUFDOzs7T0FBQTs7Z0JBaEQyQixZQUFZOztJQUgvQjtRQUFSLEtBQUssRUFBRTs7MERBQTBCO0lBRHZCLHVCQUF1QjtRQUxuQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsMkJBQTJCO1lBQ3JDLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQzt5Q0FLNEIsWUFBWTtPQUo3Qix1QkFBdUIsQ0FxRG5DO0lBQUQsOEJBQUM7Q0FBQSxBQXJERCxJQXFEQztTQXJEWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtbHlDb25maWcgfSBmcm9tICcuLi9zZXJ2aWNlcy9mb3JtbHkuY29uZmlnJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgaXNPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Zvcm1seS12YWxpZGF0aW9uLW1lc3NhZ2UnLFxuICB0ZW1wbGF0ZTogJ3t7IGVycm9yTWVzc2FnZSQgfCBhc3luYyB9fScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBGb3JtbHlWYWxpZGF0aW9uTWVzc2FnZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZztcbiAgZXJyb3JNZXNzYWdlJDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBGb3JtbHlDb25maWcpIHt9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5lcnJvck1lc3NhZ2UkID0gdGhpcy5maWVsZC5mb3JtQ29udHJvbC5zdGF0dXNDaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gKGlzT2JzZXJ2YWJsZSh0aGlzLmVycm9yTWVzc2FnZSkgPyB0aGlzLmVycm9yTWVzc2FnZSA6IG9mKHRoaXMuZXJyb3JNZXNzYWdlKSkpLFxuICAgICk7XG4gIH1cblxuICBnZXQgZXJyb3JNZXNzYWdlKCkge1xuICAgIGNvbnN0IGZpZWxkRm9ybSA9IHRoaXMuZmllbGQuZm9ybUNvbnRyb2w7XG4gICAgZm9yIChjb25zdCBlcnJvciBpbiBmaWVsZEZvcm0uZXJyb3JzKSB7XG4gICAgICBpZiAoZmllbGRGb3JtLmVycm9ycy5oYXNPd25Qcm9wZXJ0eShlcnJvcikpIHtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB0aGlzLmNvbmZpZy5nZXRWYWxpZGF0b3JNZXNzYWdlKGVycm9yKTtcblxuICAgICAgICBpZiAoaXNPYmplY3QoZmllbGRGb3JtLmVycm9yc1tlcnJvcl0pKSB7XG4gICAgICAgICAgaWYgKGZpZWxkRm9ybS5lcnJvcnNbZXJyb3JdLmVycm9yUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChmaWVsZEZvcm0uZXJyb3JzW2Vycm9yXS5tZXNzYWdlKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gZmllbGRGb3JtLmVycm9yc1tlcnJvcl0ubWVzc2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWVsZC52YWxpZGF0aW9uICYmIHRoaXMuZmllbGQudmFsaWRhdGlvbi5tZXNzYWdlcyAmJiB0aGlzLmZpZWxkLnZhbGlkYXRpb24ubWVzc2FnZXNbZXJyb3JdKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZmllbGQudmFsaWRhdGlvbi5tZXNzYWdlc1tlcnJvcl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWVsZC52YWxpZGF0b3JzICYmIHRoaXMuZmllbGQudmFsaWRhdG9yc1tlcnJvcl0gJiYgdGhpcy5maWVsZC52YWxpZGF0b3JzW2Vycm9yXS5tZXNzYWdlKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZmllbGQudmFsaWRhdG9yc1tlcnJvcl0ubWVzc2FnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmZpZWxkLmFzeW5jVmFsaWRhdG9ycyAmJlxuICAgICAgICAgIHRoaXMuZmllbGQuYXN5bmNWYWxpZGF0b3JzW2Vycm9yXSAmJlxuICAgICAgICAgIHRoaXMuZmllbGQuYXN5bmNWYWxpZGF0b3JzW2Vycm9yXS5tZXNzYWdlXG4gICAgICAgICkge1xuICAgICAgICAgIG1lc3NhZ2UgPSB0aGlzLmZpZWxkLmFzeW5jVmFsaWRhdG9yc1tlcnJvcl0ubWVzc2FnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlKGZpZWxkRm9ybS5lcnJvcnNbZXJyb3JdLCB0aGlzLmZpZWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19