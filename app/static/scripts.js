
let allCharacters = [];

async function fetchCharacters() {
    try {
        const response = await fetch('/api/v1/characters/');
        const data = await response.json();
        allCharacters = data; 
        displayCharacterCards(allCharacters); 
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

function displayCharacterCards(characters) {
    const characterCardsContainer = document.getElementById('characterCards');
    characterCardsContainer.innerHTML = ''; 

    characters.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.onclick = () => openModal(character);

        const img = document.createElement('img');
        img.src = character.image;
        img.alt = character.name;
        card.appendChild(img);

        const name = document.createElement('p');
        name.textContent = character.name;
        card.appendChild(name);

        characterCardsContainer.appendChild(card);
    });
}

const classification_type = {
    'animals': 'Животные',
    'hostile': 'Враждебные мобы',
    'neutral': 'Нейтральные мобы',
    'npc': 'Мирные NPC',
    'main': 'Главный персонаж',
    'boss': 'Босс-мобы',
}

function openModal(character) {
    const modal = document.getElementById('characterModal');
    const name = document.getElementById('characterName');
    const image = document.getElementById('characterImage');
    const description = document.getElementById('characterDescription');
    const classification = document.getElementById('characterClassification');
    const specialInformation = document.getElementById('specialInformation');

    name.textContent = character.name;
    image.src = character.image;
    description.textContent = character.description;
    classification.textContent = `${classification_type[character.classification]}`;
    specialInformation.textContent = `${character.special_information}`;

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('characterModal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('characterModal');
    if (event.target === modal) {
        closeModal();
    }
}

function searchAndFilter() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('classificationFilter').value;

    const filteredCharacters = allCharacters.filter(character => {
        const matchesName = character.name.toLowerCase().includes(searchInput);
        const matchesClassification = filter === 'all' || character.classification === filter;

        return matchesName && matchesClassification;
    });

    displayCharacterCards(filteredCharacters); 
}




window.onclick = function(event) {
    const modal = document.getElementById('chooseModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('characterModal');
    if (event.target === modal) {
        closeModal();
    }
}

function closeModal() {
    const modal = document.getElementById('characterModal');
    modal.style.display = 'none';
}

window.onload = function() {
    // document.getElementById('chooseModal').style.display = 'flex'; 
    fetchCharacters() 
}
