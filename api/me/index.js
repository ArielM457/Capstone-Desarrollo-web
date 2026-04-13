module.exports = async function (context, req) {
  const auth = req.headers['authorization'];

  if (!auth || !auth.startsWith('Bearer ')) {
    context.res = {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'No autorizado' }),
    };
    return;
  }

  try {
    const token = auth.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticated: true, username: payload.username }),
    };
  } catch {
    context.res = {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Token inválido' }),
    };
  }
};
