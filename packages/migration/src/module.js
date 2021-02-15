/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function storyDataArrayToObject(storyData) {
  return { pages: storyData };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const NEW_PAGE_WIDTH = 1080;
const NEW_PAGE_HEIGHT = 1920;
const OLD_PAGE_WIDTH = 412;
const OLD_PAGE_HEIGHT = 732;

const SCALE_X = NEW_PAGE_WIDTH / OLD_PAGE_WIDTH;
const SCALE_Y = NEW_PAGE_HEIGHT / OLD_PAGE_HEIGHT;

function dataPixelTo1080({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement({ x, y, width, height, fontSize, ...rest }) {
  const element = {
    x: dataPixels(x * SCALE_X),
    y: dataPixels(y * SCALE_Y),
    width: dataPixels(width * SCALE_X),
    height: dataPixels(height * SCALE_Y),
    ...rest,
  };
  if (typeof fontSize === 'number') {
    element.fontSize = dataPixels(fontSize * SCALE_Y);
  }
  return element;
}

/**
 * See `units/dimensions.js`.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "data" space precision.
 */
function dataPixels(v) {
  return Number(v.toFixed(0));
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function fullbleedToFill({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$1),
    ...rest,
  };
}

function reducePage$1({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$1),
    ...rest,
  };
}

function updateElement$1({ isFullbleed, ...rest }) {
  return {
    isFill: isFullbleed,
    ...rest,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function dataSquareToShape({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$2),
    ...rest,
  };
}

function reducePage$2({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$2),
    ...rest,
  };
}

function updateElement$2({ type, ...rest }) {
  const element = {
    type: type === 'square' ? 'shape' : type,
    ...rest,
  };
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function dataMediaElementToResource({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$3),
    ...rest,
  };
}

function reducePage$3({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$3),
    ...rest,
  };
}

function updateElement$3(element) {
  if (element.type === 'image') {
    const { src, origRatio, width, height, mimeType, ...rest } = element;
    return {
      resource: {
        type: 'image',
        src,
        width,
        height,
        mimeType,
      },
      width,
      height,
      ...rest,
    };
  } else if (element.type === 'video') {
    const {
      src,
      origRatio,
      poster,
      posterId,
      videoId,
      mimeType,
      width,
      height,
      ...rest
    } = element;
    return {
      resource: {
        type: 'video',
        src,
        width,
        height,
        poster,
        posterId,
        videoId,
        mimeType,
      },
      width,
      height,
      ...rest,
    };
  }
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function setOpacity({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$4),
    ...rest,
  };
}

function reducePage$4({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$4),
    ...rest,
  };
}

