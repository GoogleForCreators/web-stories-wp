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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../utils/addQueryArgs';
import { useStory, useMedia } from '../../app';
import useRefreshPostEditURL from '../../utils/useRefreshPostEditURL';
import { Outline, Primary } from '../button';
import CircularProgress from '../circularProgress';

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
      story: { link },
    },
  } = useStory();

  /**
   * Open a preview of the story in current window.
   */
  const openPreviewLink = () => {
    const previewLink = addQueryArgs(link, { preview: 'true' });
    window.open(previewLink, 'story-preview');
  };
  return (
    <Outline onClick={openPreviewLink} isDisabled={isSaving}>
      {__('Preview', 'web-stories')}
    </Outline>
  );
}

function Publish() {
  const {
    state: {
      meta: { isSaving },
      story: { date, storyId },
    },
    actions: { updateStory },
  } = useStory();
  const {
    state: { isUploading },
  } = useMedia();

  const refreshPostEditURL = useRefreshPostEditURL(storyId);
  const hasFutureDate = Date.now() < Date.parse(date);

  const handlePublish = useCallback(() => {
    updateStory({ properties: { status: 'publish' } });
    refreshPostEditURL();
  }, [refreshPostEditURL, updateStory]);

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
    actions: { updateStory },
  } = useStory();
  const {
    state: { isUploading },
  } = useMedia();

  const handleUnPublish = useCallback(
    () => updateStory({ properties: { status: 'draft' } }),
    [updateStory]
  );

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
        <Outline onClick={saveStory} isDisabled={isSaving || isUploading}>
          {text}
        </Outline>
      );
  }

  return (
    <Primary onClick={saveStory} isDisabled={isSaving || isUploading}>
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
