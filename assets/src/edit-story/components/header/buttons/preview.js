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
import { useCallback, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
/**
 * Internal dependencies
 */
import { useStory, useLocalMedia } from '../../../app';
import escapeHTML from '../../../utils/escapeHTML';
import PreviewErrorDialog from '../previewErrorDialog';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Tooltip,
  TOOLTIP_PLACEMENT,
} from '../../../../design-system';

const PREVIEW_TARGET = 'story-preview';

function Preview() {
  const { isSaving, previewLink, status, autoSave, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { status, previewLink },
      },
      actions: { autoSave, saveStory },
    }) => ({ isSaving, status, previewLink, autoSave, saveStory })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));

  const [previewLinkToOpenViaDialog, setPreviewLinkToOpenViaDialog] = useState(
    null
  );
  const isDraft = 'draft' === status;

  /**
   * Open a preview of the story in current window.
   */
  const openPreviewLink = useCallback(() => {
    trackEvent('preview_story', 'editor');

    // Start a about:blank popup with waiting message until we complete
    // the saving operation. That way we will not bust the popup timeout.
    let popup;
    try {
      popup = global.open('about:blank', PREVIEW_TARGET);
      if (popup) {
        popup.document.write('<!DOCTYPE html><html><head>');
        popup.document.write('<title>');
        popup.document.write(
          escapeHTML(__('Generating the preview…', 'web-stories'))
        );
        popup.document.write('</title>');
        popup.document.write('</head><body>');
        // Output "waiting" message.
        popup.document.write(
          escapeHTML(__('Please wait. Generating the preview…', 'web-stories'))
        );
        // Force redirect to the preview URL after 5 seconds. The saving tab
        // might get frozen by the browser.
        popup.document.write(
          `<script>
            setTimeout(function() {
              location.replace(${JSON.stringify(previewLink)});
            }, 5000);
          </script>`
        );
      }
    } catch (e) {
      // Ignore errors. Anything can happen with a popup. The errors
      // will be resolved after the story is saved.
    }

    // Save story directly if draft, otherwise, use auto-save.
    const updateFunc = isDraft ? saveStory : autoSave;
    updateFunc()
      .then((update) => {
        if (popup && !popup.closed) {
          if (popup.location.href) {
            // Auto-save sends an updated preview link, use that instead if available.
            const updatedPreviewLink = update?.preview_link ?? previewLink;
            popup.location.replace(updatedPreviewLink);
          }
        }
      })
      .catch(() => setPreviewLinkToOpenViaDialog(previewLink));
  }, [autoSave, isDraft, previewLink, saveStory]);

  const openPreviewLinkSync = useCallback(
    (evt) => {
      setPreviewLinkToOpenViaDialog(null);
      // Ensure that this method is as safe as possible and pass the random
      // target in case the normal target is not openable.
      window.open(previewLinkToOpenViaDialog, PREVIEW_TARGET + Math.random());
      evt.preventDefault();
    },
    [previewLinkToOpenViaDialog]
  );

  const onDialogClose = useCallback(
    () => setPreviewLinkToOpenViaDialog(null),
    []
  );

  const label = __('Preview', 'web-stories');
  return (
    <>
      <Tooltip
        title={label}
        placement={TOOLTIP_PLACEMENT.BOTTOM}
        hasTail={true}
      >
        <Button
          variant={BUTTON_VARIANTS.CIRCLE}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          onClick={openPreviewLink}
          disabled={isSaving || isUploading}
          aria-label={label}
        >
          <Icons.Preview />
        </Button>
      </Tooltip>
      <PreviewErrorDialog
        open={Boolean(previewLinkToOpenViaDialog)}
        onClose={onDialogClose}
        onRetry={openPreviewLinkSync}
      />
    </>
  );
}

export default Preview;
