// Record data array
const records = [
  {
    title: "Exorcise The Demons [1999]",
    imageSource: "/assets/images/records/2024/SD99.webp",
    link: "/pages/record/2024/34.html",
    week: 34,
    year: 2024,
  },
  {
    title: "Realm of Chaos [1989]",
    imageSource: "/assets/images/records/2024/BT89.webp",
    link: "/pages/record/2024/35.html",
    week: 35,
    year: 2024,
  },
  {
    title: "Paradise [1998]",
    imageSource: "/assets/images/records/2024/BS98.webp",
    link: "/pages/record/2024/36.html",
    week: 36,
    year: 2024,
  },
  {
    title: "Welcome to Sky Valley [1989]",
    imageSource: "/assets/images/records/2024/KY94.webp",
    link: "/pages/record/2024/37.html",
    week: 37,
    year: 2024,
  },
  {
    title: "100% Ghetto 4 [2010]",
    imageSource: "/assets/images/records/2024/DC10.webp",
    link: "/pages/record/2024/38.html",
    week: 38,
    year: 2024,
  },
  {
    title: "Godflesh [1988]",
    imageSource: "/assets/images/records/2024/GF88.webp",
    link: "/pages/record/2024/39.html",
    week: 39,
    year: 2024,
  },
];

// Sort the record data array by date in descending order
const sortedRecords = records.sort((a, b) => {
  if (a.year !== b.year) {
    return b.year - a.year; // Sort by year descending
  }
  return b.week - a.week; // If same year, sort by week descending
});

// Get the container element where you want to append the record items
const recordContainer = document.querySelector('.record-container');

// Loop through the sorted records and generate HTML
sortedRecords.forEach(record => {
  const recordItem = document.createElement('div');
  recordItem.classList.add('record-item');

  const link = document.createElement('a');
  link.href = record.link;
  link.target = '_blank';

  const image = document.createElement('img');
  image.src = record.imageSource;
  //image.alt = record.title; // Hidden because I don't like the weird text shown before load...

  link.appendChild(image);
  recordItem.appendChild(link);

  const titleAndDateContainer = document.createElement('div');
  titleAndDateContainer.classList.add('title-container');

  const title = document.createElement('h3');
  title.textContent = record.title;

  const date = document.createElement('span');
  date.textContent = `${record.year} | WEEK ${record.week}`;

  titleAndDateContainer.appendChild(title);
  titleAndDateContainer.appendChild(date);

  recordItem.appendChild(titleAndDateContainer);

  recordContainer.appendChild(recordItem);
});