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

const title = _x('Water Droplet', 'sticker name', 'web-stories');

function WaterDroplet({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 37 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2489 0.168323L18.8154 0.642292L18.3795 0.170591C18.6246 -0.0559898 19.0025 -0.0569755 19.2489 0.168323ZM18.8176 1.52756C18.7293 1.61307 18.6287 1.71134 18.5164 1.82193C18.0446 2.28681 17.369 2.96905 16.5575 3.83488C14.9339 5.56729 12.7698 8.03097 10.607 10.9562C6.25997 16.8358 2.008 24.462 2.008 31.7194C2.008 41.1143 9.53774 48.7154 18.8154 48.7154C28.0931 48.7154 35.6228 41.1143 35.6228 31.7194C35.6228 24.3774 31.37 16.7509 27.0244 10.8941C24.862 7.97973 22.6983 5.53208 21.0749 3.81302C20.2636 2.95386 19.5881 2.27762 19.1165 1.81709C19.0052 1.70841 18.9052 1.61176 18.8176 1.52756ZM28.0561 10.1286C32.4353 16.0308 36.9074 23.9427 36.9074 31.7194C36.9074 41.8107 28.8155 50 18.8154 50C8.8153 50 0.723412 41.8107 0.723412 31.7194C0.723412 24.0261 5.19629 16.1138 9.57409 10.1925C11.7738 7.2173 13.9721 4.71495 15.6202 2.95643C16.4447 2.07681 17.1323 1.38236 17.6148 0.906924C17.8561 0.669183 18.0461 0.48614 18.1764 0.362023C18.2415 0.299963 18.2917 0.252628 18.3259 0.220548L18.3651 0.183933L18.3754 0.174328L18.3795 0.170591C18.3795 0.170591 18.3795 0.170591 18.8154 0.642292C19.2489 0.168323 19.2489 0.168323 19.2489 0.168323L19.2529 0.172042L19.2633 0.181568L19.3025 0.217853C19.3367 0.249637 19.387 0.296528 19.4521 0.358012C19.5825 0.480976 19.7726 0.662335 20.0139 0.897985C20.4965 1.36924 21.1843 2.05788 22.0089 2.93105C23.6573 4.67666 25.856 7.16354 28.0561 10.1286Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6673 42.2929C18.6673 41.9381 18.9548 41.6506 19.3096 41.6506C24.4929 41.6506 28.5487 37.9084 28.5487 33.3996C28.5487 33.0449 28.8363 32.7573 29.191 32.7573C29.5457 32.7573 29.8333 33.0449 29.8333 33.3996C29.8333 38.7418 25.0717 42.9352 19.3096 42.9352C18.9548 42.9352 18.6673 42.6476 18.6673 42.2929Z"
        fill="#235524"
      />
    </svg>
  );
}

WaterDroplet.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 37 / 50,
  svg: WaterDroplet,
  title,
};
