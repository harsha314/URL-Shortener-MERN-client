import dotenv from 'dotenv';

dotenv.config();

export let API_URL = process.env.REACT_APP_API_URL;

export let REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;

let urls = { API_URL, REDIRECT_URL };

export default urls;
