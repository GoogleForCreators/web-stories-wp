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
import useCommonFlip from './useCommonFlip';

import CONFIG from './config';

function useSetup() {
  const { horizontal, vertical, canFlip } = useCommonFlip();

  useElementSetup(
    CONFIG.FLIPHORIZONTAL.PROPERTY,
    {
      value: horizontal,
    },
    [horizontal]
  );

  useElementSetup(
    CONFIG.FLIPVERTICAL.PROPERTY,
    {
      value: vertical,
    },
    [vertical]
  );

  useElementSetup(
    CONFIG.CANFLIP.PROPERTY,
    {
      value: canFlip,
    },
    [canFlip]
  );
}

export default useSetup;
