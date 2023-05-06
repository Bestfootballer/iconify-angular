/* tslint:disable:no-redundant-jsdoc variable-name no-conditional-assignment no-bitwise */
/**
 * Unique id counter
 */
let idCounter = 0;
/**
 * Regex used to split dimensions
 */
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
/**
 * Attributes used for icon
 */
const iconAttributes = ['width', 'height', 'inline', 'hFlip', 'vFlip', 'flip', 'rotate', 'align', 'color', 'box'];
/**
 * Default attribute values
 */
const defaultAttributes = {
    left: 0,
    top: 0,
    width: 16,
    height: 16,
    rotate: 0,
    hFlip: false,
    vFlip: false
};
/**
 * Add missing properties to icon
 *
 * Important: in PHP version of this library this function is part of Collection class: Collection::addMissingAttributes()
 *
 * JavaScript version uses separate file so this function could be used in React and other components without loading
 * entire Collection class.
 */
export function normalize(data) {
    const item = Object.assign(Object.create(null), defaultAttributes, data);
    if (item.inlineTop === void 0) {
        item.inlineTop = item.top;
    }
    if (item.inlineHeight === void 0) {
        item.inlineHeight = item.height;
    }
    if (item.verticalAlign === void 0) {
        // -0.143 if icon is designed for 14px height,
        // otherwise assume icon is designed for 16px height
        item.verticalAlign = item.height % 7 === 0 && item.height % 8 !== 0 ? -0.143 : -0.125;
    }
    return item;
}
/**
 * Get preserveAspectRatio attribute value
 */
export function getAlignment(align) {
    let result;
    switch (align.horizontal) {
        case 'left':
            result = 'xMin';
            break;
        case 'right':
            result = 'xMax';
            break;
        default:
            result = 'xMid';
    }
    switch (align.vertical) {
        case 'top':
            result += 'YMin';
            break;
        case 'bottom':
            result += 'YMax';
            break;
        default:
            result += 'YMid';
    }
    result += align.slice ? ' slice' : ' meet';
    return result;
}
/**
 * SVG class
 *
 * @see @iconify/json-tools/src/svg.js
 */
