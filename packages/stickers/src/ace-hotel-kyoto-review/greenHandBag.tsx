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

const title = _x('Green Handbag', 'sticker name', 'web-stories');

function GreenHandBag({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle cx="25" cy="25" r="25" fill="white" />
      <path
        d="M16.6584 33.3333H31.2581C31.8277 33.3333 32.316 33.13 32.7229 32.7233C33.1298 32.3167 33.3333 31.8206 33.3333 31.235V19.7916C33.3333 19.4988 33.2315 19.2507 33.0281 19.0474C32.8246 18.8441 32.5764 18.7424 32.2834 18.7424H29.1584V17.9372C29.1584 17.254 29.0445 16.6034 28.8166 15.9853C28.5725 15.3672 28.2429 14.81 27.8279 14.3139C27.4128 13.8178 26.9205 13.4152 26.3508 13.1061C25.7812 12.7808 25.1545 12.5856 24.4709 12.5205C23.706 12.4555 22.9736 12.5449 22.2737 12.7889C21.5738 13.0329 20.9635 13.3908 20.4426 13.8625C19.9218 14.3342 19.5068 14.9036 19.1975 15.5705C18.9045 16.2374 18.7581 16.9531 18.7581 17.7176V18.7424H15.6331C15.3401 18.7424 15.0919 18.8441 14.8884 19.0474C14.685 19.2507 14.5833 19.4988 14.5833 19.7916V31.235C14.5833 31.8206 14.7867 32.3167 15.1936 32.7233C15.6005 33.13 16.0888 33.3333 16.6584 33.3333ZM29.1584 20.8408V22.9147H27.0833V20.8408H29.1584ZM20.8333 17.7176C20.8333 16.8555 21.1384 16.1195 21.7488 15.5095C22.3591 14.8995 23.0956 14.5945 23.9583 14.5945C24.8209 14.5945 25.5574 14.8995 26.1677 15.5095C26.7781 16.1195 27.0833 16.8555 27.0833 17.7176V18.7424H20.8333V17.7176ZM18.7581 20.8408H20.8333V22.9147H18.7581V20.8408Z"
        fill="#19584D"
      />
    </svg>
  );
}

GreenHandBag.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: GreenHandBag,
  title,
};
