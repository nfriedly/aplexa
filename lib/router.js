import Router from 'next/router';

// monkeypatch the router to enable the prefix
// this is for deployment to github pages and similar
['push', 'replace'].forEach((method) => {
  const orig = Router[method];
  Router[method] = path => orig.call(Router, path, `${process.env.PREFIX || ''}${path}`);
});

export default Router;
