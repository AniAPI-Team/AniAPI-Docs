import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Mal() {

  let user;

  try {
    user = JSON.parse(window.localStorage.getItem('AUTH_USER'));

    if (!user) {
      window.location.replace('/login');
    }
  }
  catch { }

  useEffect(async () => {
    const query = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    console.log(query);

    const challenge = JSON.parse(window.localStorage.getItem('MAL_CHALLENGE'));
    console.log(challenge);
    const state = challenge.code_challenge;

    if (state !== query.state) {
      window.location.replace('/login');
    }

    // CONTINUARE QUI

    const user = await getToken(query.code, challenge.code_verifier);
    console.log(user);

    await updateUser(user.token, user.id);
  }, []);

  const getToken = async (code, code_verifier) => {
    try {
      const url = `https://myanimelist.net/v1/oauth2/token?client_id=${process.env.MAL_CLIENTID}&client_secret=${process.env.MAL_CLIENTSECRET}&grant_type=authorization_code&code=${code}&code_verifier=${code_verifier}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log(response);

      const body = await response.json();

      console.log(body);

      const id = await getUserId(body.access_token);

      return {
        id: id,
        token: body.refresh_token
      };
    }
    catch (ex) {
      console.error(ex);
      //window.location.replace('/profile#trackers');
    }
  }

  const getUserId = async (access_token) => {
    try{
      const response = await fetch('https://api.myanimelist.net/v2/users/@me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log(response);

      const body = response.json();

      console.log(body);

      return body.id;
    }
    catch (ex) {
      console.error(ex);
      //window.location.replace('/profile#trackers');
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
        mal_id: id,
        mal_token: token
      })
    });

    const body = await response.json();

    if (body.status_code === 200) {
      user.mal_id = body.data.mal_id;
      user.mal_token = body.data.mal_token;
      window.localStorage.setItem('AUTH_USER', JSON.stringify(user));
    }

    window.location.replace('/profile#trackers');
  }

  return (
    <Layout title="MyAnimeList">
      <main>
        <div className="container margin-vert--lg">
          <h1>Please wait...</h1>
        </div>
      </main>
    </Layout>
  );
}