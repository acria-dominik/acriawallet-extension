import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/button';
import LoadingScreen from '../../ui/loading-screen';
import { SECOND } from '../../../../shared/constants/time';

export default class LoadingNetworkScreen extends PureComponent {
  state = {
    showErrorScreen: false,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    loadingMessage: PropTypes.string,
    cancelTime: PropTypes.number,
    provider: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    providerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showNetworkDropdown: PropTypes.func,
    setProviderArgs: PropTypes.array,
    setProviderType: PropTypes.func,
    rollbackToPreviousProvider: PropTypes.func,
    isNetworkLoading: PropTypes.bool,
    showDeprecatedRpcUrlWarning: PropTypes.bool,
  };

  componentDidMount = () => {
    this.cancelCallTimeout = setTimeout(
      this.cancelCall,
      this.props.cancelTime || SECOND * 15,
    );
  };

  getConnectingLabel = function (loadingMessage) {
    if (loadingMessage) {
      return loadingMessage;
    }
    const { provider, providerId } = this.props;
    const providerName = provider.type;

    let name;

    if (providerName === 'mainnet') {
      name = this.context.t('connectingToMainnet');
    } else if (providerName === 'goerli') {
      name = this.context.t('connectingToGoerli');
    } else if (providerName === 'sepolia') {
      name = this.context.t('connectingToSepolia');
    } else {
      name = this.context.t('connectingTo', [providerId]);
    }

    return name;
  };

  renderDeprecatedRpcUrlWarning = () => {
    const { showNetworkDropdown } = this.props;

    return (
      <div className="loading-overlay__error-screen">
        <span className="loading-overlay__emoji">&#128542;</span>
        <span>{this.context.t('currentRpcUrlDeprecated')}</span>
        <div className="loading-overlay__error-buttons">
          <Button
            type="secondary"
            onClick={() => {
              window.clearTimeout(this.cancelCallTimeout);
              showNetworkDropdown();
            }}
          >
            {this.context.t('switchNetworks')}
          </Button>
        </div>
      </div>
    );
  };

  renderErrorScreenContent = () => {
    const { showNetworkDropdown, setProviderArgs, setProviderType } =
      this.props;

    return (
      <div className="loading-overlay__error-screen">
        <span className="loading-overlay__emoji">&#128542;</span>
        <span>{this.context.t('somethingWentWrong')}</span>
        <div className="loading-overlay__error-buttons">
          <Button
            type="secondary"
            onClick={() => {
              window.clearTimeout(this.cancelCallTimeout);
              showNetworkDropdown();
            }}
          >
            {this.context.t('switchNetworks')}
          </Button>

          <Button
            type="primary"
            onClick={() => {
              this.setState({ showErrorScreen: false });
              setProviderType(...setProviderArgs);
              window.clearTimeout(this.cancelCallTimeout);
              this.cancelCallTimeout = setTimeout(
                this.cancelCall,
                this.props.cancelTime || SECOND * 15,
              );
            }}
          >
            {this.context.t('tryAgain')}
          </Button>
        </div>
      </div>
    );
  };

  cancelCall = () => {
    const { isNetworkLoading } = this.props;

    if (isNetworkLoading) {
      this.setState({ showErrorScreen: true });
    }
  };

  componentDidUpdate = (prevProps) => {
    const { provider } = this.props;
    const { provider: prevProvider } = prevProps;
    if (provider.type !== prevProvider.type) {
      window.clearTimeout(this.cancelCallTimeout);
      this.setState({ showErrorScreen: false });
      this.cancelCallTimeout = setTimeout(
        this.cancelCall,
        this.props.cancelTime || SECOND * 15,
      );
    }
  };

  componentWillUnmount = () => {
    window.clearTimeout(this.cancelCallTimeout);
  };

  render() {
    const { rollbackToPreviousProvider, showDeprecatedRpcUrlWarning } =
      this.props;

    let loadingMessageToRender;
    if (this.state.showErrorScreen) {
      loadingMessageToRender = this.renderErrorScreenContent();
    } else if (showDeprecatedRpcUrlWarning) {
      loadingMessageToRender = this.renderDeprecatedRpcUrlWarning();
    } else {
      loadingMessageToRender = this.getConnectingLabel(
        this.props.loadingMessage,
      );
    }

    return (
      <LoadingScreen
        header={
          <div
            className="page-container__header-close"
            onClick={rollbackToPreviousProvider}
          />
        }
        showLoadingSpinner={!this.state.showErrorScreen}
        loadingMessage={loadingMessageToRender}
      />
    );
  }
}
