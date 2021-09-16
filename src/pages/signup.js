import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './signup.module.css';

export default function Signup() {

  const SITE_KEY = '6Lf98EgbAAAAAHSXXQIrsL-yByCMxOHsukzOqvHV';

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);

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
      
    });
  }, []);

  const onEmailKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('username').focus();
    }
  }

  const onUsernameKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('password').focus();
    }
  }

  const onPasswordKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('password-confirm').focus();
    }
  }

  const onPasswordConfirmKeyPress = (e) => {
    if (e.which === 13) {
      document.getElementById('signup').click();
    }
  }

  const onSignup = (e) => {
    setLoading(true);

    const errors = document.getElementById('errors');

    errors.innerHTML = '';

    if (!email) {
      errors.innerHTML += 'Email must not be empty';
      setLoading(false);
      return;
    }

    if (!username) {
      errors.innerHTML += 'Username must not be empty';
      setLoading(false);
      return;
    }

    if (!password) {
      errors.innerHTML += 'Password must not be empty';
      setLoading(false);
      return;
    }

    if (!passwordConfirm) {
      errors.innerHTML += 'Confirm Password must not be empty';
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      errors.innerHTML += 'Passwords must match';
      setLoading(false);
      return;
    }

    let locale = navigator.language || navigator.userLanguage;

    if (locale.length > 2) {
      locale = locale.substring(0, 2);
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(async (token) => {
        const response = await fetch(`${process.env.API_URL}/v1/user?g_recaptcha_response=${token}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
            localization: locale
          })
        });

        const body = await response.json();

        if (body.status_code === 200) {
          setCompleted(true);
          setLoading(false);
        }
        else {
          setLoading(false);
          errors.innerHTML += body.data;
          return;
        }
      });
    });
  }

  return (
    <Layout title="Signup">
      <main className={styles.signupMain}>
        {!completed ? (
          <div className={styles.form}>
            <img src="/img/aniapi_icon.png" />
            <form method="post">
              <input type="text"
                placeholder="Email"
                id="email"
                onChange={e => setEmail(e.target.value)}
                onKeyPress={onEmailKeyPress}
                value={email} />
              <input type="text"
                placeholder="Username"
                id="username"
                onChange={e => setUsername(e.target.value)}
                onKeyPress={onUsernameKeyPress}
                value={username} />
              <input type="password"
                placeholder="Password"
                id="password"
                autoComplete="on"
                onChange={e => setPassword(e.target.value)}
                onKeyPress={onPasswordKeyPress}
                value={password} />
              <input type="password"
                placeholder="Confirm Password"
                id="password-confirm"
                autoComplete="on"
                onChange={e => setPasswordConfirm(e.target.value)}
                onKeyPress={onPasswordConfirmKeyPress}
                value={passwordConfirm} />
              <div id="errors"
                className={styles.errors}></div>
              {loading ? (
                <button type="button">...</button>
              ) : (
                <button type="button"
                  id="signup"
                  onClick={onSignup}>Signup</button>
              )}
            </form>
            <Link
              className={styles.login}
              to="/login">
              Login
            </Link>
          </div>
        ) : (
          <p>
            Registration complete!<br />
            We sent an email to <b>{email}</b>'s inbox for account verification purpose
          </p>
        )}
      </main>
    </Layout>
  );
}