function updateElement$4({ opacity, ...rest }) {
  return {
    opacity: opacity ? opacity : 100,
    ...rest,
  };
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

// based on https://github.com/styled-components/styled-components/blob/fcf6f3804c57a14dd7984dfab7bc06ee2edca044/src/utils/error.js

/**
 * Parse errors.md and turn it into a simple hash of code: message
 * @private
 */
var ERRORS = {
  "1": "Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).\n\n",
  "2": "Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).\n\n",
  "3": "Passed an incorrect argument to a color function, please pass a string representation of a color.\n\n",
  "4": "Couldn't generate valid rgb string from %s, it returned %s.\n\n",
  "5": "Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.\n\n",
  "6": "Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).\n\n",
  "7": "Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).\n\n",
  "8": "Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.\n\n",
  "9": "Please provide a number of steps to the modularScale helper.\n\n",
  "10": "Please pass a number or one of the predefined scales to the modularScale helper as the ratio.\n\n",
  "11": "Invalid value passed as base to modularScale, expected number or em string but got \"%s\"\n\n",
  "12": "Expected a string ending in \"px\" or a number passed as the first argument to %s(), got \"%s\" instead.\n\n",
  "13": "Expected a string ending in \"px\" or a number passed as the second argument to %s(), got \"%s\" instead.\n\n",
  "14": "Passed invalid pixel value (\"%s\") to %s(), please pass a value like \"12px\" or 12.\n\n",
  "15": "Passed invalid base value (\"%s\") to %s(), please pass a value like \"12px\" or 12.\n\n",
  "16": "You must provide a template to this method.\n\n",
  "17": "You passed an unsupported selector state to this method.\n\n",
  "18": "minScreen and maxScreen must be provided as stringified numbers with the same units.\n\n",
  "19": "fromSize and toSize must be provided as stringified numbers with the same units.\n\n",
  "20": "expects either an array of objects or a single object with the properties prop, fromSize, and toSize.\n\n",
  "21": "expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",
  "22": "expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",
  "23": "fontFace expects a name of a font-family.\n\n",
  "24": "fontFace expects either the path to the font file(s) or a name of a local copy.\n\n",
  "25": "fontFace expects localFonts to be an array.\n\n",
  "26": "fontFace expects fileFormats to be an array.\n\n",
  "27": "radialGradient requries at least 2 color-stops to properly render.\n\n",
  "28": "Please supply a filename to retinaImage() as the first argument.\n\n",
  "29": "Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.\n\n",
  "30": "Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",
  "31": "The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation\n\n",
  "32": "To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')\n\n",
  "33": "The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation\n\n",
  "34": "borderRadius expects a radius value as a string or number as the second argument.\n\n",
  "35": "borderRadius expects one of \"top\", \"bottom\", \"left\" or \"right\" as the first argument.\n\n",
  "36": "Property must be a string value.\n\n",
  "37": "Syntax Error at %s.\n\n",
  "38": "Formula contains a function that needs parentheses at %s.\n\n",
  "39": "Formula is missing closing parenthesis at %s.\n\n",
  "40": "Formula has too many closing parentheses at %s.\n\n",
  "41": "All values in a formula must have the same unit or be unitless.\n\n",
  "42": "Please provide a number of steps to the modularScale helper.\n\n",
  "43": "Please pass a number or one of the predefined scales to the modularScale helper as the ratio.\n\n",
  "44": "Invalid value passed as base to modularScale, expected number or em/rem string but got %s.\n\n",
  "45": "Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.\n\n",
  "46": "Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.\n\n",
  "47": "minScreen and maxScreen must be provided as stringified numbers with the same units.\n\n",
  "48": "fromSize and toSize must be provided as stringified numbers with the same units.\n\n",
  "49": "Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.\n\n",
  "50": "Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.\n\n",
  "51": "Expects the first argument object to have the properties prop, fromSize, and toSize.\n\n",
  "52": "fontFace expects either the path to the font file(s) or a name of a local copy.\n\n",
  "53": "fontFace expects localFonts to be an array.\n\n",
  "54": "fontFace expects fileFormats to be an array.\n\n",
  "55": "fontFace expects a name of a font-family.\n\n",
  "56": "linearGradient requries at least 2 color-stops to properly render.\n\n",
  "57": "radialGradient requries at least 2 color-stops to properly render.\n\n",
  "58": "Please supply a filename to retinaImage() as the first argument.\n\n",
  "59": "Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.\n\n",
  "60": "Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",
  "61": "Property must be a string value.\n\n",
  "62": "borderRadius expects a radius value as a string or number as the second argument.\n\n",
  "63": "borderRadius expects one of \"top\", \"bottom\", \"left\" or \"right\" as the first argument.\n\n",
  "64": "The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.\n\n",
  "65": "To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').\n\n",
  "66": "The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.\n\n",
  "67": "You must provide a template to this method.\n\n",
  "68": "You passed an unsupported selector state to this method.\n\n",
  "69": "Expected a string ending in \"px\" or a number passed as the first argument to %s(), got %s instead.\n\n",
  "70": "Expected a string ending in \"px\" or a number passed as the second argument to %s(), got %s instead.\n\n",
  "71": "Passed invalid pixel value %s to %s(), please pass a value like \"12px\" or 12.\n\n",
  "72": "Passed invalid base value %s to %s(), please pass a value like \"12px\" or 12.\n\n",
  "73": "Please provide a valid CSS variable.\n\n",
  "74": "CSS variable not found and no default was provided.\n\n",
  "75": "important requires a valid style object, got a %s instead.\n\n",
  "76": "fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.\n\n",
  "77": "remToPx expects a value in \"rem\" but you provided it in \"%s\".\n\n",
  "78": "base must be set in \"px\" or \"%\" but you set it in \"%s\".\n"
};
/**
 * super basic version of sprintf
 * @private
 */

function format() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var a = args[0];
  var b = [];
  var c;

  for (c = 1; c < args.length; c += 1) {
    b.push(args[c]);
  }

  b.forEach(function (d) {
    a = a.replace(/%[a-z]/, d);
  });
  return a;
}
/**
 * Create an error file out of errors.md for development and a simple web link to the full errors
 * in production mode.
 * @private
 */


var PolishedError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(PolishedError, _Error);

  function PolishedError(code) {
    var _this;

    if (process.env.NODE_ENV === 'production') {
      _this = _Error.call(this, "An error occurred. See https://github.com/styled-components/polished/blob/main/src/internalHelpers/errors.md#" + code + " for more information.") || this;
    } else {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _this = _Error.call(this, format.apply(void 0, [ERRORS[code]].concat(args))) || this;
    }

    return _assertThisInitialized(_this);
  }

  return PolishedError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function colorToInt(color) {
  return Math.round(color * 255);
}

function convertToInt(red, green, blue) {
  return colorToInt(red) + "," + colorToInt(green) + "," + colorToInt(blue);
}

