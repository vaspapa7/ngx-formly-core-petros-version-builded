import { __decorate } from 'tslib';
import { Pipe, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

let FormlySelectOptionsPipe = class FormlySelectOptionsPipe {
    transform(options, field) {
        if (!(options instanceof Observable)) {
            options = of(options);
        }
        return options.pipe(map((value) => this.transformOptions(value, field)));
    }
    transformOptions(options, field) {
        const to = this.transformSelectProps(field);
        const opts = [];
        const groups = {};
        options.forEach((option) => {
            const o = this.transformOption(option, to);
            if (o.group) {
                const id = groups[o.label];
                if (id === undefined) {
                    groups[o.label] = opts.push(o) - 1;
                }
                else {
                    o.group.forEach((o) => opts[id].group.push(o));
                }
            }
            else {
                opts.push(o);
            }
        });
        if (field && field.templateOptions) {
            field.templateOptions._flatOptions = !Object.keys(groups).length;
        }
        return opts;
    }
    transformOption(option, to) {
        const group = to.groupProp(option);
        if (Array.isArray(group)) {
            return {
                label: to.labelProp(option),
                group: group.map((opt) => this.transformOption(opt, to)),
            };
        }
        option = {
            label: to.labelProp(option),
            value: to.valueProp(option),
            disabled: !!to.disabledProp(option),
        };
        if (group) {
            return { label: group, group: [option] };
        }
        return option;
    }
    transformSelectProps(field) {
        const to = field && field.templateOptions ? field.templateOptions : {};
        const selectPropFn = (prop) => (typeof prop === 'function' ? prop : (o) => o[prop]);
        return {
            groupProp: selectPropFn(to.groupProp || 'group'),
            labelProp: selectPropFn(to.labelProp || 'label'),
            valueProp: selectPropFn(to.valueProp || 'value'),
            disabledProp: selectPropFn(to.disabledProp || 'disabled'),
        };
    }
};
FormlySelectOptionsPipe = __decorate([
    Pipe({ name: 'formlySelectOptions' })
], FormlySelectOptionsPipe);

let FormlySelectModule = class FormlySelectModule {
};
FormlySelectModule = __decorate([
    NgModule({
        declarations: [FormlySelectOptionsPipe],
        exports: [FormlySelectOptionsPipe],
    })
], FormlySelectModule);

/**
 * Generated bundle index. Do not edit.
 */

export { FormlySelectModule, FormlySelectOptionsPipe as ɵFormlySelectOptionsPipe };
//# sourceMappingURL=ngx-formly-core-select.js.map
