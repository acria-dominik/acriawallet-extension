import {
  GOERLI,
  GOERLI_CHAIN_ID,
  MAINNET,
  MAINNET_CHAIN_ID,
  NETWORK_TYPE_RPC,
} from '../../../shared/constants/network';
import migration52 from './052';

const TOKEN1 = { symbol: 'TST', address: '0x10', decimals: 18 };
const TOKEN2 = { symbol: 'TXT', address: '0x11', decimals: 18 };
const TOKEN3 = { symbol: 'TVT', address: '0x12', decimals: 18 };
const TOKEN4 = { symbol: 'TAT', address: '0x13', decimals: 18 };

describe('migration #52', () => {
  it('should update the version metadata', async () => {
    const oldStorage = {
      meta: {
        version: 52,
      },
      data: {},
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({
      version: 52,
    });
  });

  it(`should move ${MAINNET} tokens and hidden tokens to be keyed by ${MAINNET_CHAIN_ID} for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              [MAINNET]: [TOKEN1],
            },
            '0x1112': {
              [MAINNET]: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              [MAINNET]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [MAINNET]: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        accountHiddenTokens: {
          '0x1111': {
            [MAINNET_CHAIN_ID]: [TOKEN1],
          },
          '0x1112': {
            [MAINNET_CHAIN_ID]: [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            [MAINNET_CHAIN_ID]: [TOKEN1, TOKEN2],
          },
          '0x1112': {
            [MAINNET_CHAIN_ID]: [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should move rinkeby tokens and hidden tokens to be keyed by '0x4' for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              rinkeby: [TOKEN1],
            },
            '0x1112': {
              rinkeby: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              rinkeby: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              rinkeby: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        accountHiddenTokens: {
          '0x1111': {
            '0x4': [TOKEN1],
          },
          '0x1112': {
            '0x4': [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            '0x4': [TOKEN1, TOKEN2],
          },
          '0x1112': {
            '0x4': [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should move kovan tokens and hidden tokens to be keyed by 0x2a for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              kovan: [TOKEN1],
            },
            '0x1112': {
              kovan: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              kovan: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              kovan: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        accountHiddenTokens: {
          '0x1111': {
            '0x2a': [TOKEN1],
          },
          '0x1112': {
            '0x2a': [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            '0x2a': [TOKEN1, TOKEN2],
          },
          '0x1112': {
            '0x2a': [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should move ${GOERLI} tokens and hidden tokens to be keyed by ${GOERLI_CHAIN_ID} for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              [GOERLI]: [TOKEN1],
            },
            '0x1112': {
              [GOERLI]: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              [GOERLI]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [GOERLI]: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        accountHiddenTokens: {
          '0x1111': {
            [GOERLI_CHAIN_ID]: [TOKEN1],
          },
          '0x1112': {
            [GOERLI_CHAIN_ID]: [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            [GOERLI_CHAIN_ID]: [TOKEN1, TOKEN2],
          },
          '0x1112': {
            [GOERLI_CHAIN_ID]: [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should move ropsten tokens and hidden tokens to be keyed by 0x3 for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              ropsten: [TOKEN1],
            },
            '0x1112': {
              ropsten: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              ropsten: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              ropsten: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        accountHiddenTokens: {
          '0x1111': {
            '0x3': [TOKEN1],
          },
          '0x1112': {
            '0x3': [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            '0x3': [TOKEN1, TOKEN2],
          },
          '0x1112': {
            '0x3': [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should duplicate ${NETWORK_TYPE_RPC} tokens and hidden tokens to all custom networks for each address`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          frequentRpcListDetail: [
            { chainId: '0xab' },
            { chainId: '0x12' },
            { chainId: '0xfa' },
          ],
          accountHiddenTokens: {
            '0x1111': {
              [NETWORK_TYPE_RPC]: [TOKEN1],
            },
            '0x1112': {
              [NETWORK_TYPE_RPC]: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              [NETWORK_TYPE_RPC]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [NETWORK_TYPE_RPC]: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        frequentRpcListDetail: [
          { chainId: '0xab' },
          { chainId: '0x12' },
          { chainId: '0xfa' },
        ],
        accountHiddenTokens: {
          '0x1111': {
            '0xab': [TOKEN1],
            '0x12': [TOKEN1],
            '0xfa': [TOKEN1],
          },
          '0x1112': {
            '0xab': [TOKEN3],
            '0x12': [TOKEN3],
            '0xfa': [TOKEN3],
          },
        },
        accountTokens: {
          '0x1111': {
            '0xab': [TOKEN1, TOKEN2],
            '0x12': [TOKEN1, TOKEN2],
            '0xfa': [TOKEN1, TOKEN2],
          },
          '0x1112': {
            '0xab': [TOKEN1, TOKEN3],
            '0x12': [TOKEN1, TOKEN3],
            '0xfa': [TOKEN1, TOKEN3],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`should overwrite ${NETWORK_TYPE_RPC} tokens with built in networks if chainIds match`, async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          frequentRpcListDetail: [{ chainId: '0x1' }],
          accountHiddenTokens: {
            '0x1111': {
              [NETWORK_TYPE_RPC]: [TOKEN3],
              [MAINNET]: [TOKEN1],
            },
          },
          accountTokens: {
            '0x1111': {
              [NETWORK_TYPE_RPC]: [TOKEN1, TOKEN2],
              [MAINNET]: [TOKEN3, TOKEN4],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      PreferencesController: {
        frequentRpcListDetail: [{ chainId: '0x1' }],
        accountHiddenTokens: {
          '0x1111': {
            '0x1': [TOKEN1],
          },
        },
        accountTokens: {
          '0x1111': {
            '0x1': [TOKEN3, TOKEN4],
          },
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it('should do nothing if no PreferencesController key', async () => {
    const oldStorage = {
      meta: {},
      data: {
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      foo: 'bar',
    });
  });
});
