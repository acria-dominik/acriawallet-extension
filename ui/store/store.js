import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from '../ducks';

export default function configureStore(initialState) {
  let storeEnhancers = applyMiddleware(thunkMiddleware);

  if (process.env.METAMASK_DEBUG && !process.env.IN_TEST) {
    const composeEnhancers = composeWithDevTools({
      name: 'AcriaWallet',
      hostname: 'localhost',
      port: 8000,
      realtime: Boolean(process.env.METAMASK_DEBUG),
    });
    storeEnhancers = composeEnhancers(storeEnhancers);
  }

  return createStore(rootReducer, initialState, storeEnhancers);
}
