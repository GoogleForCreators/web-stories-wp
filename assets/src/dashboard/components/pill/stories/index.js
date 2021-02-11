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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { TEMPLATE_COLOR_ITEMS } from '../../../constants';
import { PILL_LABEL_TYPES } from '../../../constants/components';
import Pill from '../';

export default {
  title: 'Dashboard/Components/Pill',
  component: Pill,
};

const TEMP_EDIT_PENCIL = (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2466 0.193333L11.8066 1.75333C12.0666 2.01333 12.0666 2.43333 11.8066 2.69333L10.5866 3.91333L8.08655 1.41333L9.30655 0.193333C9.43322 0.0666667 9.59988 0 9.77322 0C9.94655 0 10.1132 0.06 10.2466 0.193333ZM0 9.49833V11.9983H2.5L9.87333 4.625L7.37333 2.125L0 9.49833ZM1.94732 10.6651H1.33398V10.0517L7.37398 4.01172L7.98732 4.62505L1.94732 10.6651Z"
      fill="currentcolor"
    />
  </svg>
);

const categoryDemoData = [
  {
    label: __('All Categories', 'web-stories'),
    value: 'all',
    icon: TEMP_EDIT_PENCIL,
    selected: false,
  },
  {
    label: __('Arts and Crafts', 'web-stories'),
    value: 'arts_crafts',
    icon: TEMP_EDIT_PENCIL,
    selected: false,
  },
  {
    label: __('Beauty', 'web-stories'),
    value: 'beauty',
    icon: TEMP_EDIT_PENCIL,
    selected: true,
  },
  {
    label: __('Cooking', 'web-stories'),
    value: 'cooking',
    icon: TEMP_EDIT_PENCIL,
    selected: false,
  },
  { label: __('News', 'web-stories'), value: 'news', icon: TEMP_EDIT_PENCIL },
  {
    label: __('Sports', 'web-stories'),
    value: 'sports',
    icon: TEMP_EDIT_PENCIL,
    selected: false,
  },
  { label: __('News', 'web-stories'), value: 'news_2', icon: TEMP_EDIT_PENCIL },
  {
    label: __('UNCLICKABLE', 'web-stories'),
    value: 'unclickable',
    disabled: true,
    icon: TEMP_EDIT_PENCIL,
    selected: false,
  },
];

const DemoFieldSet = styled.fieldset`
  width: 550px;
  margin: 0;
  border: none;
  > label {
    margin: 0 16px 0 0;
  }
`;

const IconSpan = styled.span`
  color: purple;
  margin-right: 5px;
`;

export const _default = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(categoryDemoData);

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );
  return (
    <DemoFieldSet>
      {statefulDemoData.map(
        ({ icon, label, selected, value, disabled }, index) => {
          return (
            <Pill
              key={
                /* eslint-disable-next-line react/no-array-index-key */
                value + index
              }
              inputType="checkbox"
              name={value}
              onClick={(e, selectedValue) => {
                action('on click selected')(selectedValue);
                updateDemoDataState(selectedValue);
              }}
              value={value}
              isSelected={selected}
              disabled={disabled}
            >
              <IconSpan>{icon}</IconSpan> {text(`label: ${index}`, label)}
            </Pill>
          );
        }
      )}
    </DemoFieldSet>
  );
};

export const _floatingTabs = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(categoryDemoData);

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );

  return (
    <DemoFieldSet>
      {statefulDemoData.map(
        ({ icon, label, selected, value, disabled }, index) => {
          return (
            <Pill
              key={
                /* eslint-disable-next-line react/no-array-index-key */
                value + index
              }
              inputType="checkbox"
              labelType={PILL_LABEL_TYPES.FLOATING}
              name={value}
              onClick={(e, selectedValue) => {
                action('on click selected')(selectedValue);
                updateDemoDataState(selectedValue);
              }}
              value={value}
              isSelected={selected}
              disabled={disabled}
            >
              <IconSpan>{icon}</IconSpan> {text(`label: ${index}`, label)}
            </Pill>
          );
        }
      )}
    </DemoFieldSet>
  );
};

export const _radioGroup = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(categoryDemoData);

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return { ...item, selected: false };
      });
      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );
  return (
    <DemoFieldSet>
      {statefulDemoData.map(
        ({ disabled, label, selected = false, value }, index) => {
          return (
            <Pill
              key={
                /* eslint-disable-next-line react/no-array-index-key */
                value + index
              }
              inputType="radio"
              name="demo_radio"
              onClick={(e, selectedValue) => {
                action('on click selected')(selectedValue);
                updateDemoDataState(selectedValue);
              }}
              value={value}
              isSelected={selected}
              disabled={disabled}
            >
              {text(`label: ${index}`, label)}
            </Pill>
          );
        }
      )}
    </DemoFieldSet>
  );
};

export const _colorSwatches = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(
    TEMPLATE_COLOR_ITEMS
  );

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );

  return (
    <DemoFieldSet>
      {statefulDemoData.map(({ label, hex, value, selected }, index) => {
        return (
          <Pill
            ariaLabel={label}
            key={
              /* eslint-disable-next-line react/no-array-index-key */
              value + index
            }
            inputType="checkbox"
            labelType={PILL_LABEL_TYPES.SWATCH}
            hex={hex}
            name={value}
            onClick={(_, selectedValue) => {
              action('on click selected')(selectedValue);
              updateDemoDataState(selectedValue);
            }}
            value={value}
            isSelected={selected}
            disabled={boolean('disabled')}
          />
        );
      })}
    </DemoFieldSet>
  );
};
