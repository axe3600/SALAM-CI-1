import "dotenv/config"

import {
  sendVerificationCode
} from "./services/twilioService.js"


const phone = "+2250711990994"

try {

  const result =
    await sendVerificationCode(phone)

  console.log(
    "✅ TEST SMS RÉUSSI"
  )

  console.log(
    "Statut :",
    result.status
  )

}
catch (error) {

  console.error(
    "❌ TEST SMS ÉCHOUÉ"
  )

  console.error(
    error.message
  )

}