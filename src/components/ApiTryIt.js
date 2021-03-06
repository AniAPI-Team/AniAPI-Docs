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
  const [fetching, setFetching] = useState(false);

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

      if (typeof (value.value) !== 'boolean' && !value.value) {
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

        if (typeof (value.value) === 'string' && value.value.indexOf(',') !== -1) {
          const _values = value.value.split(',');

          _uri += `${value.name}=`;

          for (let j = 0; j < _values.length; j++) {
            _uri += `${encodeURIComponent(_values[j])}`;

            if ((j + 1) < _values.length) {
              _uri += ',';
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
      setFetching(true);

      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (secure) {
        headers['Authorization'] = `Bearer ${user.access_token}`;
      }

      const response = await fetch(_uri, {
        method: method,
        headers: headers
      });
      _json = await response.json();
    }
    catch (ex) {
      setFetching(false);
      setJson('// Something bad happened, check console (F12)');
      return;
    }

    setUrl(_uri);
    setJson(JSON.stringify(_json, null, 4));

    setFetching(false);
  }

  if (props.items) {
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
        case 'checkbox':
          items.push((
            <div key={item.name} className={styles.item}>
              <label className={styles.itemLabel}>{item.placeholder}</label>
              <input type={item.type}
                className={styles.tryItCbox}
                name={item.name}
                checked={value.value}
                onChange={e => {
                  setValue(prevState => ({
                    ...prevState,
                    value: e.target.checked
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
  }

  return (
    <div>
      <div className={styles.notSupported}>
        This feature is not available on mobile.
      </div>
      <div className={styles.tryIt}>
        <div className={styles.items}>
          {items}
        </div>
        <div className={styles.codeBlockContainer}>
          {fetching && (
            <i className={'fas fa-spinner fa-pulse ' + styles.loading}></i>
          )}
          <CodeBlock className="language-js" title={url}>{json}</CodeBlock>
        </div>
      </div>
    </div>
  );
}