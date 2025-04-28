let allCharacters = [];

function searchCharacters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    // console.log(searchInput)
    const filteredCharacters = allCharacters.filter(character => {
        return character.name.toLowerCase().includes(searchInput);
    });

    displayCharacterCards(filteredCharacters);
}

function fetchCharacters() {
    fetch('/api/v1/characters/')
        .then(response => response.json())
        .then(data => {
            allCharacters = data;
            displayCharacterCards(allCharacters);
        })
        .catch(error => console.error('Ошибка:', error));
}

const classification_type = {
    'animals': 'Животные',
    'hostile': 'Враждебные мобы',
    'neutral': 'Нейтральные мобы',
    'npc': 'Мирные NPC',
    'main': 'Главный персонаж',
    'boss': 'Босс-мобы',
}

function displayCharacterCards(characters) {
    const characterCardsContainer = document.getElementById('characterCards');
    characterCardsContainer.innerHTML = '';

    characters.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = character.image;
        img.alt = character.name;
        card.appendChild(img);

        const info = document.createElement('div');
        info.classList.add('card-info');

        const name = document.createElement('h3');
        name.textContent = character.name + ' [' + classification_type[character.classification] + ']';
        info.appendChild(name);

        const description = document.createElement('p');
        description.textContent = character.description.slice(0, 250);
        info.appendChild(description);

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Изменить';
        editButton.onclick = () => openEditModal(character);
        buttons.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteCharacter(character.id);
        buttons.appendChild(deleteButton);

        card.appendChild(info);
        card.appendChild(buttons);

        characterCardsContainer.appendChild(card);
    });
}

function deleteCharacter(id) {
    const url = `/api/v1/characters/${id}/`;

    fetch(url, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Персонаж удален');
                window.location.reload()
                // document.getElementById('searchInput').value = ''
                // searchCharacters();
            } else {
                alert('Ошибка при удалении персонажа');
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function openEditModal(character) {
    currentCharacter = character;

    const modal = document.getElementById('characterModal');
    const name = document.getElementById('characterName');
    const description = document.getElementById('characterDescription');
    const classification = document.getElementById('classification');
    const specialInformation = document.getElementById('specialInformation');
    const submitBtn = document.getElementById('submitBtn');
    const modalTitle = document.getElementById('modalTitle');

    name.value = character.name;
    description.value = character.description;
    classification.value = character.classification;
    specialInformation.value = character.special_information;

    modalTitle.textContent = "Редактировать персонажа";
    submitBtn.textContent = "Сохранить изменения";

    modal.style.display = 'flex';

    document.getElementById('editCharacterForm').onsubmit = function(event) {
        event.preventDefault();
        const characterData = {
            name: name.value,
            description: description.value,
            classification: classification.value,
            special_information: specialInformation.value
        };
        const image = document.getElementById('characterImage').files[0];

        const formData = new FormData();
        formData.append('name', characterData.name);
        formData.append('description', characterData.description);
        formData.append('classification', characterData.classification);
        formData.append('special_information', characterData.special_information);
        if (image) formData.append('image', image);

        const url = `/api/v1/characters/${currentCharacter.id}/`;

        fetch(url, {
            method: 'PUT',
            headers: { },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                alert('Персонаж обновлен');
                window.location.reload()
                // searchCharacters();
                // closeModal();
            } else {
                alert('Ошибка при обновлении персонажа');
            }
        })
        .catch(error => console.error('Ошибка:', error));
    };
}

function openAddModal() {
    currentCharacter = null;

    const modal = document.getElementById('characterModal');
    const name = document.getElementById('characterName');
    const description = document.getElementById('characterDescription');
    const classification = document.getElementById('classification');
    const specialInformation = document.getElementById('specialInformation');
    const submitBtn = document.getElementById('submitBtn');
    const modalTitle = document.getElementById('modalTitle');

    name.value = '';
    description.value = '';
    classification.value = 'animals';
    specialInformation.value = '';

    modalTitle.textContent = "Добавить персонажа";
    submitBtn.textContent = "Добавить персонажа";

    modal.style.display = 'flex';

    document.getElementById('editCharacterForm').onsubmit = function(event) {
        event.preventDefault();

        const name = document.getElementById('characterName').value;
        const description = document.getElementById('characterDescription').value;
        const classification = document.getElementById('classification').value;
        const specialInformation = document.getElementById('specialInformation').value;
        const image = document.getElementById('characterImage').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('classification', classification);
        formData.append('special_information', specialInformation);
        if (image) formData.append('image', image);

        const url = currentCharacter ? `/api/v1/characters/${currentCharacter.id}/` : `/api/v1/characters/`;

        const method = currentCharacter ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
            },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                alert('Персонаж сохранен');
                window.location.reload()
                // searchCharacters();
                // closeModal();
            } else {
                alert('Ошибка при сохранении персонажа');
            }
        })
        .catch(error => console.error('Ошибка:', error));
    };
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

window.onload = fetchCharacters;
