import admin from "firebase-admin";
import functions from "firebase-functions";
// Pass the Firebase config directly to initializeApp() to auto-configure
// the Admin Node.js SDK.
admin.initializeApp(functions.config().firebase);

const authorization = (() => {

    async function authorizeADJwtToken(request: functions.Request, response: functions.Response) {
        const bearerToken = req.header('Authorization');
        if (bearerToken && bearerToken.startsWith('Bearer ')) {
            const oid = bearerToken.replace('Bearer ', '');
            let shouldCreateUser = false

            try {
                await admin.auth().getUser(oid)
            } catch (error) {
                if (error.code === "auth/user-not-found") {
                    // User doesn't exist yet, create it...
                    shouldCreateUser = true
                } else {
                    console.log(`Error in getUser(${oid}): `, error)
                    res.status(500).send(error)
                }
            }

            try {
                // If the user doesn't exist, we create it
                if (shouldCreateUser === true) {
                    console.log(`Creating new user with ${oid}`)

                    const createRequest = {
                        displayName: req.user.name,
                        email: req.user.email,
                        uid: oid,
                    }

                    await admin.auth().createUser(createRequest)
                }

                console.log(`Creating custom token for oid ${oid}`)

                await admin
                    .auth()
                    .createCustomToken(oid)
                    .then(function (customToken) {
                        // Send token back to client
                        res.setHeader("Content-Type", "application/json")
                        res.send(JSON.stringify({token: customToken}))
                    })
            } catch (error) {
                console.error(error)

                res.status(500).send(error)
            }
        } else {
            res.send(403)
        }
    }
    return {authorizeADJwtToken}
})()

export default authorization