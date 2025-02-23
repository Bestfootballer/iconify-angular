import { IconProps } from './icon-props.interface';
/**
 * Add missing properties to icon
 *
 * Important: in PHP version of this library this function is part of Collection class: Collection::addMissingAttributes()
 *
 * JavaScript version uses separate file so this function could be used in React and other components without loading
 * entire Collection class.
 */
export declare function normalize(data: object): object;
/**
 * Get preserveAspectRatio attribute value
 */
export declare function getAlignment(align: {
    horizontal: string;
    vertical: string;
    slice: boolean;
}): string;
/**
 * SVG class
 *
 * @see @iconify/json-tools/src/svg.js
 */
export declare class SVG {
    private _icon;
    /**
     * Constructor
     *
     *  Use Collection.getIconData() to retrieve icon data
     */
    constructor(_icon: any);
    /**
     * Calculate second dimension when only 1 dimension is set
     * If size == width, ratio = height/width
     * If size == height, ratio = width/height
     */
    static calculateDimension(size: string | number, ratio: number, precision?: number): string | number | null;
    /**
     * Replace IDs in SVG output with unique IDs
     * Fast replacement without parsing XML, assuming commonly used patterns.
     */
    static replaceIDs(body: string): string;
    /**
     * Get SVG attributes
     */
    getAttributes(props: IconProps): {
        attributes: any;
        body: string;
        style: any;
    };
    /**
     * Generate SVG
     */
    getSVG(attributes: IconProps): string;
}
//# sourceMappingURL=svg.d.ts.map