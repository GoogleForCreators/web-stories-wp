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

const title = _x('Light Yellow Arrow', 'sticker name', 'web-stories');

function YellowArrow({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 52 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M1.82318 15.0943C17.6232 14.1943 33.4232 12.9943 49.1232 11.4943C50.6232 11.3943 50.6232 8.99435 49.1232 9.09435C33.4232 10.5943 17.6232 11.7943 1.82318 12.6943C0.323181 12.7943 0.323181 15.1943 1.82318 15.0943Z"
        fill="#FCEFAB"
      />
      <path
        d="M50.7232 9.0956C46.9232 5.6956 42.7232 2.7956 38.2232 0.395599C36.8232 -0.304401 35.6232 1.6956 37.0232 2.4956C41.4232 4.7956 45.4232 7.5956 49.0232 10.8956C50.1232 11.7956 51.8232 10.0956 50.7232 9.0956Z"
        fill="#FCEFAB"
      />
      <path
        d="M49.0232 9.39452C46.6232 13.0945 43.8232 16.4945 40.6232 19.6945C39.5232 20.7945 41.2232 22.4945 42.3232 21.3945C45.6232 18.0945 48.5232 14.4945 51.1232 10.6945C51.9232 9.29452 49.8232 8.09452 49.0232 9.39452Z"
        fill="#FCEFAB"
      />
    </svg>
  );
}

YellowArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 22,
  svg: YellowArrow,
  title,
};
