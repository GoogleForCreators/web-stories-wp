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

const title = _x('Alarm Clock', 'sticker name', 'web-stories');

function AlarmClock({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 36 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 39C24.6274 39 30 33.6274 30 27C30 20.3726 24.6274 15 18 15C11.3726 15 6 20.3726 6 27C6 33.6274 11.3726 39 18 39ZM18 41C25.732 41 32 34.732 32 27C32 19.268 25.732 13 18 13C10.268 13 4 19.268 4 27C4 34.732 10.268 41 18 41Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 43C26.8366 43 34 35.8366 34 27C34 18.1634 26.8366 11 18 11C9.16344 11 2 18.1634 2 27C2 35.8366 9.16344 43 18 43ZM18 45C27.9411 45 36 36.9411 36 27C36 17.0589 27.9411 9 18 9C8.05887 9 0 17.0589 0 27C0 36.9411 8.05887 45 18 45Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 12C6.32843 12 7 11.3284 7 10.5C7 9.67157 6.32843 9 5.5 9C4.67157 9 4 9.67157 4 10.5C4 11.3284 4.67157 12 5.5 12ZM5.5 14C7.433 14 9 12.433 9 10.5C9 8.567 7.433 7 5.5 7C3.567 7 2 8.567 2 10.5C2 12.433 3.567 14 5.5 14Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.5 12C31.3284 12 32 11.3284 32 10.5C32 9.67157 31.3284 9 30.5 9C29.6716 9 29 9.67157 29 10.5C29 11.3284 29.6716 12 30.5 12ZM30.5 14C32.433 14 34 12.433 34 10.5C34 8.567 32.433 7 30.5 7C28.567 7 27 8.567 27 10.5C27 12.433 28.567 14 30.5 14Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8ZM18 10C20.7614 10 23 7.76142 23 5C23 2.23858 20.7614 0 18 0C15.2386 0 13 2.23858 13 5C13 7.76142 15.2386 10 18 10Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 44C6.77614 44 7 43.7761 7 43.5C7 43.2239 6.77614 43 6.5 43C6.22386 43 6 43.2239 6 43.5C6 43.7761 6.22386 44 6.5 44ZM6.5 46C7.88071 46 9 44.8807 9 43.5C9 42.1193 7.88071 41 6.5 41C5.11929 41 4 42.1193 4 43.5C4 44.8807 5.11929 46 6.5 46Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.5 44C29.7761 44 30 43.7761 30 43.5C30 43.2239 29.7761 43 29.5 43C29.2239 43 29 43.2239 29 43.5C29 43.7761 29.2239 44 29.5 44ZM29.5 46C30.8807 46 32 44.8807 32 43.5C32 42.1193 30.8807 41 29.5 41C28.1193 41 27 42.1193 27 43.5C27 44.8807 28.1193 46 29.5 46Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 29C18.5523 29 19 28.5523 19 28C19 27.4477 18.5523 27 18 27C17.4477 27 17 27.4477 17 28C17 28.5523 17.4477 29 18 29ZM18 31C19.6569 31 21 29.6569 21 28C21 26.3431 19.6569 25 18 25C16.3431 25 15 26.3431 15 28C15 29.6569 16.3431 31 18 31Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6999 21.7858L16.9928 25.9929L15.593 27.4213L11.3001 23.2142L12.6999 21.7858Z"
        fill="#FFC864"
      />
    </svg>
  );
}

AlarmClock.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 36 / 46,
  svg: AlarmClock,
  title,
};
