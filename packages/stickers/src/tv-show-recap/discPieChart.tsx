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

const title = _x('Disc Pie Chart', 'sticker name', 'web-stories');

function DiscPieChart({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M45.6547 25C45.6547 27.7124 45.1204 30.3983 44.0824 32.9042C43.0444 35.4101 41.523 37.6871 39.6051 39.6051C37.6871 41.523 35.4101 43.0444 32.9042 44.0824C30.3983 45.1204 27.7124 45.6547 25 45.6547C22.2876 45.6547 19.6017 45.1204 17.0958 44.0824C14.5899 43.0444 12.3129 41.523 10.3949 39.6051C8.47697 37.6871 6.95556 35.4101 5.91757 32.9042C4.87957 30.3983 4.34532 27.7124 4.34532 25C4.34532 22.2876 4.87957 19.6017 5.91757 17.0958C6.95556 14.5899 8.47697 12.3129 10.3949 10.3949C12.3129 8.47697 14.5899 6.95556 17.0958 5.91756C19.6017 4.87957 22.2876 4.34532 25 4.34532C27.7124 4.34532 30.3983 4.87957 32.9042 5.91757C35.4101 6.95556 37.6871 8.47697 39.6051 10.3949C41.523 12.3129 43.0444 14.5899 44.0824 17.0958C45.1204 19.6017 45.6547 22.2876 45.6547 25L45.6547 25Z"
        stroke="#71665C"
        strokeWidth="8.69064"
      />
      <path
        d="M20.5031 45.1592C15.485 44.0398 11.0647 41.0891 8.10655 36.8839C5.14836 32.6787 3.86489 27.5214 4.50707 22.4202C5.14924 17.319 7.67088 12.6407 11.579 9.2999C15.4872 5.95909 20.5008 4.19598 25.6398 4.35523"
        stroke="#FFF172"
        strokeWidth="8.69064"
      />
      <path
        d="M4.72045 28.9186C3.72376 23.7606 4.72999 18.4166 7.53435 13.9743C10.3387 9.53194 14.7304 6.32514 19.8157 5.00653"
        stroke="#72AAFF"
        strokeWidth="8.69064"
      />
      <path
        d="M18.1489 5.51465C22.0028 4.15964 26.1719 3.97786 30.129 4.99228C34.0862 6.00671 37.6537 8.17179 40.3803 11.2137C43.107 14.2557 44.8704 18.0378 45.4475 22.082C46.0246 26.1261 45.3896 30.2506 43.6226 33.9338"
        stroke="#A3978E"
        strokeWidth="8.69064"
      />
      <path
        d="M24.437 4.353C25.3022 4.32941 26.168 4.36022 27.0292 4.44525"
        stroke="#A3978E"
        strokeWidth="8.69064"
      />
    </svg>
  );
}

DiscPieChart.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: DiscPieChart,
  title,
};
