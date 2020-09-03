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
import { useState } from 'react';
import { number, boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import TextArea from '../textArea';

export default {
  title: 'Stories Editor/Components/Form/TextArea',
  component: TextArea,
};

export const _default = () => {
  const [value, setValue] = useState('');

  const placeholder = text('Placeholder', 'Write some text');
  const maxLength = number('Max Character Count', 100);
  const rows = number('Text Rows', 4);
  const showTextLimit = boolean('Toggle Character Limit Label', true);

  return (
    <div
      style={{ width: '300px', backgroundColor: '#444', borderRadius: '4px' }}
    >
      <TextArea
        value={value}
        onTextChange={setValue}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        showTextLimit={showTextLimit}
      />
    </div>
  );
};
