import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './login.module.css';

export default function Login() {

  const SITE_KEY = '6Lf98EgbAAAAAHSXXQIrsL-yByCMxOHsukzOqvHV';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  try {
    const user = JSON.parse(window.sessionStorage.getItem('AUTH_USER'));

    if (user) {
      window.location.replace('./profile');
    }
  }
  catch { }

  useEffect(() => {
    const loadScript = (id, url, callback) => {
      const exists = document.getElementById(id);

      if (!exists) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.id = id;

        script.onload = () => {
          if (callback) {
            callback();
          }
        }

        document.body.appendChild(script);
      }

      if (exists && callback) {
        callback();
      }
    }

    loadScript('recaptcha-key', `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, () => {
      console.log('ReCAPTCHA loaded!');
    });
  }, []);

  const onEmailKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('password').focus();
    }
  }

  const onPasswordKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('login').click();
    }
  }

  const onLogin = (e) => {
    const errors = document.getElementById('errors');

    errors.innerHTML = '';

    if (!email) {
      errors.innerHTML += 'Email must not be empty';
      return;
    }

    if (!password) {
      errors.innerHTML += 'Password must not be empty';
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(async (token) => {
        const response = await fetch(`${process.env.API_URL}/v1/auth`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            g_recaptcha_response: token
          })
        });

        const body = await response.json();

        if (body.status_code === 200) {
          window.sessionStorage.setItem('AUTH_USER', JSON.stringify(body.data));
          window.location.reload();
        }
        else {
          errors.innerHTML += body.data;
          return;
        }
      });
    });
  }

  return (
    <Layout title="Login">
      <main>
        <div className={styles.form}>
          <img src="img/aniapi_icon.png" />
          <form method="post">
            <input type="text"
              placeholder="Email"
              id="email"
              onChange={e => setEmail(e.target.value)}
              onKeyPress={onEmailKeyPress}
              value={email} />
            <input type="password"
              placeholder="Password"
              id="password"
              autoComplete="on"
              onChange={e => setPassword(e.target.value)}
              onKeyPress={onPasswordKeyPress}
              value={password} />
            <div id="errors"
              className={styles.errors}></div>
            <button type="button"
              id="login"
              onClick={onLogin}>Login</button>
          </form>
          <Link
            className={styles.signup}
            to="/signup">
            Create an account
          </Link>
        </div>
      </main>
    </Layout>
  );
}