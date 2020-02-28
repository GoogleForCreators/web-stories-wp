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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../utils/addQueryArgs';
import { useStory } from '../../app';
import { Outline, Primary } from '../button';

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
      story: { status },
    },
    actions: { saveStory },
  } = useStory();

  let text;

  switch (status) {
    case 'publish':
    case 'private':
      text = __('Update', 'web-stories');
      break;
    case 'future':
      text = __('Scheduled', 'web-stories');
      break;
    default:
      text = __('Save draft', 'web-stories');
      break;
  }

  return (
    <Primary onClick={saveStory} isDisabled={isSaving}>
      {text}
    </Primary>
  );
}

function Loading() {
  const {
    state: { isSaving },
  } = useStory();

  return isSaving ? <Spinner /> : <Space />;
}

function Buttons() {
  return (
    <ButtonList>
      <List>
        <Loading />
        <PreviewButton />
        <Space />
        <Publish />
        <Space />
      </List>
    </ButtonList>
  );
}
export default Buttons;
