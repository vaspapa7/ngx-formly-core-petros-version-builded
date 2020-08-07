var FormlyModule_1;
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
let FormlyModule = FormlyModule_1 = class FormlyModule {
    constructor(configService, configs = []) {
        if (!configs) {
            return;
        }
        configs.forEach((config) => configService.addConfig(config));
    }
    static forRoot(config = {}) {
        return {
            ngModule: FormlyModule_1,
            providers: [
                { provide: FORMLY_CONFIG, multi: true, useFactory: defaultFormlyConfig, deps: [FormlyConfig] },
                { provide: FORMLY_CONFIG, useValue: config, multi: true },
                FormlyConfig,
                FormlyFormBuilder,
            ],
        };
    }
    static forChild(config = {}) {
        return {
            ngModule: FormlyModule_1,
            providers: [{ provide: FORMLY_CONFIG, useValue: config, multi: true }, FormlyFormBuilder],
        };
    }
};
FormlyModule.ctorParameters = () => [
    { type: FormlyConfig },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [FORMLY_CONFIG,] }] }
];
FormlyModule = FormlyModule_1 = __decorate([
    NgModule({
        declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage, FormlyTemplateType],
        exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
        imports: [CommonModule],
    }),
    __param(1, Optional()), __param(1, Inject(FORMLY_CONFIG)),
    __metadata("design:paramtypes", [FormlyConfig, Array])
], FormlyModule);
export { FormlyModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlLyIsInNvdXJjZXMiOlsibGliL2NvcmUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVyRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHdkQsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQW9CO0lBQ3RELE9BQU87UUFDTCxLQUFLLEVBQUU7WUFDTCxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRTtZQUNoRCxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUU7U0FDM0Q7UUFDRCxVQUFVLEVBQUU7WUFDVixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RELEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxJQUFJLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxrQkFBa0IsRUFBRSxFQUFFO1lBQzNELEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxJQUFJLHdCQUF3QixFQUFFLEVBQUU7U0FDeEU7S0FDRixDQUFDO0FBQ0osQ0FBQztBQU9ELElBQWEsWUFBWSxvQkFBekIsTUFBYSxZQUFZO0lBb0J2QixZQUFZLGFBQTJCLEVBQXFDLFVBQTBCLEVBQUU7UUFDdEcsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU87U0FDUjtRQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBekJELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBdUIsRUFBRTtRQUN0QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGNBQVk7WUFDdEIsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUYsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDekQsWUFBWTtnQkFDWixpQkFBaUI7YUFDbEI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBdUIsRUFBRTtRQUN2QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGNBQVk7WUFDdEIsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLGlCQUFpQixDQUFDO1NBQzFGLENBQUM7SUFDSixDQUFDO0NBU0YsQ0FBQTs7WUFQNEIsWUFBWTt3Q0FBRyxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7O0FBcEIvRCxZQUFZO0lBTHhCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDO1FBQ25ILE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixDQUFDO1FBQzFGLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztLQUN4QixDQUFDO0lBcUIwQyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7cUNBQWhELFlBQVk7R0FwQjVCLFlBQVksQ0EyQnhCO1NBM0JZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgSW5qZWN0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1seUZvcm0gfSBmcm9tICcuL2NvbXBvbmVudHMvZm9ybWx5LmZvcm0nO1xuaW1wb3J0IHsgRm9ybWx5RmllbGQgfSBmcm9tICcuL2NvbXBvbmVudHMvZm9ybWx5LmZpZWxkJztcbmltcG9ydCB7IEZvcm1seUF0dHJpYnV0ZXMgfSBmcm9tICcuL3RlbXBsYXRlcy9mb3JtbHkuYXR0cmlidXRlcyc7XG5pbXBvcnQgeyBGb3JtbHlDb25maWcsIEZPUk1MWV9DT05GSUcgfSBmcm9tICcuL3NlcnZpY2VzL2Zvcm1seS5jb25maWcnO1xuaW1wb3J0IHsgRm9ybWx5Rm9ybUJ1aWxkZXIgfSBmcm9tICcuL3NlcnZpY2VzL2Zvcm1seS5idWlsZGVyJztcbmltcG9ydCB7IEZvcm1seUdyb3VwIH0gZnJvbSAnLi90ZW1wbGF0ZXMvZm9ybWx5Lmdyb3VwJztcbmltcG9ydCB7IEZvcm1seVZhbGlkYXRpb25NZXNzYWdlIH0gZnJvbSAnLi90ZW1wbGF0ZXMvZm9ybWx5LnZhbGlkYXRpb24tbWVzc2FnZSc7XG5pbXBvcnQgeyBGb3JtbHlUZW1wbGF0ZVR5cGUgfSBmcm9tICcuL3RlbXBsYXRlcy9maWVsZC10ZW1wbGF0ZS50eXBlJztcblxuaW1wb3J0IHsgRmllbGRFeHByZXNzaW9uRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb25zL2ZpZWxkLWV4cHJlc3Npb24vZmllbGQtZXhwcmVzc2lvbic7XG5pbXBvcnQgeyBGaWVsZFZhbGlkYXRpb25FeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbnMvZmllbGQtdmFsaWRhdGlvbi9maWVsZC12YWxpZGF0aW9uJztcbmltcG9ydCB7IEZpZWxkRm9ybUV4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9ucy9maWVsZC1mb3JtL2ZpZWxkLWZvcm0nO1xuaW1wb3J0IHsgQ29yZUV4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9ucy9jb3JlL2NvcmUnO1xuaW1wb3J0IHsgQ29uZmlnT3B0aW9uIH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdEZvcm1seUNvbmZpZyhjb25maWc6IEZvcm1seUNvbmZpZyk6IENvbmZpZ09wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgdHlwZXM6IFtcbiAgICAgIHsgbmFtZTogJ2Zvcm1seS1ncm91cCcsIGNvbXBvbmVudDogRm9ybWx5R3JvdXAgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1seS10ZW1wbGF0ZScsIGNvbXBvbmVudDogRm9ybWx5VGVtcGxhdGVUeXBlIH0sXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbXG4gICAgICB7IG5hbWU6ICdjb3JlJywgZXh0ZW5zaW9uOiBuZXcgQ29yZUV4dGVuc2lvbihjb25maWcpIH0sXG4gICAgICB7IG5hbWU6ICdmaWVsZC12YWxpZGF0aW9uJywgZXh0ZW5zaW9uOiBuZXcgRmllbGRWYWxpZGF0aW9uRXh0ZW5zaW9uKGNvbmZpZykgfSxcbiAgICAgIHsgbmFtZTogJ2ZpZWxkLWZvcm0nLCBleHRlbnNpb246IG5ldyBGaWVsZEZvcm1FeHRlbnNpb24oKSB9LFxuICAgICAgeyBuYW1lOiAnZmllbGQtZXhwcmVzc2lvbicsIGV4dGVuc2lvbjogbmV3IEZpZWxkRXhwcmVzc2lvbkV4dGVuc2lvbigpIH0sXG4gICAgXSxcbiAgfTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbRm9ybWx5Rm9ybSwgRm9ybWx5RmllbGQsIEZvcm1seUF0dHJpYnV0ZXMsIEZvcm1seUdyb3VwLCBGb3JtbHlWYWxpZGF0aW9uTWVzc2FnZSwgRm9ybWx5VGVtcGxhdGVUeXBlXSxcbiAgZXhwb3J0czogW0Zvcm1seUZvcm0sIEZvcm1seUZpZWxkLCBGb3JtbHlBdHRyaWJ1dGVzLCBGb3JtbHlHcm91cCwgRm9ybWx5VmFsaWRhdGlvbk1lc3NhZ2VdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgRm9ybWx5TW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBDb25maWdPcHRpb24gPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Rm9ybWx5TW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBGb3JtbHlNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBGT1JNTFlfQ09ORklHLCBtdWx0aTogdHJ1ZSwgdXNlRmFjdG9yeTogZGVmYXVsdEZvcm1seUNvbmZpZywgZGVwczogW0Zvcm1seUNvbmZpZ10gfSxcbiAgICAgICAgeyBwcm92aWRlOiBGT1JNTFlfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnLCBtdWx0aTogdHJ1ZSB9LFxuICAgICAgICBGb3JtbHlDb25maWcsXG4gICAgICAgIEZvcm1seUZvcm1CdWlsZGVyLFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKGNvbmZpZzogQ29uZmlnT3B0aW9uID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZvcm1seU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRm9ybWx5TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBGT1JNTFlfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnLCBtdWx0aTogdHJ1ZSB9LCBGb3JtbHlGb3JtQnVpbGRlcl0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZ1NlcnZpY2U6IEZvcm1seUNvbmZpZywgQE9wdGlvbmFsKCkgQEluamVjdChGT1JNTFlfQ09ORklHKSBjb25maWdzOiBDb25maWdPcHRpb25bXSA9IFtdKSB7XG4gICAgaWYgKCFjb25maWdzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IGNvbmZpZ1NlcnZpY2UuYWRkQ29uZmlnKGNvbmZpZykpO1xuICB9XG59XG4iXX0=