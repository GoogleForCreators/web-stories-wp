/*
 * Copyright 2022 Google LLC
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
import { default as createVanillaStore } from 'zustand/vanilla';
import create from 'zustand';
import shallow from 'zustand/shallow';

const store = createVanillaStore((set, get) => ({
  addSlice: (name, slice) => set({ [name]: slice(set, get) }),
}));

const { getState, subscribe, destroy } = store;

const addSlice = (name, slice) => getState().addSlice(name, slice);
const select = (sliceName) =>
  sliceName ? getState()[sliceName].state : getState();
const dispatch = (sliceName) => getState()[sliceName]?.actions;

const useStore = create(store);
const useSelect = (sliceName, callback, equalityFn = shallow) => {
  return useStore((data) => callback(data[sliceName].state), equalityFn);
};

export { select, dispatch, addSlice, subscribe, destroy, useSelect };
