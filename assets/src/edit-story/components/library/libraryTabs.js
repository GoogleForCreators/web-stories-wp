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
 * Internal dependencies
 */
import useLibrary from './useLibrary';
import {Tabs, Media, Text, Shapes, Links} from './tabs';

function LibraryTabs() {
  const {
    state: {tab},
    actions: {setTab},
    data: {
      tabs: {MEDIA, TEXT, SHAPES, LINKS},
    },
  } = useLibrary();
  const tabs = [
    [MEDIA, Media],
    [TEXT, Text],
    [SHAPES, Shapes],
    [LINKS, Links],
  ];
  return (
    <Tabs>
      {tabs.map(([id, Tab]) => (
        <Tab key={id} isActive={tab === id} onClick={() => setTab(id)} />
      ))}
    </Tabs>
  );
}

export default LibraryTabs;
