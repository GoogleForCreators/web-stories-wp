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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import { rawCustomFonts } from '../../dataUtils/formattedCustomFonts';
import CustomFontsSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/CustomFonts',
  component: CustomFontsSettings,
};

export const _default = () => {
  const [addedFonts, setAddedFonts] = useState(rawCustomFonts);
  const demoId = useRef(4);

  const handleAddFont = useCallback(
    ({ url }) => {
      action('onSubmit fired')(url);

      // For storybook demo only.
      const fontData = {
        id: demoId,
        family: `Demo font ${demoId.current}`,
        url,
      };
      setAddedFonts([fontData, ...addedFonts]);
      demoId.current = demoId.current + 1;
    },
    [addedFonts]
  );

  const deleteFont = useCallback((toDelete) => {
    action('onDelete fired')(toDelete);

    setAddedFonts((currentFonts) => {
      return currentFonts.filter(({ id }) => id !== toDelete);
    });
  }, []);

  return (
    <CustomFontsSettings
      addCustomFont={handleAddFont}
      customFonts={addedFonts}
      deleteCustomFont={deleteFont}
      fetchCustomFonts={() => {}}
    />
  );
};
