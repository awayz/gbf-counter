export function existKey(storage, key) {
  return new Promise((resolve, reject) => {
    storage.has(key, function(error, hasKey) {
      if (error) {
        reject(error);
      }
      resolve(hasKey);
    });
  });
}

export function getByKey(storage, key) {
  return new Promise((resolve, reject) => {
    storage.get(key, function(error, data) {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
}

// 如果不存在，会返回默认值，并且 storage 会写入默认值
export async function getByKeyOrDefault(storage, key, defaultValue) {
  try {
    let exist = await existKey(storage, key);
    let data;
    if (exist) {
      data = await getByKey(storage, key);
    } else {
      data = defaultValue;
    }
    return data;
  } catch(e) {
    console.log(e);
    throw Error('getByKeyOrDefault error');
  }
}