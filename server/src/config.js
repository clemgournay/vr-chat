require('dotenv').load();

let app_domain = null;
let app_url = null;
let app_callback_facebook = null;
let app_callback_google = null;
let google_client_id = null;
let google_client_secret = null;
switch(process.env.ENV) {
  case 'local':
    app_domain = process.env.APP_DOMAIN_LOCAL;
    app_url = process.env.APP_URL_LOCAL;
    app_callback_facebook = process.env.FB_CALLBACK_URL_TEST;
    app_callback_google = process.env.GOOGLE_CALLBACK_LOCAL;
    google_client_id = process.env.GOOGLE_CLIENT_ID_LOCAL;
    google_client_secret = process.env.GOOGLE_CLIENT_SECRET_LOCAL;
    break;
  case 'test':
    app_domain = process.env.APP_DOMAIN_TEST;
    app_url = process.env.APP_URL_TEST;
    app_callback_facebook = process.env.FB_CALLBACK_URL_TEST;
    app_callback_google = process.env.GOOGLE_CALLBACK_TEST;
    google_client_id = process.env.GOOGLE_CLIENT_ID_PROD;
    google_client_secret = process.env.GOOGLE_CLIENT_secret_PROD;
    break;
  case 'prod':
    app_domain = process.env.APP_DOMAIN_PROD;
    app_url = process.env.APP_URL_PROD;
    app_callback_facebook = process.env.FB_CALLBACK_URL_PROD;
    app_callback_google = process.env.GOOGLE_CALLBACK_PROD;
    google_client_id = process.env.GOOGLE_CLIENT_ID_PROD;
    google_client_secret = process.env.GOOGLE_CLIENT_SECRET_PROD;
    break;
}

module.exports = {
  ENV: process.env.ENV,
  APP_DOMAIN: app_domain,
  APP_URL: app_url,
  APP_FALLBACK: process.env.APP_FALLBACK,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_APP_SECRET: process.env.FB_APP_SECRET,
  FB_CALLBACK_URL: app_callback_facebook,
  APP_SECRET: process.env.APP_SECRET,
  GOOGLE_CLIENT_ID: google_client_id,
  GOOGLE_CLIENT_SECRET: google_client_secret,
  GOOGLE_CALLBACK: app_callback_google,
  SALT_ROUNDS: process.env.SALT_ROUNDS
}
