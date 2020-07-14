const publicVapidKey =
  'BMSmeAZcpJsKSjuzISlaC3rCRPlRPD5CwbeuGmNZng-wtXezGtM09kRqDvzUst10cJF0BJJQjEL08KucUa1fbgE';

// Check for service worker
if ('serviceWorker' in navigator) {
  console.log('hello');
  let savedEmail = localStorage.getItem('email');
  let savedPass = localStorage.getItem('pwd');
  if (savedEmail !== null && savedPass !== null) {
    document.getElementById(
      'form'
    ).innerHTML = `<h1>You will receive notifications</h1>`;
    send(savedEmail, savedPass).catch((err) => console.error(err));
    setInterval(() => {
      console.log('hi');
      send(savedEmail, savedPass).catch((err) => console.error(err));
    }, 120000);
  } else {
    console.log('hello');
    document.getElementById('form').innerHTML = `<form id="loginForm">
      Email : <input type="email" id="email" name="email" /> <br />
      Password : <input type="password" id="pwd" name="pwd" /> <br />
      <button type="submit">Submit</button>
    </form>`;
  }
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm['email'].value;
  const password = loginForm['pwd'].value;
  localStorage.setItem('email', email);
  localStorage.setItem('pwd', password);
});

// Register SW, Register Push, Send Push
async function send(email, pass) {
  // Register Service Worker
  console.log('Registering service worker...');
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/',
  });
  console.log('Service Worker Registered...');

  // Register Push
  console.log('Registering Push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log('Push Registered...');

  console.log('Sending Push...');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, email, pass }),
    headers: {
      'content-type': 'application/json',
    },
  });
  console.log('Push Sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
