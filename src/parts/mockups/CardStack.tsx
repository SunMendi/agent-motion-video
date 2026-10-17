import React from 'react';
import {palette, shadow} from '../../brand';
import {toBangla} from '../../text/bn';

/** A stack of trending news cards, each offset like a deck. */
export const CardStack: React.FC<{titles: string[]; width?: number}> = ({titles, width = 520}) => (
  <div style={{width, position: 'relative', height: titles.length * 66 + 40}}>
    {titles.map((title, i) => {
      const last = i === titles.length - 1;
      return (
        <div
          key={title}
          style={{
            position: 'absolute',
            top: i * 66,
            left: i * 10,
            right: -i * 10,
            height: 62,
            background: palette.surface,
            borderRadius: 16,
            border: `1px solid ${palette.line}`,
            boxShadow: last ? shadow.pop : shadow.soft,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 18px',
            transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.6}deg)`,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: palette.blueSoft,
              color: palette.blue,
              fontWeight: 700,
              fontSize: 17,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: palette.ink,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            <div style={{fontSize: 13, color: palette.faint, marginTop: 3}}>
              {toBangla((i + 1) * 2)} ঘণ্টা আগে
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
