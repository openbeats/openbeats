import fetch from "node-fetch";
export default async (url, n) => {
  let error;
  for (let i = 0; i < n; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      error = err;
    }
  }
  throw error;
};
