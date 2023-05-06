import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class IconService {
    constructor() {
        this.iconsByName = {};
    }
    register(name, icon) {
        this.iconsByName[name] = icon;
    }
    registerAll(iconsByName) {
        Object.assign(this.iconsByName, iconsByName);
    }
    get(name) {
        const icon = this.iconsByName[name];
        if (!icon) {
            throw new Error(`[Iconify]: No icon registered for name '${name}'. Use 'IconService' to register icons.`);
        }
        return icon;
    }
    static { this.ɵfac = function IconService_Factory(t) { return new (t || IconService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: IconService, factory: IconService.ɵfac, providedIn: 'root' }); }
}
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IconService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvaWNvbmlmeS9zcmMvbGliL2ljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUszQyxNQUFNLE9BQU8sV0FBVztJQUh4QjtRQUlVLGdCQUFXLEdBQTJCLEVBQUUsQ0FBQztLQWlCbEQ7SUFmQyxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVELFdBQVcsQ0FBQyxXQUFtQztRQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFZO1FBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsSUFBSSx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzNHO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzRFQWpCVSxXQUFXO3VFQUFYLFdBQVcsV0FBWCxXQUFXLG1CQUZWLE1BQU07O3VGQUVQLFdBQVc7Y0FIdkIsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgSWNvblNlcnZpY2Uge1xuICBwcml2YXRlIGljb25zQnlOYW1lOiBSZWNvcmQ8c3RyaW5nLCBvYmplY3Q+ID0ge307XG5cbiAgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBpY29uOiBvYmplY3QpIHtcbiAgICB0aGlzLmljb25zQnlOYW1lW25hbWVdID0gaWNvbjtcbiAgfVxuXG4gIHJlZ2lzdGVyQWxsKGljb25zQnlOYW1lOiBSZWNvcmQ8c3RyaW5nLCBvYmplY3Q+KXtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuaWNvbnNCeU5hbWUsIGljb25zQnlOYW1lKTtcbiAgfVxuXG4gIGdldChuYW1lOiBzdHJpbmcpOiBvYmplY3Qge1xuICAgIGNvbnN0IGljb24gPSB0aGlzLmljb25zQnlOYW1lW25hbWVdO1xuICAgIGlmICghaWNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBbSWNvbmlmeV06IE5vIGljb24gcmVnaXN0ZXJlZCBmb3IgbmFtZSAnJHtuYW1lfScuIFVzZSAnSWNvblNlcnZpY2UnIHRvIHJlZ2lzdGVyIGljb25zLmApO1xuICAgIH1cbiAgICByZXR1cm4gaWNvbjtcbiAgfVxufVxuIl19