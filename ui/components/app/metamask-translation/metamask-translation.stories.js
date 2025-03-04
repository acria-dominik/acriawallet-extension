import React from 'react';
import { groupBy } from 'lodash';
import en from '../../../../app/_locales/en/messages.json';
import README from './README.mdx';
import AcriaWalletTranslation from './metamask-translation';

const { keysWithoutSubstitution } = groupBy(Object.keys(en), (key) => {
  if (en[key].message.includes('$1')) {
    return 'keysWithSubstitution';
  }
  return 'keysWithoutSubstitution';
});

export default {
  title: 'Components/App/MetamaskTranslation',
  id: __filename,
  component: AcriaWalletTranslation,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    translationKey: { options: keysWithoutSubstitution, control: 'select' },
    variables: { control: 'array' },
  },
};

export const DefaultStory = (args) => {
  return <AcriaWalletTranslation {...args} />;
};

DefaultStory.storyName = 'Default';
DefaultStory.args = {
  translationKey: keysWithoutSubstitution[0],
};

export const WithTemplate = (args) => (
  <AcriaWalletTranslation
    {...args}
    variables={[<h1 key="link">{args.translationKey}</h1>]}
  />
);

WithTemplate.args = {
  translationKey: keysWithoutSubstitution[0],
};
