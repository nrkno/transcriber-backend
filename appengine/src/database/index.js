
const admin = require( "firebase-admin")
const functions = require('firebase-functions')
// Only initialise the app once
if (!admin.apps.length) {
  console.log("initialize app")
  admin.initializeApp(functions.config().firebase)
} else {
  console.log("return initialized app")
  admin.app()
}

const db = admin.firestore()
const getTransciptById = async (transcriptId) => {
  const doc = await db.doc(`transcripts/${transcriptId}`).get()

  return doc.data()
}

const findTransciptUpdatedTodayNotDone = async () => {
  const cc = await db.collection('transcripts').where('status.progress', '==', 'SAVING').where('status.error', '==', 'undefined').get().then((snapshot) => {
    let count = 0
    snapshot.docs.forEach(doc => {
      console.log("transcriptId: ", doc.id)
      count ++
    })
    return count
  })
  return cc

}

module.exports = {
  getTransciptById,
  findTransciptUpdatedTodayNotDone
}


