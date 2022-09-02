/*
 * Copyright 2021 Google LLC
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
/**
 * External dependencies
 */
import { _x } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import type { StickerProps, Sticker } from '../types';

const title = _x('Curved Arrow', 'sticker name', 'web-stories');

function CurvedArrow({ style }: StickerProps) {
  return (
    <svg
      style={style}
      viewBox="0 0 81 295"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M69.8976 291.272C61.4277 289.856 53.5045 284.451 46.4298 277.049C39.5985 269.9 33.4099 261.063 27.9513 251.348C17.3979 232.562 9.47536 209.935 4.97825 185.578C0.554833 161.623 -0.476371 135.926 2.6153 111.248C5.53805 87.9031 12.0805 65.6718 21.2937 46.9804C30.4653 28.3742 42.3115 13.0597 55.9049 3.77678C57.5821 2.63071 59.2847 1.57159 61.0058 0.599249C62.2276 -0.0939282 62.7046 3.04702 61.4897 3.72958C47.8824 11.4044 35.7739 25.1694 26.1946 42.5354C16.5741 59.9652 9.50164 81.0721 5.78379 103.556C1.88031 127.168 1.96758 152.107 5.42717 175.705C8.96521 199.822 15.9229 222.566 25.5396 241.782C30.4095 251.515 35.9545 260.445 42.0958 268.084C48.6369 276.218 55.9682 283.055 64.0533 286.327C65.9931 287.119 67.9567 287.685 69.9508 288.014C71.2243 288.25 71.1847 291.487 69.8976 291.272Z"
        fill="#9F240F"
      />
      <path
        d="M69.2679 290.966C62.1282 290.814 54.9887 290.65 47.8492 290.487C48.0328 289.488 48.2163 288.489 48.4067 287.479C50.4917 289.612 53.0512 289.718 55.4472 290.014C58.1967 290.362 60.9542 290.634 63.7128 290.831C66.4645 291.049 69.2242 291.181 71.9852 291.237C74.432 291.286 77.0753 291.588 79.351 289.831C79.3358 290.759 79.3205 291.697 79.3053 292.625C69.9497 284.843 62.2226 272.353 57.3865 257.279C56.7947 255.441 58.5528 253.843 59.1445 255.692C63.8341 270.32 71.2887 282.296 80.3671 289.856C81.0135 290.4 80.9851 292.137 80.3214 292.649C77.8832 294.532 75.2283 294.532 72.5941 294.49C69.6124 294.438 66.632 294.301 63.6531 294.077C60.6742 293.853 57.7032 293.554 54.7334 293.18C52.1842 292.848 49.5548 292.514 47.3447 290.259C46.516 289.408 46.8926 287.237 47.9021 287.251C55.0416 287.414 62.1811 287.578 69.3208 287.73C70.6109 287.762 70.5647 290.998 69.2679 290.966Z"
        fill="#9F240F"
      />
    </svg>
  );
}

export default {
  aspectRatio: 81 / 295,
  svg: CurvedArrow,
  title,
} as Sticker;
