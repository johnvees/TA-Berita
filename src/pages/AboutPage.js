import React, { Component } from 'react';
import Header from '../parts/Header';
import Content from '../parts/About/Content';
import FloatingVector from '../parts/FloatingVectorWhite';

export default class AboutPage extends Component {
  render() {
    return (
      <>
        <Header {...this.props}></Header>
        <FloatingVector></FloatingVector>
        <Content></Content>
      </>
    );
  }
}
