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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useFeatures } from 'flagged';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { clamp, STORY_ANIMATION_STATE } from '../../../../animation';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import stripHTML from '../../../../edit-story/utils/stripHTML';
import VisibleImage from '../../../../edit-story/elements/media/visibleImage';
import ShapeLayerContent from '../../../../edit-story/elements/shape/layer';
import getStoryMarkup from '../../../../edit-story/output/utils/getStoryMarkup';
import {
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../constants';
import { PreviewPage } from '../../../../edit-story/components/previewPage';
import { getPagePreviewHeights } from '../../../utils';
import FontProvider from '../../font/fontProvider';
import useApi from '../../api/useApi';
import UpdateTemplateForm from './updateTemplateForm';
import Timeline from './timeline';
import {
  PageContainer,
  ActiveCard,
  StorySelector,
  Container,
  ElementsContainer,
  ElementInfo,
  Type,
  Text,
  STORY_WIDTH,
} from './components';
import { emitter } from './emitter';

function StoryAnimTool() {
  const [activeStory, setActiveStory] = useState(null);
  const [activeAnimation, setActiveAnimation] = useState({});
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pageAnimationState, setPageAnimationState] = useState(
    STORY_ANIMATION_STATE.RESET
  );

  const [selectedElementIds, setSelectedElementIds] = useState({});
  const [isElementSelectable, setIsElementSelectable] = useState(false);
  const globalTimeSubscription = useMemo(() => emitter(), []);
  const flags = useFeatures();

  const { updateStory, fetchStories, stories, storiesOrderById } = useApi(
    ({
      actions: {
        storyApi: { updateStory, fetchStories },
      },
      state: {
        stories: { stories, storiesOrderById },
      },
    }) => ({ updateStory, fetchStories, stories, storiesOrderById })
  );

  useEffect(() => {
    fetchStories({
      searchTerm: '',
      sortOption: STORY_SORT_OPTIONS.LAST_MODIFIED,
      sortDirection: SORT_DIRECTION.DESC,
      status: STORY_STATUS.ALL,
      page: 1,
      perPage: 25,
    });
  }, [fetchStories]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const saveActiveStoryUpdates = useCallback(() => {
    const { content, story_data } = activeStory.originalStoryData;

    updateStory({
      ...activeStory,
      content,
      story_data: {
        ...story_data,
        pages: [...activeStory.pages],
      },
    });
  }, [activeStory, updateStory]);

  const handleSelectStory = useCallback(
    (e) => {
      if (activeStory) {
        saveActiveStoryUpdates(activeStory);
      }

      // Deselect animation
      setActiveAnimation({});

      // Reset active page
      setActivePageIndex(0);

      const story = orderedStories.find(
        (s) => s.id === parseInt(e.target.value)
      );
      setActiveStory(story);
    },
    [activeStory, saveActiveStoryUpdates, orderedStories]
  );

  const handlePageNavClick = useCallback(
    (offset) => {
      const currentPageIndex = clamp(activePageIndex + offset, [
        0,
        activeStory.pages.length,
      ]);

      setActivePageIndex(currentPageIndex);
    },
    [activeStory, activePageIndex]
  );

  const handleSelectElement = useCallback(
    (element) => {
      if (selectedElementIds[element.id]) {
        const {
          [element.id]: removed,
          ...remainingElementIds
        } = selectedElementIds;

        setSelectedElementIds(remainingElementIds);
      } else {
        setSelectedElementIds({
          ...selectedElementIds,
          [element.id]: element.id,
        });
      }
    },
    [selectedElementIds]
  );

  const handleAddOrUpdateAnimation = useCallback(
    (animation) => {
      const story = Object.values(selectedElementIds).reduce(
        (story, selectedElementId, i) => {
          const animationWithTarget = {
            ...animation,
            targets: [selectedElementId],
            id: i === 0 ? animation.id : uuidv4(),
          };

          const animations = story.pages[activePageIndex].animations || [];
          const index = animations.findIndex(
            (a) => a.id === animationWithTarget.id
          );

          if (index < 0) {
            // not found, push it to the end
            animations.push(animationWithTarget);
          } else {
            // found, overwrite at index
            animations[index] = animationWithTarget;
          }

          story.pages[activePageIndex].animations = animations;
          return story;
        },
        { ...activeStory }
      );
      setActiveStory(story);
      saveActiveStoryUpdates(story);

      // Deselect animation
      setActiveAnimation({});
    },
    [activeStory, saveActiveStoryUpdates, activePageIndex, selectedElementIds]
  );

  const handleAnimationSelect = useCallback(
    (animationId) => {
      setActiveAnimation(
        (activeStory.pages[activePageIndex].animations || []).find(
          (a) => a.id === animationId
        ) || {}
      );
    },
    [activeStory, activePageIndex]
  );

  const handleAnimationDelete = useCallback(
    (animationId) => {
      const animations = activeStory.pages[activePageIndex].animations || [];
      const index = animations.findIndex((a) => a.id === animationId);

      if (index > -1) {
        animations.splice(index, 1);
        activeStory.pages[activePageIndex].animations = [...animations];

        setActiveStory({
          ...activeStory,
        });

        saveActiveStoryUpdates(activeStory);

        // Deselect animation
        setActiveAnimation({});
      }
    },
    [activeStory, activePageIndex, saveActiveStoryUpdates]
  );

  const handlePreviewClick = useCallback(() => {
    const story = {
      ...activeStory.originalStoryData,
      title: activeStory.title,
      excerpt: '',
      featuredMedia: {
        id: 0,
      },
      story_data: {
        ...activeStory.originalStoryData.story_data,
        pages: {
          ...activeStory.pages,
        },
      },
    };

    const storyMarkup = getStoryMarkup(
      story,
      activeStory.pages,
      {
        publisher: {
          name: 'Demo',
        },
      },
      flags
    );

    const popup = window.open('about:blank', '_blank');

    popup.document.write('<!DOCTYPE html><html><head>');
    popup.document.write(`<title>${activeStory.title}</title>`);
    popup.document.write('</head><body style="width: 100%; height: 100vh;">');
    popup.document.write(
      '<iframe id="content" width="100%" height="100%" frameBorder="0"></iframe>'
    );
    popup.document.write('</body></html>');

    const iframe = popup.document.querySelector('#content');
    const iframeDoc = iframe.contentDocument;

    iframeDoc.open();
    iframeDoc.write(storyMarkup.toString());
    iframeDoc.close();
  }, [activeStory, flags]);

  useEffect(() => {
    setSelectedElementIds(
      (activeAnimation.targets || []).reduce(
        (acc, elementId) => ({
          ...acc,
          [elementId]: elementId,
        }),
        {}
      )
    );
  }, [activeAnimation]);

  useEffect(() => {
    // Deselect animation
    setActiveAnimation({});
  }, [activePageIndex]);

  const { fullBleedHeight, storyHeight } = getPagePreviewHeights(STORY_WIDTH);

  const renderElementContent = useCallback((element) => {
    switch (element.type) {
      case 'image':
        return (
          <VisibleImage
            src={element.resource.src}
            alt={element.resource.alt}
            height="50"
          />
        );
      case 'text':
        return <Text>{stripHTML(element.content)}</Text>;
      case 'shape':
        return <ShapeLayerContent element={element} />;
      default:
        return null;
    }
  }, []);

  return (
    <PageContainer>
      <StorySelector
        value={(activeStory && activeStory.id) || ''}
        onChange={handleSelectStory}
        onBlur={() => {}}
      >
        <option value={-1}>{'-- Select Story --'}</option>
        {orderedStories.map((story) => (
          <option key={story.id} value={story.id}>
            {story.title}
          </option>
        ))}
      </StorySelector>

      {activeStory && (
        <>
          <button onClick={handlePreviewClick}>{'Preview Story'}</button>
          <Container>
            <div>
              <FontProvider>
                <TransformProvider>
                  <UnitsProvider
                    pageSize={{
                      width: STORY_WIDTH,
                      height: storyHeight,
                    }}
                  >
                    <ActiveCard
                      width={STORY_WIDTH}
                      height={fullBleedHeight}
                      selectedElementIds={selectedElementIds}
                    >
                      <PreviewPage
                        pageSize={{
                          width: STORY_WIDTH,
                          height: storyHeight,
                          containerHeight: fullBleedHeight,
                        }}
                        page={activeStory.pages[activePageIndex]}
                        animationState={pageAnimationState}
                        subscribeGlobalTime={globalTimeSubscription.subscribe}
                        onAnimationComplete={() =>
                          setPageAnimationState(STORY_ANIMATION_STATE.RESET)
                        }
                      />
                    </ActiveCard>
                  </UnitsProvider>
                </TransformProvider>
              </FontProvider>

              <button
                onClick={() => handlePageNavClick(-1)}
                disabled={isElementSelectable || activePageIndex === 0}
              >
                {'Previous Page'}
              </button>
              <button
                onClick={() => handlePageNavClick(1)}
                disabled={
                  isElementSelectable ||
                  activePageIndex === activeStory.pages.length - 1
                }
              >
                {'Next Page'}
              </button>
              <button
                onClick={() =>
                  setPageAnimationState(STORY_ANIMATION_STATE.PLAYING)
                }
              >
                {'Play'}
              </button>
              <button
                onClick={() =>
                  setPageAnimationState(STORY_ANIMATION_STATE.PAUSED)
                }
              >
                {'Pause'}
              </button>
              <button
                onClick={() =>
                  setPageAnimationState(STORY_ANIMATION_STATE.RESET)
                }
              >
                {'Reset'}
              </button>
              <button
                onClick={() =>
                  setPageAnimationState(STORY_ANIMATION_STATE.SCRUBBING)
                }
              >
                {'Scrub'}
              </button>
            </div>
            <ElementsContainer>
              {activeStory.pages[activePageIndex].elements.map((element) => (
                <ElementInfo
                  key={element.id}
                  isActive={Boolean(selectedElementIds[element.id])}
                  onClick={() =>
                    isElementSelectable && handleSelectElement(element)
                  }
                >
                  <Type>{element.type}</Type>
                  {renderElementContent(element)}
                </ElementInfo>
              ))}
            </ElementsContainer>
            <UpdateTemplateForm story={activeStory} />
          </Container>
          <Timeline
            story={activeStory}
            activePageIndex={activePageIndex}
            activeAnimation={activeAnimation}
            isElementSelectable={isElementSelectable}
            isAnimationSaveable={Object.keys(selectedElementIds).length > 0}
            onAddOrUpdateAnimation={handleAddOrUpdateAnimation}
            onAnimationSelect={handleAnimationSelect}
            onAnimationDelete={handleAnimationDelete}
            onToggleTargetSelect={setIsElementSelectable}
            emitGlobalTime={globalTimeSubscription.emit}
            canScrub={pageAnimationState === STORY_ANIMATION_STATE.SCRUBBING}
          />
        </>
      )}
    </PageContainer>
  );
}

export default StoryAnimTool;
