import { __decorate, __metadata } from "tslib";
import { Input, Directive } from '@angular/core';
let FieldType = class FieldType {
    get model() {
        return this.field.model;
    }
    get form() {
        return this.field.form;
    }
    get options() {
        return this.field.options;
    }
    get key() {
        return this.field.key;
    }
    get formControl() {
        return this.field.formControl;
    }
    get to() {
        return this.field.templateOptions || {};
    }
    get showError() {
        return this.options.showError(this);
    }
    get id() {
        return this.field.id;
    }
    get formState() {
        return this.options.formState || {};
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], FieldType.prototype, "field", void 0);
FieldType = __decorate([
    Directive()
], FieldType);
export { FieldType };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQudHlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2ZpZWxkLnR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSWpELElBQXNCLFNBQVMsR0FBL0IsTUFBc0IsU0FBUztJQUk3QixJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUNGLENBQUE7QUF0Q1U7SUFBUixLQUFLLEVBQUU7O3dDQUFVO0FBREUsU0FBUztJQUQ5QixTQUFTLEVBQUU7R0FDVSxTQUFTLENBdUM5QjtTQXZDcUIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmllbGRUeXBlPEYgZXh0ZW5kcyBGb3JtbHlGaWVsZENvbmZpZyA9IEZvcm1seUZpZWxkQ29uZmlnPiB7XG4gIEBJbnB1dCgpIGZpZWxkOiBGO1xuICBkZWZhdWx0T3B0aW9ucz86IEY7XG5cbiAgZ2V0IG1vZGVsKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm1vZGVsO1xuICB9XG5cbiAgZ2V0IGZvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuZm9ybTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm9wdGlvbnM7XG4gIH1cblxuICBnZXQga2V5KCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLmtleTtcbiAgfVxuXG4gIGdldCBmb3JtQ29udHJvbCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZC5mb3JtQ29udHJvbDtcbiAgfVxuXG4gIGdldCB0bygpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZC50ZW1wbGF0ZU9wdGlvbnMgfHwge307XG4gIH1cblxuICBnZXQgc2hvd0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2hvd0Vycm9yKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuaWQ7XG4gIH1cblxuICBnZXQgZm9ybVN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZm9ybVN0YXRlIHx8IHt9O1xuICB9XG59XG4iXX0=