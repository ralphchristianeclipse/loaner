export const audios = {
  punjabi: new Audio("punjabi.mp3"),
  ting: new Audio("ting.mp3"),
  nani: new Audio("nani.mp3"),
  galit: new Audio("galit.mp3"),
  crying: new Audio("crying.mp3")
};

export const getLocalStorageItem = key =>
  new Promise(async resolve => {
    try {
      let string = localStorage.getItem(key);
      if (!string) return;
      const result = JSON.parse(string);
      resolve(result);
    } finally {
      resolve();
    }
  });

export const getUserBumbays = async user => {
  const result = await getLocalStorageItem(user);
  await audios[result ? "punjabi" : "ting"].play();
  return result;
};

export const sum = (array, callback) =>
  array.reduce(
    (total, item, index) => (total += callback(item, total, index)),
    0
  );

export const formatDate = (date, format) => {
  const result = date.toJSON().split(/[:/.TZ-]/);
  return format.replace(
    /[ymdhis]/g,
    letter => result["ymdhis".indexOf(letter)]
  );
};

export const mapToJson = map => {
  return JSON.stringify([...map]);
};
export const jsonToMap = jsonStr => {
  return new Map(JSON.parse(jsonStr));
};

export const keyProxy = new Proxy(Object.create(null), {
  get: (_, key) => key
});
