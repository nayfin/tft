# Project Troubleshooting Guide

This document contains a list of common issues and their solutions for this project.

## Local Development Server Unreachable

**Problem:**
When running `nx run <project>:serve`, the site is unreachable at `http://localhost:4200`. The browser shows a `net::ERR_CONNECTION_REFUSED` error.

**Solution:**
This is often due to how Node.js (v17+) or the OS resolves `localhost` to an IPv6 address (`::1`) while the dev server is only listening on the IPv4 address.

1.  **Access the site directly via the IPv4 loopback address:** `http://127.0.0.1:4200`.
2.  **Force the dev server to listen on all interfaces:** Run the serve command with the `--host` flag: `nx run <project>:serve --host=0.0.0.0`.
