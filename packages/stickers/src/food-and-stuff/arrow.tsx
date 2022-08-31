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

const title = _x('Arrow', 'sticker name', 'web-stories');

function Arrow({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 19 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M17.9472 5.38801C18.1615 5.17372 18.1615 4.82628 17.9472 4.61199L14.4552 1.11992C14.2409 0.905633 13.8934 0.905633 13.6791 1.11992C13.4649 1.33421 13.4649 1.68165 13.6791 1.89594L16.7832 5L13.6791 8.10406C13.4649 8.31835 13.4649 8.66579 13.6791 8.88008C13.8934 9.09437 14.2409 9.09437 14.4552 8.88008L17.9472 5.38801ZM0 5.54873H17.5592V4.45127H0V5.54873Z"
        fill="#3A566E"
      />
    </svg>
  );
}

Arrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 19 / 10,
  svg: Arrow,
  title,
};
