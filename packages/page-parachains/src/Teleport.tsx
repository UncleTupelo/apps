// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Option } from '@polkadot/apps-config/settings/types';
import type { XcmVersionedMultiLocation } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { getTeleportWeight } from '@polkadot/apps-config';
import { Button, ChainImg, Dropdown, InputAddress, InputBalance, MarkWarning, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useApiUrl, useTeleport, useWeightFee } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ZERO, isFunction } from '@polkadot/util';

import { deleteTeleportSession, generateSessionId, loadTeleportSession, markSessionCompleted, saveTeleportSession } from './teleportSessions';
import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
  sessionId?: string;
}

const INVALID_PARAID = Number.MAX_SAFE_INTEGER;
const XCM_LOC = ['xcm', 'xcmPallet', 'polkadotXcm'];
const XCM_FNS = ['limitedTeleportAssets', 'teleportAssets'];

function createOption ({ info, paraId, text }: LinkOption): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={paraId}
      >
        <ChainImg
          className='ui--Dropdown-icon'
          logo={info}
        />
        <div className='ui--Dropdown-name'>{text}</div>
      </div>
    ),
    value: paraId || -1
  };
}

function Teleport ({ onClose, sessionId: propSessionId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [recipientParaId, setParaId] = useState(INVALID_PARAID);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(propSessionId || null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const { allowTeleport, destinations, isParaTeleport, oneWay } = useTeleport();

  // Load session data if sessionId is provided
  useEffect((): void => {
    if (currentSessionId) {
      const session = loadTeleportSession(currentSessionId);

      if (session && !session.completed) {
        setSenderId(session.senderId);
        setRecipientId(session.recipientId);
        setParaId(session.recipientParaId);
        setAmount(session.amount ? new BN(session.amount) : BN_ZERO);
        setSessionSaved(true);
      }
    }
  }, [currentSessionId]);

  const handleSaveSession = (): void => {
    const sessionId = currentSessionId || generateSessionId();

    saveTeleportSession({
      amount: amount?.toString() || '0',
      id: sessionId,
      recipientId,
      recipientParaId,
      senderId,
      timestamp: Date.now()
    });

    setCurrentSessionId(sessionId);
    setSessionSaved(true);
  };

  const handleClearSession = (): void => {
    if (currentSessionId) {
      deleteTeleportSession(currentSessionId);
    }

    setCurrentSessionId(null);
    setSessionSaved(false);
    setSenderId(null);
    setRecipientId(null);
    setAmount(BN_ZERO);
    setParaId(INVALID_PARAID);
  };

  const handleTeleportSuccess = (): void => {
    if (currentSessionId) {
      markSessionCompleted(currentSessionId);
    }

    onClose();
  };

  const [destWeight, call] = useMemo(
    (): [number, SubmittableExtrinsicFunction<'promise'>] => {
      const m = XCM_LOC.filter((x) => api.tx[x] && XCM_FNS.some((f) => isFunction(api.tx[x][f])))[0];
      const f = XCM_FNS.filter((f) => isFunction(api.tx[m][f]))[0];

      return [
        getTeleportWeight(api),
        api.tx[m][f]
      ];
    },
    [api]
  );

  const chainOpts = useMemo(
    () => destinations.map(createOption),
    [destinations]
  );

  const url = useMemo(
    () => destinations.find(({ paraId }, index) =>
      recipientParaId === -1
        ? index === 0
        : recipientParaId === paraId
    )?.value as string,
    [destinations, recipientParaId]
  );

  const destApi = useApiUrl(url);
  const weightFee = useWeightFee(destWeight, destApi);

  const params = useMemo(
    () => {
      // From Polkadot runtime 9110 (no destination weight)
      // Get first item, it should have V0, V1, ...
      const firstType = api.createType<XcmVersionedMultiLocation>(call.meta.args[0].type.toString());
      const isCurrent = firstType.defKeys.includes('V1');

      const dst = isParaTeleport
        ? { X1: 'Parent' }
        : { X1: { ParaChain: recipientParaId } };
      const acc = { X1: { AccountId32: { id: api.createType('AccountId32', recipientId).toHex(), network: 'Any' } } };
      const ass = isParaTeleport
        ? [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }]
        // forgo id - 'Here' for 9100, 'Null' for 9110 (both is the default enum value)
        : [{ ConcreteFungible: { amount } }];

      return isCurrent
        ? call.meta.args.length === 5
          // with weight
          ? call.method === 'limitedTeleportAssets'
            ? [{ V0: dst }, { V0: acc }, { V0: ass }, 0, { Unlimited: null }]
            : [{ V0: dst }, { V0: acc }, { V0: ass }, 0, destWeight]
          // without weight
          : [{ V0: dst }, { V0: acc }, { V0: ass }, 0]
        : [dst, acc, ass, destWeight];
    },
    [api, amount, call, destWeight, isParaTeleport, recipientId, recipientParaId]
  );

  const hasAvailable = !!amount && amount.gte(weightFee);

  return (
    <Modal
      header={t<string>('Teleport assets')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
          <InputAddress
            label={t<string>('send from account')}
            labelExtra={
              <Available
                label={t<string>('transferrable')}
                params={senderId}
              />
            }
            onChange={setSenderId}
            type='account'
            value={senderId}
          />
        </Modal.Columns>
        {chainOpts.length !== 0 && (
          <Modal.Columns hint={t<string>('The destination chain for this asset teleport. The transferred value will appear on this chain.')}>
            <Dropdown
              label={t<string>('destination chain')}
              onChange={setParaId}
              options={chainOpts}
              value={recipientParaId === INVALID_PARAID ? chainOpts[0]?.value : recipientParaId}
            />
            {!isParaTeleport && oneWay.includes(recipientParaId) && (
              <MarkWarning content={t<string>('Currently this is a one-way transfer since the on-chain runtime functionality to send the funds from the destination chain back to this account not yet available.')} />
            )}
          </Modal.Columns>
        )}
        <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred amount when the transaction is included in a block.')}>
          <InputAddress
            label={t<string>('send to address')}
            onChange={setRecipientId}
            type='allPlus'
            value={recipientId}
          />
        </Modal.Columns>
        <Modal.Columns
          hint={
            <>
              <p>{t<string>('If the recipient account is new, the balance needs to be more than the existential deposit on the recipient chain.')}</p>
              <p>{t<string>('The amount deposited to the recipient will be net the calculated cross-chain fee.')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            isError={!hasAvailable}
            isZeroable
            label={t<string>('amount')}
            onChange={setAmount}
            value={amount}
          />
          {destApi
            ? (
              <>
                <InputBalance
                  defaultValue={weightFee}
                  isDisabled
                  label={t<string>('destination transfer fee')}
                />
                <InputBalance
                  defaultValue={destApi.consts.balances.existentialDeposit}
                  isDisabled
                  label={t<string>('destination existential deposit')}
                />
              </>
            )
            : (
              <Spinner
                label={t<string>('Retrieving destination chain fees')}
                variant='appPadded'
              />
            )
          }
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='save'
          isDisabled={!senderId || !recipientId || !amount}
          label={sessionSaved ? t<string>('Session Saved') : t<string>('Save Session')}
          onClick={handleSaveSession}
        />
        {sessionSaved && (
          <Button
            icon='trash'
            label={t<string>('Clear Session')}
            onClick={handleClearSession}
          />
        )}
        {currentSessionId && (
          <div style={{ fontSize: '0.9em', opacity: 0.7, padding: '0 1em' }}>
            Session ID: {currentSessionId}
          </div>
        )}
        <TxButton
          accountId={senderId}
          icon='share-square'
          isDisabled={!allowTeleport || !hasAvailable || !recipientId || !amount || !destApi || (!isParaTeleport && recipientParaId === INVALID_PARAID)}
          label={t<string>('Teleport')}
          onStart={handleTeleportSuccess}
          params={params}
          tx={call}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Teleport);
