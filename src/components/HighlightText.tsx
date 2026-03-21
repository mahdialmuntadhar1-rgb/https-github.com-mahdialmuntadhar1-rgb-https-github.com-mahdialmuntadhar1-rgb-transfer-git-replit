/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
}

const HighlightText = React.memo(({ text, highlight }: HighlightTextProps) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const terms = highlight.trim().split(/\s+/).filter(t => t.length > 0);
  if (terms.length === 0) return <>{text}</>;

  const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            style={{ 
              backgroundColor: 'rgba(232, 197, 71, 0.3)', 
              color: 'inherit', 
              padding: '0 2px', 
              borderRadius: '2px' 
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
});

export default HighlightText;