function hslToRgb(hue, saturation, lightness, convert) {
  if (convert === void 0) {
    convert = convertToInt;
  }

  if (saturation === 0) {
    // achromatic
    return convert(lightness, lightness, lightness);
  } // formulae from https://en.wikipedia.org/wiki/HSL_and_HSV


  var huePrime = (hue % 360 + 360) % 360 / 60;
  var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  var secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
  var red = 0;
  var green = 0;
  var blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red = chroma;
    blue = secondComponent;
  }

  var lightnessModification = lightness - chroma / 2;
  var finalRed = red + lightnessModification;
  var finalGreen = green + lightnessModification;
  var finalBlue = blue + lightnessModification;
  return convert(finalRed, finalGreen, finalBlue);
}

var namedColorMap = {
  aliceblue: 'f0f8ff',
  antiquewhite: 'faebd7',
  aqua: '00ffff',
  aquamarine: '7fffd4',
  azure: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '000',
  blanchedalmond: 'ffebcd',
  blue: '0000ff',
  blueviolet: '8a2be2',
  brown: 'a52a2a',
  burlywood: 'deb887',
  cadetblue: '5f9ea0',
  chartreuse: '7fff00',
  chocolate: 'd2691e',
  coral: 'ff7f50',
  cornflowerblue: '6495ed',
  cornsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: '00ffff',
  darkblue: '00008b',
  darkcyan: '008b8b',
  darkgoldenrod: 'b8860b',
  darkgray: 'a9a9a9',
  darkgreen: '006400',
  darkgrey: 'a9a9a9',
  darkkhaki: 'bdb76b',
  darkmagenta: '8b008b',
  darkolivegreen: '556b2f',
  darkorange: 'ff8c00',
  darkorchid: '9932cc',
  darkred: '8b0000',
  darksalmon: 'e9967a',
  darkseagreen: '8fbc8f',
  darkslateblue: '483d8b',
  darkslategray: '2f4f4f',
  darkslategrey: '2f4f4f',
  darkturquoise: '00ced1',
  darkviolet: '9400d3',
  deeppink: 'ff1493',
  deepskyblue: '00bfff',
  dimgray: '696969',
  dimgrey: '696969',
  dodgerblue: '1e90ff',
  firebrick: 'b22222',
  floralwhite: 'fffaf0',
  forestgreen: '228b22',
  fuchsia: 'ff00ff',
  gainsboro: 'dcdcdc',
  ghostwhite: 'f8f8ff',
  gold: 'ffd700',
  goldenrod: 'daa520',
  gray: '808080',
  green: '008000',
  greenyellow: 'adff2f',
  grey: '808080',
  honeydew: 'f0fff0',
  hotpink: 'ff69b4',
  indianred: 'cd5c5c',
  indigo: '4b0082',
  ivory: 'fffff0',
  khaki: 'f0e68c',
  lavender: 'e6e6fa',
  lavenderblush: 'fff0f5',
  lawngreen: '7cfc00',
  lemonchiffon: 'fffacd',
  lightblue: 'add8e6',
  lightcoral: 'f08080',
  lightcyan: 'e0ffff',
  lightgoldenrodyellow: 'fafad2',
  lightgray: 'd3d3d3',
  lightgreen: '90ee90',
  lightgrey: 'd3d3d3',
  lightpink: 'ffb6c1',
  lightsalmon: 'ffa07a',
  lightseagreen: '20b2aa',
  lightskyblue: '87cefa',
  lightslategray: '789',
  lightslategrey: '789',
  lightsteelblue: 'b0c4de',
  lightyellow: 'ffffe0',
  lime: '0f0',
  limegreen: '32cd32',
  linen: 'faf0e6',
  magenta: 'f0f',
  maroon: '800000',
  mediumaquamarine: '66cdaa',
  mediumblue: '0000cd',
  mediumorchid: 'ba55d3',
  mediumpurple: '9370db',
  mediumseagreen: '3cb371',
  mediumslateblue: '7b68ee',
  mediumspringgreen: '00fa9a',
  mediumturquoise: '48d1cc',
  mediumvioletred: 'c71585',
  midnightblue: '191970',
  mintcream: 'f5fffa',
  mistyrose: 'ffe4e1',
  moccasin: 'ffe4b5',
  navajowhite: 'ffdead',
  navy: '000080',
  oldlace: 'fdf5e6',
  olive: '808000',
  olivedrab: '6b8e23',
  orange: 'ffa500',
  orangered: 'ff4500',
  orchid: 'da70d6',
  palegoldenrod: 'eee8aa',
  palegreen: '98fb98',
  paleturquoise: 'afeeee',
  palevioletred: 'db7093',
  papayawhip: 'ffefd5',
  peachpuff: 'ffdab9',
  peru: 'cd853f',
  pink: 'ffc0cb',
  plum: 'dda0dd',
  powderblue: 'b0e0e6',
  purple: '800080',
  rebeccapurple: '639',
  red: 'f00',
  rosybrown: 'bc8f8f',
  royalblue: '4169e1',
  saddlebrown: '8b4513',
  salmon: 'fa8072',
  sandybrown: 'f4a460',
  seagreen: '2e8b57',
  seashell: 'fff5ee',
  sienna: 'a0522d',
  silver: 'c0c0c0',
  skyblue: '87ceeb',
  slateblue: '6a5acd',
  slategray: '708090',
  slategrey: '708090',
  snow: 'fffafa',
  springgreen: '00ff7f',
  steelblue: '4682b4',
  tan: 'd2b48c',
  teal: '008080',
  thistle: 'd8bfd8',
  tomato: 'ff6347',
  turquoise: '40e0d0',
  violet: 'ee82ee',
  wheat: 'f5deb3',
  white: 'fff',
  whitesmoke: 'f5f5f5',
  yellow: 'ff0',
  yellowgreen: '9acd32'
};
/**
 * Checks if a string is a CSS named color and returns its equivalent hex value, otherwise returns the original color.
 * @private
 */

