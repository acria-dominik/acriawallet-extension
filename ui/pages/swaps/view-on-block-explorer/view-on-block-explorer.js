import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '../../../components/ui/box';
import { I18nContext } from '../../../contexts/i18n';
import { getURLHostName } from '../../../helpers/utils/util';

export default function ViewOnBlockExplorer({ blockExplorerUrl }) {
  const t = useContext(I18nContext);
  const blockExplorerHostName = getURLHostName(blockExplorerUrl);

  return (
    <Box marginTop={6} className="view-on-block-explorer">
      <button
        onClick={() => {
          global.platform.openTab({ url: blockExplorerUrl });
        }}
      >
        {t('viewOnCustomBlockExplorer', [
          t('blockExplorerSwapAction'),
          blockExplorerHostName,
        ])}
      </button>
    </Box>
  );
}

ViewOnBlockExplorer.propTypes = {
  blockExplorerUrl: PropTypes.string.isRequired,
};
