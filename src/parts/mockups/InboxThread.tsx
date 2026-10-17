import React from 'react';
import {palette, shadow} from '../../brand';

/** An inbox conversation: a question asked, an answer sent. */
export const InboxThread: React.FC<{question: string; answer: string; width?: number}> = ({
  question,
  answer,
  width = 460,
}) => (
  <div
    style={{
      width,
      background: palette.surface,
      borderRadius: 22,
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.pop,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    <div style={{display: 'flex', justifyContent: 'flex-start'}}>
      <div
        style={{
          background: '#EEF1F7',
          color: palette.ink,
          fontSize: 19,
          padding: '12px 18px',
          borderRadius: '18px 18px 18px 6px',
          maxWidth: '80%',
        }}
      >
        {question}
      </div>
    </div>
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <div
        style={{
          background: palette.blue,
          color: '#fff',
          fontSize: 19,
          padding: '12px 18px',
          borderRadius: '18px 18px 6px 18px',
          maxWidth: '80%',
        }}
      >
        {answer}
      </div>
    </div>
  </div>
);
