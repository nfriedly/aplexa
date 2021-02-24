import cookies from 'next-cookies';

// local cache for the index page to use even when savePassword is false
let credentials = null;

export function loadCredentials(ctx) {
  if (credentials) {
    return credentials;
  }
  const { aplexa } = cookies(ctx);
  return aplexa && JSON.parse(Buffer.from(aplexa, 'base64').toString());
}

export function storeCredentials(ctx, {
  hostname, username, password, savePassword,
}) {
  credentials = { hostname, username, password };
  const toStore = { hostname, username };
  if (savePassword) {
    toStore.password = password;
  }
  // base64 isn't exactly encryption.. but it's slightly better than storing in plain text
  // this is the best option that works client-side
  const data = Buffer.from(JSON.stringify(toStore)).toString('base64');
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10);
  if (ctx.res) {
    ctx.res.cookie('aplexa', data, { path: '/', expires });
  } else {
    document.cookie = `aplexa=${data}; path=/; expires=${expires.toGMTString()}`;
  }
}
