export function getBeUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://be-mern-chat-app.onrender.com';
  } else return 'http://localhost:9090';
}

export function getWsUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'wss://be-mern-chat-app.onrender.com';
  }
  return 'ws://localhost:9090';
}
