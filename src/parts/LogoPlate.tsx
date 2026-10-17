import React from 'react';
import {Img, staticFile} from 'remotion';
import {palette} from '../brand';

/** The logo is a JPG on white, so it always sits on a white plate. */
export const LogoPlate: React.FC<{width: number; radius?: number; padding?: number}> = ({
  width,
  radius = 28,
  padding = 24,
}) => (
  <div
    style={{
      background: palette.plate,
      borderRadius: radius,
      padding,
      display: 'inline-block',
      boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
    }}
  >
    <Img
      src={staticFile('brand/logo.jpg')}
      style={{width, height: 'auto', display: 'block', borderRadius: 6}}
    />
  </div>
);
