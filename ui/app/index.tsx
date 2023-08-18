import React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react';


class RootNode extends React.Component {
  render() {
    return (
      <div><Button>test1</Button></div>
    )
  }
}

window.onload = () => {
  ReactDOM.render(
    <RootNode />,
    document.getElementById('reactRoot'),
  );
};
