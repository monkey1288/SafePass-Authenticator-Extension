This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

# SafePass Authenticator

A secure and user-friendly 2FA (Two-Factor Authentication) account manager browser extension built with React and TypeScript.

## Features

- **Secure 2FA Management**: Store and manage your 2FA accounts securely in your browser
- **Real-time TOTP Generation**: Generate time-based one-time passwords that update every 30 seconds
- **Multiple Input Methods**: Add accounts manually or by scanning QR codes
- **Clean Interface**: Modern, intuitive UI with progress bars showing code expiration
- **Local Storage**: All data is stored locally in your browser for maximum privacy
- **Copy to Clipboard**: One-click copying of authentication codes

## Installation

### Development Mode

1. Clone the repository:
```bash
git clone <repository-url>
cd safepass-extension
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build/chrome-mv3-dev` folder

### Production Build

1. Build the extension:
```bash
pnpm build
```

2. Load the extension from the `build/chrome-mv3-prod` folder

## Usage

### Adding a New Account

1. Click the "+" button in the bottom right corner
2. Choose between manual input or QR code scanning:
   - **Manual Input**: Enter account name, issuer, and secret key manually
   - **QR Code**: Upload a QR code image or paste QR code data

### Managing Accounts

- **View Codes**: Each account displays a 6-digit TOTP code that updates every 30 seconds
- **Copy Codes**: Click the copy icon to copy the current code to clipboard
- **Delete Accounts**: Click the delete icon to remove an account
- **Progress Bar**: Visual indicator showing how much time remains before the code refreshes

### Supported Formats

The extension supports standard TOTP formats including:
- Google Authenticator QR codes
- Authy QR codes
- Manual secret key entry
- otpauth:// URLs

## Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Plasmo (Chrome Extension Framework)
- **Styling**: Tailwind CSS
- **TOTP Generation**: otplib library
- **QR Code Support**: qrcode library
- **Storage**: Chrome Extension Storage API
- **Permissions**: storage, clipboardWrite

## Security Features

- All data is stored locally in your browser
- No data is transmitted to external servers
- Uses industry-standard TOTP algorithms
- Secure clipboard operations

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── AccountCard.tsx # Individual account display
│   ├── AccountList.tsx # List of all accounts
│   └── AddAccountModal.tsx # Add account dialog
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── totp.ts        # TOTP generation logic
│   ├── storage.ts     # Storage operations
│   └── qr.ts          # QR code parsing
├── popup.tsx          # Main popup interface
└── style.css          # Global styles
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm package` - Create distributable package

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
