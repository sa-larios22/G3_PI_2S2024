const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/forms.body'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const loadSavedCredentials = async() => {
    try {
        const content = await readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (error) {
        return null;
    }
}

const saveCredentials = async(client) => {
    const content = await readFileSync(CREDENTIALS_PATH);
    const contentString = content.toString();
    const keys = JSON.parse(contentString);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await writeFileSync(TOKEN_PATH, payload);
}

const authorize = async() => {
    let client = await loadSavedCredentials();
    if (client) {
        return client;
    }
    client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

module.exports = {
    authorize
};