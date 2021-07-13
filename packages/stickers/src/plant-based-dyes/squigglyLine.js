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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Squiggly Line', 'sticker name', 'web-stories');

function SquigglyLine({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 54 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M1.18923 18.3387C1.15429 18.3513 1.10478 18.3455 1.06984 18.3581C0.155435 18.4513 0.158588 19.9898 1.09436 19.9995C2.43007 20.0228 3.45891 19.2409 4.49844 18.5104C5.81264 17.5782 7.02102 16.5499 8.1459 15.3781C9.28922 14.1917 10.2937 12.9054 11.2234 11.5434C12.0755 10.2726 13.2247 9.03672 13.7622 7.5952C13.3468 7.71354 12.9148 7.82995 12.4994 7.9483C12.7625 8.12971 12.9063 8.89897 13.0257 9.1638C13.2248 9.60519 13.4403 10.0485 13.6908 10.4792C14.1356 11.2504 14.689 11.9508 15.353 12.5639C16.7103 13.827 18.546 14.5778 20.3971 14.0598C22.1084 13.5922 23.5303 12.4553 24.5979 11.0594C25.8412 9.45 26.2845 7.52926 27.2132 5.74918C26.7103 5.75694 26.191 5.76276 25.6882 5.77052C26.2855 7.66313 27.1264 9.3336 28.6632 10.6345C29.9719 11.7413 31.7931 12.758 33.5618 12.5145C35.4002 12.2458 37.0172 10.7305 38.0265 9.26087C38.5729 8.45571 39.0446 7.57488 39.322 6.63779C39.6296 5.5872 39.9857 4.40857 40.0971 3.3182C39.5448 3.32014 39.007 3.34051 38.4547 3.34245C38.7607 5.15067 40.2297 6.7445 41.7412 7.6913C43.3004 8.6604 45.1574 9.22984 47.0008 9.06202C48.8587 8.91263 50.468 7.74758 51.5763 6.28956C52.1887 5.49216 52.6827 4.56381 52.9786 3.61216C53.1397 3.09609 53.2201 2.55381 53.3482 2.03386C53.4539 1.56143 53.647 1.19959 53.6062 0.693216C53.5547 0.135423 52.9159 -0.123588 52.4597 0.0568446C52.1083 0.199445 51.8977 0.425471 51.6628 0.715523C50.964 1.5362 52.3028 2.52956 52.9851 1.70694C53.0239 1.66135 53.0792 1.61769 53.1181 1.5721C52.7414 1.36062 52.3482 1.14721 51.9715 0.93573C51.9579 0.766937 51.7697 1.51389 51.7338 1.67687C51.6485 2.11825 51.5816 2.54508 51.4467 2.98064C51.2294 3.69074 50.9004 4.35427 50.4763 4.97317C49.6281 6.21098 48.4032 7.23732 46.8627 7.39059C45.4911 7.53027 44.0184 7.10635 42.8467 6.40013C41.6749 5.69392 40.3303 4.4658 40.1097 3.06889C39.9504 2.14732 38.5613 2.1512 38.4673 3.09314C38.3664 3.95069 38.0948 4.8383 37.8804 5.66578C37.6699 6.46026 37.3623 7.22662 36.912 7.92604C36.1482 9.15706 34.8525 10.6432 33.3227 10.8479C31.9637 11.0225 30.5551 10.0544 29.5823 9.22108C28.3396 8.12198 27.7103 6.64359 27.2228 5.09826C26.9761 4.35033 25.9821 4.55113 25.6978 5.1196C24.9195 6.61642 24.5587 8.26263 23.592 9.65371C22.7234 10.9226 21.483 12.0808 19.9484 12.4689C18.3293 12.8637 16.8294 11.8179 15.8497 10.616C15.3235 9.96897 14.9409 9.2385 14.5952 8.47893C14.3039 7.82607 14.1621 7.04032 13.5427 6.61639C13.1097 6.3147 12.4758 6.44081 12.2798 6.9695C11.8209 8.16948 10.827 9.22297 10.1157 10.293C9.30433 11.5017 8.46387 12.6735 7.46809 13.7435C6.52762 14.7698 5.53084 15.706 4.42824 16.546C3.67408 17.1261 2.35798 18.3591 1.33969 18.3397C1.34172 18.8917 1.36219 19.4291 1.36422 19.9811C1.39916 19.9685 1.44867 19.9743 1.48361 19.9617C2.49703 19.8802 2.25603 18.2301 1.18923 18.3387Z"
        fill="#F9E46C"
      />
    </svg>
  );
}

SquigglyLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 54 / 20,
  svg: SquigglyLine,
  title,
};
