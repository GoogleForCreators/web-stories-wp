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
 * External dependencies
 */
import { useCallback, useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { rawCustomFonts } from '../../dataUtils/formattedCustomFonts';
import CustomFontsSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/CustomFonts',
  component: CustomFontsSettings,
  argTypes: {
    onSubmit: { action: 'onSubmitFired' },
    onDelete: { action: 'onDelete fired' },
  },
};

export const _default = (args) => {
  const [addedFonts, setAddedFonts] = useState(rawCustomFonts);
  const demoId = useRef(4);

  const handleAddFont = useCallback(
    ({ url }) => {
      args.onSubmit(url);

      // For storybook demo only.
      const fontData = {
        id: demoId,
        family: `Demo font ${demoId.current}`,
        url,
      };
      setAddedFonts([fontData, ...addedFonts]);
      demoId.current = demoId.current + 1;
    },
    [addedFonts, args]
  );

  const deleteFont = useCallback(
    (toDelete) => {
      args.onDelete(toDelete);

      setAddedFonts((currentFonts) => {
        return currentFonts.filter(({ id }) => id !== toDelete);
      });
    },
    [args]
  );

  return (
    <CustomFontsSettings
      addCustomFont={handleAddFont}
      customFonts={addedFonts}
      deleteCustomFont={deleteFont}
    />
  );
};
