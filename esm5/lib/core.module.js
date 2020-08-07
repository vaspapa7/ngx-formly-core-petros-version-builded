import { __decorate, __metadata, __param } from "tslib";
import { NgModule, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyForm } from './components/formly.form';
import { FormlyField } from './components/formly.field';
import { FormlyAttributes } from './templates/formly.attributes';
import { FormlyConfig, FORMLY_CONFIG } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.builder';
import { FormlyGroup } from './templates/formly.group';
import { FormlyValidationMessage } from './templates/formly.validation-message';
import { FormlyTemplateType } from './templates/field-template.type';
import { FieldExpressionExtension } from './extensions/field-expression/field-expression';
import { FieldValidationExtension } from './extensions/field-validation/field-validation';
import { FieldFormExtension } from './extensions/field-form/field-form';
import { CoreExtension } from './extensions/core/core';
export function defaultFormlyConfig(config) {
    return {
        types: [
            { name: 'formly-group', component: FormlyGroup },
            { name: 'formly-template', component: FormlyTemplateType },
        ],
        extensions: [
            { name: 'core', extension: new CoreExtension(config) },
            { name: 'field-validation', extension: new FieldValidationExtension(config) },
            { name: 'field-form', extension: new FieldFormExtension() },
            { name: 'field-expression', extension: new FieldExpressionExtension() },
        ],
    };
}
var FormlyModule = /** @class */ (function () {
    function FormlyModule(configService, configs) {
        if (configs === void 0) { configs = []; }
        if (!configs) {
            return;
        }
        configs.forEach(function (config) { return configService.addConfig(config); });
    }
    FormlyModule_1 = FormlyModule;
    FormlyModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: FormlyModule_1,
            providers: [
                { provide: FORMLY_CONFIG, multi: true, useFactory: defaultFormlyConfig, deps: [FormlyConfig] },
                { provide: FORMLY_CONFIG, useValue: config, multi: true },
                FormlyConfig,
                FormlyFormBuilder,
            ],
        };
    };
    FormlyModule.forChild = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: FormlyModule_1,
            providers: [{ provide: FORMLY_CONFIG, useValue: config, multi: true }, FormlyFormBuilder],
        };
    };
    var FormlyModule_1;
    FormlyModule.ctorParameters = function () { return [
        { type: FormlyConfig },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [FORMLY_CONFIG,] }] }
    ]; };
    FormlyModule = FormlyModule_1 = __decorate([
        NgModule({
            declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage, FormlyTemplateType],
            exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
            imports: [CommonModule],
        }),
        __param(1, Optional()), __param(1, Inject(FORMLY_CONFIG)),
        __metadata("design:paramtypes", [FormlyConfig, Array])
    ], FormlyModule);
    return FormlyModule;
}());
export { FormlyModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlLyIsInNvdXJjZXMiOlsibGliL2NvcmUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRXJFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUd2RCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsTUFBb0I7SUFDdEQsT0FBTztRQUNMLEtBQUssRUFBRTtZQUNMLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFO1lBQ2hELEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtTQUMzRDtRQUNELFVBQVUsRUFBRTtZQUNWLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLElBQUksd0JBQXdCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0UsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLGtCQUFrQixFQUFFLEVBQUU7WUFDM0QsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLElBQUksd0JBQXdCLEVBQUUsRUFBRTtTQUN4RTtLQUNGLENBQUM7QUFDSixDQUFDO0FBT0Q7SUFvQkUsc0JBQVksYUFBMkIsRUFBcUMsT0FBNEI7UUFBNUIsd0JBQUEsRUFBQSxZQUE0QjtRQUN0RyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTztTQUNSO1FBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sSUFBSyxPQUFBLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQztJQUMvRCxDQUFDO3FCQTFCVSxZQUFZO0lBQ2hCLG9CQUFPLEdBQWQsVUFBZSxNQUF5QjtRQUF6Qix1QkFBQSxFQUFBLFdBQXlCO1FBQ3RDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBWTtZQUN0QixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUM5RixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2dCQUN6RCxZQUFZO2dCQUNaLGlCQUFpQjthQUNsQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0scUJBQVEsR0FBZixVQUFnQixNQUF5QjtRQUF6Qix1QkFBQSxFQUFBLFdBQXlCO1FBQ3ZDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBWTtZQUN0QixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsaUJBQWlCLENBQUM7U0FDMUYsQ0FBQztJQUNKLENBQUM7OztnQkFFMEIsWUFBWTs0Q0FBRyxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7O0lBcEIvRCxZQUFZO1FBTHhCLFFBQVEsQ0FBQztZQUNSLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDO1lBQ25ILE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixDQUFDO1lBQzFGLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QixDQUFDO1FBcUIwQyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7eUNBQWhELFlBQVk7T0FwQjVCLFlBQVksQ0EyQnhCO0lBQUQsbUJBQUM7Q0FBQSxBQTNCRCxJQTJCQztTQTNCWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIEluamVjdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3JtbHlGb3JtIH0gZnJvbSAnLi9jb21wb25lbnRzL2Zvcm1seS5mb3JtJztcbmltcG9ydCB7IEZvcm1seUZpZWxkIH0gZnJvbSAnLi9jb21wb25lbnRzL2Zvcm1seS5maWVsZCc7XG5pbXBvcnQgeyBGb3JtbHlBdHRyaWJ1dGVzIH0gZnJvbSAnLi90ZW1wbGF0ZXMvZm9ybWx5LmF0dHJpYnV0ZXMnO1xuaW1wb3J0IHsgRm9ybWx5Q29uZmlnLCBGT1JNTFlfQ09ORklHIH0gZnJvbSAnLi9zZXJ2aWNlcy9mb3JtbHkuY29uZmlnJztcbmltcG9ydCB7IEZvcm1seUZvcm1CdWlsZGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9mb3JtbHkuYnVpbGRlcic7XG5pbXBvcnQgeyBGb3JtbHlHcm91cCB9IGZyb20gJy4vdGVtcGxhdGVzL2Zvcm1seS5ncm91cCc7XG5pbXBvcnQgeyBGb3JtbHlWYWxpZGF0aW9uTWVzc2FnZSB9IGZyb20gJy4vdGVtcGxhdGVzL2Zvcm1seS52YWxpZGF0aW9uLW1lc3NhZ2UnO1xuaW1wb3J0IHsgRm9ybWx5VGVtcGxhdGVUeXBlIH0gZnJvbSAnLi90ZW1wbGF0ZXMvZmllbGQtdGVtcGxhdGUudHlwZSc7XG5cbmltcG9ydCB7IEZpZWxkRXhwcmVzc2lvbkV4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9ucy9maWVsZC1leHByZXNzaW9uL2ZpZWxkLWV4cHJlc3Npb24nO1xuaW1wb3J0IHsgRmllbGRWYWxpZGF0aW9uRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb25zL2ZpZWxkLXZhbGlkYXRpb24vZmllbGQtdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBGaWVsZEZvcm1FeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbnMvZmllbGQtZm9ybS9maWVsZC1mb3JtJztcbmltcG9ydCB7IENvcmVFeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbnMvY29yZS9jb3JlJztcbmltcG9ydCB7IENvbmZpZ09wdGlvbiB9IGZyb20gJy4vbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRGb3JtbHlDb25maWcoY29uZmlnOiBGb3JtbHlDb25maWcpOiBDb25maWdPcHRpb24ge1xuICByZXR1cm4ge1xuICAgIHR5cGVzOiBbXG4gICAgICB7IG5hbWU6ICdmb3JtbHktZ3JvdXAnLCBjb21wb25lbnQ6IEZvcm1seUdyb3VwIH0sXG4gICAgICB7IG5hbWU6ICdmb3JtbHktdGVtcGxhdGUnLCBjb21wb25lbnQ6IEZvcm1seVRlbXBsYXRlVHlwZSB9LFxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogW1xuICAgICAgeyBuYW1lOiAnY29yZScsIGV4dGVuc2lvbjogbmV3IENvcmVFeHRlbnNpb24oY29uZmlnKSB9LFxuICAgICAgeyBuYW1lOiAnZmllbGQtdmFsaWRhdGlvbicsIGV4dGVuc2lvbjogbmV3IEZpZWxkVmFsaWRhdGlvbkV4dGVuc2lvbihjb25maWcpIH0sXG4gICAgICB7IG5hbWU6ICdmaWVsZC1mb3JtJywgZXh0ZW5zaW9uOiBuZXcgRmllbGRGb3JtRXh0ZW5zaW9uKCkgfSxcbiAgICAgIHsgbmFtZTogJ2ZpZWxkLWV4cHJlc3Npb24nLCBleHRlbnNpb246IG5ldyBGaWVsZEV4cHJlc3Npb25FeHRlbnNpb24oKSB9LFxuICAgIF0sXG4gIH07XG59XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0Zvcm1seUZvcm0sIEZvcm1seUZpZWxkLCBGb3JtbHlBdHRyaWJ1dGVzLCBGb3JtbHlHcm91cCwgRm9ybWx5VmFsaWRhdGlvbk1lc3NhZ2UsIEZvcm1seVRlbXBsYXRlVHlwZV0sXG4gIGV4cG9ydHM6IFtGb3JtbHlGb3JtLCBGb3JtbHlGaWVsZCwgRm9ybWx5QXR0cmlidXRlcywgRm9ybWx5R3JvdXAsIEZvcm1seVZhbGlkYXRpb25NZXNzYWdlXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogQ29uZmlnT3B0aW9uID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZvcm1seU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRm9ybWx5TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogRk9STUxZX0NPTkZJRywgbXVsdGk6IHRydWUsIHVzZUZhY3Rvcnk6IGRlZmF1bHRGb3JtbHlDb25maWcsIGRlcHM6IFtGb3JtbHlDb25maWddIH0sXG4gICAgICAgIHsgcHJvdmlkZTogRk9STUxZX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZywgbXVsdGk6IHRydWUgfSxcbiAgICAgICAgRm9ybWx5Q29uZmlnLFxuICAgICAgICBGb3JtbHlGb3JtQnVpbGRlcixcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JDaGlsZChjb25maWc6IENvbmZpZ09wdGlvbiA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxGb3JtbHlNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEZvcm1seU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogRk9STUxZX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZywgbXVsdGk6IHRydWUgfSwgRm9ybWx5Rm9ybUJ1aWxkZXJdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihjb25maWdTZXJ2aWNlOiBGb3JtbHlDb25maWcsIEBPcHRpb25hbCgpIEBJbmplY3QoRk9STUxZX0NPTkZJRykgY29uZmlnczogQ29uZmlnT3B0aW9uW10gPSBbXSkge1xuICAgIGlmICghY29uZmlncykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbmZpZ3MuZm9yRWFjaCgoY29uZmlnKSA9PiBjb25maWdTZXJ2aWNlLmFkZENvbmZpZyhjb25maWcpKTtcbiAgfVxufVxuIl19