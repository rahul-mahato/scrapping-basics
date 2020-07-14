const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const { login, getNotices } = require('./controller/scrapper');
const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey =
  'BMSmeAZcpJsKSjuzISlaC3rCRPlRPD5CwbeuGmNZng-wtXezGtM09kRqDvzUst10cJF0BJJQjEL08KucUa1fbgE';
const privateVapidKey = 'nLiI8lawGmkirnKmLtjPp-386QLycbRdKv-FHyy7CAQ';

webpush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post('/subscribe', async (req, res) => {
  // Get pushSubscription object
  const { subscription, email, pass } = req.body;
  const subscriptions = subscription;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const data = await Promise.resolve(login(email, pass));
  const payload = JSON.stringify({ title: data.notice });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscriptions, payload)
    .catch((err) => console.error(err));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
