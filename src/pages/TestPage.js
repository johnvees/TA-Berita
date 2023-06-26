import React, { Component } from 'react';
import TestPart from '../parts/TestPart';
import DocTest from '../parts/DocTest';
import AnotherTest from '../parts/AnotherTest';
import NewsTest from '../parts/NewsTest';

export default class TestPage extends Component {
  render() {
    return (
      <>
        {/* <TestPart></TestPart> */}
        {/* <DocTest></DocTest> */}
        <AnotherTest></AnotherTest>
        <NewsTest></NewsTest>
      </>
    );
  }
}
