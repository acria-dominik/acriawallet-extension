const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const PendingTxDetails = require('./pending-typed-msg-details')
const t = require('../../i18n')

module.exports = PendingMsg

inherits(PendingMsg, Component)
function PendingMsg () {
  Component.call(this)
}

PendingMsg.prototype.render = function () {
  var state = this.props
  var msgData = state.txData

  return (

    h('div', {
      key: msgData.id,
    }, [

      // header
      h('h3', {
        style: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
      }, t('signMessage')),

      // message details
      h(PendingTxDetails, state),

      // sign + cancel
      h('.flex-row.flex-space-around', [
        h('button.allcaps', {
          onClick: state.cancelTypedMessage,
        }, t('cancel')),
        h('button.allcaps', {
          onClick: state.signTypedMessage,
        }, t('sign')),
      ]),
    ])

  )
}
