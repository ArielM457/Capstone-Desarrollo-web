const fs = require('fs/promises');
const path = require('path');

const USERS = [
  { username: 'admin', password: '1234' },
  { username: 'usuario', password: 'pass' },
];

const activeTokens = new Map();
const storageProvider = process.env.WISHLIST_STORAGE_PROVIDER || 'local';
const azureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const azureContainerName = process.env.AZURE_BLOB_CONTAINER || 'julibrary-data';
const localStoragePath = path.join(__dirname, 'data');

let azureContainerClient = null;

async function getAzureContainerClient() {
  if (storageProvider !== 'azure_blob') {
    return null;
  }
  if (azureContainerClient) {
    return azureContainerClient;
  }
  if (!azureConnectionString) {
    throw new Error('Falta AZURE_STORAGE_CONNECTION_STRING para usar Azure Blob Storage.');
  }

  const { BlobServiceClient } = require('@azure/storage-blob');
  const serviceClient = BlobServiceClient.fromConnectionString(azureConnectionString);
  azureContainerClient = serviceClient.getContainerClient(azureContainerName);
  await azureContainerClient.createIfNotExists();
  return azureContainerClient;
}

function buildWishlistFilePath(username) {
  return path.join(localStoragePath, `wishlist-${username}.json`);
}

function buildWishlistBlobName(username) {
  return `wishlists/${encodeURIComponent(username)}.json`;
}

async function streamToString(readableStream) {
  if (!readableStream) {
    return '';
  }
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function readWishlistByUsername(username) {
  if (storageProvider === 'azure_blob') {
    const containerClient = await getAzureContainerClient();
    const blobClient = containerClient.getBlockBlobClient(buildWishlistBlobName(username));
    const exists = await blobClient.exists();
    if (!exists) {
      return [];
    }
    const response = await blobClient.download();
    const body = await streamToString(response.readableStreamBody);
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [];
  }

  await fs.mkdir(localStoragePath, { recursive: true });
  const filePath = buildWishlistFilePath(username);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeWishlistByUsername(username, wishlist) {
  if (storageProvider === 'azure_blob') {
    const containerClient = await getAzureContainerClient();
    const blobClient = containerClient.getBlockBlobClient(buildWishlistBlobName(username));
    const content = JSON.stringify(wishlist);
    await blobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: { blobContentType: 'application/json' },
    });
    return;
  }

  await fs.mkdir(localStoragePath, { recursive: true });
  const filePath = buildWishlistFilePath(username);
  await fs.writeFile(filePath, JSON.stringify(wishlist, null, 2), 'utf8');
}

function getAuthorizationHeader(req) {
  return req.headers?.authorization || req.headers?.Authorization || '';
}

function extractBearerToken(req) {
  const authHeader = getAuthorizationHeader(req);
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice('Bearer '.length).trim();
}

function createTokenForUsername(username) {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  activeTokens.set(token, username);
  return token;
}

function revokeToken(token) {
  if (!token) {
    return;
  }
  activeTokens.delete(token);
}

function requireAuthenticatedUsername(req) {
  const token = extractBearerToken(req);
  if (!token) {
    return { errorResponse: jsonResponse(401, { error: 'No autorizado' }) };
  }
  const username = activeTokens.get(token) ?? null;
  if (!username) {
    return { errorResponse: jsonResponse(401, { error: 'No autorizado' }) };
  }
  return { username, token };
}

function jsonResponse(status, payload) {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

module.exports = {
  USERS,
  createTokenForUsername,
  extractBearerToken,
  jsonResponse,
  readWishlistByUsername,
  requireAuthenticatedUsername,
  revokeToken,
  writeWishlistByUsername,
};
