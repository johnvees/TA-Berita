import React from 'react';
import Button from '../elements/Button';
import BrandLogo from '../assets/images/brandlogo.png';

export default function BrandIcon() {
  return (
    <Button href="" type="link">
      <img className="brand-logo" src={BrandLogo} alt="Brand Logo" />
    </Button>
  );
}
