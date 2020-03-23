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
import { useCallback, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import { useTheme } from '../../theme';
import createSolidFromString from '../../utils/createSolidFromString';
import { Color } from '../form';
import { SimplePanel } from './panel';

function PageBackgroundPanel() {
  const {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  } = useStory();
  const theme = useTheme();
  const currentBackground = useMemo(() => {
    if (currentPage?.backgroundColor) {
      return currentPage?.backgroundColor;
    }
    return createSolidFromString(theme.colors.fg.v1);
  }, [currentPage, theme.colors.fg.v1]);
  const handleChange = useCallback(
    (value) => {
      updateCurrentPageProperties({ properties: { backgroundColor: value } });
    },
    [updateCurrentPageProperties]
  );
  return (
    <SimplePanel name="pagebackground" title={__('Page', 'web-stories')}>
      <Color
        hasGradient
        hasOpacity={false}
        value={currentBackground}
        onChange={handleChange}
        label={__('Current page color', 'web-stories')}
      />
    </SimplePanel>
  );
}

export default PageBackgroundPanel;
