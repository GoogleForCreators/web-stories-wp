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

const FashionStarburstSolid = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 48 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M27.3533 2.78839l-.6471-1.01633-.8797.82319-1.8291 1.71147-1.827-1.71114-.8792-.82352-.6476 1.01584-1.3478 2.11428-2.195-1.20228-1.0562-.57853-.3746 1.14452-.7802 2.38391-2.425-.6162-1.166-.29628-.0782 1.20048-.163 2.50318-2.50427.00527-1.20339.00253.22278 1.18262.46488 2.4677-2.42461.6306-1.16236.3023.50788 1.0884 1.0615 2.2748-2.19217 1.2141-1.05092.5821.76306.9279 1.59278 1.9368-1.82291 1.7245-.87187.8248.9686.7087 2.02237 1.4797-1.3371 2.1238-.63971 1.016 1.11504.4454 2.32704.9295-.76855 2.3909-.36782 1.1443 1.19212.1536 2.48134.3195-.15084 2.5061-.07229 1.2009 1.19392-.1485 2.4845-.309.4751 2.4647.2281 1.1829 1.1206-.4419 2.3275-.9177 1.0706 2.2665.5147 1.0896.9761-.7068 2.0284-1.469 1.5996 1.9291.7698.9284.7698-.9284 1.5995-1.9291 2.0285 1.469.976.7068.5147-1.0896 1.0707-2.2667 2.33.918 1.1205.4415.228-1.1826.4752-2.4646 2.482.3089 1.194.1486-.0723-1.201-.1509-2.506 2.4837-.3196 1.1922-.1535-.3678-1.1444-.7686-2.3912 2.3249-.9293 1.1146-.4455-.6395-1.0158-1.3371-2.1238 2.0224-1.4797.9681-.7084-.8711-.8248-1.8215-1.7248 1.5914-1.9372.7621-.9278-1.0503-.5818-2.1922-1.2141 1.0615-2.2748.5078-1.0882-1.1621-.3024-2.423-.6307.4632-2.4684.2219-1.18192-1.2026-.00253-2.5025-.00527-.1648-2.50388-.079-1.19957-1.1651.29607-2.425.6162-.7803-2.38391-.3746-1.14452-1.0562.57853-2.1945 1.20202-1.3455-2.11353z"
      fill="#FF3000"
      stroke="#FFECE3"
      strokeWidth="2"
    />
  </svg>
);

FashionStarburstSolid.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 48 / 47,
  svg: FashionStarburstSolid,
  title,
};
