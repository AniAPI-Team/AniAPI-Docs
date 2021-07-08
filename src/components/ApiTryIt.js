import React, { useEffect } from 'react';
import { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './ApiTryIt.module.css';

export default function ApiTryIt(props) {
  const items = [];
  const values = [];
  const uri = `https://api.aniapi.com${props.uri}`;
  const method = props.method;
  const secure = props.secure ? props.secure : false;

  const [changed, setChanged] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timer, setTimer] = useState(null);

  const [url, setUrl] = useState('');
  const [json, setJson] = useState('');

  useEffect(() => {
    if (mounted) {
      onValueChanged();
    }
  }, [values])

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      setMounted(false);
    }
  }, []);

  const onValueChanged = async () => {
    if (!changed) {
      return;
    }

    setChanged(false);

    let _uri = uri;
    let _init = false;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      if (!value.value) {
        continue;
      }

      if (value.name.indexOf(':') !== -1) {
        _uri = _uri.replace(value.name, value.value);
      }
      else {
        if (!_init) {
          _uri += '?';
          _init = true;
        }
        else {
          _uri += '&';
        }

        if (value.value.indexOf(',') !== -1) {
          const _values = value.value.split(',');

          for (let j = 0; j < _values.length; j++) {
            _uri += `${value.name}=${encodeURIComponent(_values[j])}`;

            if ((j + 1) < _values.length) {
              _uri += '&';
            }
          }
        }
        else {
          _uri += `${value.name}=${encodeURIComponent(value.value)}`;
        }
      }
    }

    const user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

    if (!user && secure) {
      setJson('// You need to login in order to perform this request!');
      return;
    }

    let _json = '';

    try {
      const response = await fetch(_uri, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      _json = await response.json();
    }
    catch (ex) {
      setJson('// Something bad happened, check console (F12)');
      return;
    }

    setUrl(_uri);
    setJson(JSON.stringify(_json, null, 4));
  }

  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];

    const [value, setValue] = useState({
      name: item.name,
      value: item.value
    });

    values.push(value);

    switch (item.type) {
      case 'number':
      case 'text':
        items.push((
          <div key={item.name} className={styles.item}>
            <label className={styles.itemLabel}>{item.placeholder}</label>
            <input type={item.type}
              placeholder={item.placeholder}
              name={item.name}
              value={value.value}
              onChange={e => {
                setValue(prevState => ({
                  ...prevState,
                  value: e.target.value
                }));

                if (timer) {
                  clearTimeout(timer);
                  setTimer(null);
                }

                setTimer(
                  setTimeout(() => {
                    setChanged(true);
                  }, 500)
                );
              }} />
          </div>
        ));
        break;
    }
  }

  return (
    <div className={styles.tryIt}>
      <div className={styles.items}>
        {items}
      </div>
      <CodeBlock className="language-js"
        title={url}>{json}</CodeBlock>
    </div>
  );
}