export class SVG {
    /**
     * Constructor
     *
     *  Use Collection.getIconData() to retrieve icon data
     */
    constructor(_icon) {
        this._icon = _icon;
    }
    /**
     * Calculate second dimension when only 1 dimension is set
     * If size == width, ratio = height/width
     * If size == height, ratio = width/height
     */
    static calculateDimension(size, ratio, precision = 100) {
        if (ratio === 1) {
            return size;
        }
        if (typeof size === 'number') {
            return Math.ceil(size * ratio * precision) / precision;
        }
        // split code into sets of strings and numbers
        const split = size.split(unitsSplit);
        if (split === null || !split.length) {
            return null;
        }
        const results = [];
        let code = split.shift();
        let isNumber = unitsTest.test(code);
        let num;
        while (true) {
            if (isNumber) {
                num = parseFloat(code);
                if (isNaN(num)) {
                    results.push(code);
                }
                else {
                    results.push(Math.ceil(num * ratio * precision) / precision);
                }
            }
            else {
                results.push(code);
            }
            // next
            code = split.shift();
            if (code === void 0) {
                return results.join('');
            }
            isNumber = !isNumber;
        }
    }
    /**
     * Replace IDs in SVG output with unique IDs
     * Fast replacement without parsing XML, assuming commonly used patterns.
     */
    static replaceIDs(body) {
        const regex = /\sid="(\S+)"/g;
        const ids = [];
        let match;
        let prefix;
        function strReplace(search, replace, subject) {
            let pos = 0;
            while ((pos = subject.indexOf(search, pos)) !== -1) {
                subject = subject.slice(0, pos) + replace + subject.slice(pos + search.length);
                pos += replace.length;
            }
            return subject;
        }
        // Find all IDs
        while (match = regex.exec(body)) {
            ids.push(match[1]);
        }
        if (!ids.length) {
            return body;
        }
        prefix = 'IconifyId-' + Date.now().toString(16) + '-' + (Math.random() * 0x1000000 | 0).toString(16) + '-';
        // Replace with unique ids
        ids.forEach((id) => {
            const newID = prefix + idCounter;
            idCounter++;
            body = strReplace('="' + id + '"', '="' + newID + '"', body);
            body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
            body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
        });
        return body;
    }
    /**
     * Get SVG attributes
     */
    getAttributes(props) {
        const item = this._icon;
        if (typeof props !== 'object') {
            props = Object.create(null);
        }
        // Set data
        const align = {
            horizontal: 'center',
            vertical: 'middle',
            slice: false
        };
        const transform = {
            rotate: item.rotate,
            hFlip: item.hFlip,
            vFlip: item.vFlip
        };
        const style = Object.create(null);
        const attributes = Object.create(null);
        // Get width/height
        const inline = props.inline === true || props.inline === 'true' || props.inline === '1';
        const box = {
            left: item.left,
            top: inline ? item.inlineTop : item.top,
            width: item.width,
            height: inline ? item.inlineHeight : item.height
        };
        // Transformations
        ['hFlip', 'vFlip'].forEach(key => {
            if (props[key] !== void 0 && (props[key] === true || props[key] === 'true' || props[key] === '1')) {
                transform[key] = !transform[key];
            }
        });
        if (props.flip !== void 0) {
            props.flip.toLowerCase().split(/[\s,]+/).forEach(value => {
                switch (value) {
                    case 'horizontal':
                        transform.hFlip = !transform.hFlip;
                        break;
                    case 'vertical':
                        transform.vFlip = !transform.vFlip;
                }
            });
        }
        if (props.rotate !== void 0) {
            let value = props.rotate;
            if (typeof value === 'number') {
                transform.rotate += value;
            }
            else if (typeof value === 'string') {
                const units = value.replace(/^-?[0-9.]*/, '');
                if (units === '') {
                    value = parseInt(value, 10);
                    if (!isNaN(value)) {
                        transform.rotate += value;
                    }
                }
                else if (units !== value) {
                    let split = false;
                    switch (units) {
                        case '%':
                            // 25% -> 1, 50% -> 2, ...
                            split = 25;
                            break;
                        case 'deg':
                            // 90deg -> 1, 180deg -> 2, ...
                            split = 90;
                    }
                    if (split) {
                        value = parseInt(value.slice(0, value.length - units.length), 10);
                        if (!isNaN(value)) {
                            transform.rotate += Math.round(value / split);
                        }
                    }
                }
            }
        }
        // Apply transformations to box
        const transformations = [];
        let tempValue;
        if (transform.hFlip) {
            if (transform.vFlip) {
                transform.rotate += 2;
            }
            else {
                // Horizontal flip
                transformations.push('translate(' + (box.width + box.left) + ' ' + (0 - box.top) + ')');
                transformations.push('scale(-1 1)');
                box.top = box.left = 0;
            }
        }
        else if (transform.vFlip) {
            // Vertical flip
            transformations.push('translate(' + (0 - box.left) + ' ' + (box.height + box.top) + ')');
            transformations.push('scale(1 -1)');
            box.top = box.left = 0;
        }
        switch (transform.rotate % 4) {
            case 1:
                // 90deg
                tempValue = box.height / 2 + box.top;
                transformations.unshift('rotate(90 ' + tempValue + ' ' + tempValue + ')');
                // swap width/height and x/y
                if (box.left !== 0 || box.top !== 0) {
                    tempValue = box.left;
                    box.left = box.top;
                    box.top = tempValue;
                }
                if (box.width !== box.height) {
                    tempValue = box.width;
                    box.width = box.height;
                    box.height = tempValue;
                }
                break;
            case 2:
                // 180deg
                transformations.unshift('rotate(180 ' + (box.width / 2 + box.left) + ' ' + (box.height / 2 + box.top) + ')');
                break;
            case 3:
                // 270deg
                tempValue = box.width / 2 + box.left;
                transformations.unshift('rotate(-90 ' + tempValue + ' ' + tempValue + ')');
                // swap width/height and x/y
                if (box.left !== 0 || box.top !== 0) {
                    tempValue = box.left;
                    box.left = box.top;
                    box.top = tempValue;
                }
                if (box.width !== box.height) {
                    tempValue = box.width;
                    box.width = box.height;
                    box.height = tempValue;
                }
                break;
        }
        // Calculate dimensions
        // Values for width/height: null = default, 'auto' = from svg, false = do not set
        // Default: if both values aren't set, height defaults to '1em', width is calculated from height
        const customWidth = props.width ? props.width : null;
        let customHeight = props.height ? props.height : null;
        let width;
        let height;
        if (customWidth === null && customHeight === null) {
            customHeight = '1em';
        }
        if (customWidth !== null && customHeight !== null) {
            width = customWidth;
            height = customHeight;
        }
        else if (customWidth !== null) {
            width = customWidth;
            height = SVG.calculateDimension(width, box.height / box.width);
        }
        else {
            height = customHeight;
            width = SVG.calculateDimension(height, box.width / box.height);
        }
        if (width !== false) {
            attributes.width = width === 'auto' ? box.width : width;
        }
        if (height !== false) {
            attributes.height = height === 'auto' ? box.height : height;
        }
        // Add vertical-align for inline icon
        if (inline && item.verticalAlign !== 0) {
            style['vertical-align'] = item.verticalAlign + 'em';
        }
        // Check custom alignment
        if (props.align !== void 0) {
            props.align.toLowerCase().split(/[\s,]+/).forEach(value => {
                switch (value) {
                    case 'left':
                    case 'right':
                    case 'center':
                        align.horizontal = value;
                        break;
                    case 'top':
                    case 'bottom':
                    case 'middle':
                        align.vertical = value;
                        break;
                    case 'crop':
                        align.slice = true;
                        break;
                    case 'meet':
                        align.slice = false;
                }
            });
        }
        // Generate viewBox and preserveAspectRatio attributes
        attributes.preserveAspectRatio = getAlignment(align);
        attributes.viewBox = box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height;
        // Generate body
        let body = SVG.replaceIDs(item.body);
        if (props.color !== void 0) {
            body = body.replace(/currentColor/g, props.color);
        }
        if (transformations.length) {
            body = '<g transform="' + transformations.join(' ') + '">' + body + '</g>';
        }
        if (props.box === true || props.box === 'true' || props.box === '1') {
            // Add transparent bounding box
            // tslint:disable-next-line:max-line-length
            body += '<rect x="' + box.left + '" y="' + box.top + '" width="' + box.width + '" height="' + box.height + '" fill="rgba(0, 0, 0, 0)" />';
        }
        return {
            attributes,
            body,
            style
        };
    }
    /**
     * Generate SVG
     */
    getSVG(attributes) {
        const data = this.getAttributes(attributes);
        let svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
        // Add SVG attributes
        Object.keys(data.attributes).forEach(attr => {
            svg += ' ' + attr + '="' + data.attributes[attr] + '"';
        });
        // Add style with 360deg transformation to style to prevent subpixel rendering bug
        svg += ' style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);';
        Object.keys(data.style).forEach(attr => {
            svg += ' ' + attr + ': ' + data.style[attr] + ';';
        });
        svg += '">';
        svg += data.body + '</svg>';
        return svg;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvaWNvbmlmeS9zcmMvbGliL3N2Zy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRkFBMEY7QUFJMUY7O0dBRUc7QUFDSCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFFbEI7O0dBRUc7QUFDSCxNQUFNLFVBQVUsR0FBRywyQkFBMkIsQ0FBQztBQUMvQyxNQUFNLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztBQUU5Qzs7R0FFRztBQUNILE1BQU0sY0FBYyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFbEg7O0dBRUc7QUFDSCxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLElBQUksRUFBRSxDQUFDO0lBQ1AsR0FBRyxFQUFFLENBQUM7SUFDTixLQUFLLEVBQUUsRUFBRTtJQUNULE1BQU0sRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLENBQUM7SUFDVCxLQUFLLEVBQUUsS0FBSztJQUNaLEtBQUssRUFBRSxLQUFLO0NBQ2IsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLElBQVk7SUFDcEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pFLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsRUFBRTtRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDM0I7SUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FB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QztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUVILGtGQUFrRjtRQUNsRixHQUFHLElBQUksc0dBQXNHLENBQUM7UUFDOUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JDLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsSUFBSSxJQUFJLENBQUM7UUFFWixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFFNUIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1yZWR1bmRhbnQtanNkb2MgdmFyaWFibGUtbmFtZSBuby1jb25kaXRpb25hbC1hc3NpZ25tZW50IG5vLWJpdHdpc2UgKi9cblxuaW1wb3J0IHsgSWNvblByb3BzIH0gZnJvbSAnLi9pY29uLXByb3BzLmludGVyZmFjZSc7XG5cbi8qKlxuICogVW5pcXVlIGlkIGNvdW50ZXJcbiAqL1xubGV0IGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogUmVnZXggdXNlZCB0byBzcGxpdCBkaW1lbnNpb25zXG4gKi9cbmNvbnN0IHVuaXRzU3BsaXQgPSAvKC0/WzAtOS5dKlswLTldK1swLTkuXSopL2c7XG5jb25zdCB1bml0c1Rlc3QgPSAvXi0/WzAtOS5dKlswLTldK1swLTkuXSokL2c7XG5cbi8qKlxuICogQXR0cmlidXRlcyB1c2VkIGZvciBpY29uXG4gKi9cbmNvbnN0IGljb25BdHRyaWJ1dGVzID0gWyd3aWR0aCcsICdoZWlnaHQnLCAnaW5saW5lJywgJ2hGbGlwJywgJ3ZGbGlwJywgJ2ZsaXAnLCAncm90YXRlJywgJ2FsaWduJywgJ2NvbG9yJywgJ2JveCddO1xuXG4vKipcbiAqIERlZmF1bHQgYXR0cmlidXRlIHZhbHVlc1xuICovXG5jb25zdCBkZWZhdWx0QXR0cmlidXRlcyA9IHtcbiAgbGVmdDogMCxcbiAgdG9wOiAwLFxuICB3aWR0aDogMTYsXG4gIGhlaWdodDogMTYsXG4gIHJvdGF0ZTogMCxcbiAgaEZsaXA6IGZhbHNlLFxuICB2RmxpcDogZmFsc2Vcbn07XG5cbi8qKlxuICogQWRkIG1pc3NpbmcgcHJvcGVydGllcyB0byBpY29uXG4gKlxuICogSW1wb3J0YW50OiBpbiBQSFAgdmVyc2lvbiBvZiB0aGlzIGxpYnJhcnkgdGhpcyBmdW5jdGlvbiBpcyBwYXJ0IG9mIENvbGxlY3Rpb24gY2xhc3M6IENvbGxlY3Rpb246OmFkZE1pc3NpbmdBdHRyaWJ1dGVzKClcbiAqXG4gKiBKYXZhU2NyaXB0IHZlcnNpb24gdXNlcyBzZXBhcmF0ZSBmaWxlIHNvIHRoaXMgZnVuY3Rpb24gY291bGQgYmUgdXNlZCBpbiBSZWFjdCBhbmQgb3RoZXIgY29tcG9uZW50cyB3aXRob3V0IGxvYWRpbmdcbiAqIGVudGlyZSBDb2xsZWN0aW9uIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKGRhdGE6IG9iamVjdCk6IG9iamVjdCB7XG4gIGNvbnN0IGl0ZW0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzLCBkYXRhKTtcbiAgaWYgKGl0ZW0uaW5saW5lVG9wID09PSB2b2lkIDApIHtcbiAgICBpdGVtLmlubGluZVRvcCA9IGl0ZW0udG9wO1xuICB9XG4gIGlmIChpdGVtLmlubGluZUhlaWdodCA9PT0gdm9pZCAwKSB7XG4gICAgaXRlbS5pbmxpbmVIZWlnaHQgPSBpdGVtLmhlaWdodDtcbiAgfVxuICBpZiAoaXRlbS52ZXJ0aWNhbEFsaWduID09PSB2b2lkIDApIHtcbiAgICAvLyAtMC4xNDMgaWYgaWNvbiBpcyBkZXNpZ25lZCBmb3IgMTRweCBoZWlnaHQsXG4gICAgLy8gb3RoZXJ3aXNlIGFzc3VtZSBpY29uIGlzIGRlc2lnbmVkIGZvciAxNnB4IGhlaWdodFxuICAgIGl0ZW0udmVydGljYWxBbGlnbiA9IGl0ZW0uaGVpZ2h0ICUgNyA9PT0gMCAmJiBpdGVtLmhlaWdodCAlIDggIT09IDAgPyAtMC4xNDMgOiAtMC4xMjU7XG4gIH1cbiAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogR2V0IHByZXNlcnZlQXNwZWN0UmF0aW8gYXR0cmlidXRlIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGlnbm1lbnQoYWxpZ246IHsgaG9yaXpvbnRhbDogc3RyaW5nOyB2ZXJ0aWNhbDogc3RyaW5nOyBzbGljZTogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdDtcbiAgc3dpdGNoIChhbGlnbi5ob3Jpem9udGFsKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXN1bHQgPSAneE1pbic7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIHJlc3VsdCA9ICd4TWF4JztcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJlc3VsdCA9ICd4TWlkJztcbiAgfVxuICBzd2l0Y2ggKGFsaWduLnZlcnRpY2FsKSB7XG4gICAgY2FzZSAndG9wJzpcbiAgICAgIHJlc3VsdCArPSAnWU1pbic7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICByZXN1bHQgKz0gJ1lNYXgnO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmVzdWx0ICs9ICdZTWlkJztcbiAgfVxuICByZXN1bHQgKz0gYWxpZ24uc2xpY2UgPyAnIHNsaWNlJyA6ICcgbWVldCc7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogU1ZHIGNsYXNzXG4gKlxuICogQHNlZSBAaWNvbmlmeS9qc29uLXRvb2xzL3NyYy9zdmcuanNcbiAqL1xuZXhwb3J0IGNsYXNzIFNWRyB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiAgVXNlIENvbGxlY3Rpb24uZ2V0SWNvbkRhdGEoKSB0byByZXRyaWV2ZSBpY29uIGRhdGFcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2ljb24pIHt9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBzZWNvbmQgZGltZW5zaW9uIHdoZW4gb25seSAxIGRpbWVuc2lvbiBpcyBzZXRcbiAgICogSWYgc2l6ZSA9PSB3aWR0aCwgcmF0aW8gPSBoZWlnaHQvd2lkdGhcbiAgICogSWYgc2l6ZSA9PSBoZWlnaHQsIHJhdGlvID0gd2lkdGgvaGVpZ2h0XG4gICAqL1xuICBzdGF0aWMgY2FsY3VsYXRlRGltZW5zaW9uKHNpemU6IHN0cmluZyB8IG51bWJlciwgcmF0aW86IG51bWJlciwgcHJlY2lzaW9uID0gMTAwKTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKHJhdGlvID09PSAxKSB7XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHNpemUgKiByYXRpbyAqIHByZWNpc2lvbikgLyBwcmVjaXNpb247XG4gICAgfVxuXG4gICAgLy8gc3BsaXQgY29kZSBpbnRvIHNldHMgb2Ygc3RyaW5ncyBhbmQgbnVtYmVyc1xuICAgIGNvbnN0IHNwbGl0ID0gc2l6ZS5zcGxpdCh1bml0c1NwbGl0KTtcbiAgICBpZiAoc3BsaXQgPT09IG51bGwgfHwgIXNwbGl0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBsZXQgY29kZSA9IHNwbGl0LnNoaWZ0KCk7XG4gICAgbGV0IGlzTnVtYmVyID0gdW5pdHNUZXN0LnRlc3QoY29kZSk7XG4gICAgbGV0IG51bTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoaXNOdW1iZXIpIHtcbiAgICAgICAgbnVtID0gcGFyc2VGbG9hdChjb2RlKTtcbiAgICAgICAgaWYgKGlzTmFOKG51bSkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKE1hdGguY2VpbChudW0gKiByYXRpbyAqIHByZWNpc2lvbikgLyBwcmVjaXNpb24pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2goY29kZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIG5leHRcbiAgICAgIGNvZGUgPSBzcGxpdC5zaGlmdCgpO1xuICAgICAgaWYgKGNvZGUgPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0cy5qb2luKCcnKTtcbiAgICAgIH1cbiAgICAgIGlzTnVtYmVyID0gIWlzTnVtYmVyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIElEcyBpbiBTVkcgb3V0cHV0IHdpdGggdW5pcXVlIElEc1xuICAgKiBGYXN0IHJlcGxhY2VtZW50IHdpdGhvdXQgcGFyc2luZyBYTUwsIGFzc3VtaW5nIGNvbW1vbmx5IHVzZWQgcGF0dGVybnMuXG4gICAqL1xuICBzdGF0aWMgcmVwbGFjZUlEcyhib2R5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gL1xcc2lkPVwiKFxcUyspXCIvZztcbiAgICBjb25zdCBpZHMgPSBbXTtcbiAgICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheTtcbiAgICBsZXQgcHJlZml4OiBzdHJpbmc7XG5cbiAgICBmdW5jdGlvbiBzdHJSZXBsYWNlKHNlYXJjaCwgcmVwbGFjZSwgc3ViamVjdCkge1xuICAgICAgbGV0IHBvcyA9IDA7XG5cbiAgICAgIHdoaWxlICgocG9zID0gc3ViamVjdC5pbmRleE9mKHNlYXJjaCwgcG9zKSkgIT09IC0xKSB7XG4gICAgICAgIHN1YmplY3QgPSBzdWJqZWN0LnNsaWNlKDAsIHBvcykgKyByZXBsYWNlICsgc3ViamVjdC5zbGljZShwb3MgKyBzZWFyY2gubGVuZ3RoKTtcbiAgICAgICAgcG9zICs9IHJlcGxhY2UubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGFsbCBJRHNcbiAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKGJvZHkpKSB7XG4gICAgICBpZHMucHVzaChtYXRjaFsxXSk7XG4gICAgfVxuICAgIGlmICghaWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgcHJlZml4ID0gJ0ljb25pZnlJZC0nICsgRGF0ZS5ub3coKS50b1N0cmluZygxNikgKyAnLScgKyAoTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMCB8IDApLnRvU3RyaW5nKDE2KSArICctJztcblxuICAgIC8vIFJlcGxhY2Ugd2l0aCB1bmlxdWUgaWRzXG4gICAgaWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICBjb25zdCBuZXdJRCA9IHByZWZpeCArIGlkQ291bnRlcjtcbiAgICAgIGlkQ291bnRlcisrO1xuICAgICAgYm9keSA9IHN0clJlcGxhY2UoJz1cIicgKyBpZCArICdcIicsICc9XCInICsgbmV3SUQgKyAnXCInLCBib2R5KTtcbiAgICAgIGJvZHkgPSBzdHJSZXBsYWNlKCc9XCIjJyArIGlkICsgJ1wiJywgJz1cIiMnICsgbmV3SUQgKyAnXCInLCBib2R5KTtcbiAgICAgIGJvZHkgPSBzdHJSZXBsYWNlKCcoIycgKyBpZCArICcpJywgJygjJyArIG5ld0lEICsgJyknLCBib2R5KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBTVkcgYXR0cmlidXRlc1xuICAgKi9cbiAgZ2V0QXR0cmlidXRlcyhwcm9wczogSWNvblByb3BzKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2ljb247XG4gICAgaWYgKHR5cGVvZiBwcm9wcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHByb3BzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgZGF0YVxuICAgIGNvbnN0IGFsaWduID0ge1xuICAgICAgaG9yaXpvbnRhbDogJ2NlbnRlcicsXG4gICAgICB2ZXJ0aWNhbDogJ21pZGRsZScsXG4gICAgICBzbGljZTogZmFsc2VcbiAgICB9O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHtcbiAgICAgIHJvdGF0ZTogaXRlbS5yb3RhdGUsXG4gICAgICBoRmxpcDogaXRlbS5oRmxpcCxcbiAgICAgIHZGbGlwOiBpdGVtLnZGbGlwXG4gICAgfTtcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIC8vIEdldCB3aWR0aC9oZWlnaHRcbiAgICBjb25zdCBpbmxpbmUgPSBwcm9wcy5pbmxpbmUgPT09IHRydWUgfHwgcHJvcHMuaW5saW5lID09PSAndHJ1ZScgfHwgcHJvcHMuaW5saW5lID09PSAnMSc7XG5cbiAgICBjb25zdCBib3ggPSB7XG4gICAgICBsZWZ0OiBpdGVtLmxlZnQsXG4gICAgICB0b3A6IGlubGluZSA/IGl0ZW0uaW5saW5lVG9wIDogaXRlbS50b3AsXG4gICAgICB3aWR0aDogaXRlbS53aWR0aCxcbiAgICAgIGhlaWdodDogaW5saW5lID8gaXRlbS5pbmxpbmVIZWlnaHQgOiBpdGVtLmhlaWdodFxuICAgIH07XG5cbiAgICAvLyBUcmFuc2Zvcm1hdGlvbnNcbiAgICBbJ2hGbGlwJywgJ3ZGbGlwJ10uZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKHByb3BzW2tleV0gIT09IHZvaWQgMCAmJiAocHJvcHNba2V5XSA9PT0gdHJ1ZSB8fCBwcm9wc1trZXldID09PSAndHJ1ZScgfHwgcHJvcHNba2V5XSA9PT0gJzEnKSkge1xuICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9ICF0cmFuc2Zvcm1ba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocHJvcHMuZmxpcCAhPT0gdm9pZCAwKSB7XG4gICAgICBwcm9wcy5mbGlwLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1tcXHMsXSsvKS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgIGNhc2UgJ2hvcml6b250YWwnOlxuICAgICAgICAgICAgdHJhbnNmb3JtLmhGbGlwID0gIXRyYW5zZm9ybS5oRmxpcDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAndmVydGljYWwnOlxuICAgICAgICAgICAgdHJhbnNmb3JtLnZGbGlwID0gIXRyYW5zZm9ybS52RmxpcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5yb3RhdGUgIT09IHZvaWQgMCkge1xuICAgICAgbGV0IHZhbHVlID0gcHJvcHMucm90YXRlO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0ZSArPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCB1bml0cyA9IHZhbHVlLnJlcGxhY2UoL14tP1swLTkuXSovLCAnJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJycpIHtcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGUgKz0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHVuaXRzICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGxldCBzcGxpdDogYm9vbGVhbiB8IG51bWJlciA9IGZhbHNlO1xuICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgICAvLyAyNSUgLT4gMSwgNTAlIC0+IDIsIC4uLlxuICAgICAgICAgICAgICBzcGxpdCA9IDI1O1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZGVnJzpcbiAgICAgICAgICAgICAgLy8gOTBkZWcgLT4gMSwgMTgwZGVnIC0+IDIsIC4uLlxuICAgICAgICAgICAgICBzcGxpdCA9IDkwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3BsaXQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUuc2xpY2UoMCwgdmFsdWUubGVuZ3RoIC0gdW5pdHMubGVuZ3RoKSwgMTApO1xuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0ZSArPSBNYXRoLnJvdW5kKHZhbHVlIC8gc3BsaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucyB0byBib3hcbiAgICBjb25zdCB0cmFuc2Zvcm1hdGlvbnMgPSBbXTtcbiAgICBsZXQgdGVtcFZhbHVlO1xuICAgIGlmICh0cmFuc2Zvcm0uaEZsaXApIHtcbiAgICAgIGlmICh0cmFuc2Zvcm0udkZsaXApIHtcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0ZSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBmbGlwXG4gICAgICAgIHRyYW5zZm9ybWF0aW9ucy5wdXNoKCd0cmFuc2xhdGUoJyArIChib3gud2lkdGggKyBib3gubGVmdCkgKyAnICcgKyAoMCAtIGJveC50b3ApICsgJyknKTtcbiAgICAgICAgdHJhbnNmb3JtYXRpb25zLnB1c2goJ3NjYWxlKC0xIDEpJyk7XG4gICAgICAgIGJveC50b3AgPSBib3gubGVmdCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0cmFuc2Zvcm0udkZsaXApIHtcbiAgICAgIC8vIFZlcnRpY2FsIGZsaXBcbiAgICAgIHRyYW5zZm9ybWF0aW9ucy5wdXNoKCd0cmFuc2xhdGUoJyArICgwIC0gYm94LmxlZnQpICsgJyAnICsgKGJveC5oZWlnaHQgKyBib3gudG9wKSArICcpJyk7XG4gICAgICB0cmFuc2Zvcm1hdGlvbnMucHVzaCgnc2NhbGUoMSAtMSknKTtcbiAgICAgIGJveC50b3AgPSBib3gubGVmdCA9IDA7XG4gICAgfVxuICAgIHN3aXRjaCAodHJhbnNmb3JtLnJvdGF0ZSAlIDQpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgLy8gOTBkZWdcbiAgICAgICAgdGVtcFZhbHVlID0gYm94LmhlaWdodCAvIDIgKyBib3gudG9wO1xuICAgICAgICB0cmFuc2Zvcm1hdGlvbnMudW5zaGlmdCgncm90YXRlKDkwICcgKyB0ZW1wVmFsdWUgKyAnICcgKyB0ZW1wVmFsdWUgKyAnKScpO1xuICAgICAgICAvLyBzd2FwIHdpZHRoL2hlaWdodCBhbmQgeC95XG4gICAgICAgIGlmIChib3gubGVmdCAhPT0gMCB8fCBib3gudG9wICE9PSAwKSB7XG4gICAgICAgICAgdGVtcFZhbHVlID0gYm94LmxlZnQ7XG4gICAgICAgICAgYm94LmxlZnQgPSBib3gudG9wO1xuICAgICAgICAgIGJveC50b3AgPSB0ZW1wVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJveC53aWR0aCAhPT0gYm94LmhlaWdodCkge1xuICAgICAgICAgIHRlbXBWYWx1ZSA9IGJveC53aWR0aDtcbiAgICAgICAgICBib3gud2lkdGggPSBib3guaGVpZ2h0O1xuICAgICAgICAgIGJveC5oZWlnaHQgPSB0ZW1wVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjpcbiAgICAgICAgLy8gMTgwZGVnXG4gICAgICAgIHRyYW5zZm9ybWF0aW9ucy51bnNoaWZ0KCdyb3RhdGUoMTgwICcgKyAoYm94LndpZHRoIC8gMiArIGJveC5sZWZ0KSArICcgJyArIChib3guaGVpZ2h0IC8gMiArIGJveC50b3ApICsgJyknKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgLy8gMjcwZGVnXG4gICAgICAgIHRlbXBWYWx1ZSA9IGJveC53aWR0aCAvIDIgKyBib3gubGVmdDtcbiAgICAgICAgdHJhbnNmb3JtYXRpb25zLnVuc2hpZnQoJ3JvdGF0ZSgtOTAgJyArIHRlbXBWYWx1ZSArICcgJyArIHRlbXBWYWx1ZSArICcpJyk7XG4gICAgICAgIC8vIHN3YXAgd2lkdGgvaGVpZ2h0IGFuZCB4L3lcbiAgICAgICAgaWYgKGJveC5sZWZ0ICE9PSAwIHx8IGJveC50b3AgIT09IDApIHtcbiAgICAgICAgICB0ZW1wVmFsdWUgPSBib3gubGVmdDtcbiAgICAgICAgICBib3gubGVmdCA9IGJveC50b3A7XG4gICAgICAgICAgYm94LnRvcCA9IHRlbXBWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYm94LndpZHRoICE9PSBib3guaGVpZ2h0KSB7XG4gICAgICAgICAgdGVtcFZhbHVlID0gYm94LndpZHRoO1xuICAgICAgICAgIGJveC53aWR0aCA9IGJveC5oZWlnaHQ7XG4gICAgICAgICAgYm94LmhlaWdodCA9IHRlbXBWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgZGltZW5zaW9uc1xuICAgIC8vIFZhbHVlcyBmb3Igd2lkdGgvaGVpZ2h0OiBudWxsID0gZGVmYXVsdCwgJ2F1dG8nID0gZnJvbSBzdmcsIGZhbHNlID0gZG8gbm90IHNldFxuICAgIC8vIERlZmF1bHQ6IGlmIGJvdGggdmFsdWVzIGFyZW4ndCBzZXQsIGhlaWdodCBkZWZhdWx0cyB0byAnMWVtJywgd2lkdGggaXMgY2FsY3VsYXRlZCBmcm9tIGhlaWdodFxuICAgIGNvbnN0IGN1c3RvbVdpZHRoID0gcHJvcHMud2lkdGggPyBwcm9wcy53aWR0aCA6IG51bGw7XG4gICAgbGV0IGN1c3RvbUhlaWdodCA9IHByb3BzLmhlaWdodCA/IHByb3BzLmhlaWdodCA6IG51bGw7XG5cbiAgICBsZXQgd2lkdGg7XG4gICAgbGV0IGhlaWdodDtcbiAgICBpZiAoY3VzdG9tV2lkdGggPT09IG51bGwgJiYgY3VzdG9tSGVpZ2h0ID09PSBudWxsKSB7XG4gICAgICBjdXN0b21IZWlnaHQgPSAnMWVtJztcbiAgICB9XG4gICAgaWYgKGN1c3RvbVdpZHRoICE9PSBudWxsICYmIGN1c3RvbUhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgd2lkdGggPSBjdXN0b21XaWR0aDtcbiAgICAgIGhlaWdodCA9IGN1c3RvbUhlaWdodDtcbiAgICB9IGVsc2UgaWYgKGN1c3RvbVdpZHRoICE9PSBudWxsKSB7XG4gICAgICB3aWR0aCA9IGN1c3RvbVdpZHRoO1xuICAgICAgaGVpZ2h0ID0gU1ZHLmNhbGN1bGF0ZURpbWVuc2lvbih3aWR0aCwgYm94LmhlaWdodCAvIGJveC53aWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IGN1c3RvbUhlaWdodDtcbiAgICAgIHdpZHRoID0gU1ZHLmNhbGN1bGF0ZURpbWVuc2lvbihoZWlnaHQsIGJveC53aWR0aCAvIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmICh3aWR0aCAhPT0gZmFsc2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMud2lkdGggPSB3aWR0aCA9PT0gJ2F1dG8nID8gYm94LndpZHRoIDogd2lkdGg7XG4gICAgfVxuICAgIGlmIChoZWlnaHQgIT09IGZhbHNlKSB7XG4gICAgICBhdHRyaWJ1dGVzLmhlaWdodCA9IGhlaWdodCA9PT0gJ2F1dG8nID8gYm94LmhlaWdodCA6IGhlaWdodDtcbiAgICB9XG5cbiAgICAvLyBBZGQgdmVydGljYWwtYWxpZ24gZm9yIGlubGluZSBpY29uXG4gICAgaWYgKGlubGluZSAmJiBpdGVtLnZlcnRpY2FsQWxpZ24gIT09IDApIHtcbiAgICAgIHN0eWxlWyd2ZXJ0aWNhbC1hbGlnbiddID0gaXRlbS52ZXJ0aWNhbEFsaWduICsgJ2VtJztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBjdXN0b20gYWxpZ25tZW50XG4gICAgaWYgKHByb3BzLmFsaWduICE9PSB2b2lkIDApIHtcbiAgICAgIHByb3BzLmFsaWduLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1tcXHMsXSsvKS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICAgICAgYWxpZ24uaG9yaXpvbnRhbCA9IHZhbHVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgY2FzZSAnbWlkZGxlJzpcbiAgICAgICAgICAgIGFsaWduLnZlcnRpY2FsID0gdmFsdWU7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2Nyb3AnOlxuICAgICAgICAgICAgYWxpZ24uc2xpY2UgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdtZWV0JzpcbiAgICAgICAgICAgIGFsaWduLnNsaWNlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIHZpZXdCb3ggYW5kIHByZXNlcnZlQXNwZWN0UmF0aW8gYXR0cmlidXRlc1xuICAgIGF0dHJpYnV0ZXMucHJlc2VydmVBc3BlY3RSYXRpbyA9IGdldEFsaWdubWVudChhbGlnbik7XG4gICAgYXR0cmlidXRlcy52aWV3Qm94ID0gYm94LmxlZnQgKyAnICcgKyBib3gudG9wICsgJyAnICsgYm94LndpZHRoICsgJyAnICsgYm94LmhlaWdodDtcblxuICAgIC8vIEdlbmVyYXRlIGJvZHlcbiAgICBsZXQgYm9keSA9IFNWRy5yZXBsYWNlSURzKGl0ZW0uYm9keSk7XG5cbiAgICBpZiAocHJvcHMuY29sb3IgIT09IHZvaWQgMCkge1xuICAgICAgYm9keSA9IGJvZHkucmVwbGFjZSgvY3VycmVudENvbG9yL2csIHByb3BzLmNvbG9yKTtcbiAgICB9XG4gICAgaWYgKHRyYW5zZm9ybWF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGJvZHkgPSAnPGcgdHJhbnNmb3JtPVwiJyArIHRyYW5zZm9ybWF0aW9ucy5qb2luKCcgJykgKyAnXCI+JyArIGJvZHkgKyAnPC9nPic7XG4gICAgfVxuICAgIGlmIChwcm9wcy5ib3ggPT09IHRydWUgfHwgcHJvcHMuYm94ID09PSAndHJ1ZScgfHwgcHJvcHMuYm94ID09PSAnMScpIHtcbiAgICAgIC8vIEFkZCB0cmFuc3BhcmVudCBib3VuZGluZyBib3hcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIGJvZHkgKz0gJzxyZWN0IHg9XCInICsgYm94LmxlZnQgKyAnXCIgeT1cIicgKyBib3gudG9wICsgJ1wiIHdpZHRoPVwiJyArIGJveC53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgYm94LmhlaWdodCArICdcIiBmaWxsPVwicmdiYSgwLCAwLCAwLCAwKVwiIC8+JztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYXR0cmlidXRlcyxcbiAgICAgIGJvZHksXG4gICAgICBzdHlsZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgU1ZHXG4gICAqL1xuICBnZXRTVkcoYXR0cmlidXRlczogSWNvblByb3BzKSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGxldCBzdmcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCInO1xuXG4gICAgLy8gQWRkIFNWRyBhdHRyaWJ1dGVzXG4gICAgT2JqZWN0LmtleXMoZGF0YS5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgc3ZnICs9ICcgJyArIGF0dHIgKyAnPVwiJyArIGRhdGEuYXR0cmlidXRlc1thdHRyXSArICdcIic7XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgc3R5bGUgd2l0aCAzNjBkZWcgdHJhbnNmb3JtYXRpb24gdG8gc3R5bGUgdG8gcHJldmVudCBzdWJwaXhlbCByZW5kZXJpbmcgYnVnXG4gICAgc3ZnICs9ICcgc3R5bGU9XCItbXMtdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyc7XG4gICAgT2JqZWN0LmtleXMoZGF0YS5zdHlsZSkuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIHN2ZyArPSAnICcgKyBhdHRyICsgJzogJyArIGRhdGEuc3R5bGVbYXR0cl0gKyAnOyc7XG4gICAgfSk7XG5cbiAgICBzdmcgKz0gJ1wiPic7XG5cbiAgICBzdmcgKz0gZGF0YS5ib2R5ICsgJzwvc3ZnPic7XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG59XG4iXX0=