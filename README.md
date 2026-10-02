# SpendWise - Personal Budget & Expense Tracker

## Project Description

SpendWise is a personal budget and expense tracking application.

The project was initially created as a static dashboard using HTML and CSS. It has now been improved with JavaScript to make the application interactive.

Users can:

- Set a monthly budget.
- Add multiple expenses.
- Select expense categories.
- View total spending.
- View their remaining balance.
- Receive feedback about their spending.
- View expenses directly on the webpage.
- Delete expenses.
- See spending totals for different categories.

The application uses HTML, CSS, and JavaScript.

---

# Week 6 Improvements

During Week 6, SpendWise was changed from a mostly static dashboard into an interactive budgeting application.

The major improvements include:

1. Conditional statements
2. Arrays
3. Loops
4. DOM manipulation
5. Event listeners
6. Dynamic expense records
7. Dynamic budget calculations
8. Budget feedback

---

# 1. Decision Making with Conditionals

Conditional statements are used to make decisions based on the user's budget and expenses.

For example, SpendWise checks the remaining balance and provides appropriate feedback.

```javascript
if (budget === 0) {

    budgetFeedback.textContent =
        "Please set a budget to start tracking your spending.";

}

else if (remainingBalance > budget * 0.5) {

    budgetFeedback.textContent =
        "Great! You still have more than half of your budget remaining.";

}

else if (remainingBalance > 0) {

    budgetFeedback.textContent =
        "You are spending your budget. Keep monitoring your expenses.";

}

else {

    budgetFeedback.textContent =
        "Warning: You have exceeded your budget.";

}