import React from 'react';
import Disqus from 'disqus-react';

export default function DisqusComments(params) {
  const config = {
    url: 'http://aniapi.com',
    identifier: params.identifier,
    title: params.title
  };

  console.log(config);

  return (
    <Disqus.DiscussionEmbed
      shortname="aniapi"
      config={config}
    />
  );
}