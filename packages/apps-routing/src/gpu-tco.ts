// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-gpu-tco';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'developer',
    icon: 'server',
    name: 'gpu-tco',
    text: t('nav.gpu-tco', 'GPU TCO', { ns: 'apps-routing' })
  };
}
