import { __decorate, __metadata, __param, __read, __spread } from "tslib";
import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, DoCheck, Inject, OnDestroy, } from '@angular/core';
import { defineHiddenProp, FORMLY_VALIDATORS, observe } from '../utils';
import { DOCUMENT } from '@angular/common';
var FormlyAttributes = /** @class */ (function () {
    function FormlyAttributes(renderer, elementRef, _document) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.uiAttributesCache = {};
        this.uiAttributes = __spread(FORMLY_VALIDATORS, ['tabindex', 'placeholder', 'readonly', 'disabled', 'step']);
        /**
         * HostBinding doesn't register listeners conditionally which may produce some perf issues.
         *
         * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1991
         */
        this.uiEvents = {
            listeners: [],
            events: ['click', 'keyup', 'keydown', 'keypress', 'change'],
        };
        this.document = _document;
    }
    Object.defineProperty(FormlyAttributes.prototype, "to", {
        get: function () {
            return this.field.templateOptions || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormlyAttributes.prototype, "fieldAttrElements", {
        get: function () {
            return (this.field && this.field['_elementRefs']) || [];
        },
        enumerable: true,
        configurable: true
    });
    FormlyAttributes.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.field) {
            this.field.name && this.setAttribute('name', this.field.name);
            this.uiEvents.listeners.forEach(function (listener) { return listener(); });
            this.uiEvents.events.forEach(function (eventName) {
                var callback = _this.to && _this.to[eventName];
                if (eventName === 'change') {
                    callback = _this.onChange.bind(_this);
                }
                if (callback) {
                    _this.uiEvents.listeners.push(_this.renderer.listen(_this.elementRef.nativeElement, eventName, function (e) { return callback(_this.field, e); }));
                }
            });
            if (this.to && this.to.attributes) {
                observe(this.field, ['templateOptions', 'attributes'], function (_a) {
                    var currentValue = _a.currentValue, previousValue = _a.previousValue;
                    if (previousValue) {
                        Object.keys(previousValue).forEach(function (attr) { return _this.removeAttribute(attr); });
                    }
                    if (currentValue) {
                        Object.keys(currentValue).forEach(function (attr) { return _this.setAttribute(attr, currentValue[attr]); });
                    }
                });
            }
            this.detachElementRef(changes.field.previousValue);
            this.attachElementRef(changes.field.currentValue);
            if (this.fieldAttrElements.length === 1) {
                !this.id && this.field.id && this.setAttribute('id', this.field.id);
                this.focusObserver = observe(this.field, ['focus'], function (_a) {
                    var currentValue = _a.currentValue;
                    _this.toggleFocus(currentValue);
                });
            }
        }
        if (changes.id) {
            this.setAttribute('id', this.id);
        }
    };
    /**
     * We need to re-evaluate all the attributes on every change detection cycle, because
     * by using a HostBinding we run into certain edge cases. This means that whatever logic
     * is in here has to be super lean or we risk seriously damaging or destroying the performance.
     *
     * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
     * Material issue: https://github.com/angular/components/issues/14024
     */
    FormlyAttributes.prototype.ngDoCheck = function () {
        var _this = this;
        this.uiAttributes.forEach(function (attr) {
            var value = _this.to[attr];
            if (_this.uiAttributesCache[attr] !== value) {
                _this.uiAttributesCache[attr] = value;
                if (value || value === 0) {
                    _this.setAttribute(attr, value === true ? attr : "" + value);
                }
                else {
                    _this.removeAttribute(attr);
                }
            }
        });
    };
    FormlyAttributes.prototype.ngOnDestroy = function () {
        this.uiEvents.listeners.forEach(function (listener) { return listener(); });
        this.detachElementRef(this.field);
        this.focusObserver && this.focusObserver.unsubscribe();
    };
    FormlyAttributes.prototype.toggleFocus = function (value) {
        var _this = this;
        var element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
        if (!element || !element.nativeElement.focus) {
            return;
        }
        var isFocused = !!this.document.activeElement &&
            this.fieldAttrElements.some(function (_a) {
                var nativeElement = _a.nativeElement;
                return _this.document.activeElement === nativeElement || nativeElement.contains(_this.document.activeElement);
            });
        if (value && !isFocused) {
            element.nativeElement.focus();
        }
        else if (!value && isFocused) {
            element.nativeElement.blur();
        }
    };
    FormlyAttributes.prototype.onFocus = function ($event) {
        this.focusObserver && this.focusObserver.setValue(true);
        if (this.to.focus) {
            this.to.focus(this.field, $event);
        }
    };
    FormlyAttributes.prototype.onBlur = function ($event) {
        this.focusObserver && this.focusObserver.setValue(false);
        if (this.to.blur) {
            this.to.blur(this.field, $event);
        }
    };
    FormlyAttributes.prototype.onChange = function ($event) {
        if (this.to.change) {
            this.to.change(this.field, $event);
        }
        if (this.field.formControl) {
            this.field.formControl.markAsDirty();
        }
    };
    FormlyAttributes.prototype.attachElementRef = function (f) {
        if (!f) {
            return;
        }
        if (f['_elementRefs'] && f['_elementRefs'].indexOf(this.elementRef) === -1) {
            f['_elementRefs'].push(this.elementRef);
        }
        else {
            defineHiddenProp(f, '_elementRefs', [this.elementRef]);
        }
    };
    FormlyAttributes.prototype.detachElementRef = function (f) {
        var index = f && f['_elementRefs'] ? this.fieldAttrElements.indexOf(this.elementRef) : -1;
        if (index !== -1) {
            this.field['_elementRefs'].splice(index, 1);
        }
    };
    FormlyAttributes.prototype.setAttribute = function (attr, value) {
        this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
    };
    FormlyAttributes.prototype.removeAttribute = function (attr) {
        this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
    };
    FormlyAttributes.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    __decorate([
        Input('formlyAttributes'),
        __metadata("design:type", Object)
    ], FormlyAttributes.prototype, "field", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FormlyAttributes.prototype, "id", void 0);
    FormlyAttributes = __decorate([
        Directive({
            selector: '[formlyAttributes]',
            host: {
                '(focus)': 'onFocus($event)',
                '(blur)': 'onBlur($event)',
            },
        }),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Renderer2, ElementRef, Object])
    ], FormlyAttributes);
    return FormlyAttributes;
}());
export { FormlyAttributes };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWx5LmF0dHJpYnV0ZXMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWZvcm1seS9jb3JlLyIsInNvdXJjZXMiOlsibGliL3RlbXBsYXRlcy9mb3JtbHkuYXR0cmlidXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQWEsTUFBTSxVQUFVLENBQUM7QUFDbkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBUzNDO0lBMkJFLDBCQUFvQixRQUFtQixFQUFVLFVBQXNCLEVBQW9CLFNBQWM7UUFBckYsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUF0Qi9ELHNCQUFpQixHQUFRLEVBQUUsQ0FBQztRQUM1QixpQkFBWSxZQUFPLGlCQUFpQixHQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEdBQUU7UUFHekc7Ozs7V0FJRztRQUNLLGFBQVEsR0FBRztZQUNqQixTQUFTLEVBQUUsRUFBRTtZQUNiLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7U0FDNUQsQ0FBQztRQVdBLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBQzVCLENBQUM7SUFWRCxzQkFBSSxnQ0FBRTthQUFOO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7UUFDMUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSwrQ0FBaUI7YUFBN0I7WUFDRSxPQUFPLENBQUMsSUFBSSxD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QUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRU8sdUNBQVksR0FBcEIsVUFBcUIsSUFBWSxFQUFFLEtBQWE7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTywwQ0FBZSxHQUF2QixVQUF3QixJQUFZO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JFLENBQUM7O2dCQWxKNkIsU0FBUztnQkFBc0IsVUFBVTtnREFBRyxNQUFNLFNBQUMsUUFBUTs7SUExQjlEO1FBQTFCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQzs7bURBQTBCO0lBQzNDO1FBQVIsS0FBSyxFQUFFOztnREFBWTtJQUZULGdCQUFnQjtRQVA1QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLElBQUksRUFBRTtnQkFDSixTQUFTLEVBQUUsaUJBQWlCO2dCQUM1QixRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCO1NBQ0YsQ0FBQztRQTRCMEUsV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7eUNBQTVELFNBQVMsRUFBc0IsVUFBVTtPQTNCNUQsZ0JBQWdCLENBOEs1QjtJQUFELHVCQUFDO0NBQUEsQUE5S0QsSUE4S0M7U0E5S1ksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIERvQ2hlY2ssXG4gIEluamVjdCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnLCBGb3JtbHlUZW1wbGF0ZU9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHsgZGVmaW5lSGlkZGVuUHJvcCwgRk9STUxZX1ZBTElEQVRPUlMsIG9ic2VydmUsIElPYnNlcnZlciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Zvcm1seUF0dHJpYnV0ZXNdJyxcbiAgaG9zdDoge1xuICAgICcoZm9jdXMpJzogJ29uRm9jdXMoJGV2ZW50KScsXG4gICAgJyhibHVyKSc6ICdvbkJsdXIoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1seUF0dHJpYnV0ZXMgaW1wbGVtZW50cyBPbkNoYW5nZXMsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnZm9ybWx5QXR0cmlidXRlcycpIGZpZWxkOiBGb3JtbHlGaWVsZENvbmZpZztcbiAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSB1aUF0dHJpYnV0ZXNDYWNoZTogYW55ID0ge307XG4gIHByaXZhdGUgdWlBdHRyaWJ1dGVzID0gWy4uLkZPUk1MWV9WQUxJREFUT1JTLCAndGFiaW5kZXgnLCAncGxhY2Vob2xkZXInLCAncmVhZG9ubHknLCAnZGlzYWJsZWQnLCAnc3RlcCddO1xuICBwcml2YXRlIGZvY3VzT2JzZXJ2ZXI6IElPYnNlcnZlcjxib29sZWFuPjtcblxuICAvKipcbiAgICogSG9zdEJpbmRpbmcgZG9lc24ndCByZWdpc3RlciBsaXN0ZW5lcnMgY29uZGl0aW9uYWxseSB3aGljaCBtYXkgcHJvZHVjZSBzb21lIHBlcmYgaXNzdWVzLlxuICAgKlxuICAgKiBGb3JtbHkgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZ3gtZm9ybWx5L25neC1mb3JtbHkvaXNzdWVzLzE5OTFcbiAgICovXG4gIHByaXZhdGUgdWlFdmVudHMgPSB7XG4gICAgbGlzdGVuZXJzOiBbXSxcbiAgICBldmVudHM6IFsnY2xpY2snLCAna2V5dXAnLCAna2V5ZG93bicsICdrZXlwcmVzcycsICdjaGFuZ2UnXSxcbiAgfTtcblxuICBnZXQgdG8oKTogRm9ybWx5VGVtcGxhdGVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZC50ZW1wbGF0ZU9wdGlvbnMgfHwge307XG4gIH1cblxuICBwcml2YXRlIGdldCBmaWVsZEF0dHJFbGVtZW50cygpOiBFbGVtZW50UmVmW10ge1xuICAgIHJldHVybiAodGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkWydfZWxlbWVudFJlZnMnXSkgfHwgW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmZpZWxkKSB7XG4gICAgICB0aGlzLmZpZWxkLm5hbWUgJiYgdGhpcy5zZXRBdHRyaWJ1dGUoJ25hbWUnLCB0aGlzLmZpZWxkLm5hbWUpO1xuXG4gICAgICB0aGlzLnVpRXZlbnRzLmxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIoKSk7XG4gICAgICB0aGlzLnVpRXZlbnRzLmV2ZW50cy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gdGhpcy50byAmJiB0aGlzLnRvW2V2ZW50TmFtZV07XG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLnVpRXZlbnRzLmxpc3RlbmVycy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgKGUpID0+IGNhbGxiYWNrKHRoaXMuZmllbGQsIGUpKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMudG8gJiYgdGhpcy50by5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIG9ic2VydmUodGhpcy5maWVsZCwgWyd0ZW1wbGF0ZU9wdGlvbnMnLCAnYXR0cmlidXRlcyddLCAoeyBjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUgfSkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhwcmV2aW91c1ZhbHVlKS5mb3JFYWNoKChhdHRyKSA9PiB0aGlzLnJlbW92ZUF0dHJpYnV0ZShhdHRyKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudFZhbHVlKS5mb3JFYWNoKChhdHRyKSA9PiB0aGlzLnNldEF0dHJpYnV0ZShhdHRyLCBjdXJyZW50VmFsdWVbYXR0cl0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRldGFjaEVsZW1lbnRSZWYoY2hhbmdlcy5maWVsZC5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIHRoaXMuYXR0YWNoRWxlbWVudFJlZihjaGFuZ2VzLmZpZWxkLmN1cnJlbnRWYWx1ZSk7XG4gICAgICBpZiAodGhpcy5maWVsZEF0dHJFbGVtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgIXRoaXMuaWQgJiYgdGhpcy5maWVsZC5pZCAmJiB0aGlzLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmZpZWxkLmlkKTtcbiAgICAgICAgdGhpcy5mb2N1c09ic2VydmVyID0gb2JzZXJ2ZTxib29sZWFuPih0aGlzLmZpZWxkLCBbJ2ZvY3VzJ10sICh7IGN1cnJlbnRWYWx1ZSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy50b2dnbGVGb2N1cyhjdXJyZW50VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5pZCkge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgYWxsIHRoZSBhdHRyaWJ1dGVzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2VcbiAgICogYnkgdXNpbmcgYSBIb3N0QmluZGluZyB3ZSBydW4gaW50byBjZXJ0YWluIGVkZ2UgY2FzZXMuIFRoaXMgbWVhbnMgdGhhdCB3aGF0ZXZlciBsb2dpY1xuICAgKiBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgc2VyaW91c2x5IGRhbWFnaW5nIG9yIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgKlxuICAgKiBGb3JtbHkgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZ3gtZm9ybWx5L25neC1mb3JtbHkvaXNzdWVzLzEzMTdcbiAgICogTWF0ZXJpYWwgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE0MDI0XG4gICAqL1xuICBuZ0RvQ2hlY2soKSB7XG4gICAgdGhpcy51aUF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnRvW2F0dHJdO1xuICAgICAgaWYgKHRoaXMudWlBdHRyaWJ1dGVzQ2FjaGVbYXR0cl0gIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMudWlBdHRyaWJ1dGVzQ2FjaGVbYXR0cl0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUgPT09IHRydWUgPyBhdHRyIDogYCR7dmFsdWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudWlFdmVudHMubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcigpKTtcbiAgICB0aGlzLmRldGFjaEVsZW1lbnRSZWYodGhpcy5maWVsZCk7XG4gICAgdGhpcy5mb2N1c09ic2VydmVyICYmIHRoaXMuZm9jdXNPYnNlcnZlci51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgdG9nZ2xlRm9jdXModmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maWVsZEF0dHJFbGVtZW50cyA/IHRoaXMuZmllbGRBdHRyRWxlbWVudHNbMF0gOiBudWxsO1xuICAgIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNGb2N1c2VkID1cbiAgICAgICEhdGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmXG4gICAgICB0aGlzLmZpZWxkQXR0ckVsZW1lbnRzLnNvbWUoXG4gICAgICAgICh7IG5hdGl2ZUVsZW1lbnQgfSkgPT5cbiAgICAgICAgICB0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IG5hdGl2ZUVsZW1lbnQgfHwgbmF0aXZlRWxlbWVudC5jb250YWlucyh0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLFxuICAgICAgKTtcblxuICAgIGlmICh2YWx1ZSAmJiAhaXNGb2N1c2VkKSB7XG4gICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKCF2YWx1ZSAmJiBpc0ZvY3VzZWQpIHtcbiAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG5cbiAgb25Gb2N1cygkZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuZm9jdXNPYnNlcnZlciAmJiB0aGlzLmZvY3VzT2JzZXJ2ZXIuc2V0VmFsdWUodHJ1ZSk7XG4gICAgaWYgKHRoaXMudG8uZm9jdXMpIHtcbiAgICAgIHRoaXMudG8uZm9jdXModGhpcy5maWVsZCwgJGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoJGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLmZvY3VzT2JzZXJ2ZXIgJiYgdGhpcy5mb2N1c09ic2VydmVyLnNldFZhbHVlKGZhbHNlKTtcbiAgICBpZiAodGhpcy50by5ibHVyKSB7XG4gICAgICB0aGlzLnRvLmJsdXIodGhpcy5maWVsZCwgJGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZSgkZXZlbnQ6IGFueSkge1xuICAgIGlmICh0aGlzLnRvLmNoYW5nZSkge1xuICAgICAgdGhpcy50by5jaGFuZ2UodGhpcy5maWVsZCwgJGV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5maWVsZC5mb3JtQ29udHJvbCkge1xuICAgICAgdGhpcy5maWVsZC5mb3JtQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoRWxlbWVudFJlZihmOiBGb3JtbHlGaWVsZENvbmZpZykge1xuICAgIGlmICghZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChmWydfZWxlbWVudFJlZnMnXSAmJiBmWydfZWxlbWVudFJlZnMnXS5pbmRleE9mKHRoaXMuZWxlbWVudFJlZikgPT09IC0xKSB7XG4gICAgICBmWydfZWxlbWVudFJlZnMnXS5wdXNoKHRoaXMuZWxlbWVudFJlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmluZUhpZGRlblByb3AoZiwgJ19lbGVtZW50UmVmcycsIFt0aGlzLmVsZW1lbnRSZWZdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRldGFjaEVsZW1lbnRSZWYoZjogRm9ybWx5RmllbGRDb25maWcpIHtcbiAgICBjb25zdCBpbmRleCA9IGYgJiYgZlsnX2VsZW1lbnRSZWZzJ10gPyB0aGlzLmZpZWxkQXR0ckVsZW1lbnRzLmluZGV4T2YodGhpcy5lbGVtZW50UmVmKSA6IC0xO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZmllbGRbJ19lbGVtZW50UmVmcyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRBdHRyaWJ1dGUoYXR0cjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGF0dHIsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQXR0cmlidXRlKGF0dHI6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBhdHRyKTtcbiAgfVxufVxuIl19