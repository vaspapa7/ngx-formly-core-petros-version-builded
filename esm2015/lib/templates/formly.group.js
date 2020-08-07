import { __decorate } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from './field.type';
let FormlyGroup = class FormlyGroup extends FieldType {
};
FormlyGroup = __decorate([
    Component({
        selector: 'formly-group',
        template: `
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    <ng-content></ng-content>
  `,
        host: {
            '[class]': 'field.fieldGroupClassName || ""',
        },
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], FormlyGroup);
export { FormlyGroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5Lmdyb3VwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1mb3JtbHkvY29yZS8iLCJzb3VyY2VzIjpbImxpYi90ZW1wbGF0ZXMvZm9ybWx5Lmdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFhekMsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBWSxTQUFRLFNBQVM7Q0FBRyxDQUFBO0FBQWhDLFdBQVc7SUFYdkIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFOzs7R0FHVDtRQUNELElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxpQ0FBaUM7U0FDN0M7UUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtLQUNoRCxDQUFDO0dBQ1csV0FBVyxDQUFxQjtTQUFoQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmllbGRUeXBlIH0gZnJvbSAnLi9maWVsZC50eXBlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZm9ybWx5LWdyb3VwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8Zm9ybWx5LWZpZWxkICpuZ0Zvcj1cImxldCBmIG9mIGZpZWxkLmZpZWxkR3JvdXBcIiBbZmllbGRdPVwiZlwiPjwvZm9ybWx5LWZpZWxkPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzogJ2ZpZWxkLmZpZWxkR3JvdXBDbGFzc05hbWUgfHwgXCJcIicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBGb3JtbHlHcm91cCBleHRlbmRzIEZpZWxkVHlwZSB7fVxuIl19