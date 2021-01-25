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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useFeatures } from 'flagged';
/**
 * Internal dependencies
 */
import { useStory, useLocalMedia, useHistory, useConfig } from '../../../app';
import { Outline } from '../../button';
import { useGlobalKeyDownEffect } from '../../../../design-system';
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

  const { customMetaBoxes: isMetaBoxesFeatureEnabled } = useFeatures();
  const { metaBoxes = {} } = useConfig();

  const hasMetaBoxes =
    isMetaBoxesFeatureEnabled &&
    Object.keys(metaBoxes).some((location) =>
      Boolean(metaBoxes[location]?.length)
    );

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
        <Outline
          onClick={() => saveStory({ status: 'draft' })}
          isDisabled={
            !hasMetaBoxes && (isSaving || isUploading || !hasNewChanges)
          }
        >
          {text}
        </Outline>
      );
  }

  return (
    <ButtonWithChecklistWarning
      onClick={() => saveStory()}
      isDisabled={isSaving || isUploading}
      text={text}
    />
  );
}

export default Update;
