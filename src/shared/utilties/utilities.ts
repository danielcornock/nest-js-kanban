export const promisify = fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
