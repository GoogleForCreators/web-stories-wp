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

const title = _x('Burst', 'sticker name', 'web-stories');

const FashionStarburst = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 134 134"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M66.6245 8.27711l.3753.35155.3755-.35137L75.3094.853325 81.146 10.0211l.2762.4338.4511-.247 9.5222-5.21576 3.3821 10.33326.1597.488.4976-.1264 10.5181-2.6728.715 10.8524.034.5121.513.0011 10.853.0229-2.007 10.6924-.095.5038.497.1291 10.504 2.7339-4.599 9.8554-.217.4644.448.2484 9.502 5.2624-6.894 8.3924-.325.3956.371.352 7.891 7.4716-8.765 6.4126-.413.3025.273.4335 5.792 9.2004-10.078 4.0286-.476.1902.157.488 3.329 10.3571-10.77 1.386-.509.066.031.512.654 10.86-10.769-1.34-.51-.064-.097.505-2.0601 10.684-10.1077-3.982-.4784-.189-.2197.465-4.6435 9.83-8.8003-6.373-.4167-.302-.3283.396L67 133.139l-6.9383-8.368-.3283-.396-.4167.302-8.8003 6.373-4.6435-9.83-.2197-.465-.4785.189-10.0996 3.982-2.0596-10.684-.0973-.505-.5099.064-10.7769 1.34.6536-10.86.0309-.512-.509-.066-10.7618-1.385 3.3294-10.3581.1569-.4881-.4761-.1902-10.08654-4.0287 5.79226-9.2002.27298-.4335-.41347-.3025-8.764068-6.4124 7.898068-7.4716.37228-.3522-.32551-.3958-6.90164-8.3924 9.50094-5.2622.4484-.2484-.2168-.4644-4.59885-9.8553 10.51205-2.7339.4965-.1292-.095-.5042-2.0142-10.692 10.8604-.0229.5136-.0011.0334-.5125.7069-10.8519 10.5181 2.6727.4976.1264.1597-.488 3.3821-10.33326 9.5222 5.21576.4508.2469.2763-.4334L58.6982.853326l7.9263 7.423784z"
      stroke="#FF3000"
      strokeWidth="1.09867"
    />
  </svg>
);

FashionStarburst.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 134 / 134,
  svg: FashionStarburst,
  title,
};
