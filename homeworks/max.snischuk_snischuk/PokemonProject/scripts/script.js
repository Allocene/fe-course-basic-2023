const FIRST_VALUE_ELEMENT = document.querySelector('[data-math-value="first"]');
const SECOND_VALUE_ELEMENT = document.querySelector('[data-math-value="second"]');
const OPERATION_ELEMENT = document.querySelector('[data-math-operation]');
const CALCULATE_BUTTON_ELEMENT = document.querySelector('[data-math-calculate-btn]');
const RESULT_VALUE_ELEMENT = document.querySelector('[data-math-output-value]');
const CALCULATOR_CONTAINER = document.querySelector('[data-math-container]');

const MIN_CARDS_IN_COLUMN = 1;
const MAX_CARDS_IN_COLUMN = 10;

function deleteMathExpression() {
    const MATH_EXPRESSION_ELEMENT = CALCULATOR_CONTAINER.querySelector('[data-math-output-list]');
    if (!MATH_EXPRESSION_ELEMENT) return;
    MATH_EXPRESSION_ELEMENT.remove();
}

function createMathExpressionElement(value1, sign, value2, result) {
    return `
        <ul class="calculator__math-output-list" data-math-output-list>
            <li class="calculator__math-output-item" data-math-operand="first">${value1}</li>
            <li class="calculator__math-output-item">${sign}</li>
            <li class="calculator__math-output-item">${value2}</li>
            <li class="calculator__math-output-item">=</li>
            <li class="calculator__math-output-item" data-math-operand="last">${result} pokemons</li>
        </ul>
    `;
}

function renderMathExpressionElement() {
    deleteMathExpression();

    const firstValue = FIRST_VALUE_ELEMENT.value;
    const secondValue = SECOND_VALUE_ELEMENT.value;
    const operation = OPERATION_ELEMENT.value;

    const mathResult = window.calculate(firstValue, secondValue, operation);
    RESULT_VALUE_ELEMENT.innerText = mathResult;

    if (typeof mathResult !== 'number') return;

    CALCULATOR_CONTAINER.insertAdjacentHTML('beforeend', createMathExpressionElement(firstValue, operation, secondValue, mathResult));
}

function clearElement(element) {
    if (!element) return;
    element.innerHTML = '';
}

function changeElement(fromElement, toElement) {
    if (!(fromElement instanceof Element) || !(toElement instanceof Element)) return;
    fromElement.outerHTML = toElement.outerHTML;
}

function addElement(parent, child) {
    if (!(parent instanceof Element) || !(child instanceof Element)) return;
    parent.appendChild(child);
}

function createCard() {
    const card = document.createElement('li');
    card.classList.add('calculator__math-output-card');

    const img = document.createElement('img');
    img.classList.add('calculator__math-output-card-img');
    img.src = './images/urshifu.png';
    img.alt = 'urshifu';

    card.appendChild(img);

    return card;
}

function createPartialCard(size) {
    const pokemonCard = createCard();
    pokemonCard.style.clipPath = `inset(0 0 ${100 - size * 100}% 0)`;
    return pokemonCard;
}

function addCardsToList(count) {
    const pokemonsCardsList = document.createElement('ul');
    pokemonsCardsList.classList.add('calculator__column');

    for (let i = 1; i <= count; i++) {
        const pokemonCard = createCard();
        pokemonsCardsList.appendChild(pokemonCard);
    }

    const partialCardSize = count - Math.floor(count);
    if (partialCardSize > 0) {
        const partialCard = createPartialCard(partialCardSize);
        pokemonsCardsList.appendChild(partialCard);
    }

    return pokemonsCardsList;
}

function overlapStyle(cardsCount, gridContainer) {
    const fullCountRow = Math.ceil(Number(cardsCount));
    if (!(gridContainer instanceof Element) || fullCountRow < 0) return;
    gridContainer.style.gridTemplateRows = `repeat(${fullCountRow + 1}, 45px)`;
}

function firstOutputOperandHandler() {
    const MATH_FIRST_OPERAND_ELEMENT = document.querySelector('[data-math-operand="first"]');
    const pokemonsCardsCount = FIRST_VALUE_ELEMENT.value;

    if (pokemonsCardsCount <= 0) {
        deleteMathExpression();
        return;
    }

    if (pokemonsCardsCount < MIN_CARDS_IN_COLUMN) {
        clearElement(MATH_FIRST_OPERAND_ELEMENT);

        const partialCardSize = pokemonsCardsCount;
        const partialCard = createPartialCard(partialCardSize);

        changeElement(MATH_FIRST_OPERAND_ELEMENT, partialCard);
        return;
    }

    if (pokemonsCardsCount <= MAX_CARDS_IN_COLUMN) {
        clearElement(MATH_FIRST_OPERAND_ELEMENT);

        const cardsList = addCardsToList(pokemonsCardsCount);
        overlapStyle(pokemonsCardsCount, cardsList);

        addElement(MATH_FIRST_OPERAND_ELEMENT, cardsList);
    }
}

function lastOutputOperandHandler() {
    const LIMIT_CARDS = 100;
    const MATH_LAST_OPERAND_ELEMENT = document.querySelector('[data-math-operand="last"]');

    const pokemonsCountResult = RESULT_VALUE_ELEMENT.innerText;

    if (pokemonsCountResult <= 0) {
        deleteMathExpression();
        return;
    }

    if (pokemonsCountResult < MIN_CARDS_IN_COLUMN) {
        clearElement(MATH_LAST_OPERAND_ELEMENT);

        const partialCardSize = pokemonsCountResult;
        const partialCard = createPartialCard(partialCardSize);

        changeElement(MATH_LAST_OPERAND_ELEMENT, partialCard);
        return;
    }

    if (pokemonsCountResult <= LIMIT_CARDS) {
        clearElement(MATH_LAST_OPERAND_ELEMENT);

        const columnCount = Math.ceil(pokemonsCountResult / MAX_CARDS_IN_COLUMN);
        let remainingCards = pokemonsCountResult;

        for (let i = 1; i <= columnCount; i++) {
            const cardsInCurrentColumn = Math.min(MAX_CARDS_IN_COLUMN, remainingCards);

            const cardsList = addCardsToList(cardsInCurrentColumn);
            overlapStyle(cardsInCurrentColumn, cardsList);

            addElement(MATH_LAST_OPERAND_ELEMENT, cardsList);
            remainingCards -= cardsInCurrentColumn;
        }
    }
}

CALCULATE_BUTTON_ELEMENT.addEventListener('click', () => {
    renderMathExpressionElement();
});

FIRST_VALUE_ELEMENT.addEventListener('input', () => {
    renderMathExpressionElement();

    firstOutputOperandHandler();
    lastOutputOperandHandler();
});
