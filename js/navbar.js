// DYNAMIC NAVBAR MOMENT

const navData = [
    {
        title: 'クリエイティビティ (創造)', // Creative
        items: [
            { text: 'Home Page', link: '/pages/home.html', title: 'back to lobby' },
            { text: 'Art Repo', link: '/pages/art.html', title: 'my lil artworks' },
            { text: 'My Mixes', link: '/pages/mix.html', title: 'some of my sound-works' }
        ]
    },
    {
        title: 'ジェネラビティ（世代）', // Personal
        items: [
            { text: 'Record Highlight', link: '/pages/record.html', title: 'my favourite record for the week' },
            { text: 'New Thoughts', link: '', title: 'just some random ideas that i get' }
        ]
    },
    {
        title: 'マテリアライゼネ (質的な)', // Material
        items: [
            { text: '8-bitizer', link: '/pages/converter.html', title: 'make crunchy audio files', target: '_blank' },
        ]
    }
];

function createNavbar() {
    const navbarContainer = document.querySelector('.navbar');

    navData.forEach(section => {
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = section.title;
        navbarContainer.appendChild(sectionTitle);

        const sectionList = document.createElement('ul');
        section.items.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.link;
            link.title = item.title;
            if (item.target) link.target = item.target;
            link.textContent = item.text;
            listItem.appendChild(link);
            sectionList.appendChild(listItem);
        });
        navbarContainer.appendChild(sectionList);
    });
}

createNavbar();  