import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSendMaxModeState,
  isSendFormInvalid,
  toggleSendMaxMode,
} from '../../../../../ducks/send';
import { useI18nContext } from '../../../../../hooks/useI18nContext';

export default function AmountMaxButton() {
  const isDraftTransactionInvalid = useSelector(isSendFormInvalid);
  const maxModeOn = useSelector(getSendMaxModeState);
  const dispatch = useDispatch();
  const t = useI18nContext();

  const onMaxClick = () => {
    dispatch(toggleSendMaxMode());
  };

  const disabled = isDraftTransactionInvalid;

  return (
    <button
      className="send-v2__amount-max"
      disabled={disabled}
      onClick={onMaxClick}
    >
      <input type="checkbox" checked={maxModeOn} readOnly />
      <div
        className={classnames('send-v2__amount-max__button', {
          'send-v2__amount-max__button__disabled': disabled,
        })}
      >
        {t('max')}
      </div>
    </button>
  );
}