function nameToHex(color) {
  if (typeof color !== 'string') return color;
  var normalizedColorName = color.toLowerCase();
  return namedColorMap[normalizedColorName] ? "#" + namedColorMap[normalizedColorName] : color;
}

var hexRegex = /^#[a-fA-F0-9]{6}$/;
var hexRgbaRegex = /^#[a-fA-F0-9]{8}$/;
var reducedHexRegex = /^#[a-fA-F0-9]{3}$/;
var reducedRgbaHexRegex = /^#[a-fA-F0-9]{4}$/;
var rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
var rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i;
var hslRegex = /^hsl\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i;
var hslaRegex = /^hsla\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i;
/**
 * Returns an RgbColor or RgbaColor object. This utility function is only useful
 * if want to extract a color component. With the color util `toColorString` you
 * can convert a RgbColor or RgbaColor object back to a string.
 *
 * @example
 * // Assigns `{ red: 255, green: 0, blue: 0 }` to color1
 * const color1 = parseToRgb('rgb(255, 0, 0)');
 * // Assigns `{ red: 92, green: 102, blue: 112, alpha: 0.75 }` to color2
 * const color2 = parseToRgb('hsla(210, 10%, 40%, 0.75)');
 */

function parseToRgb(color) {
  if (typeof color !== 'string') {
    throw new PolishedError(3);
  }

  var normalizedColor = nameToHex(color);

  if (normalizedColor.match(hexRegex)) {
    return {
      red: parseInt("" + normalizedColor[1] + normalizedColor[2], 16),
      green: parseInt("" + normalizedColor[3] + normalizedColor[4], 16),
      blue: parseInt("" + normalizedColor[5] + normalizedColor[6], 16)
    };
  }

  if (normalizedColor.match(hexRgbaRegex)) {
    var alpha = parseFloat((parseInt("" + normalizedColor[7] + normalizedColor[8], 16) / 255).toFixed(2));
    return {
      red: parseInt("" + normalizedColor[1] + normalizedColor[2], 16),
      green: parseInt("" + normalizedColor[3] + normalizedColor[4], 16),
      blue: parseInt("" + normalizedColor[5] + normalizedColor[6], 16),
      alpha: alpha
    };
  }

  if (normalizedColor.match(reducedHexRegex)) {
    return {
      red: parseInt("" + normalizedColor[1] + normalizedColor[1], 16),
      green: parseInt("" + normalizedColor[2] + normalizedColor[2], 16),
      blue: parseInt("" + normalizedColor[3] + normalizedColor[3], 16)
    };
  }

  if (normalizedColor.match(reducedRgbaHexRegex)) {
    var _alpha = parseFloat((parseInt("" + normalizedColor[4] + normalizedColor[4], 16) / 255).toFixed(2));

    return {
      red: parseInt("" + normalizedColor[1] + normalizedColor[1], 16),
      green: parseInt("" + normalizedColor[2] + normalizedColor[2], 16),
      blue: parseInt("" + normalizedColor[3] + normalizedColor[3], 16),
      alpha: _alpha
    };
  }

  var rgbMatched = rgbRegex.exec(normalizedColor);

  if (rgbMatched) {
    return {
      red: parseInt("" + rgbMatched[1], 10),
      green: parseInt("" + rgbMatched[2], 10),
      blue: parseInt("" + rgbMatched[3], 10)
    };
  }

  var rgbaMatched = rgbaRegex.exec(normalizedColor);

  if (rgbaMatched) {
    return {
      red: parseInt("" + rgbaMatched[1], 10),
      green: parseInt("" + rgbaMatched[2], 10),
      blue: parseInt("" + rgbaMatched[3], 10),
      alpha: parseFloat("" + rgbaMatched[4])
    };
  }

  var hslMatched = hslRegex.exec(normalizedColor);

  if (hslMatched) {
    var hue = parseInt("" + hslMatched[1], 10);
    var saturation = parseInt("" + hslMatched[2], 10) / 100;
    var lightness = parseInt("" + hslMatched[3], 10) / 100;
    var rgbColorString = "rgb(" + hslToRgb(hue, saturation, lightness) + ")";
    var hslRgbMatched = rgbRegex.exec(rgbColorString);

    if (!hslRgbMatched) {
      throw new PolishedError(4, normalizedColor, rgbColorString);
    }

    return {
      red: parseInt("" + hslRgbMatched[1], 10),
      green: parseInt("" + hslRgbMatched[2], 10),
      blue: parseInt("" + hslRgbMatched[3], 10)
    };
  }

  var hslaMatched = hslaRegex.exec(normalizedColor);

  if (hslaMatched) {
    var _hue = parseInt("" + hslaMatched[1], 10);

    var _saturation = parseInt("" + hslaMatched[2], 10) / 100;

    var _lightness = parseInt("" + hslaMatched[3], 10) / 100;

    var _rgbColorString = "rgb(" + hslToRgb(_hue, _saturation, _lightness) + ")";

    var _hslRgbMatched = rgbRegex.exec(_rgbColorString);

    if (!_hslRgbMatched) {
      throw new PolishedError(4, normalizedColor, _rgbColorString);
    }

    return {
      red: parseInt("" + _hslRgbMatched[1], 10),
      green: parseInt("" + _hslRgbMatched[2], 10),
      blue: parseInt("" + _hslRgbMatched[3], 10),
      alpha: parseFloat("" + hslaMatched[4])
    };
  }

  throw new PolishedError(5);
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function colorToPattern({ pages, ...rest }) {
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updatePage({ elements, backgroundColor, ...rest }) {
  return {
    elements: elements.map(updateElement$5),
    backgroundColor: parse(backgroundColor),
    ...rest,
  };
}

function updateElement$5(props) {
  const newProps = { ...props };

  if (Object.prototype.hasOwnProperty.call(props, 'color')) {
    newProps.color = parse(newProps.color);
  }

  if (Object.prototype.hasOwnProperty.call(props, 'backgroundColor')) {
    newProps.backgroundColor = parse(newProps.backgroundColor);
  }

  return newProps;
}

function parse(colorString) {
  if (!colorString || colorString === 'transparent') {
    return null;
  }

  const { red: r, green: g, blue: b, alpha: a = 1 } = parseToRgb(colorString);
  if (a === 1) {
    return { color: { r, g, b } };
  }
  return { color: { r, g, b, a } };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function setFlip({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$5),
    ...rest,
  };
}

function reducePage$5({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$6),
    ...rest,
  };
}

function updateElement$6({ flip, ...rest }) {
  return {
    flip: flip
      ? flip
      : {
          horizontal: false,
          vertical: false,
        },
    ...rest,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function paddingToObject({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$6),
    ...rest,
  };
}

function reducePage$6({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$7),
    ...rest,
  };
}

function updateElement$7({ padding, type, ...rest }) {
  if ('text' !== type) {
    return {
      type,
      ...rest,
    };
  }
  // If padding is already set, just return as is.
  if (
    padding &&
    Object.prototype.hasOwnProperty.call(padding, 'vertical') &&
    Object.prototype.hasOwnProperty.call(padding, 'horizontal')
  ) {
    return {
      type,
      padding,
      ...rest,
    };
  }
  const newPadding = padding || 0;
  return {
    padding: {
      horizontal: newPadding,
      vertical: newPadding,
    },
    type,
    ...rest,
  };
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PAGE_WIDTH = 1080;
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;

function defaultBackground({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$7),
    ...rest,
  };
}

function reducePage$7({
  elements,
  backgroundElementId,
  backgroundColor,
  ...rest
}) {
  if (!backgroundElementId) {
    const element = {
      type: 'shape',
      x: (PAGE_WIDTH / 4) * Math.random(),
      y: (PAGE_WIDTH / 4) * Math.random(),
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_WIDTH,
      rotationAngle: 0,
      mask: {
        type: 'rectangle',
      },
      flip: {
        vertical: false,
        horizontal: false,
      },
      isBackground: true,
      backgroundColor: backgroundColor || {
        color: { r: 255, g: 255, b: 255, a: 1 },
      },
      id: v4(),
    };
    elements.unshift(element);
    backgroundElementId = element.id;
  }
  return {
    backgroundElementId,
    elements,
    ...rest,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const NEW_PAGE_WIDTH$1 = 440;
const NEW_PAGE_HEIGHT$1 = 660;
const OLD_PAGE_WIDTH$1 = 1080;
const OLD_PAGE_HEIGHT$1 = 1920;

// Aspect ratio is changed, but we don't want to break ratios of existing
// elements at this point. Thus the formula here is "contain".
const SCALE = Math.min(
  NEW_PAGE_WIDTH$1 / OLD_PAGE_WIDTH$1,
  NEW_PAGE_HEIGHT$1 / OLD_PAGE_HEIGHT$1
);

function dataPixelTo440({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$8),
    ...rest,
  };
}

function reducePage$8({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$8),
    ...rest,
  };
}

function updateElement$8({ x, y, width, height, fontSize, padding, ...rest }) {
  const element = {
    x: dataPixels$1(x * SCALE),
    y: dataPixels$1(y * SCALE),
    width: dataPixels$1(width * SCALE),
    height: dataPixels$1(height * SCALE),
    ...rest,
  };
  if (typeof fontSize === 'number') {
    element.fontSize = dataPixels$1(fontSize * SCALE);
  }
  if (padding) {
    const { horizontal, vertical } = padding;
    element.padding = {
      horizontal: dataPixels$1(horizontal * SCALE),
      vertical: dataPixels$1(vertical * SCALE),
    };
  }
  return element;
}

/**
 * See `units/dimensions.js`.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "data" space precision.
 */
function dataPixels$1(v) {
  return Number(v.toFixed(0));
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function pageAdvancement({ autoAdvance, defaultPageDuration, ...rest }) {
  return {
    autoAdvance: typeof autoAdvance !== 'undefined' ? autoAdvance : true,
    defaultPageDuration:
      typeof defaultPageDuration === 'number' ? defaultPageDuration : 7,
    ...rest,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function setBackgroundTextMode({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$9),
    ...rest,
  };
}

function reducePage$9({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$9),
    ...rest,
  };
}

function updateElement$9(props) {
  const { type } = props;

  if (type === 'text') {
    const { backgroundColor } = props;
    const hasBackgroundColor =
      backgroundColor && backgroundColor !== 'transparent';

    return {
      backgroundTextMode: hasBackgroundColor ? 'FILL' : 'NONE',
      ...props,
    };
  }

  return props;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function videoIdToId({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$a),
    ...rest,
  };
}

function reducePage$a({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$a),
    ...rest,
  };
}

function updateElement$a(element) {
  if (element.resource && 'videoId' in element.resource) {
    element.resource.id = element.resource.videoId;
    delete element.resource.videoId;
  }
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function oneTapLinkDeprecate({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$b),
    ...rest,
  };
}

function reducePage$b({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$b),
    ...rest,
  };
}

