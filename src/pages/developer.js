import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './developer.module.css';

export default function Developer() {

  let user;

  const [sideItems, setSideItems] = useState([]);
  const [panels, setPanels] = useState([]);

  const [id, setId] = useState(-1);
  const [accessToken, setAccessToken] = useState('');

  const [cId, setCId] = useState(-1);
  const [name, setName] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [clientId, setClientId] = useState('');

  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    try {
      setSideItems(document.getElementsByClassName(styles.sideItem));
      setPanels(document.getElementsByClassName(styles.panel));

      user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

      setId(user.id);
      setAccessToken(user.access_token);
    }
    catch {
      window.location.replace('/login');
    }
  }, []);

  useEffect(async () => {
    await loadClients();
  }, [id]);

  useEffect(() => {
    for (let i = 0; i < sideItems.length; i++) {
      sideItems[i].removeEventListener('click', onSideItemClick, true);
      sideItems[i].addEventListener('click', onSideItemClick, true);
    }

    const panelId = location.hash.substr(1);
    if (panelId) {
      selectSideItem(panelId);
      selectPanel(panelId);
    }
  }, [sideItems, panels]);

  const loadClients = async () => {
    const response = await fetch(`${process.env.API_URL}/v1/oauth_client?user_id=${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const body = await response.json();

    if (body.status_code !== 200) {
      return;
    }

    const cls = [];

    for (let i = 0; i < body.data.documents.length; i++) {
      const c = body.data.documents[i];
      cls.push((
        <div key={i} className={styles.client}>
          <h4>{c.name}</h4>
          <div className={styles.clientRow}>
            <span>Id</span>
            {c.client_id}
          </div>
          <div className={styles.clientRow}>
            <span>Redirect URI</span>
            {c.redirect_uri}
          </div>
          {loading ? (
            <button type="button">...</button>
          ) : (
            <button type="button"
              onClick={() => onDelete(c.id)}>Delete</button>
          )}
          <button type="button"
            onClick={() => {
              setCId(c.id);
              setName(c.name);
              setRedirectUri(c.redirect_uri);
              setClientId(c.client_id);

              selectSideItem('edit');
              selectPanel('edit');
            }}>Edit</button>
        </div >
      ));
    }

    setClients(cls);
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

  const onAdd = async () => {
    setLoading(true);

    const errors = document.getElementById('add-errors');

    errors.innerHTML = '';

    if (!name) {
      errors.innerHTML += 'Name must not be empty';
      setLoading(false);
      return;
    }

    if (!redirectUri) {
      errors.innerHTML += 'Redirect URI must not be empty';
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.API_URL}/v1/oauth_client`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        redirect_uri: redirectUri
      })
    });

    const body = await response.json();

    if (body.status_code === 200) {
      await loadClients();

      selectSideItem('list');
      selectPanel('list');

      console.log(`This is your ${name} client's secret.\nYou won't be able to copy it in future times.\nSave it in a safe place!`);
      console.log(body.data.client_secret);
      alert('Check your console to copy the client\'s secret [F12]');

      setLoading(false);
    }
    else {
      setLoading(false);
      errors.innerHTML += body.data;
      return;
    }
  }

  const onEdit = async () => {
    setLoading(true);

    const errors = document.getElementById('edit-errors');

    errors.innerHTML = '';

    if (!name) {
      errors.innerHTML += 'Name must not be empty';
      setLoading(false);
      return;
    }

    if (!redirectUri) {
      errors.innerHTML += 'Redirect URI must not be empty';
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.API_URL}/v1/oauth_client`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: cId,
        user_id: id,
        client_id: clientId,
        name: name,
        redirect_uri: redirectUri
      })
    });

    const body = await response.json();

    if (body.status_code === 200) {
      await loadClients();

      selectSideItem('list');
      selectPanel('list');

      setLoading(false);
    }
    else {
      setLoading(false);
      errors.innerHTML += body.data;
      return;
    }
  }

  const onDelete = async (id) => {
    setLoading(true);

    const response = await fetch(`${process.env.API_URL}/v1/oauth_client/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const body = await response.json();

    if (body.status_code === 200) {
      await loadClients();

      selectSideItem('list');
      selectPanel('list');

      setLoading(false);
    }
    else {
      setLoading(false);
      alert(body.data);
      return;
    }
  }

  return (
    <Layout title="Developer">
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--3">
              <h2>Menu</h2>
              <div className={`${styles.sideItem} ${styles.selected}`}
                data-panelid="list">
                List
              </div>
              <div className={styles.sideItem}
                data-panelid="add"
                onClick={() => {
                  setName('');
                  setRedirectUri('');
                }}>
                Add
              </div>
            </div>
            <div className="col col--7">
              <div className={`${styles.panel} ${styles.visible}`}
                data-panelid="list">
                <h1>List</h1>
                {clients.length === 0 ? (
                  <p>No clients found</p>
                ) : (
                  <div className={styles.clients}>
                    {clients}
                  </div>
                )}
              </div>
              <div className={styles.panel}
                data-panelid="add">
                <h1>Add</h1>
                <form method="post">
                  <h4 className={styles.inputLabel}>Name</h4>
                  <input type="text"
                    placeholder="Name"
                    id="add-name"
                    onChange={e => setName(e.target.value)}
                    value={name} />
                  <h4 className={styles.inputLabel}>Redirect URI</h4>
                  <input type="text"
                    placeholder="Redirect URI"
                    id="add-reduri"
                    onChange={e => setRedirectUri(e.target.value)}
                    value={redirectUri} />
                  <div id="add-errors"
                    className={styles.errors}></div>
                  {loading ? (
                    <button type="button">...</button>
                  ) : (
                    <button type="button"
                      id="add"
                      onClick={onAdd}>Add</button>
                  )}
                </form>
              </div>
              <div className={styles.panel}
                data-panelid="edit">
                <h1>Edit</h1>
                <form method="post">
                  <h4 className={styles.inputLabel}>Name</h4>
                  <input type="text"
                    placeholder="Name"
                    id="edit-name"
                    onChange={e => setName(e.target.value)}
                    value={name} />
                  <h4 className={styles.inputLabel}>Redirect URI</h4>
                  <input type="text"
                    placeholder="Redirect URI"
                    id="edit-reduri"
                    onChange={e => setRedirectUri(e.target.value)}
                    value={redirectUri} />
                  <div id="edit-errors"
                    className={styles.errors}></div>
                  {loading ? (
                    <button type="button">...</button>
                  ) : (
                    <button type="button"
                      id="edit"
                      onClick={onEdit}>Edit</button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}