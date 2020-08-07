import { __decorate, __extends } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from './field.type';
var FormlyGroup = /** @class */ (function (_super) {
    __extends(FormlyGroup, _super);
    function FormlyGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormlyGroup = __decorate([
        Component({
            selector: 'formly-group',
            template: "\n    <formly-field *ngFor=\"let f of field.fieldGroup\" [field]=\"f\"></formly-field>\n    <ng-content></ng-content>\n  ",
            host: {
                '[class]': 'field.fieldGroupClassName || ""',
            },
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], FormlyGroup);
    return FormlyGroup;
}(FieldType));
export { FormlyGroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5Lmdyb3VwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1mb3JtbHkvY29yZS8iLCJzb3VyY2VzIjpbImxpYi90ZW1wbGF0ZXMvZm9ybWx5Lmdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFhekM7SUFBaUMsK0JBQVM7SUFBMUM7O0lBQTRDLENBQUM7SUFBaEMsV0FBVztRQVh2QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsMkhBR1Q7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLGlDQUFpQzthQUM3QztZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7T0FDVyxXQUFXLENBQXFCO0lBQUQsa0JBQUM7Q0FBQSxBQUE3QyxDQUFpQyxTQUFTLEdBQUc7U0FBaEMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZpZWxkVHlwZSB9IGZyb20gJy4vZmllbGQudHlwZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Zvcm1seS1ncm91cCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGZvcm1seS1maWVsZCAqbmdGb3I9XCJsZXQgZiBvZiBmaWVsZC5maWVsZEdyb3VwXCIgW2ZpZWxkXT1cImZcIj48L2Zvcm1seS1maWVsZD5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6ICdmaWVsZC5maWVsZEdyb3VwQ2xhc3NOYW1lIHx8IFwiXCInLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgRm9ybWx5R3JvdXAgZXh0ZW5kcyBGaWVsZFR5cGUge31cbiJdfQ==