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

const title = _x('Facebook', 'sticker name', 'web-stories');

function FacebookIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 13 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M7.84372 24.144V13.1313H11.407L11.9415 8.83951H7.84372V6.0976C7.84372 4.85581 8.1772 4.0074 9.89487 4.0074H12.0854V0.168259C11.7062 0.116122 10.4065 0 8.89214 0C5.73318 0 3.57239 2.00015 3.57239 5.6734V8.83951H0V13.1313H3.57239V24.144H7.84372Z"
        fill="#FAF4EA"
      />
    </svg>
  );
}

FacebookIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 13 / 25,
  svg: FacebookIcon,
  title,
};
