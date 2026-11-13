import 'dotenv/config'

const configuredPort = Number(process.env.PORT || 5000)

if (
  !Number.isInteger(configuredPort)
  || configuredPort < 1
  || configuredPort > 65535
) {
  throw new Error('PORT must be an integer between 1 and 65535.')
}

export const PORT = configuredPort
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
