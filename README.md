# 🔐 Crypto Signature Web Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-4f46e5?style=for-the-badge&logo=semver&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)
![Security](https://img.shields.io/badge/security-military--grade-ef4444?style=for-the-badge&logo=shield&logoColor=white)
![Browser](https://img.shields.io/badge/browser-modern-8b5cf6?style=for-the-badge&logo=googlechrome&logoColor=white)

**🚀 Beautiful and secure digital signature tool with military-grade encryption**

*Generate RSA-PSS keys, sign documents, and verify signatures - all client-side with stunning glassmorphism design*

[🌟 **Live Demo**](https://rajibkd1.github.io/crypto-signature-web-tool/) • [📚 **Documentation**](#-documentation) • [🛠️ **Installation**](#-installation)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔑 **Key Management**
- Generate RSA-PSS 2048-bit key pairs
- Download keys in PEM format
- Import existing private keys
- Secure clipboard operations

</td>
<td width="50%">

### ✍️ **Document Signing**
- Sign text content directly
- Upload and sign any file type
- Drag & drop file support
- Export signatures as text files

</td>
</tr>
<tr>
<td width="50%">

### 🔍 **Signature Verification**
- Multi-file upload verification
- Real-time authenticity checking
- Detailed validation results
- Cross-platform compatibility

</td>
<td width="50%">

### 🎨 **User Experience**
- Beautiful glassmorphism design
- Responsive mobile-first layout
- Keyboard shortcuts support
- Auto-save functionality

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Rajibkd1/crypto-signature-web-tool.git
cd crypto-signature-web-tool
```

### 2. Open in Browser
```bash
# Simply open index.html in any modern browser
open index.html

# Or serve locally
python -m http.server 8000
```

### 3. Start Using
1. **Generate** your key pair
2. **Sign** documents or text
3. **Verify** signatures

---

## 📁 Project Structure

```
crypto-signature-web-tool/
├── 📄 index.html          # Main application structure
├── 🎨 styles.css          # Beautiful styling & animations
├── ⚡ script.js           # Core functionality
├── 📖 README.md           # This file
└── 📋 documentation.md    # Detailed documentation
```

---

## 🛠️ Installation

### Prerequisites
- Modern web browser (Chrome 37+, Firefox 34+, Safari 7+, Edge 12+)
- No additional dependencies required!

### Local Development
```bash
# Clone the repository
git clone https://github.com/Rajibkd1/crypto-signature-web-tool.git

# Navigate to directory
cd crypto-signature-web-tool

# Open with live server (optional)
npx live-server
```

### Deploy to Web Server
```bash
# Upload all files to your web server
# Ensure HTTPS for production use
# No server-side configuration needed
```

---

## 🔧 Usage

### Generate Key Pair
```javascript
🔑 Click "Generate Keys" → 🎲 Generate New Key Pair
📥 Download both public and private keys
🔒 Keep private key secure!
```

### Sign Documents
```javascript
📝 Text Input: Type or paste content
📁 File Upload: Select any file type
🔐 Provide private key
🖊️ Create signature → 💾 Download
```

### Verify Signatures
```javascript
📄 Upload original document
🔓 Upload public key file
🎯 Upload signature file
🔍 Verify → ✅ Valid/❌ Invalid
```

---

## 🔒 Security & Privacy

<div align="center">

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 **Client-Side Only** | ✅ | All operations happen in your browser |
| 🛡️ **No Data Collection** | ✅ | Zero tracking or analytics |
| 🔑 **Military-Grade Encryption** | ✅ | RSA-PSS 2048-bit with SHA-256 |
| 🚫 **No Server Communication** | ✅ | Complete offline functionality |
| 🧹 **Memory Cleanup** | ✅ | Sensitive data cleared automatically |

</div>

### Cryptographic Specifications
- **Algorithm**: RSA-PSS (PKCS#1 v2.1)
- **Key Size**: 2048 bits
- **Hash Function**: SHA-256
- **Salt Length**: 32 bytes
- **Standards**: FIPS 140-2 compliant

---

## 🌐 Browser Compatibility

<div align="center">

| Browser | Version | Status |
|---------|---------|--------|
| ![Chrome](https://img.shields.io/badge/Chrome-37+-green?logo=googlechrome) | 37+ | ✅ Fully Supported |
| ![Firefox](https://img.shields.io/badge/Firefox-34+-green?logo=firefox) | 34+ | ✅ Fully Supported |
| ![Safari](https://img.shields.io/badge/Safari-7+-green?logo=safari) | 7+ | ✅ Fully Supported |
| ![Edge](https://img.shields.io/badge/Edge-12+-green?logo=microsoftedge) | 12+ | ✅ Fully Supported |
| ![Opera](https://img.shields.io/badge/Opera-24+-green?logo=opera) | 24+ | ✅ Fully Supported |

</div>

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + G` | Go to Generate Keys |
| `Ctrl/Cmd + S` | Go to Sign Document |
| `Ctrl/Cmd + V` | Go to Verify Signature |
| `Escape` | Close instruction panel |
| `Arrow Keys` | Navigate between tabs |

---

## 🎯 Use Cases

### 📋 **Legal & Business**
- Contract signing and verification
- Legal document authentication
- Business agreement validation
- Compliance documentation

### 💰 **Financial Services**
- Transaction verification
- Banking document security
- Insurance claim validation
- Investment agreement signing

### 🏛️ **Government & Public**
- Official document signing
- Permit and license verification
- Public record authentication
- Regulatory compliance

### 💻 **Technology**
- Software package signing
- Code integrity verification
- API authentication
- Digital certificate management

---

## 🔧 Technical Implementation

### Core Technologies
```javascript
// Web Crypto API for cryptographic operations
const keyPair = await crypto.subtle.generateKey({
  name: "RSA-PSS",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256"
}, true, ["sign", "verify"]);

// File API for document handling
const fileContent = await file.arrayBuffer();

// Modern JavaScript (ES6+)
const signature = await signData(privateKey, data);
```

### Architecture
- **Frontend Only**: Pure client-side application
- **No Dependencies**: Uses only browser APIs
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first approach

---

## 🚨 Troubleshooting

### Common Issues

<details>
<summary><strong>🔴 "Web Crypto API not supported"</strong></summary>

**Solution**: Update your browser to a modern version
- Chrome 37+, Firefox 34+, Safari 7+, Edge 12+
- Ensure you're using HTTPS in production
</details>

<details>
<summary><strong>🟡 "Failed to generate keys"</strong></summary>

**Solution**: 
- Wait a few seconds and try again
- Close other browser tabs to free memory
- Restart your browser if the issue persists
</details>

<details>
<summary><strong>🔴 "Invalid private key format"</strong></summary>

**Solution**:
- Ensure the key is in PEM format
- Check that the key file isn't corrupted
- Verify the key isn't password-protected
</details>

<details>
<summary><strong>🟡 Signature verification fails</strong></summary>

**Solution**:
- Verify all three files are correct
- Ensure the document hasn't been modified
- Check that the public key matches the private key used for signing
</details>

---

## 📊 Performance

### Benchmarks
- **Key Generation**: 1-3 seconds (typical)
- **Document Signing**: < 1 second (most files)
- **Signature Verification**: < 1 second
- **File Size Limit**: 50MB recommended, 100MB+ possible

### Optimization Tips
- Close unnecessary browser tabs
- Use modern browsers for best performance
- Keep files under 50MB for optimal speed
- Clear browser cache if experiencing issues

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
- Use the [issue tracker](https://github.com/Rajibkd1/crypto-signature-web-tool/issues)
- Include browser version and steps to reproduce
- Provide error messages if any

### 💡 **Feature Requests**
- Describe the use case
- Explain the expected behavior
- Consider security implications

### 🔧 **Code Contributions**
```bash
# Fork the repository
git fork https://github.com/Rajibkd1/crypto-signature-web-tool.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Create a Pull Request
```

---



---

## 🙏 Acknowledgments

- **Web Crypto API** - For providing secure cryptographic operations
- **Inter Font** - Beautiful typography by Rasmus Andersson
- **JetBrains Mono** - Excellent monospace font for code
- **Community** - For feedback, bug reports, and contributions

---

## 📞 Support

<div align="center">

### Need Help?

[![Documentation](https://img.shields.io/badge/📖-Documentation-blue?style=for-the-badge)](./documentation.md)
[![Issues](https://img.shields.io/badge/🐛-Report%20Bug-red?style=for-the-badge)](https://github.com/Rajibkd1/crypto-signature-web-tool/issues)
[![Discussions](https://img.shields.io/badge/💬-Discussions-green?style=for-the-badge)](https://github.com/Rajibkd1/crypto-signature-web-tool/discussions)

</div>

---

<div align="center">

**Made with ❤️ for secure digital communications**

*Your privacy and security are our top priority*

[⬆️ Back to Top](#-crypto-signature-web-tool)

</div>
