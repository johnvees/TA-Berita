import React, { Component } from 'react';
import Header from '../parts/Header';
import Hero from '../parts/Landing/Hero';

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <Header {...this.props}></Header>
        <Hero {...this.props}></Hero>
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
