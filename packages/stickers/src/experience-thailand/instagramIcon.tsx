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

const title = _x('Instagram', 'sticker name', 'web-stories');

const InstagramIcon = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M18.6524 26.4359H8.03621c-4.06197 0-7.385819-3.3202-7.385819-7.3776V7.7585c0-4.05747 3.323849-7.377641 7.385819-7.377641H18.6524c4.062 0 7.3859 3.320171 7.3859 7.377641v11.2998c0 4.0574-3.3239 7.3776-7.3859 7.3776zm0-1.9482c1.4436 0 2.8054-.567 3.8354-1.5959 1.0301-1.029 1.5977-2.3893 1.5977-3.8312V7.7585c0-1.44193-.5676-2.8022-1.5977-3.83115-1.03-1.02895-2.3918-1.59592-3.8354-1.59592H8.03621c-1.44353 0-2.8053.56697-3.83539 1.59592s-1.5977 2.38922-1.5977 3.83115v11.2998c0 1.4419.56761 2.8022 1.5977 3.8311 1.03009 1.029 2.39186 1.5959 3.83539 1.5959H18.6524v.0024z"
      fill="#094228"
    />
    <path
      d="M20.3738 13.3076c0 3.8568-3.13 6.9834-6.9911 6.9834-3.86107 0-6.99105-3.1266-6.99105-6.9834s3.12998-6.98332 6.99105-6.98332c3.8611 0 6.9911 3.12652 6.9911 6.98332zM13.35 8.7415c-2.5273 0-4.57816 2.0462-4.57816 4.5731 0 2.5269 2.04846 4.5731 4.57816 4.5731 2.5297 0 4.5782-2.0462 4.5782-4.5731 0-2.5269-2.0508-4.5731-4.5782-4.5731zM20.4862 7.87085c.9146 0 1.6561-.74063 1.6561-1.65424 0-.91361-.7415-1.65423-1.6561-1.65423-.9146 0-1.6561.74062-1.6561 1.65423 0 .91361.7415 1.65424 1.6561 1.65424z"
      fill="#094228"
    />
  </svg>
);

InstagramIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 27 / 27,
  svg: InstagramIcon,
  title,
};
