const CryptoJs = require("crypto-js");
const SecureStorage = require("secure-web-storage");
const SECRET_KEY = CryptoJs.SHA256(
  navigator.productSub + navigator.platform + navigator.userAgent
).toString();

const secureStorage = new SecureStorage(localStorage, {
  hash: function hash(key) {
    key = CryptoJs.SHA256(key, SECRET_KEY);

    return key.toString();
  },
  encrypt: function encrypt(data) {
    data = CryptoJs.AES.encrypt(data, SECRET_KEY);

    data = data.toString();

    return data;
  },
  decrypt: function decrypt(data) {
    data = CryptoJs.AES.decrypt(data, SECRET_KEY);
    try {
      data = data.toString(CryptoJs.enc.Utf8);
    } catch (error) {
      localStorage.clear();
      window.location.reload();
    }

    return data;
  },
});

export default secureStorage;
