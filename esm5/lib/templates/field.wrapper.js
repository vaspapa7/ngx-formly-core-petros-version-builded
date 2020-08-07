import { __decorate, __extends, __metadata } from "tslib";
import { ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { FieldType } from './field.type';
var FieldWrapper = /** @class */ (function (_super) {
    __extends(FieldWrapper, _super);
    function FieldWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        ViewChild('fieldComponent', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], FieldWrapper.prototype, "fieldComponent", void 0);
    FieldWrapper = __decorate([
        Directive()
    ], FieldWrapper);
    return FieldWrapper;
}(FieldType));
export { FieldWrapper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQud3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvIiwic291cmNlcyI6WyJsaWIvdGVtcGxhdGVzL2ZpZWxkLndyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFJekM7SUFBNEYsZ0NBQVk7SUFBeEc7O0lBRUEsQ0FBQztJQUQwRDtRQUF4RCxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztrQ0FBaUIsZ0JBQWdCO3dEQUFDO0lBRHRFLFlBQVk7UUFEakMsU0FBUyxFQUFFO09BQ1UsWUFBWSxDQUVqQztJQUFELG1CQUFDO0NBQUEsQUFGRCxDQUE0RixTQUFTLEdBRXBHO1NBRnFCLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBWaWV3Q2hpbGQsIERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmllbGRUeXBlIH0gZnJvbSAnLi9maWVsZC50eXBlJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmllbGRXcmFwcGVyPEYgZXh0ZW5kcyBGb3JtbHlGaWVsZENvbmZpZyA9IEZvcm1seUZpZWxkQ29uZmlnPiBleHRlbmRzIEZpZWxkVHlwZTxGPiB7XG4gIEBWaWV3Q2hpbGQoJ2ZpZWxkQ29tcG9uZW50JywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIGZpZWxkQ29tcG9uZW50OiBWaWV3Q29udGFpbmVyUmVmO1xufVxuIl19