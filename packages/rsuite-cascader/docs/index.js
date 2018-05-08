import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { IconFont } from 'rsuite';
import { Markdown } from 'react-markdown-reader';
import { PageContainer } from 'rsuite-docs';
import { findNodeOfTree } from 'rsuite-utils/lib/utils';

import Examples from './Examples';
import './less/index.less';

import Cascader from '../src';
import data from './data/province';
import province from './data/province-simplified';


class App extends React.Component {
  render() {
    return (
      <PageContainer
        activeKey="Cascader"
        githubURL="https://github.com/rsuite/rsuite-cascader"
      >

        <Markdown>
          {require('../README.md')}
        </Markdown>

        <h2>示例</h2>

        <Examples
          dependencies={{
            Cascader,
            province,
            data,
            IconFont,
            get: _.get,
            cloneDeep: _.cloneDeep,
            findNodeOfTree
          }}
          list={[
            require('./md/default.md'),
            require('./md/placement.md'),
            require('./md/custom.md'),
            require('./md/controlled.md'),
            require('./md/disabled.md'),
            require('./md/asyn.md'),
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
