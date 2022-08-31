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

const title = _x('Green Leaf Shape', 'sticker name', 'web-stories');

function GreenLeafShape({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M3.31844 49.9977C3.20557 48.6149 2.69763 47.3169 2.38722 45.9624C1.9075 43.9306 1.82284 41.8706 1.3149 39.8671C0.919834 38.2304 0.694083 36.4808 0.581207 34.8159C0.468331 32.897 0.299018 30.9217 0.24258 29.0028C0.186142 26.9428 0.524769 24.2056 1.68175 22.4278C2.30256 21.4965 3.06447 20.6782 3.68529 19.747C4.02392 19.239 4.4472 18.9004 4.84227 18.4771C5.35021 17.9127 5.6324 17.2355 6.0839 16.6711C7.77704 14.4418 10.2321 13.2002 12.5178 11.7046C16.017 9.39062 19.9958 8.00789 23.8054 6.31476C26.7684 4.98847 29.9289 4.22656 32.8919 2.87205C34.4721 2.16657 36.1371 1.63042 37.6327 0.783847C38.3664 0.360563 39.4669 0.16303 40.3135 0.106593C41.8655 -0.00628317 44.1795 -0.232035 45.5058 0.727409C46.7192 1.6022 47.9608 2.67452 48.9485 3.80327C50.049 5.04491 50.0208 5.94791 48.9485 7.18955C47.0014 9.44706 44.5745 10.9427 42.1759 12.664C40.765 13.6799 39.8902 14.5829 39.4951 16.3325C38.7896 19.4648 37.7455 22.6817 36.2782 25.5601C35.6009 26.9146 34.8954 28.1844 34.2464 29.5672C33.8231 30.5266 33.4281 31.5143 32.9483 32.4455C32.2993 33.7436 31.8478 35.3803 30.4368 35.9164C28.2358 36.7348 26.3451 38.0046 24.0876 38.7383C23.1564 39.0487 22.4791 39.5849 21.6325 40.0646C18.3309 41.8988 14.7471 43.3098 11.5866 45.398C10.8247 45.9059 9.86524 46.0752 9.01867 46.4421C8.28498 46.7525 7.63594 47.204 6.90225 47.5144C6.05568 47.853 5.51952 48.2199 4.84227 48.8125C4.50364 49.0664 3.79817 50.0541 3.31844 49.9977Z"
        fill="#4A6747"
      />
    </svg>
  );
}

GreenLeafShape.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: GreenLeafShape,
  title,
};
