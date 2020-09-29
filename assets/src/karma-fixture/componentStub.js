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
import React, { useState, useMemo, forwardRef } from 'react';
import { act } from '@testing-library/react';

export default class ComponentStub {
  constructor(fixture, Component, matcher) {
    this._fixture = fixture;
    this._matcher = matcher;
    this._implementation = null;

    this._props = null;

    let setRefresher;
    this._refresh = () => {
      act(() => {
        if (setRefresher) {
          setRefresher((v) => v + 1);
        }
      });
    };

    const pendingHooks = [];
    this._pushPendingHook = (func) => {
      let resolver;
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      pendingHooks.push(() => {
        const result = func();
        resolver(result);
      });
      this._refresh();
      return promise;
    };

    const Wrapper = forwardRef((props, ref) => {
      this._props = props;

      const [refresher, setRefresherInternal] = useState(0);
      setRefresher = setRefresherInternal;
      const hooks = useMemo(
        () => {
          const hooksToExecute = pendingHooks.slice(0);
          pendingHooks.length = 0;
          return hooksToExecute;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresher]
      );

      const Impl = useMemo(
        () => {
          if (this._implementation) {
            const MockImpl = forwardRef((fProps, fRef) =>
              this._implementation(fProps, fRef)
            );
            MockImpl.displayName = `Stub(${
              Component.displayName || Component.name || ''
            })`;
            return MockImpl;
          }
          return Component;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresher]
      );

      return (
        <>
          <HookExecutor key={refresher} hooks={hooks} />
          <Impl _wrapped={true} ref={ref} {...props} />
        </>
      );
    });
    Wrapper.displayName = `Mock(${
      Component.displayName || Component.name || ''
    })`;
    this._wrapper = Wrapper;
  }

  get and() {
    return this;
  }

  get props() {
    return this._props;
  }

  mockImplementation(implementation) {
    this._implementation = implementation;
    this._refresh();
    return this;
  }

  callFake(implementation) {
    return this.mockImplementation(implementation);
  }

  renderHook(func) {
    return this._fixture.act(() => this._pushPendingHook(func));
  }
}

/* eslint-disable react/prop-types, react/jsx-no-useless-fragment */
function HookExecutor({ hooks }) {
  hooks.forEach((func) => func());
  return <></>;
}
/* eslint-enable react/prop-types, react/jsx-no-useless-fragment */
