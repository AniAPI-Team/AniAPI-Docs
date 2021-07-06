import React from 'react';

export default function Highlight(params) {
  return (
    <span style={{
      backgroundColor: params.bgColor,
      borderRadius: '0.4rem',
      color: params.color,
      padding: '0.1rem 0.3rem',
      border: '0.1rem solid rgba(0, 0, 0, 0.1)',
      fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '95%',
      verticalAlign: 'middle'
    }}>
      {params.content}
    </span>
  );
}