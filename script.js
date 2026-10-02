// ==========================================
// SPENDWISE - JAVASCRIPT INTERACTIVE VERSION
// ==========================================


// ==========================================
// 1. APPLICATION DATA
// ==========================================

// Store the user's budget
let budget = 0;

// Store multiple expense records in an array
let expenses = [];

const STORAGE_KEY = "spendwise-data";

const VALID_CATEGORIES = new Set([
    "Food",
    "Transport",
    "Rent",
    "Entertainment",
    "Savings",
    "Utilities",
    "Other"
]);

function loadUserData() {

    try {

        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return;
        }

        const parsedData = JSON.parse(savedData);

        if (
            parsedData &&
            typeof parsedData.budget === "number" &&
            Number.isFinite(parsedData.budget) &&
            parsedData.budget >= 0
        ) {
            budget = parsedData.budget;
        }

        if (parsedData && Array.isArray(parsedData.expenses)) {
            expenses = parsedData.expenses.filter(function (expense) {
                return expense &&
                    typeof expense.name === "string" &&
                    expense.name.trim() !== "" &&
                    typeof expense.amount === "number" &&
                    Number.isFinite(expense.amount) &&
                    expense.amount > 0 &&
                    VALID_CATEGORIES.has(expense.category);
            });
        }
    }
    catch (error) {
        console.warn("Saved SpendWise data could not be loaded.", error);
    }
}

function saveUserData() {

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ budget: budget, expenses: expenses })
        );
    }
    catch (error) {
        console.warn("SpendWise data could not be saved.", error);
    }
}


// ==========================================
// 2. GET HTML ELEMENTS FROM THE DOM
// ==========================================

const budgetForm = document.getElementById("budget-form");

const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");

const expenseNameInput = document.getElementById("expense-name");

const expenseAmountInput =
    document.getElementById("expense-amount");

const expenseCategoryInput =
    document.getElementById("expense-category");

const budgetDisplay =
    document.getElementById("budget-display");

const spentDisplay =
    document.getElementById("spent-display");

const remainingDisplay =
    document.getElementById("remaining-display");

const budgetFeedback =
    document.getElementById("budget-feedback");

const expenseList =
    document.getElementById("expense-list");

const expenseCount =
    document.getElementById("expense-count");


// Category totals
const foodTotal =
    document.getElementById("food-total");

const transportTotal =
    document.getElementById("transport-total");

const rentTotal =
    document.getElementById("rent-total");

const entertainmentTotal =
    document.getElementById("entertainment-total");

const savingsTotal =
    document.getElementById("savings-total");

const utilitiesTotal =
    document.getElementById("utilities-total");


// ==========================================
// 3. FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return "KSh " + amount.toLocaleString(
        "en-KE",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


// ==========================================
// 4. CALCULATE TOTAL EXPENSES
// ==========================================

function calculateTotalExpenses() {

    let total = 0;

    // LOOP through every expense
    expenses.forEach(function (expense) {

        total += expense.amount;

    });

    return total;
}


// ==========================================
// 5. CALCULATE REMAINING BALANCE
// ==========================================

function calculateRemainingBalance() {

    const totalExpenses =
        calculateTotalExpenses();

    return budget - totalExpenses;
}


// ==========================================
// 6. DECISION MAKING WITH CONDITIONALS
// ==========================================

function updateBudgetFeedback() {

    const totalExpenses =
        calculateTotalExpenses();

    const remainingBalance =
        calculateRemainingBalance();


    // Remove previous status classes
    budgetFeedback.classList.remove(
        "warning",
        "danger"
    );


    // CONDITIONAL STATEMENTS
    if (budget === 0) {

        budgetFeedback.textContent =
            "Please set a budget to start tracking your spending.";

    }

    else if (totalExpenses === 0) {

        budgetFeedback.textContent =
            "Your budget is ready. Add an expense to start tracking your spending.";

    }

    else if (remainingBalance > budget * 0.5) {

        budgetFeedback.textContent =
            "Great! You still have more than half of your budget remaining.";

    }

    else if (remainingBalance > 0) {

        budgetFeedback.classList.add("warning");

        budgetFeedback.textContent =
            "You are spending your budget. Keep monitoring your expenses.";

    }

    else {

        budgetFeedback.classList.add("danger");

        budgetFeedback.textContent =
            "Warning: You have exceeded your budget.";

    }
}


// ==========================================
// 7. UPDATE SUMMARY CARDS
// ==========================================

function updateSummary() {

    const totalExpenses =
        calculateTotalExpenses();

    const remainingBalance =
        calculateRemainingBalance();


    // DOM MANIPULATION
    budgetDisplay.textContent =
        formatMoney(budget);

    spentDisplay.textContent =
        formatMoney(totalExpenses);

    remainingDisplay.textContent =
        formatMoney(remainingBalance);


    updateBudgetFeedback();
}


// ==========================================
// 8. DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    // Clear the current list
    expenseList.innerHTML = "";


    // If there are no expenses
    if (expenses.length === 0) {

        expenseList.innerHTML =
            '<p class="empty-message">No expenses added yet.</p>';

        expenseCount.textContent =
            "0 expenses";

        return;
    }


    // LOOP through all expense records
    expenses.forEach(function (expense, index) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className =
            "expense-item";


        expenseItem.innerHTML = `
            <div class="expense-details">

                <h3>${expense.name}</h3>

                <p>
                    Category: ${expense.category}
                </p>

            </div>

            <div class="expense-right">

                <span class="expense-amount">
                    ${formatMoney(expense.amount)}
                </span>

                <button
                    class="delete-button"
                    data-index="${index}"
                    type="button"
                    aria-label="Delete ${expense.name} expense"
                >
                    <i class="ri-delete-bin-6-line" aria-hidden="true"></i>
                    <span>Delete</span>
                </button>

            </div>
        `;


        expenseList.appendChild(expenseItem);

    });


    // Update expense count
    if (expenses.length === 1) {

        expenseCount.textContent =
            "1 expense";

    }

    else {

        expenseCount.textContent =
            expenses.length + " expenses";

    }


    // Add event listeners to delete buttons
    const deleteButtons =
        document.querySelectorAll(".delete-button");


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            deleteExpense
        );

    });
}


