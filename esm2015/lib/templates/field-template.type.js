import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from './field.type';
let FormlyTemplateType = class FormlyTemplateType extends FieldType {
    constructor(sanitizer) {
        super();
        this.sanitizer = sanitizer;
        this.innerHtml = { content: null, template: null };
    }
    get template() {
        if (this.field && this.field.template !== this.innerHtml.template) {
            this.innerHtml = {
                template: this.field.template,
                content: this.to.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template,
            };
        }
        return this.innerHtml.content;
    }
};
FormlyTemplateType.ctorParameters = () => [
    { type: DomSanitizer }
];
FormlyTemplateType = __decorate([
    Component({
        selector: 'formly-template',
        template: `<div [innerHtml]="template"></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [DomSanitizer])
], FormlyTemplateType);
export { FormlyTemplateType };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtdGVtcGxhdGUudHlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2ZpZWxkLXRlbXBsYXRlLnR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFPekMsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBbUIsU0FBUSxTQUFTO0lBYS9DLFlBQW9CLFNBQXVCO1FBQ3pDLEtBQUssRUFBRSxDQUFDO1FBRFUsY0FBUyxHQUFULFNBQVMsQ0FBYztRQURuQyxjQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUd0RCxDQUFDO0lBZEQsSUFBSSxRQUFRO1FBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ2pFLElBQUksQ0FBQyxTQUFTLEdBQUc7Z0JBQ2YsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDN0IsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTthQUM5RyxDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ2hDLENBQUM7Q0FNRixDQUFBOztZQUhnQyxZQUFZOztBQWJoQyxrQkFBa0I7SUFMOUIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGlCQUFpQjtRQUMzQixRQUFRLEVBQUUsb0NBQW9DO1FBQzlDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO0tBQ2hELENBQUM7cUNBYytCLFlBQVk7R0FiaEMsa0JBQWtCLENBZ0I5QjtTQWhCWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEZpZWxkVHlwZSB9IGZyb20gJy4vZmllbGQudHlwZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Zvcm1seS10ZW1wbGF0ZScsXG4gIHRlbXBsYXRlOiBgPGRpdiBbaW5uZXJIdG1sXT1cInRlbXBsYXRlXCI+PC9kaXY+YCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seVRlbXBsYXRlVHlwZSBleHRlbmRzIEZpZWxkVHlwZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBpZiAodGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkLnRlbXBsYXRlICE9PSB0aGlzLmlubmVySHRtbC50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy5pbm5lckh0bWwgPSB7XG4gICAgICAgIHRlbXBsYXRlOiB0aGlzLmZpZWxkLnRlbXBsYXRlLFxuICAgICAgICBjb250ZW50OiB0aGlzLnRvLnNhZmVIdG1sID8gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5maWVsZC50ZW1wbGF0ZSkgOiB0aGlzLmZpZWxkLnRlbXBsYXRlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbm5lckh0bWwuY29udGVudDtcbiAgfVxuXG4gIHByaXZhdGUgaW5uZXJIdG1sID0geyBjb250ZW50OiBudWxsLCB0ZW1wbGF0ZTogbnVsbCB9O1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuIl19