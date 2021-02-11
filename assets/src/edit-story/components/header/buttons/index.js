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
import { useState, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { addQueryArgs } from '../../../../design-system';
import { useStory } from '../../../app';
import CircularProgress from '../../circularProgress';
import PostPublishDialog from '../postPublishDialog';
import Preview from './preview';
import SwitchToDraft from './switchToDraft';
import Update from './update';
import Publish from './publish';

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

function Loading() {
  const { isSaving } = useStory((state) => ({
    isSaving: state.state.meta.isSaving,
  }));
  return (
    <>
      {isSaving && <CircularProgress size={30} />}
      <Space />
    </>
  );
}

function Buttons() {
  const { status, storyId, link, isFreshlyPublished } = useStory(
    ({
      state: {
        story: { status, storyId, link },
        meta: { isFreshlyPublished },
      },
    }) => ({
      status,
      storyId,
      link,
      isFreshlyPublished,
    })
  );
  const [showDialog, setShowDialog] = useState(false);
  useEffect(() => setShowDialog(Boolean(isFreshlyPublished)), [
    isFreshlyPublished,
  ]);

  const isDraft = 'draft' === status;

  const confirmURL = addQueryArgs('post-new.php', {
    ['from-web-story']: storyId,
  });

  return (
    <>
      <ButtonList>
        <List>
          <Loading />
          {isDraft && <Update />}
          {!isDraft && <SwitchToDraft />}
          <Space />
          <Preview />
          <Space />
          {isDraft && <Publish />}
          {!isDraft && <Update />}
          <Space />
        </List>
      </ButtonList>
      <PostPublishDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        confirmURL={confirmURL}
        storyURL={link}
      />
    </>
  );
}
export default Buttons;
