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

const title = _x('Chat Box', 'sticker name', 'web-stories');

function Chatbox({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 44 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M1.69329 0C0.834158 0 0.137695 0.696461 0.137695 1.55559V15.3878C0.137695 16.2469 0.834159 16.9434 1.69329 16.9434H30.8417L33.8983 20L36.955 16.9434H42.3069C43.166 16.9434 43.8625 16.2469 43.8625 15.3878V1.55559C43.8625 0.696463 43.166 0 42.3069 0H1.69329Z"
        fill="white"
      />
    </svg>
  );
}

Chatbox.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 44 / 20,
  svg: Chatbox,
  title,
};
