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
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { UnitsProvider } from '@web-stories-wp/units';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  LoadingSpinner,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../edit-story/app';
import { TransformProvider } from '../../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
  LoadingContainer,
} from '../../../../components';
import {
  ViewPropTypes,
  PagePropTypes,
  SearchPropTypes,
} from '../../../../utils/useTemplateView';
import { TemplatesPropType, TemplateActionsPropType } from '../../../../types';
import FontProvider from '../../../font/fontProvider';
import { TemplateGridView, EmptyContentMessage } from '../../shared';

function Content({
  allPagesFetched,
  isLoading,
  page,
  templates,
  view,
  totalTemplates,
  search,
  templateActions,
}) {
  const { newStoryURL } = useConfig();

  const pageContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }
    return totalTemplates > 0 ? (
      <>
        <TemplateGridView
          templates={templates}
          pageSize={view.pageSize}
          templateActions={templateActions}
        />
        <InfiniteScroller
          canLoadMore={!allPagesFetched}
          isLoading={isLoading}
          allDataLoadedMessage={__('No more templates', 'web-stories')}
          allDataLoadedAriaMessage={__(
            'All templates are loaded',
            'web-stories'
          )}
          loadingAriaMessage={__('Loading more templates', 'web-stories')}
          onLoadMore={page.requestNextPage}
        />
      </>
    ) : (
      <EmptyContentMessage>
        <Headline size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} as="h3">
          {search?.keyword
            ? sprintf(
                /* translators: %s: search term. */
                __(
                  'Sorry, we couldn\'t find any results matching "%s"',
                  'web-stories'
                ),
                search.keyword
              )
            : __('No templates currently available.', 'web-stories')}
        </Headline>
        {!search?.keyword && (
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            as="a"
            href={newStoryURL}
          >
            {__('Create New Story', 'web-stories')}
          </Button>
        )}
      </EmptyContentMessage>
    );
  }, [
    allPagesFetched,
    isLoading,
    newStoryURL,
    page.requestNextPage,
    search?.keyword,
    templateActions,
    templates,
    totalTemplates,
    view.pageSize,
  ]);

  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider
            pageSize={{
              width: view.pageSize.width,
              height: view.pageSize.height,
            }}
          >
            <StandardViewContentGutter>{pageContent}</StandardViewContentGutter>
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}

Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  isLoading: PropTypes.bool,
  page: PagePropTypes,
  templates: TemplatesPropType,
  totalTemplates: PropTypes.number,
  search: SearchPropTypes,
  templateActions: TemplateActionsPropType,
  view: ViewPropTypes,
};
export default Content;
