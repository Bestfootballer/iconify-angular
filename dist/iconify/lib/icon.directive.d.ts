import { IconService } from './icon.service';
import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class IconDirective implements OnInit, OnChanges {
    private domSanitizer;
    private iconService;
    icIcon: object | string;
    icon: object | string;
    color: string;
    inline: boolean;
    box: boolean;
    size: string;
    width: string;
    height: string;
    align: string;
    hFlip: boolean;
    vFlip: boolean;
    flip: string;
    rotate: number;
    iconHTML: SafeHtml;
    constructor(domSanitizer: DomSanitizer, iconService: IconService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateIcon(): void;
    private getIcon;
    private generateSvgHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<IconDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IconDirective, "ic-icon,[icIcon]", never, { "icIcon": { "alias": "icIcon"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "color": { "alias": "color"; "required": false; }; "inline": { "alias": "inline"; "required": false; }; "box": { "alias": "box"; "required": false; }; "size": { "alias": "size"; "required": false; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; "align": { "alias": "align"; "required": false; }; "hFlip": { "alias": "hFlip"; "required": false; }; "vFlip": { "alias": "vFlip"; "required": false; }; "flip": { "alias": "flip"; "required": false; }; "rotate": { "alias": "rotate"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=icon.directive.d.ts.map