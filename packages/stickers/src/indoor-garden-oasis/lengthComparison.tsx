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

const title = _x('Length Comparison', 'sticker name', 'web-stories');

function LengthComparison({ style }: StickerProps) {
  return (
    <svg
      style={style}
      viewBox="0 0 44 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2151 1.52625C15.4036 0.343436 17.4443 0.343462 18.6328 1.52633C24.5817 7.23945 29.1985 15.9536 31.02 24.5581C32.8377 33.1438 31.904 41.8091 26.473 47.2402C24.0083 49.7048 20.8008 51.1728 16.4239 51.1728C15.8336 51.1728 15.2646 51.1461 14.7158 51.0939C14.7945 51.5275 14.8787 51.9479 14.9684 52.3539C15.5999 55.2142 16.4768 57.2504 17.4775 58.2511C17.7313 58.505 17.7313 58.9165 17.4775 59.1704C17.2237 59.4242 16.8121 59.4242 16.5583 59.1704C15.2786 57.8906 14.3396 55.5355 13.699 52.6342C13.5769 52.0815 13.4649 51.5048 13.363 50.9066C10.4945 50.3793 8.22525 49.0907 6.3748 47.2402C0.943711 41.8091 0.0100819 33.1438 1.82771 24.5581C3.64931 15.9536 8.26615 7.23937 14.2151 1.52625ZM16.4239 49.8728C15.7502 49.8728 15.109 49.8357 14.4979 49.7635C14.1626 47.4841 13.9679 44.9048 13.9306 42.1577C13.8258 34.4536 14.9596 25.5161 17.6279 18.2919C17.7523 17.9552 17.5801 17.5814 17.2434 17.457C16.9066 17.3326 16.5328 17.5048 16.4084 17.8415C13.6712 25.2524 12.5244 34.3564 12.6307 42.1754C12.6664 44.8033 12.8438 47.2957 13.1528 49.5385C10.7506 49.0115 8.85753 47.8845 7.29404 46.321C2.31707 41.344 1.32111 33.2278 3.09953 24.8273C4.87351 16.4478 9.37648 7.97337 15.1199 2.45973L15.1293 2.45045C15.811 1.76873 17.0367 1.76873 17.7184 2.45045L17.7279 2.45973C23.4713 7.97337 27.9742 16.4478 29.7482 24.8273C31.5266 33.2278 30.5307 41.344 25.5537 46.321C23.3406 48.5341 20.467 49.8728 16.4239 49.8728ZM34.6682 1.06641C34.3092 1.06641 34.0182 1.35742 34.0182 1.71641C34.0182 2.07539 34.3092 2.36641 34.6682 2.36641H42.3682C42.7272 2.36641 43.0182 2.07539 43.0182 1.71641C43.0182 1.35742 42.7272 1.06641 42.3682 1.06641H34.6682ZM39.1684 3.06651L39.1675 4.06653L37.8675 4.06535L37.8684 3.06533L39.1684 3.06651ZM39.1657 6.06657L39.1639 8.0666L37.8639 8.06542L37.8657 6.06538L39.1657 6.06657ZM39.1621 10.0666L39.1603 12.0667L37.8603 12.0655L37.8621 10.0655L39.1621 10.0666ZM39.1584 14.0667L39.1566 16.0667L37.8566 16.0656L37.8584 14.0655L39.1584 14.0667ZM39.1548 18.0668L39.153 20.0668L37.853 20.0656L37.8548 18.0656L39.1548 18.0668ZM39.1512 22.0668L39.1494 24.0669L37.8494 24.0657L37.8512 22.0656L39.1512 22.0668ZM39.1475 26.0669L39.1457 28.0669L37.8457 28.0658L37.8475 26.0657L39.1475 26.0669ZM39.1439 30.067L39.1421 32.067L37.8421 32.0658L37.8439 30.0658L39.1439 30.067ZM39.1403 34.067L39.1385 36.0671L37.8385 36.0659L37.8403 34.0659L39.1403 34.067ZM39.1367 38.0671L39.1348 40.0672L37.8348 40.066L37.8367 38.0659L39.1367 38.0671ZM39.133 42.0672L39.1312 44.0672L37.8312 44.066L37.833 42.066L39.133 42.0672ZM39.1294 46.0673L39.1276 48.0673L37.8276 48.0661L37.8294 46.0661L39.1294 46.0673ZM39.1258 50.0673L39.1239 52.0674L37.8239 52.0662L37.8258 50.0661L39.1258 50.0673ZM38.0147 55.0664H34.6682C34.3092 55.0664 34.0182 55.3574 34.0182 55.7164C34.0182 56.0754 34.3092 56.3664 34.6682 56.3664H42.3682C42.7272 56.3664 43.0182 56.0754 43.0182 55.7164C43.0182 55.3574 42.7272 55.0664 42.3682 55.0664H39.1212L39.1221 54.0674L37.8221 54.0662L37.8212 55.0662L38.0147 55.0664Z"
        fill="#235524"
      />
    </svg>
  );
}

export default {
  aspectRatio: 44 / 60,
  svg: LengthComparison,
  title,
} as Sticker;
