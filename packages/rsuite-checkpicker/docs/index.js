import React from 'react';
import ReactDOM from 'react-dom';

import { Markdown } from 'react-markdown-reader';
import { PageContainer } from 'rsuite-docs';
import Examples from './Examples';

import './less/index.less';

import CheckPicker from '../src';
import data from './data/users';

class App extends React.Component {
  render() {
    return (
      <PageContainer
        activeKey="CheckPicker"
        githubURL="https://github.com/rsuite/rsuite-checkpicker"
      >

        <Markdown>
          {require('../README.md')}
        </Markdown>

        <h2>示例</h2>

        <Examples
          dependencies={{ CheckPicker, data }}
          list={[
            require('./md/default.md'),
            require('./md/group.md'),
            //require('./md/placement.md'),
            require('./md/custom.md'),
            require('./md/controlled.md'),
            require('./md/disabled.md'),
            require('./md/extra-footer.md')
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
