import React from 'react';
import Disqus from 'disqus-react';

export default function DisqusComments(params) {
  const config = {
    url: `https://aniapi.com/blog/${params.identifier}`,
    identifier: params.identifier,
    title: params.title
  };

  return (
    <Disqus.DiscussionEmbed
      shortname="aniapi"
      config={config}
    />
  );
}