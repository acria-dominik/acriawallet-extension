import { connect } from 'react-redux';
import {
  displayWarning,
  requestRevealSeedWords,
  fetchInfoToSync,
  exportAccounts,
  hideWarning,
} from '../../store/actions';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import { getAcriaWalletKeyrings } from '../../selectors';
import MobileSyncPage from './mobile-sync.component';

const mapDispatchToProps = (dispatch) => {
  return {
    requestRevealSeedWords: (password) =>
      dispatch(requestRevealSeedWords(password)),
    fetchInfoToSync: () => dispatch(fetchInfoToSync()),
    displayWarning: (message) => dispatch(displayWarning(message || null)),
    exportAccounts: (password, addresses) =>
      dispatch(exportAccounts(password, addresses)),
    hideWarning: () => dispatch(hideWarning()),
  };
};

const mapStateToProps = (state) => {
  const {
    metamask: { selectedAddress },
  } = state;

  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    selectedAddress,
    keyrings: getAcriaWalletKeyrings(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileSyncPage);
