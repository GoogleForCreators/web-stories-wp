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

const title = _x('Laptop 3/4', 'sticker name', 'web-stories');

function LaptopRatingsThreeFouth({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 42 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.9567 1H8.0437C6.38685 1 5.0437 2.34315 5.0437 4V22.1739H36.9567V4C36.9567 2.34315 35.6136 1 33.9567 1ZM8.0437 0C5.83456 0 4.0437 1.79087 4.0437 4V23.1739H37.9567V4C37.9567 1.79086 36.1659 0 33.9567 0H8.0437Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.1307 3.82611H10.8699C9.21302 3.82611 7.86987 5.16925 7.86987 6.82611V22.1739H34.1307V6.82611C34.1307 5.16926 32.7876 3.82611 31.1307 3.82611ZM10.8699 2.82611C8.66073 2.82611 6.86987 4.61697 6.86987 6.82611V23.1739H35.1307V6.82611C35.1307 4.61697 33.3399 2.82611 31.1307 2.82611H10.8699Z"
        fill="#0057FF"
      />
      <path
        d="M7.08716 7C7.08716 4.79086 8.87802 3 11.0872 3H30.0872V23H7.08716V7Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.0872 4H11.0872C9.4303 4 8.08716 5.34315 8.08716 7V22H29.0872V4ZM11.0872 3C8.87802 3 7.08716 4.79086 7.08716 7V23H30.0872V3H11.0872Z"
        fill="#0057FF"
      />
      <path
        d="M41.9133 22C41.9133 24.2091 40.1225 26 37.9133 26L4.08725 26C1.87811 26 0.0872423 24.2091 0.0872425 22L0.0872426 20.913L41.9133 20.913L41.9133 22Z"
        fill="#E4E4E4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.08725 25L37.9133 25C39.5702 25 40.9133 23.6569 40.9133 22L40.9133 21.913L1.08724 21.913L1.08724 22C1.08724 23.6568 2.43039 25 4.08725 25ZM37.9133 26C40.1225 26 41.9133 24.2091 41.9133 22L41.9133 20.913L0.0872426 20.913L0.0872425 22C0.0872423 24.2091 1.87811 26 4.08725 26L37.9133 26Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.2612 24.1739H18.7394C18.1001 24.1739 17.5374 24.5025 17.2112 25H24.7893C24.4631 24.5025 23.9005 24.1739 23.2612 24.1739ZM25.9052 25C25.5014 23.9327 24.4699 23.1739 23.2612 23.1739H18.7394C17.5307 23.1739 16.4992 23.9327 16.0954 25C15.9777 25.3109 15.9133 25.6479 15.9133 26H26.0872C26.0872 25.6479 26.0229 25.3109 25.9052 25Z"
        fill="#0057FF"
      />
    </svg>
  );
}

LaptopRatingsThreeFouth.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 26,
  svg: LaptopRatingsThreeFouth,
  title,
};
