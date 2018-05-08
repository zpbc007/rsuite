import React from 'react';
import ReactDOM from 'react-dom';

import { Markdown } from 'react-markdown-reader';
import { PageContainer } from 'rsuite-docs';
import Examples from './Examples';

import './less/index.less';

import Picker from '../src';
import data from './data/users';

class App extends React.Component {
  render() {
    return (
      <PageContainer
        activeKey="SelectPicker"
        githubURL="https://github.com/rsuite/rsuite-selectpicker"
      >

        <Markdown>
          {require('../README.md')}
        </Markdown>

        <h2>示例</h2>

        <Examples
          dependencies={{ Picker, data }}
          list={[
            require('./md/default.md'),
            require('./md/group.md'),
            require('./md/placement.md'),
            require('./md/custom.md'),
            require('./md/controlled.md'),
            require('./md/disabled.md')
          ]}
        />

        <Markdown>
          {require('./md/props.md')}
        </Markdown>

      </PageContainer>

    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('app')
);