function updateElement$b(element) {
  if (element.link?.type) {
    delete element.link.type;
  }
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function fontObjects({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$c),
    ...rest,
  };
}

function reducePage$c({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$c),
    ...rest,
  };
}

const SYSTEM_FONTS = [
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Baskerville',
  'Brush Script MT',
  'Copperplate',
  'Courier New',
  'Century Gothic',
  'Garamond',
  'Georgia',
  'Gill Sans',
  'Lucida Bright',
  'Lucida Sans Typewriter',
  'Palatino',
  'Papyrus',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

function updateElement$c({ type, fontFamily, fontFallback, ...rest }) {
  if ('text' !== type) {
    return {
      type,
      ...rest,
    };
  }

  const isSystemFont = SYSTEM_FONTS.includes(fontFamily);

  return {
    font: {
      service: isSystemFont ? 'system' : 'fonts.google.com',
      family: fontFamily,
      fallbacks: fontFallback,
    },
    type,
    ...rest,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function isFullbleedDeprecate({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$d),
    ...rest,
  };
}

function reducePage$d({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$d),
    ...rest,
  };
}

function updateElement$d(element) {
  if (typeof element.isFullbleedBackground !== 'undefined') {
    delete element.isFullbleedBackground;
  }
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function inlineTextProperties({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$e),
    ...rest,
  };
}

function reducePage$e({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$e),
    ...rest,
  };
}

