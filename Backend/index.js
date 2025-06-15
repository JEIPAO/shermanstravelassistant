 require('dotenv').config();
 
const express = require('express');
const dotenv = require('dotenv');
const scrapeRoutes = require('./routes/scrape');
const chatRoutes = require('./routes/chat');
const historyRoutes = require('./routes/history');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Pages to Scrape
const pagesToScrape = [
  {
    url: 'https://www.shermanstravel.com/cruise-destinations/alaska-itineraries',
    label: 'Alaska'
  },
  {
    url: 'https://www.shermanstravel.com/cruise-destinations/caribbean-and-bahamas',
    label: 'Caribbean & Bahamas'
  },
  {
    url: 'https://www.shermanstravel.com/cruise-destinations/hawaiian-islands',
    label: 'Hawaiian Islands'
  },
  {
    url: 'https://www.shermanstravel.com/cruise-destinations/northern-europe',
    label: 'Northern Europe'
  }
];

app.use((req, res, next) => {
  req.pagesToScrape = pagesToScrape;
  next();
});

app.use('/scrape', scrapeRoutes);
app.use('/chat', chatRoutes);
app.use('/history', historyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
