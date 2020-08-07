import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, DoCheck, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy, NgZone, } from '@angular/core';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone } from '../utils';
import { switchMap, filter, take } from 'rxjs/operators';
let FormlyForm = class FormlyForm {
    constructor(builder, config, ngZone) {
        this.builder = builder;
        this.config = config;
        this.ngZone = ngZone;
        this.modelChange = new EventEmitter();
        this.field = {};
        this._modelChangeValue = {};
        this.valueChangesUnsubscribe = () => { };
    }
    set form(form) {
        this.field.form = form;
    }
    get form() {
        return this.field.form;
    }
    set model(model) {
        this.setField({ model });
    }
    get model() {
        return this.field.model;
    }
    set fields(fieldGroup) {
        this.setField({ fieldGroup });
    }
    get fields() {
        return this.field.fieldGroup;
    }
    set options(options) {
        this.setField({ options });
    }
    get options() {
        return this.field.options;
    }
    ngDoCheck() {
        if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
            this.checkExpressionChange();
        }
    }
    ngOnChanges(changes) {
        if (changes.fields || changes.form || (changes.model && this._modelChangeValue !== changes.model.currentValue)) {
            this.valueChangesUnsubscribe();
            this.builder.build(this.field);
            this.valueChangesUnsubscribe = this.valueChanges();
        }
    }
    ngOnDestroy() {
        this.valueChangesUnsubscribe();
    }
    checkExpressionChange() {
        this.field.options.checkExpressions(this.field);
    }
    valueChanges() {
        this.valueChangesUnsubscribe();
        const sub = this.field.options.fieldChanges
            .pipe(filter(({ type }) => type === 'valueChanges'), switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))))
            .subscribe(() => this.ngZone.runGuarded(() => {
            // runGuarded is used to keep in sync the expression changes
            // https://github.com/ngx-formly/ngx-formly/issues/2095
            this.checkExpressionChange();
            this.modelChange.emit((this._modelChangeValue = clone(this.model)));
        }));
        return () => sub.unsubscribe();
    }
    setField(field) {
        this.field = Object.assign(Object.assign({}, this.field), (this.config.extras.immutable ? clone(field) : field));
    }
};
FormlyForm.ctorParameters = () => [
    { type: FormlyFormBuilder },
    { type: FormlyConfig },
    { type: NgZone }
];
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
        template: ` <formly-field *ngFor="let f of fields" [field]="f"></formly-field> `,
        providers: [FormlyFormBuilder],
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [FormlyFormBuilder, FormlyConfig, NgZone])
], FormlyForm);
export { FormlyForm };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LmZvcm0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybWx5LmZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLE9BQU8sRUFDUCxTQUFTLEVBQ1QsS0FBSyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDakMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFRekQsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVTtJQXVDckIsWUFBb0IsT0FBMEIsRUFBVSxNQUFvQixFQUFVLE1BQWM7UUFBaEYsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFjO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQU4xRixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFeEMsVUFBSyxHQUEyQixFQUFFLENBQUM7UUFDbkMsc0JBQWlCLEdBQVEsRUFBRSxDQUFDO1FBQzVCLDRCQUF1QixHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUU0RCxDQUFDO0lBckN4RyxJQUFJLElBQUksQ0FBQyxJQUEyQjtRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUE2QixD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QUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUE7O1lBbEQ4QixpQkFBaUI7WUFBa0IsWUFBWTtZQUFrQixNQUFNOztBQXJDcEc7SUFEQyxLQUFLLEVBQUU7OztzQ0FHUDtBQU1EO0lBREMsS0FBSyxFQUFFOzs7dUNBR1A7QUFNRDtJQURDLEtBQUssRUFBRTs7O3dDQUdQO0FBTUQ7SUFEQyxLQUFLLEVBQUU7Ozt5Q0FHUDtBQUtTO0lBQVQsTUFBTSxFQUFFOzsrQ0FBdUM7QUFqQ3JDLFVBQVU7SUFOdEIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLHNFQUFzRTtRQUNoRixTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztRQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtLQUNoRCxDQUFDO3FDQXdDNkIsaUJBQWlCLEVBQWtCLFlBQVksRUFBa0IsTUFBTTtHQXZDekYsVUFBVSxDQXlGdEI7U0F6RlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIERvQ2hlY2ssXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1BcnJheSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnLCBGb3JtbHlGb3JtT3B0aW9ucywgRm9ybWx5RmllbGRDb25maWdDYWNoZSB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBGb3JtbHlGb3JtQnVpbGRlciB9IGZyb20gJy4uL3NlcnZpY2VzL2Zvcm1seS5idWlsZGVyJztcbmltcG9ydCB7IEZvcm1seUNvbmZpZyB9IGZyb20gJy4uL3NlcnZpY2VzL2Zvcm1seS5jb25maWcnO1xuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIGZpbHRlciwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZm9ybWx5LWZvcm0nLFxuICB0ZW1wbGF0ZTogYCA8Zm9ybWx5LWZpZWxkICpuZ0Zvcj1cImxldCBmIG9mIGZpZWxkc1wiIFtmaWVsZF09XCJmXCI+PC9mb3JtbHktZmllbGQ+IGAsXG4gIHByb3ZpZGVyczogW0Zvcm1seUZvcm1CdWlsZGVyXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seUZvcm0gaW1wbGVtZW50cyBEb0NoZWNrLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHNldCBmb3JtKGZvcm06IEZvcm1Hcm91cCB8IEZvcm1BcnJheSkge1xuICAgIHRoaXMuZmllbGQuZm9ybSA9IGZvcm07XG4gIH1cbiAgZ2V0IGZvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuZm9ybSBhcyBGb3JtR3JvdXAgfCBGb3JtQXJyYXk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbW9kZWwobW9kZWw6IGFueSkge1xuICAgIHRoaXMuc2V0RmllbGQoeyBtb2RlbCB9KTtcbiAgfVxuICBnZXQgbW9kZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQubW9kZWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgZmllbGRzKGZpZWxkR3JvdXA6IEZvcm1seUZpZWxkQ29uZmlnW10pIHtcbiAgICB0aGlzLnNldEZpZWxkKHsgZmllbGRHcm91cCB9KTtcbiAgfVxuICBnZXQgZmllbGRzKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLmZpZWxkR3JvdXA7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBGb3JtbHlGb3JtT3B0aW9ucykge1xuICAgIHRoaXMuc2V0RmllbGQoeyBvcHRpb25zIH0pO1xuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm9wdGlvbnM7XG4gIH1cblxuICBAT3V0cHV0KCkgbW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlID0ge307XG4gIHByaXZhdGUgX21vZGVsQ2hhbmdlVmFsdWU6IGFueSA9IHt9O1xuICBwcml2YXRlIHZhbHVlQ2hhbmdlc1Vuc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBidWlsZGVyOiBGb3JtbHlGb3JtQnVpbGRlciwgcHJpdmF0ZSBjb25maWc6IEZvcm1seUNvbmZpZywgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmV4dHJhcy5jaGVja0V4cHJlc3Npb25PbiA9PT0gJ2NoYW5nZURldGVjdGlvbkNoZWNrJykge1xuICAgICAgdGhpcy5jaGVja0V4cHJlc3Npb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmllbGRzIHx8IGNoYW5nZXMuZm9ybSB8fCAoY2hhbmdlcy5tb2RlbCAmJiB0aGlzLl9tb2RlbENoYW5nZVZhbHVlICE9PSBjaGFuZ2VzLm1vZGVsLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuYnVpbGRlci5idWlsZCh0aGlzLmZpZWxkKTtcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUgPSB0aGlzLnZhbHVlQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tFeHByZXNzaW9uQ2hhbmdlKCkge1xuICAgIHRoaXMuZmllbGQub3B0aW9ucy5jaGVja0V4cHJlc3Npb25zKHRoaXMuZmllbGQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWx1ZUNoYW5nZXMoKSB7XG4gICAgdGhpcy52YWx1ZUNoYW5nZXNVbnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3Qgc3ViID0gdGhpcy5maWVsZC5vcHRpb25zLmZpZWxkQ2hhbmdlc1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09ICd2YWx1ZUNoYW5nZXMnKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMubmdab25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgICAvLyBydW5HdWFyZGVkIGlzIHVzZWQgdG8ga2VlcCBpbiBzeW5jIHRoZSBleHByZXNzaW9uIGNoYW5nZXNcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmd4LWZvcm1seS9uZ3gtZm9ybWx5L2lzc3Vlcy8yMDk1XG4gICAgICAgICAgdGhpcy5jaGVja0V4cHJlc3Npb25DaGFuZ2UoKTtcbiAgICAgICAgICB0aGlzLm1vZGVsQ2hhbmdlLmVtaXQoKHRoaXMuX21vZGVsQ2hhbmdlVmFsdWUgPSBjbG9uZSh0aGlzLm1vZGVsKSkpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3ViLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIHNldEZpZWxkKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlKSB7XG4gICAgdGhpcy5maWVsZCA9IHtcbiAgICAgIC4uLnRoaXMuZmllbGQsXG4gICAgICAuLi4odGhpcy5jb25maWcuZXh0cmFzLmltbXV0YWJsZSA/IGNsb25lKGZpZWxkKSA6IGZpZWxkKSxcbiAgICB9O1xuICB9XG59XG4iXX0=