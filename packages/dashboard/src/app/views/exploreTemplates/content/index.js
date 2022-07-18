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
import PropTypes from 'prop-types';
import { useMemo } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  LoadingSpinner,
  THEME_CONSTANTS,
  InfiniteScroller,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../config';
import {
  Layout,
  StandardViewContentGutter,
  LoadingContainer,
} from '../../../../components';
import {
  ViewPropTypes,
  PagePropTypes,
} from '../../../../utils/useTemplateView';
import { TemplatesPropType, TemplateActionsPropType } from '../../../../types';
import { EmptyContentMessage } from '../../shared';
import TemplateGridView from './templateGridView';

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
          {search
            ? sprintf(
                /* translators: %s: search term. */
                __(
                  'Sorry, we couldn\'t find any results matching "%s"',
                  'web-stories'
                ),
                search
              )
            : __('No templates currently available.', 'web-stories')}
        </Headline>
        {!search && (
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
    templateActions,
    search,
    templates,
    totalTemplates,
    view.pageSize,
  ]);

  return (
    <Layout.Scrollable>
      <StandardViewContentGutter>{pageContent}</StandardViewContentGutter>
    </Layout.Scrollable>
  );
}

Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  isLoading: PropTypes.bool,
  page: PagePropTypes,
  templates: TemplatesPropType,
  totalTemplates: PropTypes.number,
  search: PropTypes.string,
  templateActions: TemplateActionsPropType,
  view: ViewPropTypes,
};
export default Content;
