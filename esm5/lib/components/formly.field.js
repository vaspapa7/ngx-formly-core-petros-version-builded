import { __decorate, __metadata, __read, __values } from "tslib";
import { Component, Input, ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, ComponentFactoryResolver, OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit, Renderer2, ElementRef, ChangeDetectionStrategy, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { defineHiddenProp, observe, observeDeep, getFieldValue, assignFieldValue } from '../utils';
import { isObservable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
var FormlyField = /** @class */ (function () {
    function FormlyField(config, renderer, resolver, elementRef) {
        this.config = config;
        this.renderer = renderer;
        this.resolver = resolver;
        this.elementRef = elementRef;
        this.hostObservers = [];
        this.componentRefs = [];
        this.hooksObservers = [];
        this.valueChangesUnsubscribe = function () { };
    }
    FormlyField.prototype.ngAfterContentInit = function () {
        this.triggerHook('afterContentInit');
    };
    FormlyField.prototype.ngAfterViewInit = function () {
        this.triggerHook('afterViewInit');
    };
    FormlyField.prototype.ngOnInit = function () {
        this.triggerHook('onInit');
    };
    FormlyField.prototype.ngOnChanges = function (changes) {
        this.triggerHook('onChanges', changes);
    };
    FormlyField.prototype.ngOnDestroy = function () {
        this.resetRefs(this.field);
        this.hostObservers.forEach(function (hostObserver) { return hostObserver.unsubscribe(); });
        this.hooksObservers.forEach(function (unsubscribe) { return unsubscribe(); });
        this.valueChangesUnsubscribe();
        this.triggerHook('onDestroy');
    };
    FormlyField.prototype.renderField = function (containerRef, f, wrappers) {
        var _this = this;
        if (this.containerRef === containerRef) {
            this.resetRefs(this.field);
            this.containerRef.clear();
        }
        if (wrappers && wrappers.length > 0) {
            var _a = __read(wrappers), wrapper = _a[0], wps_1 = _a.slice(1);
            var component = this.config.getWrapper(wrapper).component;
            var ref_1 = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref_1, f);
            observe(ref_1.instance, ['fieldComponent'], function (_a) {
                var currentValue = _a.currentValue, previousValue = _a.previousValue, firstChange = _a.firstChange;
                if (currentValue) {
                    var viewRef = previousValue ? previousValue.detach() : null;
                    if (viewRef && !viewRef.destroyed) {
                        currentValue.insert(viewRef);
                    }
                    else {
                        _this.renderField(currentValue, f, wps_1);
                    }
                    !firstChange && ref_1.changeDetectorRef.detectChanges();
                }
            });
        }
        else if (f && f.type) {
            var component = this.config.getType(f.type).component;
            var ref = containerRef.createComponent(this.resolver.resolveComponentFactory(component));
            this.attachComponentRef(ref, f);
        }
    };
    FormlyField.prototype.triggerHook = function (name, changes) {
        if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
            this.valueChangesUnsubscribe = this.fieldChanges(this.field);
        }
        if (this.field && this.field.hooks && this.field.hooks[name]) {
            if (!changes || changes.field) {
                var r = this.field.hooks[name](this.field);
                if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
                    var sub_1 = r.subscribe();
                    this.hooksObservers.push(function () { return sub_1.unsubscribe(); });
                }
            }
        }
        if (name === 'onChanges' && changes.field) {
            this.renderHostBinding();
            this.resetRefs(changes.field.previousValue);
            this.renderField(this.containerRef, this.field, this.field ? this.field.wrappers : []);
        }
    };
    FormlyField.prototype.attachComponentRef = function (ref, field) {
        this.componentRefs.push(ref);
        field._componentRefs.push(ref);
        Object.assign(ref.instance, { field: field });
    };
    FormlyField.prototype.renderHostBinding = function () {
        var _this = this;
        if (!this.field) {
            return;
        }
        this.hostObservers.forEach(function (hostObserver) { return hostObserver.unsubscribe(); });
        this.hostObservers = [
            observe(this.field, ['hide'], function (_a) {
                var firstChange = _a.firstChange, currentValue = _a.currentValue;
                if (!firstChange || (firstChange && currentValue)) {
                    _this.renderer.setStyle(_this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
                }
            }),
            observe(this.field, ['className'], function (_a) {
                var firstChange = _a.firstChange, currentValue = _a.currentValue;
                if (!firstChange || (firstChange && currentValue)) {
                    _this.renderer.setAttribute(_this.elementRef.nativeElement, 'class', currentValue);
                }
            }),
        ];
    };
    FormlyField.prototype.resetRefs = function (field) {
        var _this = this;
        if (field) {
            if (field._componentRefs) {
                field._componentRefs = field._componentRefs.filter(function (ref) { return _this.componentRefs.indexOf(ref) === -1; });
            }
            else {
                defineHiddenProp(this.field, '_componentRefs', []);
            }
        }
        this.componentRefs = [];
    };
    FormlyField.prototype.fieldChanges = function (field) {
        var e_1, _a;
        this.valueChangesUnsubscribe();
        if (!field) {
            return function () { };
        }
        var subscribes = [
            observeDeep({
                source: field,
                target: field.templateOptions,
                paths: ['templateOptions'],
                setFn: function () { return field.options.detectChanges(field); },
            }),
            observeDeep({
                source: field,
                target: field.options.formState,
                paths: ['options', 'formState'],
                setFn: function () { return field.options.detectChanges(field); },
            }),
        ];
        var _loop_1 = function (path) {
            var fieldObserver = observe(field, path, function (_a) {
                var firstChange = _a.firstChange;
                return !firstChange && field.options.detectChanges(field);
            });
            subscribes.push(function () { return fieldObserver.unsubscribe(); });
        };
        try {
            for (var _b = __values([['template'], ['fieldGroupClassName'], ['validation', 'show']]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var path = _c.value;
                _loop_1(path);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (field.key && !field.fieldGroup) {
            var control_1 = field.formControl;
            var valueChanges = control_1.valueChanges.pipe(distinctUntilChanged());
            if (control_1.value !== getFieldValue(field)) {
                valueChanges = valueChanges.pipe(startWith(control_1.value));
            }
            var _d = field.modelOptions, updateOn = _d.updateOn, debounce = _d.debounce;
            if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
                valueChanges = control_1.valueChanges.pipe(debounceTime(debounce.default));
            }
            var sub_2 = valueChanges.subscribe(function (value) {
                // workaround for https://github.com/angular/angular/issues/13792
                if (control_1 instanceof FormControl && control_1['_fields'] && control_1['_fields'].length > 1) {
                    control_1.patchValue(value, { emitEvent: false, onlySelf: true });
                }
                if (field.parsers && field.parsers.length > 0) {
                    field.parsers.forEach(function (parserFn) { return (value = parserFn(value)); });
                }
                assignFieldValue(field, value, true);
                field.options.fieldChanges.next({ value: value, field: field, type: 'valueChanges' });
            });
            subscribes.push(function () { return sub_2.unsubscribe(); });
        }
        return function () { return subscribes.forEach(function (subscribe) { return subscribe(); }); };
    };
    FormlyField.ctorParameters = function () { return [
        { type: FormlyConfig },
        { type: Renderer2 },
        { type: ComponentFactoryResolver },
        { type: ElementRef }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], FormlyField.prototype, "field", void 0);
    __decorate([
        ViewChild('container', { read: ViewContainerRef, static: true }),
        __metadata("design:type", ViewContainerRef)
    ], FormlyField.prototype, "containerRef", void 0);
    FormlyField = __decorate([
        Component({
            selector: 'formly-field',
            template: '<ng-template #container></ng-template>',
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [FormlyConfig,
            Renderer2,
            ComponentFactoryResolver,
            ElementRef])
    ], FormlyField);
    return FormlyField;
}());
export { FormlyField };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LmZpZWxkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1mb3JtbHkvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm1seS5maWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxZQUFZLEVBQ1osYUFBYSxFQUNiLHdCQUF3QixFQUN4QixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLFNBQVMsRUFDVCxVQUFVLEVBQ1YsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR25HLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQU8vRTtJQVdFLHFCQUNVLE1BQW9CLEVBQ3BCLFFBQW1CLEVBQ25CLFFBQWtDLEVBQ2xDLFVBQXNCO1FBSHRCLFdBQU0sR0FBTixNQUFNLENBQWM7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBVnhCLGtCQUFhLEdBQWlDLEVBQUUsQ0FBQztRQUNqRCxrQkFBYSxHQUFVLEVBQUUsQ0FBQztRQUMxQixtQkFBYyxHQUFlLEVBQUUsQ0FBQztRQUV4Qyw0QkFBdUIsR0FBRyxjQUFPLENBQUMsQ0FBQztJQU9oQyxD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QUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUMxRSxDQUFDLENBQUMsQ0FBQztZQUVILFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsT0FBTyxjQUFNLE9BQUEsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLFNBQVMsRUFBRSxFQUFYLENBQVcsQ0FBQyxFQUE5QyxDQUE4QyxDQUFDO0lBQzlELENBQUM7O2dCQXRMaUIsWUFBWTtnQkFDVixTQUFTO2dCQUNULHdCQUF3QjtnQkFDdEIsVUFBVTs7SUFkdkI7UUFBUixLQUFLLEVBQUU7OzhDQUEwQjtJQUVnQztRQUFqRSxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztrQ0FBZSxnQkFBZ0I7cURBQUM7SUFIdEYsV0FBVztRQUx2QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsd0NBQXdDO1lBQ2xELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7eUNBYWtCLFlBQVk7WUFDVixTQUFTO1lBQ1Qsd0JBQXdCO1lBQ3RCLFVBQVU7T0FmckIsV0FBVyxDQW1NdkI7SUFBRCxrQkFBQztDQUFBLEFBbk1ELElBbU1DO1NBbk1ZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3Q2hpbGQsXG4gIENvbXBvbmVudFJlZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRm9ybWx5Q29uZmlnIH0gZnJvbSAnLi4vc2VydmljZXMvZm9ybWx5LmNvbmZpZyc7XG5pbXBvcnQgeyBGb3JtbHlGaWVsZENvbmZpZywgRm9ybWx5RmllbGRDb25maWdDYWNoZSB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBkZWZpbmVIaWRkZW5Qcm9wLCBvYnNlcnZlLCBvYnNlcnZlRGVlcCwgZ2V0RmllbGRWYWx1ZSwgYXNzaWduRmllbGRWYWx1ZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEZpZWxkV3JhcHBlciB9IGZyb20gJy4uL3RlbXBsYXRlcy9maWVsZC53cmFwcGVyJztcbmltcG9ydCB7IEZpZWxkVHlwZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9maWVsZC50eXBlJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmb3JtbHktZmllbGQnLFxuICB0ZW1wbGF0ZTogJzxuZy10ZW1wbGF0ZSAjY29udGFpbmVyPjwvbmctdGVtcGxhdGU+JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seUZpZWxkIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZztcblxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogdHJ1ZSB9KSBjb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgcHJpdmF0ZSBob3N0T2JzZXJ2ZXJzOiBSZXR1cm5UeXBlPHR5cGVvZiBvYnNlcnZlPltdID0gW107XG4gIHByaXZhdGUgY29tcG9uZW50UmVmczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBob29rc09ic2VydmVyczogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIHZhbHVlQ2hhbmdlc1Vuc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb25maWc6IEZvcm1seUNvbmZpZyxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgKSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnRyaWdnZXJIb29rKCdhZnRlckNvbnRlbnRJbml0Jyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy50cmlnZ2VySG9vaygnYWZ0ZXJWaWV3SW5pdCcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy50cmlnZ2VySG9vaygnb25Jbml0Jyk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgdGhpcy50cmlnZ2VySG9vaygnb25DaGFuZ2VzJywgY2hhbmdlcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlc2V0UmVmcyh0aGlzLmZpZWxkKTtcbiAgICB0aGlzLmhvc3RPYnNlcnZlcnMuZm9yRWFjaCgoaG9zdE9ic2VydmVyKSA9PiBob3N0T2JzZXJ2ZXIudW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5ob29rc09ic2VydmVycy5mb3JFYWNoKCh1bnN1YnNjcmliZSkgPT4gdW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZXNVbnN1YnNjcmliZSgpO1xuICAgIHRoaXMudHJpZ2dlckhvb2soJ29uRGVzdHJveScpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGaWVsZChjb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIGY6IEZvcm1seUZpZWxkQ29uZmlnQ2FjaGUsIHdyYXBwZXJzOiBzdHJpbmdbXSkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lclJlZiA9PT0gY29udGFpbmVyUmVmKSB7XG4gICAgICB0aGlzLnJlc2V0UmVmcyh0aGlzLmZpZWxkKTtcbiAgICAgIHRoaXMuY29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgaWYgKHdyYXBwZXJzICYmIHdyYXBwZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IFt3cmFwcGVyLCAuLi53cHNdID0gd3JhcHBlcnM7XG4gICAgICBjb25zdCB7IGNvbXBvbmVudCB9ID0gdGhpcy5jb25maWcuZ2V0V3JhcHBlcih3cmFwcGVyKTtcblxuICAgICAgY29uc3QgcmVmID0gY29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudDxGaWVsZFdyYXBwZXI+KHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KSk7XG4gICAgICB0aGlzLmF0dGFjaENvbXBvbmVudFJlZihyZWYsIGYpO1xuICAgICAgb2JzZXJ2ZTxWaWV3Q29udGFpbmVyUmVmPihyZWYuaW5zdGFuY2UsIFsnZmllbGRDb21wb25lbnQnXSwgKHsgY3VycmVudFZhbHVlLCBwcmV2aW91c1ZhbHVlLCBmaXJzdENoYW5nZSB9KSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb25zdCB2aWV3UmVmID0gcHJldmlvdXNWYWx1ZSA/IHByZXZpb3VzVmFsdWUuZGV0YWNoKCkgOiBudWxsO1xuICAgICAgICAgIGlmICh2aWV3UmVmICYmICF2aWV3UmVmLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlLmluc2VydCh2aWV3UmVmKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGaWVsZChjdXJyZW50VmFsdWUsIGYsIHdwcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgIWZpcnN0Q2hhbmdlICYmIHJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZiAmJiBmLnR5cGUpIHtcbiAgICAgIGNvbnN0IHsgY29tcG9uZW50IH0gPSB0aGlzLmNvbmZpZy5nZXRUeXBlKGYudHlwZSk7XG4gICAgICBjb25zdCByZWYgPSBjb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50PEZpZWxkV3JhcHBlcj4odGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnQpKTtcbiAgICAgIHRoaXMuYXR0YWNoQ29tcG9uZW50UmVmKHJlZiwgZik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VySG9vayhuYW1lOiBzdHJpbmcsIGNoYW5nZXM/OiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKG5hbWUgPT09ICdvbkluaXQnIHx8IChuYW1lID09PSAnb25DaGFuZ2VzJyAmJiBjaGFuZ2VzLmZpZWxkICYmICFjaGFuZ2VzLmZpZWxkLmZpcnN0Q2hhbmdlKSkge1xuICAgICAgdGhpcy52YWx1ZUNoYW5nZXNVbnN1YnNjcmliZSA9IHRoaXMuZmllbGRDaGFuZ2VzKHRoaXMuZmllbGQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQuaG9va3MgJiYgdGhpcy5maWVsZC5ob29rc1tuYW1lXSkge1xuICAgICAgaWYgKCFjaGFuZ2VzIHx8IGNoYW5nZXMuZmllbGQpIHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuZmllbGQuaG9va3NbbmFtZV0odGhpcy5maWVsZCk7XG4gICAgICAgIGlmIChpc09ic2VydmFibGUocikgJiYgWydvbkluaXQnLCAnYWZ0ZXJDb250ZW50SW5pdCcsICdhZnRlclZpZXdJbml0J10uaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBzdWIgPSByLnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMuaG9va3NPYnNlcnZlcnMucHVzaCgoKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ29uQ2hhbmdlcycgJiYgY2hhbmdlcy5maWVsZCkge1xuICAgICAgdGhpcy5yZW5kZXJIb3N0QmluZGluZygpO1xuICAgICAgdGhpcy5yZXNldFJlZnMoY2hhbmdlcy5maWVsZC5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIHRoaXMucmVuZGVyRmllbGQodGhpcy5jb250YWluZXJSZWYsIHRoaXMuZmllbGQsIHRoaXMuZmllbGQgPyB0aGlzLmZpZWxkLndyYXBwZXJzIDogW10pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoQ29tcG9uZW50UmVmPFQgZXh0ZW5kcyBGaWVsZFR5cGU+KHJlZjogQ29tcG9uZW50UmVmPFQ+LCBmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSkge1xuICAgIHRoaXMuY29tcG9uZW50UmVmcy5wdXNoKHJlZik7XG4gICAgZmllbGQuX2NvbXBvbmVudFJlZnMucHVzaChyZWYpO1xuICAgIE9iamVjdC5hc3NpZ24ocmVmLmluc3RhbmNlLCB7IGZpZWxkIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIb3N0QmluZGluZygpIHtcbiAgICBpZiAoIXRoaXMuZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhvc3RPYnNlcnZlcnMuZm9yRWFjaCgoaG9zdE9ic2VydmVyKSA9PiBob3N0T2JzZXJ2ZXIudW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5ob3N0T2JzZXJ2ZXJzID0gW1xuICAgICAgb2JzZXJ2ZTxib29sZWFuPih0aGlzLmZpZWxkLCBbJ2hpZGUnXSwgKHsgZmlyc3RDaGFuZ2UsIGN1cnJlbnRWYWx1ZSB9KSA9PiB7XG4gICAgICAgIGlmICghZmlyc3RDaGFuZ2UgfHwgKGZpcnN0Q2hhbmdlICYmIGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGN1cnJlbnRWYWx1ZSA/ICdub25lJyA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBvYnNlcnZlPHN0cmluZz4odGhpcy5maWVsZCwgWydjbGFzc05hbWUnXSwgKHsgZmlyc3RDaGFuZ2UsIGN1cnJlbnRWYWx1ZSB9KSA9PiB7XG4gICAgICAgIGlmICghZmlyc3RDaGFuZ2UgfHwgKGZpcnN0Q2hhbmdlICYmIGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2NsYXNzJywgY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgXTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRSZWZzKGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZ0NhY2hlKSB7XG4gICAgaWYgKGZpZWxkKSB7XG4gICAgICBpZiAoZmllbGQuX2NvbXBvbmVudFJlZnMpIHtcbiAgICAgICAgZmllbGQuX2NvbXBvbmVudFJlZnMgPSBmaWVsZC5fY29tcG9uZW50UmVmcy5maWx0ZXIoKHJlZikgPT4gdGhpcy5jb21wb25lbnRSZWZzLmluZGV4T2YocmVmKSA9PT0gLTEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmaW5lSGlkZGVuUHJvcCh0aGlzLmZpZWxkLCAnX2NvbXBvbmVudFJlZnMnLCBbXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gIH1cblxuICBwcml2YXRlIGZpZWxkQ2hhbmdlcyhmaWVsZDogRm9ybWx5RmllbGRDb25maWdDYWNoZSkge1xuICAgIHRoaXMudmFsdWVDaGFuZ2VzVW5zdWJzY3JpYmUoKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm4gKCkgPT4ge307XG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaWJlcyA9IFtcbiAgICAgIG9ic2VydmVEZWVwKHtcbiAgICAgICAgc291cmNlOiBmaWVsZCxcbiAgICAgICAgdGFyZ2V0OiBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMsXG4gICAgICAgIHBhdGhzOiBbJ3RlbXBsYXRlT3B0aW9ucyddLFxuICAgICAgICBzZXRGbjogKCkgPT4gZmllbGQub3B0aW9ucy5kZXRlY3RDaGFuZ2VzKGZpZWxkKSxcbiAgICAgIH0pLFxuICAgICAgb2JzZXJ2ZURlZXAoe1xuICAgICAgICBzb3VyY2U6IGZpZWxkLFxuICAgICAgICB0YXJnZXQ6IGZpZWxkLm9wdGlvbnMuZm9ybVN0YXRlLFxuICAgICAgICBwYXRoczogWydvcHRpb25zJywgJ2Zvcm1TdGF0ZSddLFxuICAgICAgICBzZXRGbjogKCkgPT4gZmllbGQub3B0aW9ucy5kZXRlY3RDaGFuZ2VzKGZpZWxkKSxcbiAgICAgIH0pLFxuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgW1sndGVtcGxhdGUnXSwgWydmaWVsZEdyb3VwQ2xhc3NOYW1lJ10sIFsndmFsaWRhdGlvbicsICdzaG93J11dKSB7XG4gICAgICBjb25zdCBmaWVsZE9ic2VydmVyID0gb2JzZXJ2ZShcbiAgICAgICAgZmllbGQsXG4gICAgICAgIHBhdGgsXG4gICAgICAgICh7IGZpcnN0Q2hhbmdlIH0pID0+ICFmaXJzdENoYW5nZSAmJiBmaWVsZC5vcHRpb25zLmRldGVjdENoYW5nZXMoZmllbGQpLFxuICAgICAgKTtcbiAgICAgIHN1YnNjcmliZXMucHVzaCgoKSA9PiBmaWVsZE9ic2VydmVyLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGlmIChmaWVsZC5rZXkgJiYgIWZpZWxkLmZpZWxkR3JvdXApIHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSBmaWVsZC5mb3JtQ29udHJvbDtcbiAgICAgIGxldCB2YWx1ZUNoYW5nZXMgPSBjb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuXG4gICAgICBpZiAoY29udHJvbC52YWx1ZSAhPT0gZ2V0RmllbGRWYWx1ZShmaWVsZCkpIHtcbiAgICAgICAgdmFsdWVDaGFuZ2VzID0gdmFsdWVDaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKGNvbnRyb2wudmFsdWUpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyB1cGRhdGVPbiwgZGVib3VuY2UgfSA9IGZpZWxkLm1vZGVsT3B0aW9ucztcbiAgICAgIGlmICgoIXVwZGF0ZU9uIHx8IHVwZGF0ZU9uID09PSAnY2hhbmdlJykgJiYgZGVib3VuY2UgJiYgZGVib3VuY2UuZGVmYXVsdCA+IDApIHtcbiAgICAgICAgdmFsdWVDaGFuZ2VzID0gY29udHJvbC52YWx1ZUNoYW5nZXMucGlwZShkZWJvdW5jZVRpbWUoZGVib3VuY2UuZGVmYXVsdCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdWIgPSB2YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xMzc5MlxuICAgICAgICBpZiAoY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sICYmIGNvbnRyb2xbJ19maWVsZHMnXSAmJiBjb250cm9sWydfZmllbGRzJ10ubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNvbnRyb2wucGF0Y2hWYWx1ZSh2YWx1ZSwgeyBlbWl0RXZlbnQ6IGZhbHNlLCBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZC5wYXJzZXJzICYmIGZpZWxkLnBhcnNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLnBhcnNlcnMuZm9yRWFjaCgocGFyc2VyRm4pID0+ICh2YWx1ZSA9IHBhcnNlckZuKHZhbHVlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXNzaWduRmllbGRWYWx1ZShmaWVsZCwgdmFsdWUsIHRydWUpO1xuICAgICAgICBmaWVsZC5vcHRpb25zLmZpZWxkQ2hhbmdlcy5uZXh0KHsgdmFsdWUsIGZpZWxkLCB0eXBlOiAndmFsdWVDaGFuZ2VzJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBzdWJzY3JpYmVzLnB1c2goKCkgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpYmVzLmZvckVhY2goKHN1YnNjcmliZSkgPT4gc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=