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

const title = _x('Flour Bag', 'sticker name', 'web-stories');

function FlourBag({ style }: StickerProps) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37 39"
      fill="none"
    >
      <title>{title}</title>
      <path
        d="M34.4269 3.61157C33.8305 2.73352 33.5322 1.85547 31.4445 1.85547M31.4445 1.85547H9.37429C7.39769 1.85547 5.79537 3.42793 5.79537 5.36766V6.5384M31.4445 1.85547C29.0585 1.85547 29.0585 4.97742 29.3568 6.5384M5.79537 6.5384L1.382 15.4712C1.14603 15.9488 1.02344 16.4727 1.02344 17.0035V33.1725C1.02344 35.7588 3.1599 37.8555 5.79537 37.8555H24.5848M5.79537 6.5384H29.3568M29.3568 6.5384L34.5899 15.9985C34.8744 16.5129 35.0234 17.0889 35.0234 17.6741V33.1725C35.0234 35.7588 32.887 37.8555 30.2515 37.8555H24.5848M29.3568 6.5384L24.9088 16.0868C24.6953 16.5451 24.5848 17.0431 24.5848 17.547V37.8555M13.5498 32.5872V17.075M13.5498 17.075C11.7603 16.4896 10.448 12.6262 13.5498 10.0506C17.1287 12.9774 14.7427 16.7823 13.5498 17.075ZM13.8506 18.9077C13.8415 17.0829 16.4899 14.4667 20.0842 15.7341C19.3559 19.8698 15.461 20.1033 14.166 19.4426C13.9647 19.3399 13.8517 19.1303 13.8506 18.9077ZM12.9739 18.9077C12.9831 17.0829 10.3347 14.4667 6.74032 15.7341C7.46869 19.8698 11.3636 20.1033 12.6586 19.4426C12.8599 19.3399 12.9728 19.1303 12.9739 18.9077ZM13.8506 23.5906C13.8415 21.7658 16.4899 19.1497 20.0842 20.417C19.3559 24.5528 15.461 24.7862 14.166 24.1255C13.9647 24.0228 13.8517 23.8133 13.8506 23.5906ZM12.9739 23.5906C12.9831 21.7658 10.3347 19.1497 6.74032 20.417C7.46869 24.5528 11.3636 24.7862 12.6586 24.1255C12.8599 24.0228 12.9728 23.8133 12.9739 23.5906ZM13.8506 28.2735C13.8415 26.4488 16.4899 23.8326 20.0842 25.1C19.3559 29.2357 15.461 29.4691 14.166 28.8084C13.9647 28.7057 13.8517 28.4962 13.8506 28.2735ZM12.9739 28.2735C12.9831 26.4488 10.3347 23.8326 6.74032 25.1C7.46869 29.2357 11.3636 29.4691 12.6586 28.8084C12.8599 28.7057 12.9728 28.4962 12.9739 28.2735Z"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

export default {
  aspectRatio: 37 / 39,
  svg: FlourBag,
  title,
} as Sticker;