function updateElement$e(element) {
  if (element.type === 'text') {
    return updateTextContent(element);
  }

  return element;
}

function updateTextContent({
  bold,
  fontWeight,
  fontStyle,
  textDecoration,
  letterSpacing,
  color,
  content,
  ...rest
}) {
  // We use an array to chain all the converters more nicely
  const convertedContent = [content]
    .map((c) => convertInlineBold(c, bold, fontWeight))
    .map((c) => convertInlineItalic(c, fontStyle))
    .map((c) => convertInlineUnderline(c, textDecoration))
    .map((c) => addInlineColor(c, color))
    .map((c) => addInlineLetterSpacing(c, letterSpacing))
    .pop();

  return { ...rest, content: convertedContent };
}

function convertInlineBold(content, isBold, fontWeight) {
  // Do we have a specific global weight to apply for entire text field?
  const globalWeight =
    typeof fontWeight === 'number' && fontWeight !== 400
      ? fontWeight
      : isBold === true
      ? 700
      : null;

  if (globalWeight) {
    // In that case, strip any inline bold from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'strong');
    const fancyBold = `font-weight: ${globalWeight}`;
    return wrapWithSpan(stripped, fancyBold);
  }

  const justBold = 'font-weight: 700';
  return replaceTagWithSpan(content, 'strong', justBold);
}

