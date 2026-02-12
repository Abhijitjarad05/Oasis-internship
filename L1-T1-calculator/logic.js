const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

const updateDisplay = value => {
    display.textContent = value || "0";
};

const isOperator = char => ["+", "-", "*", "/"].includes(char);

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            updateDisplay("");
            return;
        }

        if (action === "delete") {
            expression = expression.slice(0, -1);
            updateDisplay(expression);
            return;
        }

        if (action === "calculate") {
            try {
                if (!expression || isOperator(expression.slice(-1))) return;

                const result = Function(`"use strict"; return (${expression})`)();

                if (!isFinite(result)) {
                    expression = "";
                    updateDisplay("Error");
                    return;
                }

                expression = result.toString();
                updateDisplay(expression);
            } catch {
                expression = "";
                updateDisplay("Error");
            }
            return;
        }

        if (value) {
            const lastChar = expression.slice(-1);

            if (isOperator(value) && (expression === "" || isOperator(lastChar))) {
                return;
            }

            if (value === "." && lastChar === ".") {
                return;
            }

            expression += value;
            updateDisplay(expression);
        }
    });
});
