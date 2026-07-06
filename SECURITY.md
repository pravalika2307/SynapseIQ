# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.x | ✅ Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in SynapseIQ, please report it responsibly by opening a [GitHub Security Advisory](https://github.com/pravalika2307/SynapseIQ/security/advisories/new) rather than filing a public issue.

### What to Include

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested mitigations

We will acknowledge your report within 48 hours and aim to resolve confirmed vulnerabilities within 7 days.

## Privacy Notes

SynapseIQ is a **client-side only** application:

- All CSV data is processed in-browser using JavaScript — no data is uploaded to any server
- Google Gemini API keys are stored in browser session memory only, never persisted or transmitted to any third-party service other than the Google Gemini API endpoint
- No analytics, tracking, or telemetry is collected by SynapseIQ itself

## Data Handling

- Uploaded datasets never leave your browser unless you explicitly enable Gemini API integration
- When Gemini integration is enabled, dataset summaries (not raw data) are sent to the Google Gemini API in accordance with [Google's privacy policy](https://policies.google.com/privacy)