function convertInlineItalic(content, fontStyle) {
  // Do we have a specific font style to apply for entire text field?
  const globalFontStyle = fontStyle === 'italic' ? fontStyle : null;
  const italicStyle = 'font-style: italic';

  if (globalFontStyle) {
    // In that case, strip any inline em from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'em');
    return wrapWithSpan(stripped, italicStyle);
  }

  return replaceTagWithSpan(content, 'em', italicStyle);
}

function convertInlineUnderline(content, textDecoration) {
  // Do we have a specific text decoration to apply for entire text field?
  const globalDecoration =
    textDecoration === 'underline' ? textDecoration : null;
  const underlineStyle = 'text-decoration: underline';

  if (globalDecoration) {
    // In that case, strip any inline underline from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'u');
    return wrapWithSpan(stripped, underlineStyle);
  }

  return replaceTagWithSpan(content, 'u', underlineStyle);
}

function addInlineColor(content, color) {
  // If we don't have a color (should never happen, but if), just return
  if (!color) {
    return content;
  }

  const {
    color: { r, g, b, a = 1 },
  } = color;
  return wrapWithSpan(content, `color: rgba(${r}, ${g}, ${b}, ${a})`);
}

function addInlineLetterSpacing(content, letterSpacing) {
  // If we don't have letterSpacing, just return
  if (!letterSpacing) {
    return content;
  }

  return wrapWithSpan(content, `letter-spacing: ${letterSpacing / 100}em`);
}
/* eslint-disable security/detect-non-literal-regexp */

function stripTag(html, tag) {
  // This is a very naive strip. Can only remove non-self-closing tags with attributes, which is sufficient here
  return html.replace(new RegExp(`</?${tag}>`, 'gi'), '');
}

function replaceTagWithSpan(html, tag, style) {
  // Again, very naive
  return html
    .replace(new RegExp(`<${tag}>`, 'gi'), `<span style="${style}">`)
    .replace(new RegExp(`</${tag}>`, 'gi'), '</span>');
}
/* eslint-enable security/detect-non-literal-regexp */

function wrapWithSpan(html, style) {
  return `<span style="${style}">${html}</span>`;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function createDefaultBackgroundElement({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$f),
    ...rest,
  };
}

function reducePage$f({ elements, backgroundElementId, ...rest }) {
  const backgroundElement = elements[0];
  let extra = {};
  if (backgroundElement.type === 'shape') {
    backgroundElement.isDefaultBackground = true;
  } else {
    extra = {
      defaultBackgroundElement: {
        type: 'shape',
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        rotationAngle: 0,
        mask: {
          type: 'rectangle',
        },
        backgroundColor: {
          color: { r: 255, g: 255, b: 255, a: 1 },
        },
        isBackground: true,
        isDefaultBackground: true,
        id: v4(),
      },
    };
  }
  // Note that we're not including `backgroundElementId` here
  return {
    elements,
    ...rest,
    ...extra,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function conicToLinear({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$g),
    ...rest,
  };
}

function reducePage$g({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$f),
    ...rest,
  };
}

function updateElement$f(element) {
  const { backgroundColor } = element;
  if (backgroundColor?.type !== 'conic') {
    return element;
  }
  return {
    ...element,
    backgroundColor: {
      ...backgroundColor,
      type: 'linear',
    },
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PAGE_WIDTH$1 = 440;
const PAGE_HEIGHT = 660;
const FULLBLEED_RATIO = 9 / 16;
const FULLBLEED_HEIGHT = PAGE_WIDTH$1 / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

function isFillDeprecate({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$h),
    ...rest,
  };
}

function reducePage$h({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$g),
    ...rest,
  };
}

function updateElement$g({ isFill, ...rest }) {
  if (isFill) {
    return {
      ...rest,
      x: 0,
      y: -DANGER_ZONE_HEIGHT,
      width: PAGE_WIDTH$1,
      height: PAGE_WIDTH$1 / FULLBLEED_RATIO,
      rotationAngle: 0,
    };
  }
  return rest;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function backgroundColorToPage({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$i),
    ...rest,
  };
}

function reducePage$i(page) {
  const { elements, defaultBackgroundElement } = page;
  const defaultBackground = {
    type: 'solid',
    color: { r: 255, g: 255, b: 255 },
  };
  const backgroundColor = elements[0]?.isDefaultBackground
    ? elements[0].backgroundColor
    : defaultBackgroundElement?.backgroundColor;
  return {
    ...page,
    backgroundColor: backgroundColor ? backgroundColor : defaultBackground,
  };
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const NEW_PAGE_WIDTH$2 = 412;
const NEW_PAGE_HEIGHT$2 = 618;
const OLD_PAGE_WIDTH$2 = 440;
const OLD_PAGE_HEIGHT$2 = 660;

// Aspect ratio is changed, but we don't want to break ratios of existing
// elements at this point. Thus the formula here is "contain".
const SCALE$1 = Math.min(
  NEW_PAGE_WIDTH$2 / OLD_PAGE_WIDTH$2,
  NEW_PAGE_HEIGHT$2 / OLD_PAGE_HEIGHT$2
);

function dataPixelTo440$1({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$j),
    ...rest,
  };
}

