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

const title = _x('Cart Bag', 'sticker name', 'web-stories');

function CartBag({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 28 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.72728 1.38579C4.98481 1.04241 5.38898 0.840332 5.81819 0.840332H22.1818C22.611 0.840332 23.0152 1.04241 23.2727 1.38579L27.3637 6.84033C27.5407 7.07637 27.6364 7.36346 27.6364 7.65851V26.7494C27.6364 27.8344 27.2054 28.8749 26.4382 29.6421C25.671 30.4093 24.6304 30.8403 23.5455 30.8403H4.45456C3.36958 30.8403 2.32904 30.4093 1.56185 29.6421C0.794652 28.8749 0.363647 27.8344 0.363647 26.7494V7.65851C0.363647 7.36346 0.459345 7.07637 0.636375 6.84033L4.72728 1.38579ZM6.50001 3.56761L4.45456 6.29488H23.5455L21.5 3.56761H6.50001ZM24.9091 9.02215H3.09092V26.7494C3.09092 27.1111 3.23459 27.4579 3.49032 27.7137C3.74605 27.9694 4.0929 28.1131 4.45456 28.1131H23.5455C23.9071 28.1131 24.254 27.9694 24.5097 27.7137C24.7654 27.4579 24.9091 27.1111 24.9091 26.7494V9.02215ZM8.54491 11.7489C9.29802 11.7489 9.90854 12.3594 9.90854 13.1125C9.90854 14.1975 10.3395 15.238 11.1067 16.0052C11.8739 16.7724 12.9145 17.2034 13.9995 17.2034C15.0844 17.2034 16.125 16.7724 16.8922 16.0052C17.6594 15.238 18.0904 14.1975 18.0904 13.1125C18.0904 12.3594 18.7009 11.7489 19.454 11.7489C20.2071 11.7489 20.8176 12.3594 20.8176 13.1125C20.8176 14.9208 20.0993 16.655 18.8206 17.9337C17.542 19.2123 15.8077 19.9307 13.9995 19.9307C12.1912 19.9307 10.4569 19.2123 9.17827 17.9337C7.89961 16.655 7.18127 14.9208 7.18127 13.1125C7.18127 12.3594 7.79179 11.7489 8.54491 11.7489Z"
        fill="white"
      />
    </svg>
  );
}

CartBag.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 31,
  svg: CartBag,
  title,
};
