console.log('Service Worker Loaded...');

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('Push Recieved...');
  self.registration.showNotification(data.title, {
    body: 'TNP IMP!',
    icon:
      'https://kiittnp.in/ea19b38134d463acc8c7b66744a481847ab4b/assets/img/logo.png',
  });
});
