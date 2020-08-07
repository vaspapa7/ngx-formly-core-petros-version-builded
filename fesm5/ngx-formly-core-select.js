import { __decorate } from 'tslib';
import { Pipe, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

var FormlySelectOptionsPipe = /** @class */ (function () {
    function FormlySelectOptionsPipe() {
    }
    FormlySelectOptionsPipe.prototype.transform = function (options, field) {
        var _this = this;
        if (!(options instanceof Observable)) {
            options = of(options);
        }
        return options.pipe(map(function (value) { return _this.transformOptions(value, field); }));
    };
    FormlySelectOptionsPipe.prototype.transformOptions = function (options, field) {
        var _this = this;
        var to = this.transformSelectProps(field);
        var opts = [];
        var groups = {};
        options.forEach(function (option) {
            var o = _this.transformOption(option, to);
            if (o.group) {
                var id_1 = groups[o.label];
                if (id_1 === undefined) {
                    groups[o.label] = opts.push(o) - 1;
                }
                else {
                    o.group.forEach(function (o) { return opts[id_1].group.push(o); });
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
    };
    FormlySelectOptionsPipe.prototype.transformOption = function (option, to) {
        var _this = this;
        var group = to.groupProp(option);
        if (Array.isArray(group)) {
            return {
                label: to.labelProp(option),
                group: group.map(function (opt) { return _this.transformOption(opt, to); }),
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
    };
    FormlySelectOptionsPipe.prototype.transformSelectProps = function (field) {
        var to = field && field.templateOptions ? field.templateOptions : {};
        var selectPropFn = function (prop) { return (typeof prop === 'function' ? prop : function (o) { return o[prop]; }); };
        return {
            groupProp: selectPropFn(to.groupProp || 'group'),
            labelProp: selectPropFn(to.labelProp || 'label'),
            valueProp: selectPropFn(to.valueProp || 'value'),
            disabledProp: selectPropFn(to.disabledProp || 'disabled'),
        };
    };
    FormlySelectOptionsPipe = __decorate([
        Pipe({ name: 'formlySelectOptions' })
    ], FormlySelectOptionsPipe);
    return FormlySelectOptionsPipe;
}());

var FormlySelectModule = /** @class */ (function () {
    function FormlySelectModule() {
    }
    FormlySelectModule = __decorate([
        NgModule({
            declarations: [FormlySelectOptionsPipe],
            exports: [FormlySelectOptionsPipe],
        })
    ], FormlySelectModule);
    return FormlySelectModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { FormlySelectModule, FormlySelectOptionsPipe as ɵFormlySelectOptionsPipe };
//# sourceMappingURL=ngx-formly-core-select.js.map
