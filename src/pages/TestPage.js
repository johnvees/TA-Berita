import React, { Component } from 'react';
import TestPart from '../parts/TestPart';
import DocTest from '../parts/DocTest';

export default class TestPage extends Component {
  render() {
    return (
      <>
        <TestPart></TestPart>
        <DocTest></DocTest>
      </>
    );
  }
}
