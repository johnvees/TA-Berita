import React from 'react'
import Button from '../elements/Button'
import BrandLogo from '../assets/images/brandlogo.png'

export default function BrandIcon() {
  return (
    <Button className="brand-logo" href="" type="link">
      <img src={BrandLogo} alt="Brand Logo" />
    </Button>
  )
}
