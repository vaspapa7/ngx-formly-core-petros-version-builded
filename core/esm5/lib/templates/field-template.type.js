import { __decorate, __extends, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from './field.type';
var FormlyTemplateType = /** @class */ (function (_super) {
    __extends(FormlyTemplateType, _super);
    function FormlyTemplateType(sanitizer) {
        var _this = _super.call(this) || this;
        _this.sanitizer = sanitizer;
        _this.innerHtml = { content: null, template: null };
        return _this;
    }
    Object.defineProperty(FormlyTemplateType.prototype, "template", {
        get: function () {
            if (this.field && this.field.template !== this.innerHtml.template) {
                this.innerHtml = {
                    template: this.field.template,
                    content: this.to.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template,
                };
            }
            return this.innerHtml.content;
        },
        enumerable: true,
        configurable: true
    });
    FormlyTemplateType.ctorParameters = function () { return [
        { type: DomSanitizer }
    ]; };
    FormlyTemplateType = __decorate([
        Component({
            selector: 'formly-template',
            template: "<div [innerHtml]=\"template\"></div>",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [DomSanitizer])
    ], FormlyTemplateType);
    return FormlyTemplateType;
}(FieldType));
export { FormlyTemplateType };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtdGVtcGxhdGUudHlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2ZpZWxkLXRlbXBsYXRlLnR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFPekM7SUFBd0Msc0NBQVM7SUFhL0MsNEJBQW9CLFNBQXVCO1FBQTNDLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixlQUFTLEdBQVQsU0FBUyxDQUFjO1FBRG5DLGVBQVMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztJQUd0RCxDQUFDO0lBZEQsc0JBQUksd0NBQVE7YUFBWjtZQUNFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtnQkFDakUsSUFBSSxDQUFDLFNBQVMsR0FBRztvQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO29CQUM3QixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2lCQUM5RyxDQUFDO2FBQ0g7WUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hDLENBQUM7OztPQUFBOztnQkFHOEIsWUFBWTs7SUFiaEMsa0JBQWtCO1FBTDlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsUUFBUSxFQUFFLHNDQUFvQztZQUM5QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtTQUNoRCxDQUFDO3lDQWMrQixZQUFZO09BYmhDLGtCQUFrQixDQWdCOUI7SUFBRCx5QkFBQztDQUFBLEFBaEJELENBQXdDLFNBQVMsR0FnQmhEO1NBaEJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgRmllbGRUeXBlIH0gZnJvbSAnLi9maWVsZC50eXBlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZm9ybWx5LXRlbXBsYXRlJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IFtpbm5lckh0bWxdPVwidGVtcGxhdGVcIj48L2Rpdj5gLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgRm9ybWx5VGVtcGxhdGVUeXBlIGV4dGVuZHMgRmllbGRUeXBlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGlmICh0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQudGVtcGxhdGUgIT09IHRoaXMuaW5uZXJIdG1sLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmlubmVySHRtbCA9IHtcbiAgICAgICAgdGVtcGxhdGU6IHRoaXMuZmllbGQudGVtcGxhdGUsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXMudG8uc2FmZUh0bWwgPyB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLmZpZWxkLnRlbXBsYXRlKSA6IHRoaXMuZmllbGQudGVtcGxhdGUsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlubmVySHRtbC5jb250ZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpbm5lckh0bWwgPSB7IGNvbnRlbnQ6IG51bGwsIHRlbXBsYXRlOiBudWxsIH07XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG4iXX0=