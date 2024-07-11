// Record data array
const records = [
  {
    title: "Pretty Hate Machine [1989]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/gy2eTF56z6tYkHmDLZqEiVQcf5gA7Eg6Y3caIX1KHQU/rs:fit/g:sm/q:90/h:593/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1NTQ0/LTEyMTI3MTE4NTYu/anBlZw.jpeg"
  },
  {
    title: "Nirvana [2002]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/G9aRdNnZUwH1uehJ6i6w06triCGAQ2U1oIbjjV1Dg0g/rs:fit/g:sm/q:90/h:297/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY0NzYx/NC0xMTQzMDAxNjMy/LmpwZWc.jpeg"
  },
  {
    title: "Exorcise The Demons [1999]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/qiefLPNhsvNv37fb309Z5cgfiG8WS6MrgY3Sxvw2oqs/rs:fit/g:sm/q:90/h:587/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyMTMw/LTEzMTg2MjEyMjgu/anBlZw.jpeg"
  },
  {
    title: "Pretty Hate Machine [1989]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/gy2eTF56z6tYkHmDLZqEiVQcf5gA7Eg6Y3caIX1KHQU/rs:fit/g:sm/q:90/h:593/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1NTQ0/LTEyMTI3MTE4NTYu/anBlZw.jpeg"
  },
  {
    title: "Pretty Hate Machine [1989]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/gy2eTF56z6tYkHmDLZqEiVQcf5gA7Eg6Y3caIX1KHQU/rs:fit/g:sm/q:90/h:593/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1NTQ0/LTEyMTI3MTE4NTYu/anBlZw.jpeg"
  },
  {
    title: "Pretty Hate Machine [1989]",
    date: "2024-01-01",
    imageSource: "https://i.discogs.com/gy2eTF56z6tYkHmDLZqEiVQcf5gA7Eg6Y3caIX1KHQU/rs:fit/g:sm/q:90/h:593/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1NTQ0/LTEyMTI3MTE4NTYu/anBlZw.jpeg"
  },
];

// Sort the record data array by date in descending order
const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));

// Get the container element where you want to append the record items
const recordContainer = document.querySelector('.record-container');

// Loop through the sorted records and generate HTML
sortedRecords.forEach(record => {
  const recordItem = document.createElement('div');
  recordItem.classList.add('record-item');

  const link = document.createElement('a');
  link.href = 'link-to-open'; // Set the desired link URL
  link.target = '_blank';

  const image = document.createElement('img');
  image.src = record.imageSource;
  image.alt = record.title;

  link.appendChild(image);
  recordItem.appendChild(link);

  const titleAndDateContainer = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = record.title;

  const date = document.createElement('span');
  date.textContent = record.date;

  titleAndDateContainer.appendChild(title);
  titleAndDateContainer.appendChild(date);

  recordItem.appendChild(titleAndDateContainer);

  recordContainer.appendChild(recordItem);
});