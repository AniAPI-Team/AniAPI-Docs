import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './profile.module.css';

import PkceChallenge from '../components/PkceChallenge';

export default function Profile() {
  const anilistURL = `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.ANILIST_CLIENTID}&response_type=token`;

  const [malURL, setMalURL] = useState('');

  let sideItems;
  let panels;
  let user;

  const [id, setId] = useState(-1);
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gender, setGender] = useState(0);
  const [locale, setLocale] = useState('');
  const [avatar, setAvatar] = useState('');

  const [locales, setLocales] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    try {
      sideItems = document.getElementsByClassName(styles.sideItem);
      panels = document.getElementsByClassName(styles.panel);

      user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

      setId(user.id);
      setUsername(user.username);
      setAccessToken(user.access_token);
      setLocale(user.localization);
      setGender(user.gender);
      setAvatar(user.avatar_tracker ? user.avatar_tracker : 'none');

      await loadLocalizations();
      await loadMalURL();
    }
    catch (ex) {
      window.location.replace('/login');
    }

    for (let i = 0; i < sideItems.length; i++) {
      sideItems[i].addEventListener('click', onSideItemClick, true);
    }

    const panelId = location.hash.substr(1);
    if (panelId) {
      selectSideItem(panelId);
      selectPanel(panelId);
    }

    if (user.has_anilist) {
      document.getElementById('anilist-tracker').classList.add(styles.trackerActive);
    }
    if (user.has_mal) {
      document.getElementById('mal-tracker').classList.add(styles.trackerActive);
    }
  }, []);

  const loadMalURL = async () => {
    const challenge = PkceChallenge();
    setMalURL(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${process.env.MAL_CLIENTID}&state=${challenge}&code_challenge=${challenge}&code_challenge_method=plain`);
    window.localStorage.setItem('MAL_CHALLENGE', challenge);
  }

  const loadLocalizations = async () => {
    const version = await fetch(`${process.env.API_URL}/v1/resources`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const versionBody = await version.json();

    const response = await fetch(`${process.env.API_URL}/v1/resources/${versionBody.data}/1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const body = await response.json();

    const ls = [];

    for (let i = 0; i < body.data.localizations.length; i++) {
      const l = body.data.localizations[i];
      ls.push(<option key={i} value={l.i18n}>{l.label}</option>);
    }

    setLocales(ls);
  }

  const onSideItemClick = (e) => {
    const panelId = e.target.getAttribute('data-panelid');
    selectSideItem(panelId);
    selectPanel(panelId);
  }

  const selectSideItem = (panelId) => {
    for (let i = 0; i < sideItems.length; i++) {
      if (sideItems[i].getAttribute('data-panelid') === panelId) {
        sideItems[i].classList.add(styles.selected);
      }
      else {
        sideItems[i].classList.remove(styles.selected);
      }
    }
  }

  const selectPanel = (panelId) => {
    for (let i = 0; i < panels.length; i++) {
      if (panels[i].getAttribute('data-panelid') === panelId) {
        panels[i].classList.add(styles.visible);
      }
      else {
        panels[i].classList.remove(styles.visible);
      }
    }
  }

  const onSaveEdit = async () => {
    setLoading(true);

    const success = document.getElementById('success');
    const errors = document.getElementById('errors');

    let payload = {};

    success.innerHTML = '';
    errors.innerHTML = '';

    if (password) {
      if (password !== passwordConfirm) {
        errors.innerHTML += 'Passwords must match';
        setLoading(false);
        return;
      }

      payload.password = password;
    }

    if (locale) {
      payload.localization = locale;
    }

    if (gender !== undefined && gender !== null) {
      payload.gender = gender;
    }

    payload.avatar_tracker = avatar;
    payload.id = id;

    const response = await fetch(`${process.env.API_URL}/v1/user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.json();

    if (body.status_code === 200) {
      let user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

      user.gender = gender;
      user.localization = locale;

      window.localStorage.setItem('AUTH_USER', JSON.stringify(user));

      success.innerHTML = 'Saved';
      setLoading(false);
    }
    else {
      setLoading(false);
      errors.innerHTML += body.data;
      return;
    }
  }

  const onDeveloper = () => {
    window.location.replace('/developer');
  }

  const onLogout = () => {
    window.localStorage.removeItem('AUTH_USER');
    window.location.replace('/');
  }

  return (
    <Layout title="Profile">
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--3">
              <h2>Menu</h2>
              <div className={`${styles.sideItem} ${styles.selected}`}
                data-panelid="jwt">
                JWT
              </div>
              <div className={styles.sideItem}
                data-panelid="edit">
                Edit
              </div>
              <div className={styles.sideItem}
                data-panelid="trackers">
                Trackers
              </div>
              <div className={styles.sideItem}
                onClick={onDeveloper}>
                Developer
              </div>
              <div className={styles.sideItem}
                onClick={onLogout}>
                Logout
              </div>
            </div>
            <div className="col col--7">
              <div className={`${styles.panel} ${styles.visible}`}
                data-panelid="jwt">
                <h1>JWT</h1>
                <p>
                  Hi <b>{username}</b>, you can find your <b>JSON Web Token</b> right below:
                </p>
                <CodeBlock className="language-http">{accessToken}</CodeBlock>
                <p>
                  Remember to follow <b><a href="/docs/authentication" target="_blank">Authentication</a></b> guidelines to use the token.
                </p>
              </div>
              <div className={styles.panel}
                data-panelid="edit">
                <h1>Edit</h1>
                <form method="post">
                  <h4 className={styles.inputLabel}>Password</h4>
                  <input type="password"
                    placeholder="Password"
                    id="password"
                    autoComplete="on"
                    onChange={e => setPassword(e.target.value)}
                    value={password} />
                  <h4 className={styles.inputLabel}>Confirm Password</h4>
                  <input type="password"
                    placeholder="Confirm Password"
                    id="password-confirm"
                    autoComplete="on"
                    onChange={e => setPasswordConfirm(e.target.value)}
                    value={passwordConfirm} />
                  <h4 className={styles.inputLabel}>Locale</h4>
                  <select id="locales"
                    onChange={e => setLocale(e.target.value)}
                    value={locale}>
                    {locales}
                  </select>
                  <h4 className={styles.inputLabel}>Gender</h4>
                  <div className={styles.genres}>
                    <label>Unknown</label>
                    <input type="radio"
                      name="genre"
                      id="genre-unknown"
                      value={0}
                      checked={gender === 0}
                      onChange={e => setGender(0)} />
                    <label>Male</label>
                    <input type="radio"
                      name="genre"
                      id="genre-male"
                      value={1}
                      checked={gender === 1}
                      onChange={e => setGender(1)} />
                    <label>Female</label>
                    <input type="radio"
                      name="genre"
                      id="genre-female"
                      value={2}
                      checked={gender === 2}
                      onChange={e => setGender(2)} />
                  </div>
                  <h4 className={styles.inputLabel}>Avatar</h4>
                  <div className={styles.avatar}>
                    <label>None</label>
                    <input type="radio"
                      name="avatar"
                      id="avatar-none"
                      value="none"
                      checked={avatar === "none"}
                      onChange={e => setAvatar("none")} />
                    <label>AniList</label>
                    <input type="radio"
                      name="avatar"
                      id="avatar-anilist"
                      value="anilist"
                      checked={avatar === "anilist"}
                      onChange={e => setAvatar("anilist")} />
                    <label>MyAnimeList</label>
                    <input type="radio"
                      name="avatar"
                      id="avatar-mal"
                      value="mal"
                      checked={avatar === "mal"}
                      onChange={e => setAvatar("mal")} />
                  </div>
                  <div id="errors"
                    className={styles.errors}></div>
                  {loading ? (
                    <button type="button">...</button>
                  ) : (
                    <button type="button"
                      id="save-edit"
                      onClick={onSaveEdit}>Save</button>
                  )}
                  <div id="success"
                    className={styles.success}></div>
                </form>
              </div>
              <div className={styles.panel}
                data-panelid="trackers">
                <h1>Trackers</h1>
                <div className={styles.trackers}>
                  <a className={`${styles.tracker} ${styles.anilist}`}
                    id="anilist-tracker"
                    href={anilistURL}>
                    <img src="/img/anilist_logo.png" />
                  </a>
                  <a className={`${styles.tracker} ${styles.mal}`}
                    id="mal-tracker"
                    href={malURL}>
                    <img src="/img/mal_logo.jpg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}