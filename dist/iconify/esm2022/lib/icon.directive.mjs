import { Directive, HostBinding, Input } from '@angular/core';
import { normalize, SVG } from './svg';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "./icon.service";
export class IconDirective {
    constructor(domSanitizer, iconService) {
        this.domSanitizer = domSanitizer;
        this.iconService = iconService;
        this.width = '1em';
        this.height = '1em';
        this.rotate = 0;
    }
    ngOnInit() { }
    ngOnChanges(changes) {
        if (changes) {
            this.updateIcon();
        }
    }
    updateIcon() {
        const icon = this.getIcon();
        const svg = new SVG(normalize(icon));
        this.iconHTML = this.generateSvgHtml(svg);
    }
    getIcon() {
        const iconInput = this.icon || this.icIcon;
        if (typeof iconInput !== 'object' && typeof iconInput !== 'string') {
            throw new Error('[Iconify]: No icon provided');
        }
        return typeof iconInput === 'object' ? iconInput : this.iconService.get(iconInput);
    }
    generateSvgHtml(svg) {
        return this.domSanitizer.bypassSecurityTrustHtml(svg.getSVG({
            width: this.size || this.width,
            height: this.size || this.height,
            color: this.color,
            inline: this.inline,
            box: this.box,
            align: this.align,
            hFlip: this.hFlip,
            vFlip: this.vFlip,
            flip: this.flip,
            rotate: this.rotate
        }));
    }
    static { this.ɵfac = function IconDirective_Factory(t) { return new (t || IconDirective)(i0.ɵɵdirectiveInject(i1.DomSanitizer), i0.ɵɵdirectiveInject(i2.IconService)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: IconDirective, selectors: [["ic-icon"], ["", "icIcon", ""]], hostVars: 3, hostBindings: function IconDirective_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵhostProperty("innerHTML", ctx.iconHTML, i0.ɵɵsanitizeHtml);
            i0.ɵɵclassProp("ic-inline", ctx.inline);
        } }, inputs: { icIcon: "icIcon", icon: "icon", color: "color", inline: "inline", box: "box", size: "size", width: "width", height: "height", align: "align", hFlip: "hFlip", vFlip: "vFlip", flip: "flip", rotate: "rotate" }, features: [i0.ɵɵNgOnChangesFeature] }); }
}
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IconDirective, [{
        type: Directive,
        args: [{
                selector: 'ic-icon,[icIcon]'
            }]
    }], function () { return [{ type: i1.DomSanitizer }, { type: i2.IconService }]; }, { icIcon: [{
            type: Input
        }], icon: [{
            type: Input
        }], color: [{
            type: Input
        }], inline: [{
            type: Input
        }, {
            type: HostBinding,
            args: ['class.ic-inline']
        }], box: [{
            type: Input
        }], size: [{
            type: Input
        }], width: [{
            type: Input
        }], height: [{
            type: Input
        }], align: [{
            type: Input
        }], hFlip: [{
            type: Input
        }], vFlip: [{
            type: Input
        }], flip: [{
            type: Input
        }], rotate: [{
            type: Input
        }], iconHTML: [{
            type: HostBinding,
            args: ['innerHTML']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9pY29uaWZ5L3NyYy9saWIvaWNvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFvQyxNQUFNLGVBQWUsQ0FBQztBQUVoRyxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQzs7OztBQUt2QyxNQUFNLE9BQU8sYUFBYTtJQTZCeEIsWUFBb0IsWUFBMEIsRUFBVSxXQUF3QjtRQUE1RCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBYnZFLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBT2YsV0FBTSxHQUFHLENBQUMsQ0FBQztJQUtnRSxDQUFDO0lBRXJGLFFBQVEsS0FBSyxDQUFDO0lBRWQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTyxPQUFPO1FBQ2IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNDLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNsRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE9BQU8sU0FBUyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRU8sZUFBZSxDQUFDLEdBQVE7UUFDOUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDMUQsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7WUFDOUIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU07WUFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDOzhFQWxFVSxhQUFhO29FQUFiLGFBQWE7Ozs7O3VGQUFiLGFBQWE7Y0FIekIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7eUZBR1UsTUFBTTtrQkFBZCxLQUFLO1lBQ0csSUFBSTtrQkFBWixLQUFLO1lBR0csS0FBSztrQkFBYixLQUFLO1lBSU4sTUFBTTtrQkFGTCxLQUFLOztrQkFDTCxXQUFXO21CQUFDLGlCQUFpQjtZQUdyQixHQUFHO2tCQUFYLEtBQUs7WUFHRyxJQUFJO2tCQUFaLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFHRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxJQUFJO2tCQUFaLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFHTixRQUFRO2tCQURQLFdBQVc7bUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEljb25TZXJ2aWNlIH0gZnJvbSAnLi9pY29uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBub3JtYWxpemUsIFNWRyB9IGZyb20gJy4vc3ZnJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaWMtaWNvbixbaWNJY29uXSdcbn0pXG5leHBvcnQgY2xhc3MgSWNvbkRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKSBpY0ljb246IG9iamVjdCB8IHN0cmluZztcbiAgQElucHV0KCkgaWNvbjogb2JqZWN0IHwgc3RyaW5nO1xuXG4gIC8vIE9wdGlvbmFsIFByb3BlcnRpZXNcbiAgQElucHV0KCkgY29sb3I6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmljLWlubGluZScpXG4gIGlubGluZTogYm9vbGVhbjtcblxuICBASW5wdXQoKSBib3g6IGJvb2xlYW47XG5cbiAgLy8gRGltZW5zaW9ucyBhbmQgQWxpZ25tZW50XG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcbiAgQElucHV0KCkgd2lkdGggPSAnMWVtJztcbiAgQElucHV0KCkgaGVpZ2h0ID0gJzFlbSc7XG4gIEBJbnB1dCgpIGFsaWduOiBzdHJpbmc7XG5cbiAgLy8gVHJhbnNmb3JtYXRpb25zXG4gIEBJbnB1dCgpIGhGbGlwOiBib29sZWFuO1xuICBASW5wdXQoKSB2RmxpcDogYm9vbGVhbjtcbiAgQElucHV0KCkgZmxpcDogc3RyaW5nO1xuICBASW5wdXQoKSByb3RhdGUgPSAwO1xuXG4gIEBIb3N0QmluZGluZygnaW5uZXJIVE1MJylcbiAgaWNvbkhUTUw6IFNhZmVIdG1sO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgaWNvblNlcnZpY2U6IEljb25TZXJ2aWNlKSB7IH1cblxuICBuZ09uSW5pdCgpIHsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgdGhpcy51cGRhdGVJY29uKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSWNvbigpIHtcbiAgICBjb25zdCBpY29uID0gdGhpcy5nZXRJY29uKCk7XG4gICAgY29uc3Qgc3ZnID0gbmV3IFNWRyhub3JtYWxpemUoaWNvbikpO1xuICAgIHRoaXMuaWNvbkhUTUwgPSB0aGlzLmdlbmVyYXRlU3ZnSHRtbChzdmcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRJY29uKCk6IG9iamVjdCB7XG4gICAgY29uc3QgaWNvbklucHV0ID0gdGhpcy5pY29uIHx8IHRoaXMuaWNJY29uO1xuICAgIGlmICh0eXBlb2YgaWNvbklucHV0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgaWNvbklucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbSWNvbmlmeV06IE5vIGljb24gcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBpY29uSW5wdXQgPT09ICdvYmplY3QnID8gaWNvbklucHV0IDogdGhpcy5pY29uU2VydmljZS5nZXQoaWNvbklucHV0KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVTdmdIdG1sKHN2ZzogU1ZHKTogU2FmZUh0bWx7XG4gICAgcmV0dXJuIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKHN2Zy5nZXRTVkcoe1xuICAgICAgd2lkdGg6IHRoaXMuc2l6ZSB8fCB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnNpemUgfHwgdGhpcy5oZWlnaHQsXG4gICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgIGlubGluZTogdGhpcy5pbmxpbmUsXG4gICAgICBib3g6IHRoaXMuYm94LFxuICAgICAgYWxpZ246IHRoaXMuYWxpZ24sXG4gICAgICBoRmxpcDogdGhpcy5oRmxpcCxcbiAgICAgIHZGbGlwOiB0aGlzLnZGbGlwLFxuICAgICAgZmxpcDogdGhpcy5mbGlwLFxuICAgICAgcm90YXRlOiB0aGlzLnJvdGF0ZVxuICAgIH0pKTtcbiAgfVxufVxuIl19