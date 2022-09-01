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

const title = _x('Yellow Star', 'sticker name', 'web-stories');

const YellowStar = ({ style }: StickerProps) => (
  <svg
    style={style}
    viewBox="0 0 51 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.5583 11.9566L25.9443 2.97414L24.3304 11.9566L20.6884 3.58847L21.1894 12.701L15.7158 5.39834L18.3048 14.1497L11.2947 8.30618L15.8321 16.2246L7.66328 12.1552L13.9045 18.8138L5.01742 16.738L12.626 21.7777L3.49974 21.8074L12.0654 24.9566L3.19206 27.0902L12.2531 28.1791L4.11095 32.3015L13.1789 31.2714L6.20689 37.1604L14.7929 34.0669L9.36688 41.405L17.008 36.4149L13.4206 44.8065L19.705 38.1886L18.1494 47.1814L22.7382 39.2927L23.2985 48.4017L25.9443 39.6674L28.5902 48.4017L29.1505 39.2927L33.7393 47.1814L32.1837 38.1886L38.4681 44.8065L34.8806 36.4149L42.5218 41.405L37.0958 34.0669L45.6818 37.1604L38.7098 31.2714L47.7777 32.3015L39.6356 28.1791L48.6966 27.0902L39.8232 24.9566L48.3889 21.8074L39.2627 21.7777L46.8713 16.738L37.9842 18.8138L44.2254 12.1552L36.0566 16.2246L40.594 8.30618L33.5838 14.1497L36.1729 5.39834L30.6992 12.701L31.2003 3.58847L27.5583 11.9566ZM31.7293 1.35634L31.1778 11.3861L37.2024 3.34838L34.3528 12.9806L42.0685 6.54891L37.0744 15.2643L46.0654 10.7854L39.196 18.1141L48.9776 15.8294L40.6032 21.3764L50.6481 21.4091L41.2202 24.8753L50.9867 27.2235L41.0136 28.4221L49.9753 32.9594L39.9946 31.8257L47.6684 38.3074L38.2182 34.9025L44.1904 42.9792L35.7801 37.4868L39.7287 46.723L32.8117 39.4391L34.5239 49.337L29.4732 40.6543L28.8565 50.6802L25.9443 41.0667L23.0322 50.6802L22.4155 40.6543L17.3648 49.337L19.0769 39.4391L12.16 46.723L16.1086 37.4868L7.69832 42.9792L13.6705 34.9025L4.22026 38.3074L11.894 31.8257L1.91336 32.9594L10.8751 28.4221L0.901978 27.2235L10.6685 24.8753L1.24063 21.4091L11.2854 21.3764L2.91107 15.8294L12.6927 18.1141L5.82324 10.7854L14.8143 15.2643L9.82014 6.54891L17.5359 12.9806L14.6863 3.34838L20.7108 11.3861L20.1594 1.35634L24.1679 10.5667L25.9443 0.680176L27.7208 10.5667L31.7293 1.35634Z"
      fill="#FFE55C"
    />
  </svg>
);
export default {
  aspectRatio: 51 / 51,
  svg: YellowStar,
  title,
} as Sticker;
