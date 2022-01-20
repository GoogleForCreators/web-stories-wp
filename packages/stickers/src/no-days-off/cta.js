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

const title = _x('Circled Dot', 'sticker name', 'web-stories');

const FitnessCTA = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M20 29.5652c5.2827 0 9.5652-4.2825 9.5652-9.5652 0-5.2828-4.2825-9.5653-9.5652-9.5653-5.2828 0-9.5653 4.2825-9.5653 9.5653 0 5.2827 4.2825 9.5652 9.5653 9.5652z"
      fill="#fff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40 20c0 11.0457-8.9543 20-20 20S0 31.0457 0 20 8.9543 0 20 0s20 8.9543 20 20zm-1.2903 0c0 10.3331-8.3766 18.7097-18.7097 18.7097C9.66693 38.7097 1.29032 30.3331 1.29032 20 1.29032 9.66693 9.66693 1.29032 20 1.29032c10.3331 0 18.7097 8.37661 18.7097 18.70968z"
      fill="#fff"
    />
  </svg>
);
FitnessCTA.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 40 / 40,
  svg: FitnessCTA,
  title,
};
