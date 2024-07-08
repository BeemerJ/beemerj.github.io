// DYNAMIC NAVBAR MOMENT

const navData = [
    {
        title: 'クリエイティビティ (創造)', // Creativity
        items: [
            { text: 'art_repo', link: '/pages/art.html', title: 'my lil artworks' },
            { text: '20-500', link: '', title: 'ideas for my dream game' },
            { text: 'mix_labs', link: '../pages/mix.html', title: 'some of my sound-works', target: '_blank' }
        ]
    },
    {
        title: 'ジェネラビティ（世代）', // Generavity
        items: [
            { text: 'picking-bones', link: '', title: 'fuck these things fr' },
            { text: 'record/week', link: '../pages/record.html', title: 'my favourite record for the week' },
            { text: 'new-thoughts', link: '', title: 'just some random ideas that i get' }
        ]
    },
    {
        title: 'マテリアライゼネ (質的な)', // Materialize (Qualitative)
        items: [
            { text: 'the_setup', link: '', title: 'the best pc you done ever seen' },
            { text: 'miku_gen', link: '', title: 'miku will dance to your music' },
            { text: 'me', link: '', title: 'about' },
            { text: 'communicate', link: '', title: 'chatbox' }
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