import { ViewContainerRef, SimpleChanges, ComponentFactoryResolver, OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig } from '../models';
export declare class FormlyField implements OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy {
    private config;
    private renderer;
    private resolver;
    private elementRef;
    field: FormlyFieldConfig;
    containerRef: ViewContainerRef;
    private hostObservers;
    private componentRefs;
    private hooksObservers;
    valueChangesUnsubscribe: () => void;
    constructor(config: FormlyConfig, renderer: Renderer2, resolver: ComponentFactoryResolver, elementRef: ElementRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private renderField;
    private triggerHook;
    private attachComponentRef;
    private renderHostBinding;
    private resetRefs;
    private fieldChanges;
}
