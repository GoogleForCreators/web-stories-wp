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

const title = _x('Wavy Line', 'sticker name', 'web-stories');

function WavyLine({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 52 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M0.912399 1.09772C4.46934 1.15747 7.14993 3.36836 10.7069 3.48787C14.3325 3.60738 17.0131 1.34868 20.5013 1.12162C24.0583 0.882602 26.8592 3.1652 30.2958 3.46397C33.8871 3.77469 36.6365 1.67135 39.97 1.19332C43.9909 0.607734 47.1354 3.44007 51.0876 3.49982C51.6375 3.51177 51.6375 2.91424 51.0876 2.90228C47.5307 2.84253 44.8501 0.631636 41.2931 0.512128C37.6675 0.39262 34.9869 2.65132 31.4987 2.87838C27.9417 3.1174 25.1408 0.834799 21.7042 0.536029C18.1129 0.225309 15.3635 2.32865 12.03 2.80668C8.0091 3.39227 4.86456 0.571882 0.912399 0.500177C0.362534 0.488226 0.362534 1.08577 0.912399 1.09772Z"
        fill="#F9E46C"
      />
    </svg>
  );
}

WavyLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 4,
  svg: WavyLine,
  title,
};
