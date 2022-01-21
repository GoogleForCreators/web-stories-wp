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

const title = _x('Instagram', 'sticker name', 'web-stories');

function InstagramIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M17.1462 24.8165H7.0347C3.16584 24.8165 0 21.6541 0 17.7895V7.02693C0 3.16234 3.16584 0 7.0347 0H17.1462C21.0151 0 24.1809 3.16234 24.1809 7.02693V17.7895C24.1809 21.6541 21.0151 24.8165 17.1462 24.8165ZM17.1462 22.9608C18.5211 22.9608 19.8182 22.4208 20.7993 21.4408C21.7804 20.4608 22.321 19.1651 22.321 17.7918V7.02693C22.321 5.65354 21.7804 4.35794 20.7993 3.3779C19.8182 2.39787 18.5211 1.85785 17.1462 1.85785H7.0347C5.65979 1.85785 4.36276 2.39787 3.38164 3.3779C2.40052 4.35794 1.8599 5.65354 1.8599 7.02693V17.7895C1.8599 19.1629 2.40052 20.4585 3.38164 21.4386C4.36276 22.4186 5.65979 22.9586 7.0347 22.9586H17.1462V22.9608Z"
        fill="#FAF4EA"
      />
      <path
        d="M18.7859 12.3116C18.7859 15.985 15.8047 18.9629 12.1272 18.9629C8.44966 18.9629 5.46848 15.985 5.46848 12.3116C5.46848 8.63814 8.44966 5.66028 12.1272 5.66028C15.8047 5.66028 18.7859 8.63814 18.7859 12.3116ZM12.0961 7.96257C9.68885 7.96257 7.73551 9.91151 7.73551 12.3183C7.73551 14.725 9.68663 16.6739 12.0961 16.6739C14.5055 16.6739 16.4566 14.725 16.4566 12.3183C16.4566 9.91151 14.5032 7.96257 12.0961 7.96257Z"
        fill="#FAF4EA"
      />
      <path
        d="M18.8929 7.13361C19.764 7.13361 20.4702 6.42818 20.4702 5.55798C20.4702 4.68779 19.764 3.98236 18.8929 3.98236C18.0217 3.98236 17.3155 4.68779 17.3155 5.55798C17.3155 6.42818 18.0217 7.13361 18.8929 7.13361Z"
        fill="#FAF4EA"
      />
    </svg>
  );
}

InstagramIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 25 / 25,
  svg: InstagramIcon,
  title,
};
