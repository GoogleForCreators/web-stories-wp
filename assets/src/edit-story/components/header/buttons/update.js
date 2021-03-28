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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia, useHistory } from '../../../app';
import { useMetaBoxes } from '../../../integrations/wordpress/metaBoxes';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useGlobalKeyDownEffect,
  Tooltip,
  TOOLTIP_PLACEMENT,
  Icons,
} from '../../../../design-system';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function Update() {
  const { isSaving, status, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { status },
      },
      actions: { saveStory },
    }) => ({ isSaving, status, saveStory })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));
  const {
    state: { hasNewChanges },
  } = useHistory();
  const { hasMetaBoxes } = useMetaBoxes(({ state }) => ({
    hasMetaBoxes: state.hasMetaBoxes,
  }));

  useGlobalKeyDownEffect(
    { key: ['mod+s'] },
    (event) => {
      event.preventDefault();
      if (isSaving) {
        return;
      }
      saveStory();
    },
    [saveStory, isSaving]
  );

  // The button is enabled only if we're not already saving nor uploading. And
  // then only if there are new changes or the story has meta-boxes – as these
  // can update without us knowing it.
  const isEnabled =
    !isSaving && !isUploading && (hasNewChanges || hasMetaBoxes);
  let text;
  switch (status) {
    case 'publish':
    case 'private':
      text = __('Update', 'web-stories');
      break;
    case 'future':
      text = __('Schedule', 'web-stories');
      break;
    default:
      text = __('Save draft', 'web-stories');
      return (
        <Tooltip title={text} placement={TOOLTIP_PLACEMENT.BOTTOM} hasTail>
          <Button
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.QUATERNARY}
            size={BUTTON_SIZES.SMALL}
            onClick={() => saveStory({ status: 'draft' })}
            disabled={!isEnabled}
            aria-label={text}
          >
            <Icons.FloppyDisk />
          </Button>
        </Tooltip>
      );
  }

  return (
    <ButtonWithChecklistWarning
      text={text}
      onClick={() => saveStory()}
      disabled={isSaving || isUploading}
    />
  );
}

export default Update;
