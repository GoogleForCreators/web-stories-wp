/*
 * Copyright 2022 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import { Modal } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../app';
import { updateSlug } from '../../utils/storyUpdates';
import Header from './header';
import MainContent from './mainContent';
import { INPUT_KEYS, REQUIRED_INPUTS } from './constants';

const Container = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: ${({ theme }) => `1px solid ${theme.colors.divider.primary}`};
  border-radius: ${({ theme }) => theme.borders.radius.medium};
`;

function PublishModal() {
  const storyId = useConfig(({ storyId }) => storyId);
  const updateStory = useStory(({ actions }) => actions.updateStory);
  const inputValues = useStory(({ state: { story } }) => ({
    [INPUT_KEYS.EXCERPT]: story.excerpt,
    [INPUT_KEYS.TITLE]: story.title || '',
    [INPUT_KEYS.SLUG]: story.slug,
  }));

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      trackEvent('publish_modal');
    }
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleUpdateStoryInfo = useCallback(
    ({ target }) => {
      const { value, name } = target;
      updateStory({
        properties: { [name]: value },
      });
    },
    [updateStory]
  );

  const handleUpdateSlug = useCallback(() => {
    updateSlug({
      currentSlug: inputValues.slug,
      currentTitle: inputValues.title,
      storyId,
      updateStory,
    });
  }, [inputValues, storyId, updateStory]);

  const isAllRequiredInputsFulfilled = useMemo(
    () =>
      REQUIRED_INPUTS.every(
        (requiredInput) => inputValues?.[requiredInput]?.length > 0
      ),
    [inputValues]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel={__('Story details', 'web-stories')}
      contentStyles={{
        display: 'block',
        width: '71vw',
        minWidth: '917px',
        height: '66vh',
        minHeight: '580px',
      }}
    >
      <Container>
        <Header
          onClose={onClose}
          isPublishEnabled={isAllRequiredInputsFulfilled}
        />
        <MainContent
          inputValues={inputValues}
          handleUpdateStoryInfo={handleUpdateStoryInfo}
          handleUpdateSlug={handleUpdateSlug}
        />
      </Container>
    </Modal>
  );
}

export default PublishModal;
