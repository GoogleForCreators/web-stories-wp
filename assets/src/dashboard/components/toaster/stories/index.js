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
  const [toastIndexToAdd, setToastIndexToAdd] = useState(0);
  const alerts = [
    {
      message: {
        body: 'I am an error reason.',
        title: 'Error Saving Story',
      },
      severity: ALERT_SEVERITY.ERROR,
      id: Date.now(),
    },
    {
      message: {
        body: 'I am a second error.',
        title: 'Unable to Save Story',
      },
      severity: ALERT_SEVERITY.ERROR,
      id: Date.now(),
    },
    {
      message: {
        body: 'I am just here for fun.',
        title: 'Just Dropping By',
      },
      severity: ALERT_SEVERITY.INFO,
      id: Date.now(),
    },
    {
      message: {
        body: 'Seems like things are not bueno.',
        title: 'Connection Unstable',
      },
      severity: ALERT_SEVERITY.WARNING,
      id: Date.now(),
    },
    {
      message: {
        body: 'Everything is successful and peachy!',
        title: 'Story Title Updated',
      },
      severity: ALERT_SEVERITY.SUCCESS,
      id: Date.now(),
    },
  ];
  const totalAlerts = alerts.length - 1;
  return (
    <ToastProvider>
      <ToasterContext.Consumer>
        {({ state, actions }) => (
          <>
            <Button
              onClick={() => {
                actions.addToast({
                  ...alerts[toastIndexToAdd],
                });
                setToastIndexToAdd(toastIndexToAdd + 1);
              }}
              isDisabled={toastIndexToAdd > totalAlerts}
            >
              {toastIndexToAdd > totalAlerts
                ? 'No more practice alerts'
                : 'Add practice alert'}
            </Button>
            <Toaster
              isAllowEarlyDismiss={boolean('isAllowEarlyDismiss')}
              activeToasts={state.activeToasts}
              handleRemoveToast={actions.removeToast}
            />
          </>
        )}
      </ToasterContext.Consumer>
    </ToastProvider>
  );
};
