/*
 * Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import useElementSetup from '../../useElementSetup';
import useCommonProperty from '../../useCommonProperty';
import useCommonAspectRatio from './useCommonAspectRatio';

import CONFIG from './config';

function useSetup() {
  const width = useCommonProperty('width');
  const height = useCommonProperty('height');
  const lockAspectRatio = useCommonAspectRatio();

  useElementSetup(
    CONFIG.WIDTH.PROPERTY,
    {
      value: width,
      min: CONFIG.WIDTH.MIN,
      max: CONFIG.WIDTH.MAX,
    },
    [width]
  );

  useElementSetup(
    CONFIG.HEIGHT.PROPERTY,
    {
      value: height,
      min: CONFIG.HEIGHT.MIN,
      max: CONFIG.HEIGHT.MAX,
    },
    [height]
  );

  useElementSetup(
    CONFIG.LOCKASPECTRATIO.PROPERTY,
    {
      value: lockAspectRatio,
    },
    [height]
  );
}

export default useSetup;
