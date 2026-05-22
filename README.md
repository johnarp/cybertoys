<div align="center">

![Banner](./public/banner.png)

# CyberToys

A collection of cybersecurity tools.

[![License](https://img.shields.io/github/license/johnarp/cybertoys?style=for-the-badge)](./LICENSE)
![Version](https://img.shields.io/github/v/release/johnarp/cybertoys?style=for-the-badge)

![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ffdf00?style=for-the-badge&logo=javascript&logoColor=black)

</div>

## 🧰 Tools

### Encoding

| Tool | Description |
| - | - |
| Base64 | Encode or decode Base64 strings. |
| URL Encode | URL-encode or decode strings. |

### Hashing

| Tool | Description |
| - | - |
| Hash Generator | Generate SHA256, SHA1, or MD5 hashes from text. |

### Network

| Tool | Description |
| - | - |
| DNS Lookup | Resolve A, AAAA, MX, NS, TXT, and CNAME records for any domain. |
| Network Info | Display local network interfaces, IPs, and MACs. |

### Web

| Tool | Description |
| - | - |
| HTTP Header Analyzer | Fetch HTTP headers and audit them for common security issues. |
| URL Redirect Viewer | Follow a URL through its full redirect chain. |

### Passwords

| Tool | Description |
| - | - |
| Password Analyzer | Analyze password strength and check via HIBP. Uses k-anonymity. |
| Password Generator | Generate strong random passwords. |

## 📦 Built With

| Tool | Purpose |
| - | - |
| Electron Forge | Handles packaging and creating installers |

## 📸 Preview

<div style="display: flex; gap: 10px; justify-content: center">
    <img src="./public/preview-1.png" width="45%">
    <img src="./public/preview-2.png" width="45%">
</div>

## 🚀 Installation

### Option A: Premade Installer

> **Requirements:** Windows 10/11/Server 2016+ (64-bit)

The simplest way is to use the premade [installer](https://github.com/johnarp/cybertoys/releases).

1. Find the latest release
2. Find the .exe (eg. CyberToys-#.#.#-Setup.exe)
3. Download and install

### Option B: Make Your Own Installer

> **Requirements:** [Node.js](https://nodejs.org) (v18+)

1. Clone the repository and run:
    ```
    git clone https://github.com/johnarp/cybertoys.git
    ```
2. Navigate to the repository and install required dependencies
    ```
    cd cybertoys
    npm install
    ```
3. Use Electron Forge to create an installer
    ```
    npm run make
    ```

> Note: This creates an installer for your current operating system. Building for other platforms requires running the command on that platform.

### Option C: Run Without Installing

You can run the app without installing by opening it directly from the source code.

1. Follow **Option B** until and including Step 2.
2. Run the application using:
    ```
    npm start
    ```

## 🗺️ Roadmap

### General

- Installers for different operating systems (eg. MacOS, Linux, etc.)
- Better tool organization in README
- Allow resizing of pop up windows
- Allow zoom in/out
- Run on startup
- Allow changing hotkeys

### New Tools

- Keylogger
- Vulnerability scanner
- Metadata scrubber
- Network traffic analyzer
- Steganography
- MAC spoofing and ARP detection
- Security news scraper
- SSH brute force detector
- Wireless deauth detector
- Credential rotation enforcer
- Cryptographic algorithm encrypter/decrypter/cracker
- Suspicious filename detector
- Traceroute visualizer
- Packet sniffer
- Hash Cracker
- Port Scanner
- SSL Certificate Checker

## 📜 Disclaimer

CyberToys is intended for educational purposes and authorized use only.

Only use these tools against systems and networks you own or have explicit written permission to test. Unauthorized port scanning, traffic analysis, or any other form of network probing may be illegal in your jurisdiction and is not condoned by this project.

The author assumes no liability for any misuse or damage caused by this software. Use responsibly.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).