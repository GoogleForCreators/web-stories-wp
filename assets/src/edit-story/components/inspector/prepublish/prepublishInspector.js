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
import { useState, useEffect } from 'react';
/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panels/panel';
import { useStory } from '../../../app';
import prepublishChecklist from '../../../app/prepublish';

function PrepublishInspector() {
  const { story, pages } = useStory(({ state: { story, pages } }) => ({
    story,
    pages,
  }));
  const [currentList, setCurrentList] = useState(
    prepublishChecklist({ ...story, pages })
  );

  useEffect(() => {
    setCurrentList(prepublishChecklist({ ...story, pages }));
  }, [pages, story]);

  return (
    <SimplePanel name="prepublish" title={__('Prepublish', 'web-stories')}>
      {JSON.stringify(currentList)}
    </SimplePanel>
  );
}

export default PrepublishInspector;
