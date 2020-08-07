import { __assign, __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, DoCheck, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy, NgZone, } from '@angular/core';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone } from '../utils';
import { switchMap, filter, take } from 'rxjs/operators';
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
export { FormlyForm };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LmZvcm0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybWx5LmZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLE9BQU8sRUFDUCxTQUFTLEVBQ1QsS0FBSyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDakMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFRekQ7SUF1Q0Usb0JBQW9CLE9BQTBCLEVBQVUsTUFBb0IsRUFBVSxNQUFjO1FBQWhGLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFOMUYsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXhDLFVBQUssR0FBMkIsRUFBRSxDQUFDO1FBQ25DLHNCQUFpQixHQUFRLEVBQUUsQ0FBQztRQUM1Qiw0QkFBdUIsR0FBRyxjQUFPLENBQUMsQ0FBQztJQUU0RCxDQUFDO0lBckN4RyxzQkFBSSw0QkFBSTthQUdSO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQTZCLENBQUM7UUFDbEQsQ0FBQzthQUxELFVBQVMsSUFBMkI7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNkJBQUs7YUFHVDtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQzthQUxELFVBQVUsS0FBVTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksOEJBQU07YUFHVjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDL0IsQ0FBQzthQUxELFVBQVcsVUFBK0I7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLENBQUMsQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLCtCQUFPO2FBR1g7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzVCLENBQUM7YUFMRCxVQUFZLE9BQTBCO1lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFhRCw4QkFBUyxHQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsS0FBSyxzQkFBc0IsRUFBRTtZQUNuRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxnQ0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzlHLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELGdDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU8sMENBQXFCLEdBQTdCO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTyxpQ0FBWSxHQUFwQjtRQUFBLGlCQWtCQztRQWpCQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUUvQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZO2FBQ3hDLElBQUksQ0FDSCxNQUFNLENBQUMsVUFBQyxFQUFRO2dCQUFOLGNBQUk7WUFBTyxPQUFBLElBQUksS0FBSyxjQUFjO1FBQXZCLENBQXVCLENBQUMsRUFDN0MsU0FBUyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQWpELENBQWlELENBQUMsQ0FDbkU7YUFDQSxTQUFTLENBQUM7WUFDVCxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNyQiw0REFBNEQ7Z0JBQzVELHVEQUF1RDtnQkFDdkQsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzdCLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsQ0FBQztRQUxGLENBS0UsQ0FDSCxDQUFDO1FBRUosT0FBTyxjQUFNLE9BQUEsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFqQixDQUFpQixDQUFDO0lBQ2pDLENBQUM7SUFFTyw2QkFBUSxHQUFoQixVQUFpQixLQUE2QjtRQUM1QyxJQUFJLENBQUMsS0FBSyx5QkFDTCxJQUFJLENBQUMsS0FBSyxHQUNWLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQzs7Z0JBakQ0QixpQkFBaUI7Z0JBQWtCLFlBQVk7Z0JBQWtCLE1BQU07O0lBckNwRztRQURDLEtBQUssRUFBRTs7OzBDQUdQO0lBTUQ7UUFEQyxLQUFLLEVBQUU7OzsyQ0FHUDtJQU1EO1FBREMsS0FBSyxFQUFFOzs7NENBR1A7SUFNRDtRQURDLEtBQUssRUFBRTs7OzZDQUdQO0lBS1M7UUFBVCxNQUFNLEVBQUU7O21EQUF1QztJQWpDckMsVUFBVTtRQU50QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsMEVBQXNFO1lBQ2hGLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1lBQzlCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7eUNBd0M2QixpQkFBaUIsRUFBa0IsWUFBWSxFQUFrQixNQUFNO09BdkN6RixVQUFVLENBeUZ0QjtJQUFELGlCQUFDO0NBQUEsQUF6RkQsSUF5RkM7U0F6RlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIERvQ2hlY2ssXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1BcnJheSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnLCBGb3JtbHlGb3JtT3B0aW9ucywgRm9ybWx5RmllbGRDb25maWdDYWNoZSB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBGb3JtbHlGb3JtQnVpbGRlciB9IGZyb20gJy4uL3NlcnZpY2VzL2Zvcm1seS5idWlsZGVyJztcbmltcG9ydCB7IEZvcm1seUNvbmZpZyB9IGZyb20gJy4uL3NlcnZpY2VzL2Zvcm1seS5jb25maWcnO1xuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIGZpbHRlciwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZm9ybWx5LWZvcm0nLFxuICB0ZW1wbGF0ZTogYCA8Zm9ybWx5LWZpZWxkICpuZ0Zvcj1cImxldCBmIG9mIGZpZWxkc1wiIFtmaWVsZF09XCJmXCI+PC9mb3JtbHktZmllbGQ+IGAsXG4gIHByb3ZpZGVyczogW0Zvcm1seUZvcm1CdWlsZGVyXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seUZvcm0gaW1wbGVtZW50cyBEb0NoZWNrLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHNldCBmb3JtKGZvcm06IEZvcm1Hcm91cCB8IEZvcm1BcnJheSkge1xuICAgIHRoaXMuZmllbGQuZm9ybSA9IGZvcm07XG4gIH1cbiAgZ2V0IGZvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuZm9ybSBhcyBGb3JtR3JvdXAgfCBGb3JtQXJyYXk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbW9kZWwobW9kZWw6IGFueSkge1xuICAgIHRoaXMuc2V0RmllbGQoeyBtb2RlbCB9KTtcbiAgfVxuICBnZXQgbW9kZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQubW9kZWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgZmllbGRzKGZpZWxkR3JvdXA6IEZvcm1seUZpZWxkQ29uZmlnW10pIHtcbiAgICB0aGlzLnNldEZpZWxkKHsgZmllbGRHcm91cCB9KTtcbiAgfVxuICBnZXQgZmllbGRzKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLmZpZWxkR3JvdXA7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBGb3JtbHlGb3JtT3B0aW9ucykge1xuICAgIHRoaXMuc2V0RmllbGQoeyBvcHRpb25zIH0pO1xuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm9wdGlvbnM7XG4gIH1cblxuICBAT3V0cHV0KCkgbW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlID0ge307XG4gIHByaXZhdGUgX21vZGVsQ2hhbmdlVmFsdWU6IGFueSA9IHt9O1xuICBwcml2YXRlIHZhbHVlQ2hhbmdlc1Vuc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBidWlsZGVyOiBGb3JtbHlGb3JtQnVpbGRlciwgcHJpdmF0ZSBjb25maWc6IEZvcm1seUNvbmZpZywgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmV4dHJhcy5jaGVja0V4cHJlc3Npb25PbiA9PT0gJ2NoYW5nZURldGVjdGlvbkNoZWNrJykge1xuICAgICAgdGhpcy5jaGVja0V4cHJlc3Npb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmllbGRzIHx8IGNoYW5nZXMuZm9ybSB8fCAoY2hhbmdlcy5tb2RlbCAmJiB0aGlzLl9tb2RlbENoYW5nZVZhbHVlICE9PSBjaGFuZ2VzLm1vZGVsLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuYnVpbGRlci5idWlsZCh0aGlzLmZpZWxkKTtcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUgPSB0aGlzLnZhbHVlQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tFeHByZXNzaW9uQ2hhbmdlKCkge1xuICAgIHRoaXMuZmllbGQub3B0aW9ucy5jaGVja0V4cHJlc3Npb25zKHRoaXMuZmllbGQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWx1ZUNoYW5nZXMoKSB7XG4gICAgdGhpcy52YWx1ZUNoYW5nZXNVbnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3Qgc3ViID0gdGhpcy5maWVsZC5vcHRpb25zLmZpZWxkQ2hhbmdlc1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09ICd2YWx1ZUNoYW5nZXMnKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMubmdab25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgICAvLyBydW5HdWFyZGVkIGlzIHVzZWQgdG8ga2VlcCBpbiBzeW5jIHRoZSBleHByZXNzaW9uIGNoYW5nZXNcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmd4LWZvcm1seS9uZ3gtZm9ybWx5L2lzc3Vlcy8yMDk1XG4gICAgICAgICAgdGhpcy5jaGVja0V4cHJlc3Npb25DaGFuZ2UoKTtcbiAgICAgICAgICB0aGlzLm1vZGVsQ2hhbmdlLmVtaXQoKHRoaXMuX21vZGVsQ2hhbmdlVmFsdWUgPSBjbG9uZSh0aGlzLm1vZGVsKSkpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3ViLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIHNldEZpZWxkKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlKSB7XG4gICAgdGhpcy5maWVsZCA9IHtcbiAgICAgIC4uLnRoaXMuZmllbGQsXG4gICAgICAuLi4odGhpcy5jb25maWcuZXh0cmFzLmltbXV0YWJsZSA/IGNsb25lKGZpZWxkKSA6IGZpZWxkKSxcbiAgICB9O1xuICB9XG59XG4iXX0=