// utils.js

function generateRandomIP() {
  // Filter to ensure it doesn't fall within reserved IP ranges, adapt as needed
  const randomOctet = () => Math.floor(Math.random() * 256);

  // Simple check to avoid generating a private IP, adjust logic as needed
  let ip;
  do {
    ip = `${randomOctet()}.${randomOctet()}.${randomOctet()}.${randomOctet()}`;
  } while (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') || 
    (ip.startsWith('172.') && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31)
  );

  return ip;
}

function randomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1',
    // Add more or dynamically fetch User-Agent strings from an external service if needed
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports = { generateRandomIP, randomUserAgent };
