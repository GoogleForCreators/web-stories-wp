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
import moment from 'moment';

const formattedTemplatesArray = [
  {
    bottomTargetAction: () => {},
    centerTargetAction: 'template-detail?id=2&isLocal=false',
    createdBy: 'Google Web Stories',
    description:
      'Maecenas ultrices tortor nibh, eu consequat magna maximus non. Quisque nec tellus lacus.',
    id: 2,
    isLocal: false,
    modified: moment('04-04-2020', 'MM-DD-YYYY'),
    pages: [
      {
        backgroundElementId: '900a850f-fb71-4262-84f0-d6b803224ac7',
        elements: [],
        id: 'dd6a669f-ff4b-4633-8eb4-c601e98b40f1',
        type: 'page',
      },
    ],
    status: 'template',
    tags: ['Delicious', 'Baker', 'Cook'],
    title: 'Cooking',
  },
];

export default formattedTemplatesArray;
