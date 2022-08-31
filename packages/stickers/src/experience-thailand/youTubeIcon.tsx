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

const title = _x('YouTube', 'sticker name', 'web-stories');

const YouTubeIcon = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 30 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M21.9665.0332031H8.20109C.666016.0332031.666016 2.13357.666016 7.30199v5.05021c0 4.9158 1.067524 7.2688 7.535074 7.2688H21.9686c5.8411 0 7.535-1.3771 7.535-7.2688V7.30199c-.002-5.43937-.2871-7.2687869-7.5371-7.2687869zM12.1382 13.6663V5.73741l7.7723 3.9522-7.7723 3.97669z"
      fill="#094228"
    />
  </svg>
);

YouTubeIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 30 / 20,
  svg: YouTubeIcon,
  title,
};
