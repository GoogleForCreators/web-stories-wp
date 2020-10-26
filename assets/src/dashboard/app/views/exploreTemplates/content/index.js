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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../../edit-story/units';
import { TransformProvider } from '../../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
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
            <StandardViewContentGutter>
              {totalTemplates > 0 ? (
                <>
                  <TemplateGridView
                    templates={templates}
                    pageSize={view.pageSize}
                    templateActions={templateActions}
                  />
                  <InfiniteScroller
                    canLoadMore={!allPagesFetched}
                    isLoading={isLoading}
                    allDataLoadedMessage={__(
                      'No more templates',
                      'web-stories'
                    )}
                    allDataLoadedAriaMessage={__(
                      'All templates are loaded',
                      'web-stories'
                    )}
                    loadingAriaMessage={__(
                      'Loading more templates',
                      'web-stories'
                    )}
                    onLoadMore={page.requestNextPage}
                  />
                </>
              ) : (
                <EmptyContentMessage>
                  {search?.keyword
                    ? sprintf(
                        /* translators: %s: search term. */
                        __(
                          'Sorry, we couldn\'t find any results matching "%s"',
                          'web-stories'
                        ),
                        search.keyword
                      )
                    : __('No templates currently available', 'web-stories')}
                </EmptyContentMessage>
              )}
            </StandardViewContentGutter>
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
