const apiHost = "https://api.myjson.com/bins/18eezv";
const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
};
const request = (url, options) =>
  fetch(url, {
    ...defaultOptions,
    ...options
  }).then(res => res.json());

export const getData = () => request(apiHost);
export const putData = (data = {}) =>
  request(apiHost, { method: "PUT", body: JSON.stringify(data) });
