import fs from 'fs';

export default function (path) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path);
    let data = '';
    stream.setEncoding('utf-8');
    stream.on('data', (chunk) => {
      data += chunk;
    });
    stream.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}
