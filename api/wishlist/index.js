const {
  jsonResponse,
  readWishlistByUsername,
  requireAuthenticatedUsername,
  writeWishlistByUsername,
} = require('../common');

module.exports = async function (context, req) {
  const authResult = requireAuthenticatedUsername(req);
  if (authResult.errorResponse) {
    context.res = authResult.errorResponse;
    return;
  }

  const method = (req.method || '').toUpperCase();

  if (method === 'GET') {
    try {
      const wishlist = await readWishlistByUsername(authResult.username);
      context.res = jsonResponse(200, { items: wishlist });
      return;
    } catch (error) {
      context.log.error('Error al obtener wishlist:', error);
      context.res = jsonResponse(500, { error: 'No se pudo obtener la lista de deseos' });
      return;
    }
  }

  if (method === 'POST') {
    const { bookId, bookTitle, authorName, coverImageId } = req.body ?? {};
    if (typeof bookId !== 'string' || !bookId.trim() || typeof bookTitle !== 'string' || !bookTitle.trim()) {
      context.res = jsonResponse(400, { error: 'bookId y bookTitle son obligatorios' });
      return;
    }

    try {
      const wishlist = await readWishlistByUsername(authResult.username);
      const exists = wishlist.some(item => item.bookId === bookId);
      if (exists) {
        context.res = jsonResponse(200, { items: wishlist });
        return;
      }

      wishlist.unshift({
        bookId,
        bookTitle: bookTitle.trim(),
        authorName: typeof authorName === 'string' ? authorName : 'Autor desconocido',
        coverImageId: typeof coverImageId === 'number' ? coverImageId : null,
        addedAt: new Date().toISOString(),
      });

      await writeWishlistByUsername(authResult.username, wishlist);
      context.res = jsonResponse(201, { items: wishlist });
      return;
    } catch (error) {
      context.log.error('Error al agregar wishlist:', error);
      context.res = jsonResponse(500, { error: 'No se pudo agregar el libro a la lista de deseos' });
      return;
    }
  }

  context.res = jsonResponse(405, { error: 'Método no permitido' });
};
