import { __decorate, __metadata } from "tslib";
import { Input, Directive } from '@angular/core';
var FieldType = /** @class */ (function () {
    function FieldType() {
    }
    Object.defineProperty(FieldType.prototype, "model", {
        get: function () {
            return this.field.model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "form", {
        get: function () {
            return this.field.form;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "options", {
        get: function () {
            return this.field.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "key", {
        get: function () {
            return this.field.key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "formControl", {
        get: function () {
            return this.field.formControl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "to", {
        get: function () {
            return this.field.templateOptions || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "showError", {
        get: function () {
            return this.options.showError(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "id", {
        get: function () {
            return this.field.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldType.prototype, "formState", {
        get: function () {
            return this.options.formState || {};
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], FieldType.prototype, "field", void 0);
    FieldType = __decorate([
        Directive()
    ], FieldType);
    return FieldType;
}());
export { FieldType };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQudHlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2ZpZWxkLnR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSWpEO0lBQUE7SUF1Q0EsQ0FBQztJQW5DQyxzQkFBSSw0QkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDJCQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksOEJBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDNUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwwQkFBRzthQUFQO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGtDQUFXO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBRUQsc0JBQUkseUJBQUU7YUFBTjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO1FBQzFDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksZ0NBQVM7YUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx5QkFBRTthQUFOO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGdDQUFTO2FBQWI7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQXJDUTtRQUFSLEtBQUssRUFBRTs7NENBQVU7SUFERSxTQUFTO1FBRDlCLFNBQVMsRUFBRTtPQUNVLFNBQVMsQ0F1QzlCO0lBQUQsZ0JBQUM7Q0FBQSxBQXZDRCxJQXVDQztTQXZDcUIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmllbGRUeXBlPEYgZXh0ZW5kcyBGb3JtbHlGaWVsZENvbmZpZyA9IEZvcm1seUZpZWxkQ29uZmlnPiB7XG4gIEBJbnB1dCgpIGZpZWxkOiBGO1xuICBkZWZhdWx0T3B0aW9ucz86IEY7XG5cbiAgZ2V0IG1vZGVsKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm1vZGVsO1xuICB9XG5cbiAgZ2V0IGZvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuZm9ybTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLm9wdGlvbnM7XG4gIH1cblxuICBnZXQga2V5KCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkLmtleTtcbiAgfVxuXG4gIGdldCBmb3JtQ29udHJvbCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZC5mb3JtQ29udHJvbDtcbiAgfVxuXG4gIGdldCB0bygpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZC50ZW1wbGF0ZU9wdGlvbnMgfHwge307XG4gIH1cblxuICBnZXQgc2hvd0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2hvd0Vycm9yKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGQuaWQ7XG4gIH1cblxuICBnZXQgZm9ybVN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZm9ybVN0YXRlIHx8IHt9O1xuICB9XG59XG4iXX0=