// ==========================================
// 9. DELETE AN EXPENSE
// ==========================================

function deleteExpense(event) {

    const index =
        Number(event.currentTarget.dataset.index);


    // Remove the selected expense from the array
    expenses.splice(index, 1);

    saveUserData();


    // Update everything on the dashboard
    displayExpenses();

    updateCategoryTotals();

    updateSummary();


    console.log("Expense deleted.");
}


// ==========================================
// 10. UPDATE CATEGORY TOTALS
// ==========================================

function updateCategoryTotals() {

    // Start every category at zero
    let food = 0;
    let transport = 0;
    let rent = 0;
    let entertainment = 0;
    let savings = 0;
    let utilities = 0;


    // LOOP through expenses
    expenses.forEach(function (expense) {

        // CONDITIONAL STATEMENTS
        if (expense.category === "Food") {

            food += expense.amount;

        }

        else if (expense.category === "Transport") {

            transport += expense.amount;

        }

        else if (expense.category === "Rent") {

            rent += expense.amount;

        }

        else if (expense.category === "Entertainment") {

            entertainment += expense.amount;

        }

        else if (expense.category === "Savings") {

            savings += expense.amount;

        }

        else if (expense.category === "Utilities") {

            utilities += expense.amount;

        }

    });


    // DOM updates
    foodTotal.textContent =
        formatMoney(food);

    transportTotal.textContent =
        formatMoney(transport);

    rentTotal.textContent =
        formatMoney(rent);

    entertainmentTotal.textContent =
        formatMoney(entertainment);

    savingsTotal.textContent =
        formatMoney(savings);

    utilitiesTotal.textContent =
        formatMoney(utilities);
}


// ==========================================
// 11. BUDGET FORM EVENT
// ==========================================

budgetForm.addEventListener(
    "submit",
    function (event) {

        // Stop page from refreshing
        event.preventDefault();


        const enteredBudget =
            Number(budgetInput.value);


        // Validate budget
        if (
            enteredBudget <= 0 ||
            Number.isNaN(enteredBudget)
        ) {

            alert(
                "Please enter a valid budget greater than zero."
            );

            return;
        }


        // Store the budget
        budget = enteredBudget;

        saveUserData();


        // Update the dashboard
        updateSummary();


        console.log(
            "Budget updated:",
            formatMoney(budget)
        );


        // Clear input
        budgetInput.value = "";

    }
);


// ==========================================
// 12. EXPENSE FORM EVENT
// ==========================================

expenseForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh
        event.preventDefault();


        const name =
            expenseNameInput.value.trim();

        const amount =
            Number(expenseAmountInput.value);

        const category =
            expenseCategoryInput.value;


        // Validate the expense
        if (
            name === "" ||
            amount <= 0 ||
            category === ""
        ) {

            alert(
                "Please fill in all expense fields correctly."
            );

            return;
        }


        // Create an expense object
        const newExpense = {

            name: name,

            amount: amount,

            category: category

        };


        // Add the expense to the array
        expenses.push(newExpense);

        saveUserData();


        // Update the webpage
        displayExpenses();

        updateCategoryTotals();

        updateSummary();


        // Console output
        console.log(
            "New expense added:",
            newExpense
        );


        console.log(
            "All expenses:",
            expenses
        );


        // Clear the form
        expenseForm.reset();

    }
);


// ==========================================
// 13. INITIAL DASHBOARD
// ==========================================

loadUserData();

if (budget > 0) {
    budgetInput.value = budget;
}

updateSummary();

displayExpenses();

updateCategoryTotals();


// ==========================================
// 14. SIDEBAR NAVIGATION STATE
// ==========================================

const navigationLinks = Array.from(
    document.querySelectorAll(".navigation .nav-item")
);

const navigationTargets = navigationLinks
    .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

function setActiveNavigation(targetId) {

    navigationLinks.forEach(function (link) {

        const isActive =
            link.getAttribute("href") === "#" + targetId;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function () {
        setActiveNavigation(link.getAttribute("href").slice(1));
    });
});

let navigationUpdatePending = false;

function updateActiveNavigationOnScroll() {

    if (navigationUpdatePending) {
        return;
    }

    navigationUpdatePending = true;

    window.requestAnimationFrame(function () {

        const atPageBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2;

        const hashLink = navigationLinks.find(function (link) {
            return link.getAttribute("href") === window.location.hash;
        });

        const hashTarget = hashLink
            ? document.querySelector(hashLink.getAttribute("href"))
            : null;

        const currentTarget = (atPageBottom && hashTarget) || navigationTargets
            .filter(function (target) {
                return target.getBoundingClientRect().top <= 90;
            })
            .sort(function (first, second) {
                return second.getBoundingClientRect().top -
                    first.getBoundingClientRect().top;
            })[0] || navigationTargets[0];

        if (currentTarget) {
            setActiveNavigation(currentTarget.id);
        }

        navigationUpdatePending = false;
    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigationOnScroll,
    { passive: true }
);

window.addEventListener(
    "resize",
    updateActiveNavigationOnScroll
);

window.addEventListener(
    "hashchange",
    updateActiveNavigationOnScroll
);

updateActiveNavigationOnScroll();


// ==========================================
// END OF SPENDWISE JAVASCRIPT
// ==========================================