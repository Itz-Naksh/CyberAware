const rows = [
  ['Spot a Phishing Email in 30 Seconds', 'Phishing',
    'Most breaches start with one convincing message. Learn the red flags that give phishing away.',
`Phishing is when an attacker pretends to be someone you trust — a bank, a delivery company, your boss — to trick you into clicking a link, opening a file, or handing over a password.

## Red flags to look for

- **Urgency or threats:** "Your account will be closed in 24 hours."
- **A sender address that is almost right:** support@paypa1.com instead of paypal.com.
- **Links that don't match:** hover over a link (don't click) and read the real address.
- **Unexpected attachments**, especially .zip, .html or Office files asking you to "enable macros".
- **Requests for passwords, codes or payments** by email or text message.

## What to do

- Don't click. Open the website yourself by typing the address or using your bookmark.
- Report the message to your IT team or your email provider.
- If you already clicked and entered a password, change it immediately and turn on multi-factor authentication.

When in doubt, contact the sender using a phone number or address you already know is real.`],

  ['Passwords, Passphrases and Password Managers', 'Accounts',
    'Long and unique beats complex and reused. Here is a simple password strategy that actually works.',
`Attackers rarely "guess" passwords one at a time. They take passwords leaked from one site and try them everywhere. That is why reuse is the biggest risk.

## The simple rules

- **Make it long.** A passphrase of four or more random words is stronger and easier to remember than "P@ssw0rd1!".
- **Make it unique.** Every account gets its own password.
- **Use a password manager** to create and store them, so you only remember one strong master passphrase.
- **Never share passwords** by chat or email.

## Check if you've been exposed

Search your email address on a breach-notification service such as Have I Been Pwned. If it appears, change that password everywhere you used it.

Start with the accounts that matter most: your email, your bank, and your phone account. If someone controls your email, they can reset almost everything else.`],

  ['Turn On Multi-Factor Authentication Today', 'Accounts',
    'A second step at login blocks the vast majority of account takeovers. It takes five minutes to set up.',
`Multi-factor authentication (MFA) asks for something more than your password — such as a code from an app, or a physical security key. Even if a criminal steals your password, they still cannot log in.

## Which MFA is best?

- **Security keys or passkeys:** strongest, and resistant to phishing.
- **Authenticator apps:** very good and free.
- **SMS codes:** better than nothing, but they can be intercepted or redirected, so use them only if nothing else is offered.

## Where to turn it on first

- Your main email account
- Banking and payment apps
- Social media
- Cloud storage and work accounts

Save your backup codes somewhere safe and offline. If you lose your phone, those codes get you back in.`],

  ['Ransomware: How It Works and How to Prepare', 'Malware',
    'Ransomware locks your files and demands payment. Preparation matters far more than reaction.',
`Ransomware is malware that encrypts your files and demands money to unlock them. It usually arrives through phishing emails, fake downloads, or unpatched software.

## Before an attack

- **Back up regularly** using the 3-2-1 rule: three copies, on two different types of storage, with one copy offline or off-site.
- **Test your restores.** A backup you have never restored is only a hope.
- **Keep everything updated**, including your router and phone.
- **Limit admin rights.** Use a normal account for daily work.

## If you are hit

- Disconnect the device from the network immediately.
- Do not pay without expert advice. Payment does not guarantee you get your files back and it encourages more attacks.
- Report it to your IT team or the relevant authorities, and restore from clean backups.

Good backups turn a disaster into an inconvenience.`],

  ['Staying Safe on Public Wi-Fi', 'Network',
    'Cafe, airport and hotel networks are convenient, but you cannot know who else is on them.',
`Public Wi-Fi is shared with strangers, and some networks are set up by attackers with names that look genuine, like "Airport_Free_WiFi".

## Simple habits

- **Confirm the network name** with staff before connecting.
- **Stick to HTTPS sites.** Most modern sites use it, but never ignore a browser certificate warning.
- **Avoid sensitive tasks** like banking on public networks. Use your mobile data instead.
- **Use a trusted VPN** if you must work on a shared network.
- **Turn off auto-connect** and file sharing, and forget the network when you leave.

Your phone's personal hotspot is usually a safer choice than an unknown open network.`],

  ['Social Engineering: When the Target Is You', 'Social Engineering',
    'Attackers often skip the technology and manipulate people instead. Learn their favourite tricks.',
`Social engineering uses trust, fear, curiosity and urgency to make people do things they should not. It happens by phone, text message, email and in person.

## Common tricks

- **Pretexting:** an invented story, like a caller claiming to be from IT who "needs your code to fix a problem".
- **Vishing and smishing:** phishing by voice call or text message.
- **Tailgating:** following an authorised person through a secure door.
- **Fake prizes and "wrong number" chats** that slowly build trust before asking for money.

## How to protect yourself

- Slow down. Pressure to act immediately is the biggest warning sign.
- Verify the person using an independent, known contact method.
- Never read out one-time codes to anyone. Real support teams do not ask for them.
- It is always fine to say, "I'll call you back."`],

  ['Why Software Updates Matter', 'Basics',
    'Updates fix security holes that attackers already know about. Installing them is one of the easiest wins.',
`When a vulnerability is found, the maker releases a patch. Attackers then study the patch to learn the flaw, and scan the internet for anyone who has not updated yet. Delaying updates leaves the door open.

## What to keep updated

- Your phone and computer operating systems
- Web browsers and their extensions
- Apps and plugins, especially ones that open documents or connect to the internet
- Your home router's firmware

## Make it easy

- **Turn on automatic updates** wherever possible.
- **Restart** when asked. Many updates do not take effect until you do.
- **Remove software you no longer use**, since every extra program is extra risk.
- Replace anything that no longer receives security updates.`],
];

const dates = ['2026-09-28', '2026-09-21', '2026-09-14', '2026-09-07', '2026-08-31', '2026-08-24', '2026-08-17'];

// Newest first. To add an article, add a row above and give it a date.
export const articles = rows.map(([title, category, summary, content], i) => ({
  id: i + 1,
  title,
  category,
  summary,
  content,
  date: dates[i],
}));
