import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Markdown } from 'markdownloader';
import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import Affix from 'rsuite-affix';
import cloneDeep from 'lodash/cloneDeep';
import CodeView from 'react-code-view';
import 'react-code-view/lib/less/index.less';
import { PageContainer } from 'rsuite-docs';
import './less/index.less';
import '../src/less/index.less';
import Picker from '../src';
import treeData from './data/treeData';
import cityData from './data/city';

const babelOptions = {
  presets: ['stage-0', 'react', 'es2015'],
  plugins: ['transform-class-properties'],
};
class App extends Component {
  render() {
    return (
      <PageContainer
        activeKey="TreePicker"
        githubURL="https://github.com/rsuite/rsuite-treepicker"
      >
        <a id="README" className="target-fix" />
        <Markdown>{require('../README.md')}</Markdown>
        <h2 id="examples">
          <code>示例</code>
        </h2>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/simple.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/controlled.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/disabled.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/custom.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/custom-icon.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/extra-footer.md')}
              dependencies={{
                treeData,
                Picker,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/dynamic.md')}
              dependencies={{
                treeData,
                Picker,
                cloneDeep,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/inline.md')}
              dependencies={{
                cityData,
                Picker,
                cloneDeep,
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>
        <h2>API</h2>
        <Markdown>{require('./md/props.md')}</Markdown>
      </PageContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
