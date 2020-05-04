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
import styled from 'styled-components';
import { useCallback, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../utils/addQueryArgs';
import { useStory, useMedia, useConfig, useHistory } from '../../app';
import useRefreshPostEditURL from '../../utils/useRefreshPostEditURL';
import { Outline, Plain, Primary } from '../button';
import CircularProgress from '../circularProgress';
import Dialog from '../dialog';
import escapeHTML from '../../utils/escapeHTML';

const PREVIEW_TARGET = 'story-preview';

const ButtonList = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  height: 100%;
`;

const List = styled.div`
  display: flex;
`;

const Space = styled.div`
  width: 6px;
`;

function PreviewButton() {
  const {
    state: {
      meta: { isSaving },
      story: { link, status },
    },
    actions: { autoSave, saveStory },
  } = useStory();
  const { previewLink: autoSaveLink } = useConfig();

  const [previewLinkToOpenViaDialog, setPreviewLinkToOpenViaDialog] = useState(
    null
  );
  const isDraft = 'draft' === status;

  /**
   * Open a preview of the story in current window.
   */
  const openPreviewLink = () => {
    // Display the actual link in case of a draft.
    const previewLink = isDraft
      ? addQueryArgs(link, { preview: 'true' })
      : autoSaveLink;

    // Start a about:blank popup with waiting message until we complete
    // the saving operation. That way we will not bust the popup timeout.
    let popup;
    try {
      popup = window.open('about:blank', PREVIEW_TARGET);
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
      .catch(() => {
        setPreviewLinkToOpenViaDialog(previewLink);
      });
  };

  const openPreviewLinkSync = (evt) => {
    setPreviewLinkToOpenViaDialog(null);
    // Ensure that this method is as safe as possible and pass the random
    // target in case the normal target is not openable.
    window.open(previewLinkToOpenViaDialog, PREVIEW_TARGET + Math.random());
    evt.preventDefault();
  };

  return (
    <>
      <Outline onClick={openPreviewLink} isDisabled={isSaving}>
        {__('Preview', 'web-stories')}
      </Outline>
      <Dialog
        open={Boolean(previewLinkToOpenViaDialog)}
        onClose={() => setPreviewLinkToOpenViaDialog(null)}
        title={__('Open preview', 'web-stories')}
        actions={
          <>
            <Primary onClick={openPreviewLinkSync}>
              {__('Try again', 'web-stories')}
            </Primary>
            <Plain onClick={() => setPreviewLinkToOpenViaDialog(null)}>
              {__('Cancel', 'web-stories')}
            </Plain>
          </>
        }
      >
        {__('The preview window failed to open.', 'web-stories')}
      </Dialog>
    </>
  );
}

function Publish() {
  const {
    state: {
      meta: { isSaving },
      story: { date, storyId },
    },
    actions: { saveStory },
  } = useStory();
  const {
    state: { isUploading },
  } = useMedia();

  const refreshPostEditURL = useRefreshPostEditURL(storyId);
  const hasFutureDate = Date.now() < Date.parse(date);

  const handlePublish = useCallback(() => {
    saveStory({ status: 'publish' });
    refreshPostEditURL();
  }, [refreshPostEditURL, saveStory]);

  const text = hasFutureDate
    ? __('Schedule', 'web-stories')
    : __('Publish', 'web-stories');
  return (
    <Primary onClick={handlePublish} isDisabled={isSaving || isUploading}>
      {text}
    </Primary>
  );
}

function SwitchToDraft() {
  const {
    state: {
      meta: { isSaving },
    },
    actions: { saveStory },
  } = useStory();
  const {
    state: { isUploading },
  } = useMedia();

  const handleUnPublish = useCallback(() => saveStory({ status: 'draft' }), [
    saveStory,
  ]);

  return (
    <Outline onClick={handleUnPublish} isDisabled={isSaving || isUploading}>
      {__('Switch to Draft', 'web-stories')}
    </Outline>
  );
}

function Update() {
  const {
    state: {
      meta: { isSaving },
      story: { status },
    },
    actions: { saveStory },
  } = useStory();
  const {
    state: { isUploading },
  } = useMedia();
  const {
    state: { hasNewChanges },
  } = useHistory();

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
          isDisabled={isSaving || isUploading || !hasNewChanges}
        >
          {text}
        </Outline>
      );
  }

  return (
    <Primary onClick={() => saveStory()} isDisabled={isSaving || isUploading}>
      {text}
    </Primary>
  );
}

function Loading() {
  const {
    state: {
      meta: { isSaving },
    },
  } = useStory();
  return (
    <>
      {isSaving && <CircularProgress size={30} />}
      <Space />
    </>
  );
}

function Buttons() {
  const {
    state: {
      story: { status },
    },
  } = useStory();
  const isDraft = 'draft' === status;
  return (
    <ButtonList>
      <List>
        <Loading />
        {isDraft && <Update />}
        {!isDraft && <SwitchToDraft />}
        <Space />
        <PreviewButton />
        <Space />
        {isDraft && <Publish />}
        {!isDraft && <Update />}
        <Space />
      </List>
    </ButtonList>
  );
}
export default Buttons;
