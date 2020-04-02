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
import { __, sprintf, _n } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import { useCallback, useContext, useEffect, useState, useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  FloatingTab,
  StoryGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  ListBar,
} from '../../../components';
import { VIEW_STYLE, STORY_STATUSES } from '../../../constants';
import { ApiContext } from '../../api/apiProvider';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import DisplayElement from '../../../../edit-story/components/canvas/displayElement';
import FontProvider from '../../font/fontProvider';
import useResizeEffect from '../../../utils/useResizeEffect';
import PageHeading from './pageHeading';
import NoResults from './noResults';

const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme: t }) => t.subNavigationBar.border};
`;

function MyStories() {
  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const { pageSize } = useResizeEffect();
  const {
    actions: { fetchStories },
    state: { stories },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({ status });
  }, [fetchStories, status]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const lowerTypeaheadValue = typeaheadValue.toLowerCase();

      return story.title.toLowerCase().includes(lowerTypeaheadValue);
    });
  }, [stories, typeaheadValue]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  const filteredStoriesCount = filteredStories.length;

  const listBarLabel = sprintf(
    /* translators: %s: number of stories */
    _n(
      '%s total story',
      '%s total stories',
      filteredStoriesCount,
      'web-stories'
    ),
    filteredStoriesCount
  );

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <PageHeading
            defaultTitle={__('My Stories', 'web-stories')}
            filteredStories={filteredStories}
            handleTypeaheadChange={setTypeaheadValue}
            typeaheadValue={typeaheadValue}
          />
          <FilterContainer>
            {STORY_STATUSES.map((storyStatus) => (
              <FloatingTab
                key={storyStatus.value}
                onClick={(_, value) => setStatus(value)}
                name="all-stories"
                value={storyStatus.value}
                isSelected={status === storyStatus.value}
              >
                {storyStatus.label}
              </FloatingTab>
            ))}
          </FilterContainer>
          {filteredStoriesCount > 0 ? (
            <>
              <ListBar
                label={listBarLabel}
                layoutStyle={viewStyle}
                onPress={handleViewStyleBarButtonSelected}
              />

              <StoryGrid>
                {filteredStories.map((story) => (
                  <CardGridItem key={story.id}>
                    <CardPreviewContainer
                      onOpenInEditorClick={() => {}}
                      onPreviewClick={() => {}}
                      previewSource={'http://placeimg.com/225/400/nature'}
                    >
                      {story.pages[0].elements.map(({ id, ...rest }) => {
                        return (
                          <DisplayElement
                            key={id}
                            page={story.pages[0]}
                            element={{ id, ...rest }}
                          />
                        );
                      })}
                    </CardPreviewContainer>
                    <CardTitle
                      title={story.title}
                      modifiedDate={story.modified.startOf('day').fromNow()}
                    />
                  </CardGridItem>
                ))}
              </StoryGrid>
            </>
          ) : (
            <NoResults typeaheadValue={typeaheadValue} />
          )}
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

export default MyStories;
