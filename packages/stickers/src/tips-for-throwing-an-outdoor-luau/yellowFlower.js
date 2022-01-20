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

const title = _x('Yellow Flower', 'sticker name', 'web-stories');

const YellowFlower = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 38 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M37.5005 10.2974C37.3942 9.70212 37.2028 9.08555 36.7776 8.6178C36.3311 8.12879 35.672 7.89492 35.0342 7.68231C33.4183 7.12952 31.7812 6.64051 30.1441 6.17276C29.4 5.96015 28.6346 5.7688 27.8692 5.83258C27.04 5.89637 26.2746 6.27907 25.5304 6.66177C23.0003 8.00123 20.6191 9.59581 18.4292 11.4243C18.089 11.7007 17.685 12.0196 17.2386 11.9558C16.4519 11.8495 16.3031 10.8077 16.3243 10.021C16.4306 8.04375 16.5157 6.00267 15.9204 4.11043C15.3251 2.21818 13.8793 0.453503 11.9233 0.0708015C9.94597 -0.3119 7.84111 0.899988 6.82057 2.66467C5.80004 4.42935 5.71499 6.66177 6.204 8.63906C6.67175 10.51 7.58598 12.2322 8.56399 13.8906C9.03174 14.252 9.01048 15.1662 8.54273 15.6127C8.0112 16.1443 7.22454 16.2931 6.50166 16.5057C4.22671 17.2286 2.37699 19.0358 1.37771 21.2044C0.378435 23.3731 0.208345 25.8606 0.591046 28.1994C0.761136 29.1986 1.05879 30.2404 1.8242 30.8995C2.52581 31.5161 3.50383 31.7075 4.41806 31.6862C7.20328 31.6649 9.73336 30.0491 11.7957 28.1994C12.391 27.6678 12.9863 27.0938 13.7305 26.7961C14.4746 26.4985 15.4314 26.5622 15.9629 27.1576C16.2818 27.519 16.4094 28.008 16.4732 28.4757C16.8559 30.8995 16.3881 33.5572 17.5575 35.7046C18.1315 36.7676 19.0883 37.5968 20.0876 38.2984C22.0648 39.6804 24.7225 40.6371 26.8486 39.489C28.5708 38.5536 29.4 36.5125 29.7189 34.5777C30.2291 31.4098 29.7614 28.1568 28.7621 25.1165C28.4857 24.2448 28.1455 23.3093 28.4432 22.4588C28.6983 21.7147 29.3574 21.1832 29.9953 20.7367C32.3765 19.0783 35.1405 17.6963 36.6075 15.1875C37.458 13.7417 37.7769 11.9771 37.5005 10.2974ZM19.0032 23.3518C17.8126 23.3518 16.8346 22.3738 16.8346 21.1832C16.8346 19.9925 17.8126 19.0145 19.0032 19.0145C20.1939 19.0145 21.1719 19.9925 21.1719 21.1832C21.1719 22.3738 20.1939 23.3518 19.0032 23.3518Z"
      fill="#ECE7BD"
    />
  </svg>
);

YellowFlower.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 38 / 40,
  svg: YellowFlower,
  title,
};