function reducePage$j({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$h),
    ...rest,
  };
}

function updateElement$h({ x, y, width, height, fontSize, padding, ...rest }) {
  const element = {
    x: dataPixels$2(x * SCALE$1),
    y: dataPixels$2(y * SCALE$1),
    width: dataPixels$2(width * SCALE$1),
    height: dataPixels$2(height * SCALE$1),
    ...rest,
  };
  if (typeof fontSize === 'number') {
    element.fontSize = dataPixels$2(fontSize * SCALE$1);
  }
  if (padding) {
    const { horizontal, vertical } = padding;
    element.padding = {
      horizontal: dataPixels$2(horizontal * SCALE$1),
      vertical: dataPixels$2(vertical * SCALE$1),
    };
  }
  return element;
}

/**
 * See `units/dimensions.js`.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "data" space precision.
 */
function dataPixels$2(v) {
  return Number(v.toFixed(0));
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function convertOverlayPattern({ pages, ...rest }) {
  return {
    pages: pages.map(convertPage),
    ...rest,
  };
}

function convertPage({ elements, backgroundOverlay, ...rest }) {
  const hasNonTrivialOverlay =
    backgroundOverlay &&
    ['solid', 'linear', 'radial'].includes(backgroundOverlay);
  const backgroundElement = elements[0];
  const isValidBackgroundElement = ['image', 'video'].includes(
    backgroundElement?.type
  );
  if (!hasNonTrivialOverlay || !isValidBackgroundElement) {
    return {
      elements,
      ...rest,
    };
  }

  return {
    elements: [
      {
        ...backgroundElement,
        backgroundOverlay: getBackgroundOverlay(backgroundOverlay),
      },
      ...elements.slice(1),
    ],
    ...rest,
  };
}

function getBackgroundOverlay(overlayType) {
  switch (overlayType) {
    case 'solid':
      return {
        color: { r: 0, g: 0, b: 0, a: 0.3 },
      };

    case 'linear':
      return {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.9,
      };

    case 'radial':
      return {
        type: 'radial',
        size: { w: 0.8, h: 0.5 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.25 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.6,
      };

    default:
      return null;
  }
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function blobsToSingleBlob({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$k),
    ...rest,
  };
}

function reducePage$k({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement$i),
    ...rest,
  };
}

function updateElement$i(element) {
  if (element?.mask?.type && element?.mask?.type.startsWith('blob-')) {
    element.mask.type = 'blob';
  }
  return element;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function singleAnimationTarget({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage$l),
    ...rest,
  };
}

function reducePage$l({ animations, ...rest }) {
  return {
    animations: (animations || []).reduce(updateAnimation, []),
    ...rest,
  };
}

function updateAnimation(animations, animation) {
  const { targets, id, ...rest } = animation;
  targets.map((target, i) => {
    animations.push({
      id: i === 0 ? id : v4(),
      targets: [target],
      ...rest,
    });
  });
  return animations;
}

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const MIGRATIONS = {
  1: [storyDataArrayToObject],
  2: [dataPixelTo1080],
  3: [fullbleedToFill],
  4: [dataSquareToShape, dataMediaElementToResource],
  5: [setOpacity],
  6: [colorToPattern],
  7: [setFlip],
  8: [paddingToObject],
  9: [defaultBackground],
  10: [dataPixelTo440],
  11: [pageAdvancement],
  12: [setBackgroundTextMode],
  13: [videoIdToId],
  14: [oneTapLinkDeprecate],
  15: [fontObjects],
  16: [isFullbleedDeprecate],
  17: [inlineTextProperties],
  18: [createDefaultBackgroundElement],
  19: [conicToLinear],
  20: [isFillDeprecate],
  21: [backgroundColorToPage],
  22: [dataPixelTo440$1],
  23: [convertOverlayPattern],
  24: [blobsToSingleBlob],
  25: [singleAnimationTarget],
};

const DATA_VERSION = Math.max.apply(
  null,
  Object.keys(MIGRATIONS).map(Number)
);

function migrate(storyData, version) {
  let result = storyData;
  for (let v = version; v < DATA_VERSION; v++) {
    const migrations = MIGRATIONS[v + 1];
    if (!migrations) {
      continue;
    }
    for (const i in migrations) {
      if (Object.prototype.hasOwnProperty.call(migrations, i)) {
        result = migrations[Number(i)](result);
      }
    }
  }
  return result;
}

export { DATA_VERSION, migrate };
