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

const title = _x('White Bag', 'sticker name', 'web-stories');

function WhiteBag({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 31 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3846 0C20.4826 0 24.6154 4.13276 24.6154 9.23077H30.7692V27.6923C30.7692 34.4897 25.2589 40 18.4615 40H12.3077C5.51034 40 0 34.4897 0 27.6923V9.23077H6.15385C6.15385 4.13276 10.2866 0 15.3846 0ZM9.23077 9.23077H21.5385C21.5385 5.83209 18.7833 3.07692 15.3846 3.07692C11.9859 3.07692 9.23077 5.83209 9.23077 9.23077ZM9.23077 18.4615C10.9301 18.4615 12.3077 17.084 12.3077 15.3846C12.3077 13.6853 10.9301 12.3077 9.23077 12.3077C7.53143 12.3077 6.15385 13.6853 6.15385 15.3846C6.15385 17.084 7.53143 18.4615 9.23077 18.4615ZM24.6154 15.3846C24.6154 17.084 23.2378 18.4615 21.5385 18.4615C19.8391 18.4615 18.4615 17.084 18.4615 15.3846C18.4615 13.6853 19.8391 12.3077 21.5385 12.3077C23.2378 12.3077 24.6154 13.6853 24.6154 15.3846Z"
        fill="white"
      />
    </svg>
  );
}

WhiteBag.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 31 / 40,
  svg: WhiteBag,
  title,
};
