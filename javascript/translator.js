// Define Braille symbols for each letter in the lowercase English alphabet
const brailleLower = [
    'O.....', 'O.O...', 'OO....', 'OO.O..', 'O..O..', 'OOO...', 'OOOO..', 'O.OO..', '.OO...', '.OOO..',
    'O...O.', 'O.O.O.', 'OO..O.', 'OO.OO.', 'O..OO.', 'OOO.O.', 'OOOOO.', 'O.OOO.', '.OO.O.', '.OOOO.',
    'O...OO', 'O.O.OO', '.OOO.O', 'OO..OO', 'OO.OOO', 'O..OOO'
];

// Define English lowercase alphabet, numbers, Braille capital letters and numbers indicators and space
const lowerCase = 'abcdefghijklmnopqrstuvwxyz', numbers = '1234567890';
const capitalIndicator = '.....O', numberIndicator = '.O.OOO'; 
const space = '......';

// Create a Braille map that links lowercase alphabet, uppercase alphabet and numbers to their Braille equivalents
const brailleMap = lowerCase.split('').reduce((map, char, i) => {
    map[char] = brailleLower[i];  
    map[char.toUpperCase()] = `${capitalIndicator}${brailleLower[i]}`;  
    map[numbers[i]] = brailleLower[i];  
    return map;
}, {});

// Reverse map that links Braille symbols to lowercase alphabet, uppercase alphabet and numbers
const reverseBrailleMap = Object.fromEntries(Object.entries(brailleMap).map(([key, val]) => [val, key]));

// Add mappings for Braille capital letters and numbers indicators and space
Object.assign(reverseBrailleMap, {
    [capitalIndicator]: 'capital',  
    [numberIndicator]: 'number',
    [space]: ' '
});

// Function to determine if the input is in Braille format
const isBraille = input => /[O.]/.test(input);

// Translate a Braille string into English
function translateToEnglish(braille) {
    let isCapital = false, isNumber = false;
    return braille.match(/.{1,6}/g).map(b => {
        if (b === capitalIndicator) return isCapital = true, '';  // Enable capital letter mode
        if (b === numberIndicator) return isNumber = true, '';    // Enable number mode

        // Translate the Braille block into a letter
        let letter = reverseBrailleMap[b] || '';  
        if (isCapital) letter = letter.toUpperCase(), isCapital = false;  // Capitalize the next letter
        // If number mode is active, convert Braille symbols into corresponding numbers
        if (isNumber && letter >= 'a' && letter <= 'j') {
            letter = '1234567890'['abcdefghij'.indexOf(letter)];
        }
        if (letter === ' ') isNumber = false;

        return letter;
    }).join('');  // Join the translated letters into a single English string
}

// Translate an English string into Braille
const translateToBraille = english => {
    let isNumberMode = false; 
    let previousWasSpace = false;  // Track if the previous character was a space
    return english.split('').map(char => {
        // Check if the character is a number
        if (numbers.includes(char)) {
            previousWasSpace = false; // Reset space tracking for numbers

            if (!isNumberMode) {
                isNumberMode = true; 
                return `${numberIndicator}${brailleMap[char]}`; // Add the number indicator before the first number
            }
            return brailleMap[char]; // Return the Braille symbol for the number
        } else {
            isNumberMode = false; // Reset number mode when encountering a non-number

            if (char === ' ') {
                if (!previousWasSpace) {
                    previousWasSpace = true; // Mark that the current character is a space
                    return space; // Return the Braille symbol for space
                }
                return ''; // Avoid adding multiple consecutive spaces
            }
            
            previousWasSpace = false; // Reset space tracking for non-space characters
            return brailleMap[char] || ''; // Return the Braille symbol for the letter, or empty string if not found
        }
    }).join(''); // Join all the Braille symbols into a single string
};


// Capture the input provided via the command-line arguments
const input = process.argv.slice(2).join(' ');

// Determine whether to translate from Braille to English or English to Braille, then output the result
console.log(isBraille(input) ? translateToEnglish(input) : translateToBraille(input));
