import React from 'react';
import {Img, staticFile} from 'remotion';
import {palette, shadow} from '../brand';

/** The logo is a JPG on white, so it always sits on a white plate. */
export const LogoPlate: React.FC<{width: number; radius?: number; padding?: number; style?: React.CSSProperties}> = ({
  width,
  radius = 24,
  padding = 18,
  style,
}) => (
  <div
    style={{
      background: palette.plate,
      borderRadius: radius,
      padding,
      display: 'inline-block',
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.card,
      ...style,
    }}
  >
    <Img
      src={staticFile('brand/logo.jpg')}
      style={{width, height: 'auto', display: 'block', borderRadius: 8}}
    />
  </div>
);
