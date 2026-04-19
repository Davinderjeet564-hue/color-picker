import data from './color-data.js';

const colorContainer = document.querySelector('.color-container');
const modalOverlay = document.querySelector('.modal-overlay');
const modalBox = document.querySelector('.modal-box')
const closeButton = document.querySelector('.close-button');
const gotItButton = document.querySelector('.got-it-button');
const index = 1;


data.forEach(color => {
    const colorElement = document.createElement('div');
    colorElement.className = 'color-element';
    colorElement.style.backgroundColor = color.value;
    colorElement.textContent = color.name;
    colorContainer.appendChild(colorElement);
});

function showModal() {
    modalOverlay.classList.add('active');
}

async function checkClipboardForColor(colorCode) {
    try {
        const text = await navigator.clipboard.readText();
        if (!text || text.trim().length === 0) {
            return false;
        }

        return text.includes(colorCode);

    } catch (error) {
        console.error(error);
        return false;
    }
}

function createDiv(textContent){
    const div = document.createElement('div');
    div.textContent = textContent;
    div.style.marginTop = '1rem';
    div.classList.add(`div-${index}`);  
    modalBox.appendChild(div);
}

function removeDiv(div){
    div.remove();
}

colorContainer.addEventListener('click', async (event) => {
    try {
        if (event.target.classList.contains('color-element')) {
            const colorCode = event.target.style.backgroundColor;
            const isColorInClipboard = await checkClipboardForColor(colorCode);
            if (isColorInClipboard) {
                createDiv('Color is already in clipboard!');
                showModal();
                return;
            }
            console.log(colorCode);
            createDiv(`Color hex ${colorCode} copied to clipboard!`);
            showModal();
            await navigator.clipboard.writeText(colorCode);
            
        }
    } catch (error) {
        console.error(error);
    }
});

closeButton.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    removeDiv(modalBox.lastElementChild)
});

gotItButton.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    removeDiv(modalBox.lastElementChild)

});