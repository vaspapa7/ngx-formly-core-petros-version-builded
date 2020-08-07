import { ModuleWithProviders } from '@angular/core';
import { FormlyConfig } from './services/formly.config';
import { ConfigOption } from './models';
export declare function defaultFormlyConfig(config: FormlyConfig): ConfigOption;
export declare class FormlyModule {
    static forRoot(config?: ConfigOption): ModuleWithProviders<FormlyModule>;
    static forChild(config?: ConfigOption): ModuleWithProviders<FormlyModule>;
    constructor(configService: FormlyConfig, configs?: ConfigOption[]);
}
