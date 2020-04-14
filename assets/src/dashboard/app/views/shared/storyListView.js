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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { StoriesPropType } from '../../../types';
import {
  PreviewPage,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '../../../components';

const PreviewContainer = styled.div`
  position: relative;
  top: -17px;
`;

const Title = styled.span`
  margin-left: 50px;
`;

export default function StoryListView({ filteredStories }) {
  return (
    <div style={{ width: '100%' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{__('Title', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>{__('Author', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>{__('Categories', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>{__('Tags', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>
              {__('Last Modified', 'web-stories')}
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStories.map((story) => (
            <TableRow key={`story-${story.id}`}>
              <TableCell>
                <PreviewContainer>
                  <PreviewPage page={story.pages[0]} />
                </PreviewContainer>
                <Title>{story.title}</Title>
              </TableCell>
              <TableCell>{__('—', 'web-stories')}</TableCell>
              <TableCell>{__('—', 'web-stories')}</TableCell>
              <TableCell>{__('—', 'web-stories')}</TableCell>
              <TableCell>{story.modified.startOf('day').fromNow()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

StoryListView.propTypes = {
  filteredStories: StoriesPropType,
};
