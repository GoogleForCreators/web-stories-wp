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
import { __ } from '@wordpress/i18n';

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
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../../constants';
import {
  ViewPropTypes,
  PagePropTypes,
  SearchPropTypes,
} from '../../../../utils/useTemplateView';
import { TemplatesPropType } from '../../../../types';
import FontProvider from '../../../font/fontProvider';
import { StoryGridView } from '../../shared';
import EmptyView from './emptyView';

function Content({
  allPagesFetched,
  isLoading,
  page,
  templates,
  view,
  totalTemplates,
  search,
}) {
  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider pageSize={view.pageSize}>
            <StandardViewContentGutter>
              {totalTemplates > 0 ? (
                <>
                  <StoryGridView
                    stories={templates}
                    centerActionLabelByStatus={
                      TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS
                    }
                    bottomActionLabel={__('Use template', 'web-stories')}
                    isTemplate
                    pageSize={view.pageSize}
                  />
                  <InfiniteScroller
                    canLoadMore={!allPagesFetched}
                    isLoading={isLoading}
                    allDataLoadedMessage={__(
                      'No more templates',
                      'web-stories'
                    )}
                    onLoadMore={page.requestNextPage}
                  />
                </>
              ) : (
                <EmptyView searchKeyword={search.keyword} />
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
  view: ViewPropTypes,
};
export default Content;
