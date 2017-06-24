import Analysis from '../classes/analysis';

export default function (json) {
  return new Promise((resolve, reject) => {
    try {
      resolve(new Analysis(json));
    } catch (e) {
      reject(e);
    }
  });
}
