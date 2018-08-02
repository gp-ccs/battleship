import React from 'react';

export default class extends React.Component {
  static async getInitialProps() {
    return {};
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div>Hello</div>;
  }
}
