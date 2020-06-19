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
import { boolean } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { ALERT_SEVERITY } from '../../../constants';
import { Button } from '../../';
import ToastProvider, { ToasterContext } from '../provider';
import Toaster from '../toaster';

export default {
  title: 'Dashboard/Components/Toaster',
  component: Toaster,
};

export const _default = () => {
  const [errorIndexToAdd, setErrorIndexToAdd] = useState(0);
  const errors = [
    { message: 'i am an error', severity: ALERT_SEVERITY.ERROR },
    { message: 'i am a second error', severity: ALERT_SEVERITY.ERROR },
    { message: 'i am just here for fun', severity: ALERT_SEVERITY.INFO },
    {
      message: 'seems like things are not bueno',
      severity: ALERT_SEVERITY.WARNING,
    },
    {
      message: 'Everything is successful and peachy!',
      severity: ALERT_SEVERITY.SUCCESS,
    },
  ];

  return (
    <ToastProvider>
      <ToasterContext.Consumer>
        {({ state, actions }) => {
          return (
            <>
              <Button
                onClick={() => {
                  setErrorIndexToAdd(errorIndexToAdd + 1);
                  actions.addToast({
                    ...errors[errorIndexToAdd],
                    errorId: errorIndexToAdd,
                  });
                }}
                isDisabled={errorIndexToAdd > 4}
              >
                {errorIndexToAdd > 4
                  ? 'No more practice alerts'
                  : 'Add practice alert'}
              </Button>
              <Toaster
                allowEarlyDismiss={boolean('allowEarlyDismiss')}
                activeToasts={state.activeToasts}
                onRemoveToastClick={actions.removeToast}
              />
            </>
          );
        }}
      </ToasterContext.Consumer>
    </ToastProvider>
  );
};
