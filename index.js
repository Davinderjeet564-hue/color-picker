import data from './colorData.js';

const colorContainer = document.querySelector('.color-container');
const modalOverlay = document.querySelector('.modal-overlay');
const modalBox = document.querySelector('.modal-box');
const closeButton = document.querySelector('.close-button');
const gotItButton = document.querySelector('.got-it-button');
const toastContainer = document.querySelector('.toast-container');


async function checkClipboardForColor(colorCode) {
    try {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
            console.warn('Clipboard read not supported');
            return false;
        }

        const text = await navigator.clipboard.readText();
        if (!text || text.trim().length === 0) {
            return false;
        }

        return text.includes(colorCode);

    } catch (error) {
        if (error.name === 'NotAllowedError') {
            console.warn('Permission to read clipboard denied');
        } else {
            console.error('Clipboard error:', error);
        }
        return false;
    }
}

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return null; 
    return `#${result.map(x=>parseInt(x).toString(16).padStart(2,'0')).join('')}`;
}

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function setLoading(element, isLoading) {
    if (isLoading) {
        element.style.opacity = '0.6';
        element.style.cursor = 'wait';
    } else {
        element.style.opacity = '1';
        element.style.cursor = 'pointer';
    }
}

function createNotification(textContent){
    const existingNotification = modalBox.querySelector('.notification-message');
    if (existingNotification) {
        existingNotification.remove();
    }

    const div = document.createElement('div');
    div.textContent = textContent;
    div.style.marginTop = '1rem';
    div.classList.add('notification-message');  
    modalBox.appendChild(div);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.classList.add('toast');
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

data.forEach(color => {
    const colorElement = document.createElement('div');
    colorElement.className = 'color-element';
    colorElement.style.backgroundColor = color.value;
    colorElement.style.color = getContrastColor(color.value)
    colorElement.textContent = color.name;
    colorElement.setAttribute('role', 'button');
    colorElement.setAttribute('tabindex', '0');
    colorElement.setAttribute('aria-label', `Copy ${color.name} color to clipboard`);
        
    colorElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.target.click();
        }
    });

    colorContainer.appendChild(colorElement);
});

colorContainer.addEventListener('click', async (event) => {
    try {
        if (event.target.classList.contains('color-element')) {
            const rgbColor = event.target.style.backgroundColor;
            const hexColor = rgbToHex(rgbColor);
            const isColorInClipboard = await checkClipboardForColor(hexColor);
            if (isColorInClipboard) {
                createNotification('Color is already in clipboard!');
                showModal();
                return;
            }

            setLoading(event.target, true);
            try {
                await navigator.clipboard.writeText(hexColor);
                const colorName = event.target.textContent;
                createNotification(`${colorName} ${hexColor} copied to clipboard!`);
                showModal();
            } catch (clipboardError) {
                showToast('Failed to copy to clipboard. Please try again.');
                console.error('Clipboard write error:', clipboardError);
            } finally {
                setLoading(event.target, false);
            }
        }
    } catch (error) {
        console.error(error);
    }
});

modalOverlay.setAttribute('aria-hidden', 'true');
function showModal() {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    gotItButton.focus();
}

closeButton.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    modalBox.querySelector('.notification-message')?.remove()
});

gotItButton.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    modalBox.querySelector('.notification-message')?.remove()
});