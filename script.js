const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ----------------------------
// Save to Local Storage
// ----------------------------
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ----------------------------
// Update Dashboard
// ----------------------------
function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    income.textContent = `₹${totalIncome}`;

    expense.textContent = `₹${totalExpense}`;

    balance.textContent = `₹${totalIncome - totalExpense}`;

}

// ----------------------------
// Display Transactions
// ----------------------------
function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML = `
        <div class="empty-state">
            <h3>No Transactions Found</h3>
            <p>Add your first transaction.</p>
        </div>
        `;

        updateSummary();

        return;

    }

    transactions.forEach((transaction, index) => {

        const li = document.createElement("li");

        li.classList.add(transaction.type);

        li.innerHTML = `

        <div class="transaction-info">

            <div class="transaction-title">
                ${transaction.title}
            </div>

            <div class="transaction-category">
                ${transaction.category}
            </div>

            <div class="transaction-date">
                ${transaction.date}
            </div>

        </div>

        <div class="transaction-right">

            <div class="transaction-amount">

                ${
                    transaction.type === "income"
                    ? "+"
                    : "-"
                }₹${transaction.amount}

            </div>

            <div class="action-buttons">

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${index})">

                    Delete

                </button>

            </div>

        </div>

        `;

        transactionList.appendChild(li);

    });

    updateSummary();

}

// ----------------------------
// Add Transaction
// ----------------------------
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const newTransaction = {

        title: title.value,

        amount: Number(amount.value),

        type: type.value,

        category: category.value,

        date: date.value

    };

    transactions.push(newTransaction);

    saveTransactions();

    displayTransactions();

    form.reset();

});

// ----------------------------
// Delete
// ----------------------------
function deleteTransaction(index) {

    transactions.splice(index, 1);

    saveTransactions();

    displayTransactions();

}

// ----------------------------
// Dark Mode
// ----------------------------
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

});

// ----------------------------
// CSV Export
// ----------------------------
document.getElementById("downloadCSV").addEventListener("click", () => {

    let csv = "Title,Amount,Type,Category,Date\n";

    transactions.forEach((t) => {

        csv += `${t.title},${t.amount},${t.type},${t.category},${t.date}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.csv";

    a.click();

});

// ----------------------------
// Initial Load
// ----------------------------
displayTransactions();