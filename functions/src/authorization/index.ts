import admin from "firebase-admin";
import functions from "firebase-functions";
import jwt from "jsonwebtoken";
import {IJwt} from "../interfaces";

const authorization = (() => {

    // Only initialise the app once
    if (!admin.apps.length) {
        admin.initializeApp(functions.config().firebase)
    } else {
        admin.app()
    }

    async function authorizeADJwtToken(req: functions.Request, res: functions.Response) {
        const authorizaton = req.header("Authorization")

        if (authorizaton && authorizaton.startsWith("Bearer ")) {
            const jwttoken = authorizaton.split(" ")
            // @ts-ignore
            const decoded: IJwt = jwt.decode(jwttoken[1])
            // proxy checks if the token is valid, just trust it here..
            const oid = decoded.oid
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

                    let email = decoded.email
                    if (!email) {
                        email = decoded.upn
                    }
                    const createRequest = {
                        displayName: decoded.name,
                        email,
                        uid: oid,
                    }

                    await admin.auth().createUser(createRequest)
                }

                console.log(`Creating custom token for oid ${oid}`)

                await admin
                    .auth()
                    .createCustomToken(oid)
                    .then(customToken => {
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
