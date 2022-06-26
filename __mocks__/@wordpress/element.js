/*
 * Copyright 2021 Google LLC
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
// eslint-disable-next-line import/no-extraneous-dependencies -- Available via @wordpress/element itself.
import {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement,
  createRef,
  forwardRef,
  Fragment,
  isValidElement,
  memo,
  StrictMode,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  lazy,
  Suspense,
  Context,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Available via @wordpress/element itself.
import { render, createPortal } from 'react-dom';

const Platform = {
  OS: 'web',
};

const concatChildren = jest.fn();
const createInterpolateElement = (string) => string;
const RawHTML = jest.fn(({ children, className }) => (
  <div className={className}>{children}</div>
));

export {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement,
  createRef,
  forwardRef,
  Fragment,
  isValidElement,
  memo,
  StrictMode,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  lazy,
  Suspense,
  Context,
  render,
  createPortal,
  Platform,
  concatChildren,
  createInterpolateElement,
  RawHTML,
};
