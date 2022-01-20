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

const title = _x('Yellow Browser', 'sticker name', 'web-stories');

function YellowBrowserIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 52 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path d="M0 0H52V37H0V0Z" fill="#FFBF0B" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.6286 0.37H0.371429V36.63H51.6286V0.37ZM0 0V37H52V0H0Z"
        fill="#398F5E"
      />
      <path
        d="M47.7812 2.99921L49.2274 1.55322L49.4339 1.75981L47.9879 3.2058L47.7812 2.99921Z"
        fill="#398F5E"
      />
      <path
        d="M47.9888 1.55298L49.4348 2.99912L49.2282 3.20569L47.7822 1.75955L47.9888 1.55298Z"
        fill="#398F5E"
      />
      <path
        d="M40.7705 2.23242L42.8156 2.23253V2.52468L40.7705 2.52457V2.23242Z"
        fill="#398F5E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.3132 2.26853L44.4075 2.26848V3.02816L45.3132 3.0282V2.26853ZM44.13 1.99097L44.1299 3.30564L45.5907 3.30572L45.5908 1.99104L44.13 1.99097Z"
        fill="#398F5E"
      />
      <path
        d="M45.0059 1.40674L46.4667 1.40682L46.4666 2.72149L45.0059 2.72141V1.40674Z"
        fill="#FFBF0B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.1892 1.6843L45.2834 1.68425V2.44393L46.1891 2.44398L46.1892 1.6843ZM45.0059 1.40674V2.72141L46.4666 2.72149L46.4667 1.40682L45.0059 1.40674Z"
        fill="#398F5E"
      />
      <path
        d="M3.09463 2.62129C3.09463 2.82298 2.93113 2.98648 2.72945 2.98648C2.52776 2.98648 2.36426 2.82298 2.36426 2.62129C2.36426 2.4196 2.52776 2.2561 2.72945 2.2561C2.93113 2.2561 3.09463 2.4196 3.09463 2.62129Z"
        fill="#398F5E"
      />
      <path
        d="M4.70205 2.62129C4.70205 2.82298 4.53855 2.98648 4.33686 2.98648C4.13518 2.98648 3.97168 2.82298 3.97168 2.62129C3.97168 2.4196 4.13518 2.2561 4.33686 2.2561C4.53855 2.2561 4.70205 2.4196 4.70205 2.62129Z"
        fill="#398F5E"
      />
      <path
        d="M6.3085 2.62129C6.3085 2.82298 6.145 2.98648 5.94331 2.98648C5.74163 2.98648 5.57812 2.82298 5.57812 2.62129C5.57812 2.4196 5.74163 2.2561 5.94331 2.2561C6.145 2.2561 6.3085 2.4196 6.3085 2.62129Z"
        fill="#398F5E"
      />
      <path d="M0 4.57617H51.8V4.94617H0V4.57617Z" fill="#398F5E" />
    </svg>
  );
}

YellowBrowserIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 37,
  svg: YellowBrowserIcon,
  title,
};
