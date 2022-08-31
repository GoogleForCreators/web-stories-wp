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

const title = _x('Off-white Banner', 'sticker name', 'web-stories');

function OffWhiteBanner({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 51 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M50.0394 0.524213C47.1156 0.507352 44.2173 0.29626 41.2907 0.765326C36.8034 1.46836 32.2413 1.32301 27.7338 1.29701C23.8354 1.27453 20.0617 1.90635 16.1631 1.93246C13.434 1.96532 10.7297 1.90113 8.00089 1.88539C6.80702 1.87851 5.63751 1.87176 4.44364 1.86488C3.88325 1.86165 1.61709 2.48944 1.10263 2.97242C0.172287 3.74457 1.91305 5.49486 1.9038 7.09842C1.89596 8.45902 1.69179 10.0615 2.44317 10.7461C2.8795 11.1374 3.58776 10.8499 4.05069 10.8526C4.90346 10.8575 5.75622 10.8624 6.60899 10.8673C9.72768 10.8853 13.0696 10.2243 16.1334 11.311C17.7624 11.9035 19.617 11.4283 21.2738 11.4378C23.223 11.4491 25.1965 11.4605 27.1457 11.4717C30.1669 11.4891 33.2125 11.5067 36.2337 11.5241C37.3789 11.5307 38.524 11.5373 39.6692 11.5439C40.9118 11.5511 42.0835 11.1691 43.3023 11.0789C44.5214 10.9402 45.7674 10.3642 46.9405 9.73927C47.5516 9.40264 48.1602 9.50334 48.7936 9.50699C49.2322 9.50952 49.7912 9.75571 50.1597 9.2233C50.5779 8.54539 50.4633 7.28128 50.6151 6.31026C50.8689 4.56233 50.8299 2.8613 50.8403 1.06337"
        fill="#F3E9D4"
      />
    </svg>
  );
}

OffWhiteBanner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 51 / 12,
  svg: OffWhiteBanner,
  title,
};
