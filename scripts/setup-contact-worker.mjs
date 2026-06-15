import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const devVarsPath = join(root, '.dev.vars')

function readResendApiKey() {
  let devVars
  try {
    devVars = readFileSync(devVarsPath, 'utf8')
  } catch {
    console.error('Missing .dev.vars — copy .dev.vars.example and set RESEND_API_KEY.')
    process.exit(1)
  }

  const match = devVars.match(/^RESEND_API_KEY=(.+)$/m)
  const key = match?.[1]?.trim()

  if (!key || key === 'your-resend-api-key') {
    console.error('Set RESEND_API_KEY in .dev.vars before running worker:setup.')
    process.exit(1)
  }

  return key
}

function run(command, args, input) {
  const result = spawnSync(command, args, {
    cwd: root,
    input,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const apiKey = readResendApiKey()

console.log('Setting RESEND_API_KEY secret on Cloudflare Worker…')
run('npx', ['wrangler', 'secret', 'put', 'RESEND_API_KEY'], apiKey)

console.log('Deploying kaffeskuden-contact worker…')
run('npm', ['run', 'worker:deploy'])

console.log('\nDone. Production API: https://api.kaffeskuden.dk')
