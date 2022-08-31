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
import PropTypes from 'prop-types';

const title = _x('White Twitch', 'sticker name', 'web-stories');

function TwitchIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 28 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.36377 1.36363C0.36377 0.61052 0.974289 0 1.7274 0H26.2728C27.0259 0 27.6365 0.61052 27.6365 1.36363V17.7272C27.6365 18.0889 27.4928 18.4358 27.2371 18.6915L21.7825 24.146C21.5268 24.4018 21.1799 24.5454 20.8183 24.5454H14.565L9.50981 29.6006C9.11982 29.9906 8.53329 30.1072 8.02374 29.8962C7.51418 29.6851 7.18194 29.1879 7.18194 28.6363V24.5454H1.7274C0.974289 24.5454 0.36377 23.9349 0.36377 23.1818V1.36363ZM3.09104 2.72727V21.8182H8.54558C9.29869 21.8182 9.90921 22.4287 9.90921 23.1818V25.3442L13.0359 22.2176C13.2916 21.9618 13.6385 21.8182 14.0001 21.8182H20.2535L24.9092 17.1624V2.72727H3.09104ZM12.6365 6.81817C13.3896 6.81817 14.0001 7.42869 14.0001 8.18181V13.6363C14.0001 14.3895 13.3896 15 12.6365 15C11.8834 15 11.2728 14.3895 11.2728 13.6363V8.18181C11.2728 7.42869 11.8834 6.81817 12.6365 6.81817ZM19.4547 6.81817C20.2078 6.81817 20.8183 7.42869 20.8183 8.18181V13.6363C20.8183 14.3895 20.2078 15 19.4547 15C18.7015 15 18.091 14.3895 18.091 13.6363V8.18181C18.091 7.42869 18.7015 6.81817 19.4547 6.81817Z"
        fill="white"
      />
    </svg>
  );
}

TwitchIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 30,
  svg: TwitchIcon,
  title,
};
