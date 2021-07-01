import React from 'react';
import Layout from '@theme/Layout';

export default function Developer() {

  try {
    const user = JSON.parse(window.sessionStorage.getItem('AUTH_USER'));

    if (!user) {
      window.location.replace('./login');
    }
  }
  catch { }

  return (
    <Layout title="Developer">
      <main>
      </main>
    </Layout>
  );
}