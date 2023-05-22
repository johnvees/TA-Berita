import React, { Component } from 'react';
import Header from '../parts/Header';

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <Header {...this.props}></Header>
        <p>Test Word</p>
        <p>test 222222222</p>
        <p>test 2222222222</p>
        <p>test 2222222222</p>
        <p>test 2222222222</p>
        <p>test 2222222222</p>
        <p style={{ height: 1000 }}>test 2</p>
        <p>test 2</p>
        <p>test 2</p>
        <p>test 2</p>
        <p>test 2</p>
        <p>test 2</p>
      </>
    );
  }
}
