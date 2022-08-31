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

const title = _x('White Instagram', 'sticker name', 'web-stories');

function InstagramIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.18182 2.72727C5.16936 2.72727 2.72727 5.16936 2.72727 8.18182V21.8182C2.72727 24.8306 5.16936 27.2727 8.18182 27.2727H21.8182C24.8306 27.2727 27.2727 24.8306 27.2727 21.8182V8.18182C27.2727 5.16936 24.8306 2.72727 21.8182 2.72727H8.18182ZM0 8.18182C0 3.66312 3.66312 0 8.18182 0H21.8182C26.3369 0 30 3.66312 30 8.18182V21.8182C30 26.3369 26.3369 30 21.8182 30H8.18182C3.66312 30 0 26.3369 0 21.8182V8.18182Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.6591 10.8943C14.8079 10.7681 13.9386 10.9135 13.1748 11.3098C12.4111 11.7061 11.7917 12.3332 11.4049 13.1018C11.018 13.8704 10.8833 14.7414 11.02 15.5909C11.1567 16.4405 11.5578 17.2253 12.1663 17.8337C12.7747 18.4422 13.5595 18.8433 14.4091 18.98C15.2586 19.1167 16.1296 18.982 16.8982 18.5951C17.6668 18.2083 18.2939 17.5889 18.6902 16.8252C19.0865 16.0614 19.2319 15.1921 19.1057 14.3409C18.9769 13.4727 18.5723 12.6689 17.9517 12.0483C17.3311 11.4277 16.5273 11.0231 15.6591 10.8943ZM11.9187 8.88903C13.1917 8.22852 14.6405 7.98621 16.0591 8.19657C17.5061 8.41114 18.8458 9.08543 19.8802 10.1198C20.9146 11.1542 21.5889 12.4939 21.8034 13.9409C22.0138 15.3595 21.7715 16.8083 21.111 18.0813C20.4505 19.3542 19.4054 20.3865 18.1244 21.0312C16.8434 21.676 15.3917 21.9004 13.9758 21.6726C12.5599 21.4448 11.2519 20.7763 10.2378 19.7622C9.22375 18.7481 8.55525 17.4401 8.32741 16.0242C8.09957 14.6083 8.324 13.1566 8.96876 11.8756C9.61352 10.5946 10.6458 9.54954 11.9187 8.88903Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.1364 7.5C21.1364 6.74688 21.7469 6.13636 22.5 6.13636H22.5136C23.2668 6.13636 23.8773 6.74688 23.8773 7.5C23.8773 8.25312 23.2668 8.86364 22.5136 8.86364H22.5C21.7469 8.86364 21.1364 8.25312 21.1364 7.5Z"
        fill="white"
      />
    </svg>
  );
}

InstagramIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 30 / 30,
  svg: InstagramIcon,
  title,
};
