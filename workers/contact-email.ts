export type ContactEmailInput = {
  navn: string
  email: string
  telefon: string
  besked: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

function formatSentAt(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Copenhagen',
  }).format(date)
}

function fieldRow(label: string, value: string, valueHtml?: string): string {
  return `
    <tr>
      <td style="padding:0 0 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:14px 16px;background:#fafaf8;border:1px solid #e8e6e1;border-radius:14px;">
              <p style="margin:0 0 6px;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a8d94;">
                ${escapeHtml(label)}
              </p>
              <p style="margin:0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.45;color:#0f1114;font-weight:600;">
                ${valueHtml ?? escapeHtml(value)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export function buildContactEmail(input: ContactEmailInput, sentAt = new Date()) {
  const telefon = input.telefon.trim() || '(ikke angivet)'
  const sentLabel = formatSentAt(sentAt)

  const text = [
    'Ny besked fra kaffeskuden.dk',
    '',
    `Navn: ${input.navn}`,
    `E-mail: ${input.email}`,
    `Telefon: ${telefon}`,
    `Modtaget: ${sentLabel}`,
    '',
    'Besked:',
    input.besked,
    '',
    `Svar på denne mail for at kontakte ${input.navn}.`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Ny henvendelse fra ${escapeHtml(input.navn)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f2ee;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Ny besked fra ${escapeHtml(input.navn)} via kontaktformularen på kaffeskuden.dk.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f2ee;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:560px;">
            <tr>
              <td style="padding:0 0 18px;text-align:center;">
                <p style="margin:0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8a8d94;">
                  Kaffeskuden
                </p>
                <h1 style="margin:8px 0 0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:#0f1114;">
                  Ny henvendelse
                </h1>
                <p style="margin:10px 0 0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#5c5f66;">
                  Fra kontaktformularen på <a href="https://kaffeskuden.dk" style="color:#1a4d8c;text-decoration:none;font-weight:600;">kaffeskuden.dk</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;background:#1c1c1c;border-radius:20px;overflow:hidden;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0 0 4px;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.55);">
                        Fra
                      </p>
                      <p style="margin:0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">
                        ${escapeHtml(input.navn)}
                      </p>
                      <p style="margin:8px 0 0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.72);">
                        Modtaget ${escapeHtml(sentLabel)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 22px 8px;background:#ffffff;border:1px solid #e8e6e1;border-radius:20px 20px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${fieldRow('E-mail', input.email, `<a href="mailto:${escapeHtml(input.email)}" style="color:#1a4d8c;text-decoration:none;">${escapeHtml(input.email)}</a>`)}
                  ${fieldRow('Telefon', telefon, telefon === '(ikke angivet)' ? `<span style="color:#8a8d94;font-weight:500;">${escapeHtml(telefon)}</span>` : `<a href="tel:${escapeHtml(telefon.replace(/\s/g, ''))}" style="color:#0f1114;text-decoration:none;">${escapeHtml(telefon)}</a>`)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 22px 22px;background:#ffffff;border:1px solid #e8e6e1;border-top:none;border-radius:0 0 20px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:16px 18px;background:#fafaf8;border:1px solid #e8e6e1;border-left:4px solid #1a4d8c;border-radius:14px;">
                      <p style="margin:0 0 10px;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a8d94;">
                        Besked
                      </p>
                      <p style="margin:0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.65;color:#0f1114;">
                        ${formatMultiline(input.besked)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;text-align:center;">
                <p style="margin:0;font-family:Segoe UI,system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.55;color:#8a8d94;">
                  Svar på denne mail for at kontakte ${escapeHtml(input.navn)}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { text, html }
}
