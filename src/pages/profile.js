import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './profile.module.css';

export default function Profile() {
  const anilistURL = `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.ANILIST_CLIENTID}&response_type=token`;

  let sideItems;
  let panels;
  let user;
  let [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    try {
      sideItems = document.getElementsByClassName(styles.sideItem);
      panels = document.getElementsByClassName(styles.panel);

      user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

      setUsername(user.username);
      setAccessToken(user.access_token);
    }
    catch {
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

    if (user.anilist_id) {
      document.getElementById('anilist-tracker').classList.add(styles.trackerActive);
    }
  }, []);

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
                  <a className={`${styles.tracker} ${styles.mal} ${styles.trackerDisabled}`}
                    id="mal-tracker"
                    href="">
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