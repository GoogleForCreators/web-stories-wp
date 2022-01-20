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

const title = _x('Twitter', 'sticker name', 'web-stories');

function TwitterIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 27 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M26.368 2.46776C25.3977 2.88621 24.3546 3.16946 23.2608 3.29607C24.3767 2.64372 25.2345 1.6137 25.6403 0.384112C24.595 0.987104 23.4372 1.42486 22.2045 1.66091C21.2166 0.639472 19.8118 0 18.2549 0C15.269 0 12.8455 2.35617 12.8455 5.26384C12.8455 5.67585 12.894 6.07713 12.9866 6.46339C8.49015 6.24451 4.50309 4.14798 1.83475 0.963499C1.36945 1.74031 1.10262 2.64587 1.10262 3.60937C1.10262 5.43551 2.05748 7.04707 3.50853 7.99125C2.62202 7.96336 1.78844 7.72731 1.05851 7.33247C1.05851 7.35393 1.05851 7.37538 1.05851 7.39899C1.05851 9.95044 2.92414 12.077 5.39841 12.5598C4.94413 12.68 4.4656 12.7444 3.97383 12.7444C3.6254 12.7444 3.2858 12.7122 2.95501 12.65C3.64305 14.7422 5.64099 16.2636 8.00941 16.3065C6.15701 17.7185 3.82608 18.5597 1.29006 18.5597C0.853426 18.5597 0.423405 18.534 0 18.4867C2.39488 19.9803 5.23743 20.8515 8.29168 20.8515C18.2417 20.8515 23.6842 12.8302 23.6842 5.87327C23.6842 5.64581 23.6798 5.41834 23.6688 5.19303C24.7251 4.45055 25.6425 3.52353 26.368 2.46776Z"
        fill="#FAF4EA"
      />
    </svg>
  );
}

TwitterIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 27 / 21,
  svg: TwitterIcon,
  title,
};
