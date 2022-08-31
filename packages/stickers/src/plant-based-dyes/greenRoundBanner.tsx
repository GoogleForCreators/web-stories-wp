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

const title = _x('Green Round Banner', 'sticker name', 'web-stories');

function GreenRoundBanner({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M9.78162 2.67951C6.66433 3.67231 4.20211 6.38437 2.80159 9.50808C1.40106 12.6318 0.971867 16.2156 0.949278 19.7025C0.926689 24.1096 1.58177 28.5894 3.36631 32.5606C6.37067 39.2439 12.3342 43.9415 18.7043 46.8715C25.5037 49.9952 33.4098 51.3028 40.2543 48.3244C44.5915 46.4357 48.2283 42.8761 50.8035 38.6627C54.1467 33.166 55.7279 26.3858 54.7792 19.9205C53.8304 13.4551 50.171 7.37718 44.8625 4.15661C42.0163 2.43736 38.8086 1.5172 35.5784 0.936041C26.6783 -0.734781 18.3881 -0.17784 9.78162 2.67951Z"
        fill="#414C40"
      />
    </svg>
  );
}

GreenRoundBanner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 50,
  svg: GreenRoundBanner,
  title,
};
