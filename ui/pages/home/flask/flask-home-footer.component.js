import React from 'react';

import { SUPPORT_REQUEST_LINK } from '../../../helpers/constants/common';
import { useI18nContext } from '../../../hooks/useI18nContext';

const FlaskHomeFooter = () => {
  const t = useI18nContext();

  return (
    <>
      <a target="_blank" rel="noopener noreferrer" href={SUPPORT_REQUEST_LINK}>
        {t('needHelpSubmitTicket')}
      </a>{' '}
      |{' '}
      <a
        href="https://community.metamask.io/c/metamask-flask"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('needHelpFeedback')}
      </a>
    </>
  );
};

export default FlaskHomeFooter;
