import React, { Component } from 'react';
import Header from '../parts/Header';
import Hero from '../parts/Landing/Hero';
import VectorLeft from '../assets/images/vectorleft.png';
import VectorRight from '../assets/images/vectorright.png';
import Content from '../parts/Landing/Content';

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <Header {...this.props}></Header>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div
              className="col-sm-2 col-md-2 col-lg-2 col-xl-2 d-none d-md-block"
              style={{ padding: 0 }}
            >
              <img className="vector vector-left" src={VectorLeft} alt="" />
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8">
              <Hero {...this.props}></Hero>
              <Content {...this.props}></Content>
            </div>
            <div
              className="col-sm-2 col-md-2 col-lg-2 col-xl-2 d-none d-md-block"
              style={{ padding: 0 }}
            >
              <img className="vector vector-right" src={VectorRight} alt="" />
            </div>
          </div>
        </div>
      </>
    );
  }
}
