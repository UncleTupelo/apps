// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import Teleport from './Teleport';

interface Props {
  onClose: () => void;
}

function TeleportWrapper ({ onClose }: Props): React.ReactElement<Props> {
  const location = useLocation();

  const sessionId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('session') || undefined;
  }, [location.search]);

  return (
    <Teleport
      onClose={onClose}
      sessionId={sessionId}
    />
  );
}

export default React.memo(TeleportWrapper);
