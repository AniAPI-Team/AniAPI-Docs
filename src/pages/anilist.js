import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Anilist() {

  let user;

  try {
    user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

    if (!user) {
      window.location.replace('/login');
    }
  }
  catch { }

  useEffect(async () => {
    const access_token = location.hash.substring(1).split('=')[1].split('&')[0];
    const id = await getAnilistId(access_token);

    await updateUser(access_token, id);
  }, []);

  const getAnilistId = async (token) => {
    try {
      const response = await fetch(`https://graphql.anilist.co`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
          query {
            Viewer {
              id
              name
            }
          }
          `
        })
      });

      const body = await response.json();

      return body.data.Viewer.id;
    }
    catch {
      window.location.replace('/profile#trackers');
    }
  }

  const updateUser = async (token, id) => {
    const response = await fetch(`${process.env.API_URL}/v1/user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: user.id,
        anilist_id: id,
        anilist_token: token
      })
    });

    const body = await response.json();

    if (body.status_code === 200) {
      user.anilist_id = body.data.anilist_id;
      user.anilist_token = body.data.anilist_token;
      window.localStorage.setItem('AUTH_USER', JSON.stringify(user));
    }

    window.location.replace('/profile#trackers');
  }

  return (
    <Layout title="AniList">
      <main>
        <div className="container margin-vert--lg">
          <h1>Please wait...</h1>
        </div>
      </main>
    </Layout>
  );
}