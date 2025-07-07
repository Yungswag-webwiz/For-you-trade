let token = '';
let currentUser = '';

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    alert(data.msg);
  });
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    if (data.token) {
      token = data.token;
      currentUser = username;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('trade').style.display = 'block';
      updateBalance();
      fetchPrice();
      setInterval(fetchPrice, 10000);
    } else {
      alert(data.msg);
    }
  });
}

function makeTrade() {
  const action = document.getElementById('action').value;
  const amount = parseFloat(document.getElementById('amount').value);
  fetch('/api/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, action, amount })
  }).then(res => res.json()).then(data => {
    document.getElementById('message').innerText = data.msg;
    updateBalance();
  });
}

function updateBalance() {
  fetch('/api/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, action: 'sell', amount: 0 })
  }).then(res => res.json()).then(data => {
    document.getElementById('balance').innerText = 'Balance: $' + data.balance;
  });
}

function fetchPrice() {
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
    .then(res => res.json())
    .then(data => {
      const btc = data.bitcoin.usd;
      const eth = data.ethereum.usd;
      document.getElementById('price').innerText = `BTC: $${btc} | ETH: $${eth}`;
    });
}
