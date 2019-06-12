const {google} = require('googleapis');

module.exports = async (name) => {
  const googleSpeechRef = name;
  if (googleSpeechRef) {

    try {
      const googleAuth = await google.auth.getClient({
                                                       scopes: ['https://www.googleapis.com/auth/cloud-platform']
                                                     });

      const {data} = await google.speech('v1').operations.get({auth: googleAuth, name: googleSpeechRef});
      console.log("Result from operations.get: ", data);
      return data
    } catch (error) {
      console.error("Failed to fetch operation by googleSpeechRef: ", googleSpeechRef, ". Error: ", error);
    }
  } else {
    console.log("Missing parameter googleSpeechRef ")
    return null
  }
}


