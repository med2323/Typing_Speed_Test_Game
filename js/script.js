// Selecting elements from the DOM
const typingText = document.querySelector(".typing-text p"), // Paragraph where typing happens
      inpField = document.querySelector(".wrapper .input-field"), // Input field for typing
      tryAgainBtn = document.querySelector(".content button"), // Button to try again
      timeTag = document.querySelector(".time span b"), // Span to display remaining time
      mistakeTag = document.querySelector(".mistake span"), // Span to display number of mistakes
      wpmTag = document.querySelector(".wpm span"), // Span to display words per minute
      cpmTag = document.querySelector(".cpm span"); // Span to display characters per minute

// Initializing variables
let timer, // Timer for countdown
    maxTime = 60, // Maximum time for the game
    timeLeft = maxTime, // Remaining time
    charIndex = 0, // Index of the current character
    mistakes = 0, // Number of mistakes made
    isTyping = 0; // Boolean to check if typing has started

// Function to load a new paragraph for typing
function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length); // Get a random index for paragraphs array
    typingText.innerHTML = ""; // Clear the typing text
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`; // Wrap each character in a span
        typingText.innerHTML += span; // Append the span to typingText
    });
    typingText.querySelectorAll("span")[0].classList.add("active"); // Make the first character active
    document.addEventListener("keydown", () => inpField.focus()); // Focus input field on keydown
    typingText.addEventListener("click", () => inpField.focus()); // Focus input field on click
}

// Function to handle typing input
function initTyping() {
    const characters = typingText.querySelectorAll("span"); // Get all character spans
    const typedChar = inpField.value.split("")[charIndex]; // Get the currently typed character
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000); // Start the timer
            isTyping = true; // Set isTyping to true
        }
        if(typedChar == null) { // If typedChar is null (backspace)
            if(charIndex > 0) {
                charIndex--; // Decrement charIndex
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--; // Decrement mistakes if character was incorrect
                }
                characters[charIndex].classList.remove("correct", "incorrect"); // Remove classes
            }
        } else {
            if(characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct"); // Add correct class
            } else {
                mistakes++; // Increment mistakes
                characters[charIndex].classList.add("incorrect"); // Add incorrect class
            }
            charIndex++; // Increment charIndex
        }
        characters.forEach(span => span.classList.remove("active")); // Remove active class from all spans
        characters[charIndex].classList.add("active"); // Add active class to current character

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60); // Calculate words per minute
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; // Ensure wpm is a valid number

        wpmTag.innerText = wpm; // Update wpm display
        mistakeTag.innerText = mistakes; // Update mistakes display
        cpmTag.innerText = charIndex - mistakes; // Update characters per minute display
    } else {
        clearInterval(timer); // Clear the timer when time is up or all characters are typed
        inpField.value = ""; // Clear the input field
    }   
}

// Function to handle the countdown timer
function initTimer() {
    if(timeLeft > 0) {
        timeLeft--; // Decrement time left
        timeTag.innerText = timeLeft; // Update time display
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60); // Calculate words per minute
        wpmTag.innerText = wpm; // Update wpm display
    } else {
        clearInterval(timer); // Clear the timer when time is up
    }
}

// Function to reset the game
function resetGame() {
    loadParagraph(); // Load a new paragraph
    clearInterval(timer); // Clear the timer
    timeLeft = maxTime; // Reset time left
    charIndex = 0; // Reset character index
    mistakes = 0; // Reset mistakes count
    isTyping = 0; // Reset isTyping flag
    inpField.value = ""; // Clear the input field
    timeTag.innerText = timeLeft; // Reset time display
    wpmTag.innerText = 0; // Reset wpm display
    mistakeTag.innerText = 0; // Reset mistakes display
    cpmTag.innerText = 0; // Reset cpm display
}

// Initial setup
loadParagraph(); // Load the first paragraph
inpField.addEventListener("input", initTyping); // Add event listener for typing input
tryAgainBtn.addEventListener("click", resetGame); // Add event listener for reset button
