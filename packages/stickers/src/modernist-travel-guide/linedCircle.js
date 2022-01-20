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

const title = _x('Lined Circle', 'sticker name', 'web-stories');

function LinedCircle({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.131 49.5821L1.11422 33.5654L1.35103 33.3286L17.3678 49.3453L17.131 49.5821Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.8691 0.417855L48.8858 16.4346L48.649 16.6714L32.6322 0.654664L32.8691 0.417855Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.1 49.7913L0.208597 28.8999L0.445406 28.6631L21.3369 49.5545L21.1 49.7913Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.8998 0.209134L49.7912 21.1006L49.5544 21.3374L28.663 0.445943L28.8998 0.209134Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.0697 50L0 24.9303L0.236809 24.6935L25.3065 49.7632L25.0697 50Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.9301 0L49.9998 25.0697L49.763 25.3065L24.6933 0.236809L24.9301 0Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.3428 49.5127L0.487502 21.6575L0.724311 21.4206L28.5796 49.2759L28.3428 49.5127Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6575 0.487294L49.5128 28.3426L49.276 28.5794L21.4207 0.724104L21.6575 0.487294Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.6156 49.0254L0.974769 18.3846L1.21158 18.1478L31.8524 48.7886L31.6156 49.0254Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.3845 0.975055L49.0253 31.6158L48.7885 31.8526L18.1477 1.21186L18.3845 0.975055Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.8886 48.5376L1.46227 15.1113L1.69908 14.8745L35.1254 48.3008L34.8886 48.5376Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1112 1.46235L48.5375 34.8887L48.3007 35.1255L14.8744 1.69916L15.1112 1.46235Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.4654 47.3537L2.64633 12.5346L2.88314 12.2978L37.7022 47.1169L37.4654 47.3537Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5351 2.64608L47.3542 37.4652L47.1174 37.702L12.2983 2.88289L12.5351 2.64608Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M39.3456 45.4735L4.5265 10.6545L4.76331 10.4177L39.5824 45.2367L39.3456 45.4735Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6549 4.52624L45.474 39.3453L45.2372 39.5821L10.4181 4.76305L10.6549 4.52624Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.2257 43.5934L6.40666 8.7743L6.64347 8.53749L41.4625 43.3566L41.2257 43.5934Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.77455 6.40664L43.5936 41.2257L43.3568 41.4625L8.53774 6.64345L8.77455 6.40664Z"
        fill="white"
      />
    </svg>
  );
}

LinedCircle.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: LinedCircle,
  title,
};
