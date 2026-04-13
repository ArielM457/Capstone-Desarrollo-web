const USERS = [
  { username: 'admin', password: '1234' },
  { username: 'usuario', password: 'pass' },
];

module.exports = async function (context, req) {
  const { username, password } = req.body || {};
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    context.res = {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Credenciales inválidas' }),
    };
    return;
  }

  const payload = { username: user.username, ts: Date.now() };
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, username: user.username }),
  };
};
