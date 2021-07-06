import React from 'react';
import styles from './ApiCodeBlock.module.css';

export default function ApiCodeBlock(params) {
  const items = [];

  const getStyleByMethod = (method) => {
    switch (method) {
      case 'GET': return styles.getMethod;
      case 'PUT': return styles.putMethod;
      case 'POST': return styles.postMethod;
      case 'DELETE': return styles.deleteMethod;
    }
  }

  for (let i = 0; i < params.items.length; i++) {
    const method = params.items[i].method;
    const uri = params.items[i].uri;

    items.push((
      <div key={`${method}-${uri}`}>
        <span className={`${styles.method} ${getStyleByMethod(method)}`}>
          {method}
        </span>
        {uri}
      </div>
    ));
  }

  return (
    <div className={styles.block}>
      {params.title && (
        <div className={styles.blockHead}>
          {params.title}
        </div>
      )}
      <div className={styles.blockBody}>
        {items}
      </div>
    </div>
  );
}