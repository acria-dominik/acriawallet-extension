import EventEmitter from 'safe-event-emitter';
import ExtensionPlatform from '../platforms/extension';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;

export const NOTIFICATION_MANAGER_EVENTS = {
  POPUP_CLOSED: 'onPopupClosed',
};

/**
 * A collection of methods for controlling the showing and hiding of the notification popup.
 */
export default class NotificationManager extends EventEmitter {
  constructor() {
    super();
    this.platform = new ExtensionPlatform();
    this.platform.addOnRemovedListener(this._onWindowClosed.bind(this));
  }

  /**
   * Mark the notification popup as having been automatically closed.
   *
   * This lets us differentiate between the cases where we close the
   * notification popup v.s. when the user closes the popup window directly.
   */
  markAsAutomaticallyClosed() {
    this._popupAutomaticallyClosed = true;
  }

  /**
   * Either brings an existing Acria Wallet notification window into focus, or creates a new notification window. New
   * notification windows are given a 'popup' type.
   *
   */
  async showPopup() {
    const popup = await this._getPopup();

    // Bring focus to chrome popup
    if (popup) {
      // bring focus to existing chrome popup
      await this.platform.focusWindow(popup.id);
    } else {
      let left = 0;
      let top = 0;
      try {
        const lastFocused = await this.platform.getLastFocusedWindow();
        // Position window in top right corner of lastFocused window.
        top = lastFocused.top;
        left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
      } catch (_) {
        // The following properties are more than likely 0, due to being
        // opened from the background chrome process for the extension that
        // has no physical dimensions
        const { screenX, screenY, outerWidth } = window;
        top = Math.max(screenY, 0);
        left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
      }

      // create new notification popup
      const popupWindow = await this.platform.openWindow({
        url: 'notification.html',
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top,
      });

      // Firefox currently ignores left/top for create, but it works for update
      if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
        await this.platform.updateWindowPosition(popupWindow.id, left, top);
      }
      this._popupId = popupWindow.id;
    }
  }

  _onWindowClosed(windowId) {
    if (windowId === this._popupId) {
      this._popupId = undefined;
      this.emit(NOTIFICATION_MANAGER_EVENTS.POPUP_CLOSED, {
        automaticallyClosed: this._popupAutomaticallyClosed,
      });
      this._popupAutomaticallyClosed = undefined;
    }
  }

  /**
   * Checks all open Acria Wallet windows, and returns the first one it finds that is a notification window (i.e. has the
   * type 'popup')
   *
   * @private
   */
  async _getPopup() {
    const windows = await this.platform.getAllWindows();
    return this._getPopupIn(windows);
  }

  /**
   * Given an array of windows, returns the 'popup' that has been opened by Acria Wallet, or null if no such window exists.
   *
   * @private
   * @param {Array} windows - An array of objects containing data about the open Acria Wallet extension windows.
   */
  _getPopupIn(windows) {
    return windows
      ? windows.find((win) => {
          // Returns notification popup
          return win && win.type === 'popup' && win.id === this._popupId;
        })
      : null;
  }
}
