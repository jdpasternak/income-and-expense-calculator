/* 
    Entry:
    <a class="collection-item row d-flex justify-content-between">
        <span class="col s12 m4 left-align" data-description data-entryid="1">
            Description
        </span>
        <span class="col s12 m4 right-align" data-amount data-entryid="1">
            $0.00
        </span>
    </a>
*/

var currencyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

var entryCounter = 0;
var entries = [];

$(document).ready(() => {
  $(".modal").modal({
    onCloseEnd: () => {
      $(".modal input").each((_, i) => {
        $(i).val("");
        $(i).removeClass("invalid");
        $(i).removeClass("valid");
      });
      $(".modal label").each((_, l) => {
        $(l).removeClass("active");
      });
    },
  });

  $("#addEntryBtn").on("click", addEntryHandler);
  $("#saveEntryBtn").on("click", saveModifiedEntryHandler);
  $("#deleteEntryBtn").on("click", deleteEntryHandler);
});

var openAddEntryModalHandler = (evt) => {
  console.log(evt.target.dataset.category);
  if (evt.target.dataset.category === "income") {
    $("#entryType").text("Income");
    $("#addEntryModal form").attr("data-category", "income");
  } else if (evt.target.dataset.category === "expense") {
    $("#entryType").text("Expense");
    $("#addEntryModal form").attr("data-category", "expense");
  }
  $("#addEntryModal").modal("open");
};

[$("#addIncomeBtn"), $("#addExpenseBtn")].forEach((b) => {
  b.on("click", openAddEntryModalHandler);
});

// Add Entry Function
var addEntry = (description, amount, category) => {
  var entryObj = {
    id: entryCounter,
    description: description,
    amount: amount,
    category: category,
  };

  entries.push(entryObj);
  saveEntries();

  if (category === "expense") {
    amount = -Math.abs(amount);
  }
  var newEntry = $(`<tr data-entryid="${entryCounter}">`);
  newEntry.html(`<td data-description data-entryid="${entryCounter}">
        ${description}
    </td>
    <td data-amount data-entryid="${entryCounter}">
        ${currencyFormatter.format(amount)}
    </td>`);
  $(`tbody[data-category="${category}"]`).append(newEntry);

  newEntry.on("click", modifyEntryHandler);

  entryCounter++;

  updateDashboard();
};

// Add Entry Button Handler
var addEntryHandler = (evt) => {
  // gather inputs
  var description = $("#description").val();
  var amount = $("#amount").val();
  var category = $(".modal form")[0].dataset.category;

  // Income must be a positive non-zero number

  // Expense can accept positive or negative (handling abs val on the backend)

  // Check if description is greater than 3 or more characters
  if (description.length < 3) {
    M.toast({
      html: "Enter at least 3 letters for description.",
      classes: "red",
    });
    return false;
  }

  // Check for zero amount input
  if (amount === 0 || amount === "") {
    M.toast({
      html: "Amount must not be 0.",
      classes: "red",
    });
    return false;
  }

  // Check if income amount is negative
  if (category === "income" && amount < 0) {
    M.toast({
      html: "Income amount must be a postive number.",
      classes: "red",
    });
    return false;
  }

  addEntry(description, amount, category);
  $(".modal").modal("close");
};

var modifyEntryHandler = (evt) => {
  var description = $($(evt.target).closest("tr").children()[0]).text().trim();
  var amount = $($(evt.target).closest("tr").children()[1]).text().trim();
  var category = $(evt.target).closest("tbody")[0].dataset.category;
  var id = $(evt.target).closest("tr")[0].dataset.entryid;

  $("#editDeleteEntryModal").modal("open");
  $("#editDescription").val(description).addClass("valid");
  $("#editAmount").val(convertCurrencyFormatToFloat(amount)).addClass("valid");
  $(`label[for="editAmount"]`).addClass("active");
  $(`label[for="editDescription"]`).addClass("active");
  $(`#editDeleteEntryModal form`).attr("data-category", category);
  $(`#editDeleteEntryModal form`).attr("data-entryid", id);
};

var saveModifiedEntryHandler = (evt) => {
  console.log($(`#editDeleteEntryModal form`)[0].dataset.category);
  var category = $(`#editDeleteEntryModal form`)[0].dataset.category;
  var description = $("#editDescription").val();
  var amount = $("#editAmount").val();
  var id = $(`#editDeleteEntryModal form`)[0].dataset.entryid;
  console.log(category, description, amount, id);

  if (validateInputs(description, amount, category)) {
    saveModifiedEntry(description, amount, category, id);
    $("#editDeleteEntryModal").modal("close");
  }
};

var saveModifiedEntry = (description, amount, category, id) => {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].id == id) {
      entries[i].description = description;
      entries[i].amount = amount;
    }
  }
  saveEntries();

  if (category === "expense") {
    amount = -Math.abs(amount);
  }

  var descriptionEl = $(`tr[data-entryid="${id}"] td[data-description]`);
  var amountEl = $(`tr[data-entryid="${id}"] td[data-amount]`);

  descriptionEl.text(description);
  amountEl.text(currencyFormatter.format(amount));
  updateDashboard();
};

var deleteEntryHandler = (evt) => {
  var id = $("#editDeleteEntryModal form")[0].dataset.entryid;
  $(`tr[data-entryid="${id}"`).hide();
  $("#editDeleteEntryModal").modal("close");
  var myToast = M.toast({
    html: `<span>Entry deleted.</span><button class="btn-flat toast-action">UNDO</button>`,
    classes: "orange",
    // completeCallback: () => deleteEntry(id),
  });
  var deleteTimeout = setTimeout(() => {
    deleteEntry(id);
  }, myToast.options.displayLength);
  $(".toast-action").on("click", () => {
    window.clearTimeout(deleteTimeout);
    myToast.dismiss();
    $(`tr[data-entryid="${id}"`).show();
    updateDashboard();
  });
  updateDashboard();
};

var deleteEntry = (id) => {
  $(`tr[data-entryid="${id}"]`).remove();

  var newEntries = [];
  for (var i = 0; i < entries.length; i++) {
    if (!entries[i].id == id) {
      newEntries.push(entries[i]);
    }
  }
  entries = newEntries;
  saveEntries();
};

var updateDashboard = () => {
  // Calculate income
  var income = 0;
  $(`tbody[data-category="income"] td[data-amount]`).each((i, j) => {
    if (!($($(j).closest("tr")[0]).attr("style") === "display: none;")) {
      income += convertCurrencyFormatToFloat($(j).text());
    }
  });

  // Update income on DOM
  $("#totalIncome").text(currencyFormatter.format(income));
  $("#totalIncome").addClass("green-text");

  // Calculate expense
  var expense = 0;
  $(`tbody[data-category="expense"] td[data-amount]`).each((i, j) => {
    if (!($($(j).closest("tr")[0]).attr("style") === "display: none;")) {
      expense += convertCurrencyFormatToFloat($(j).text());
    }
  });

  // Update expense on DOM
  $("#totalExpense").text(currencyFormatter.format(expense));
  $("#totalExpense").addClass("red-text");

  // Calculate leftover
  var leftover = income - Math.abs(expense);

  // Update leftover on DOM
  $("#leftover").text(currencyFormatter.format(leftover));
  if (leftover < 0) {
    $("#leftover").removeClass("green-text");
    $("#leftover").addClass("red-text");
  } else if (leftover > 0) {
    $("#leftover").addClass("green-text");
    $("#leftover").removeClass("red-text");
  } else {
    $("#leftover").removeClass(["green-text", "red-text"]);
  }
};

var saveEntries = () => {
  localStorage.setItem("entries", JSON.stringify(entries));
};

// Utility Functions
var convertCurrencyFormatToFloat = (currency) => {
  currency = currency.replace("$", "");
  currency = currency.replace(",", "");
  currency = parseFloat(currency);
  return currency;
};

var validateInputs = (description, amount, category) => {
  // Check if description is greater than 3 or more characters
  if (description.length < 3) {
    M.toast({
      html: "Enter at least 3 letters for description.",
      classes: "red",
    });
    return false;
  }

  // Check for zero amount input
  if (amount === 0 || amount === "") {
    M.toast({
      html: "Amount must not be 0.",
      classes: "red",
    });
    return false;
  }

  // Check if income amount is negative
  if (category === "income" && amount < 0) {
    M.toast({
      html: "Income amount must be a postive number.",
      classes: "red",
    });
    return false;
  }

  return true;
};

/* 
  Testing
*/
// addEntry("Income 1", "4200", "income");
// addEntry("Expense 1", "120", "expense");
// addEntry("Expense 2", "450", "expense");
// addEntry("Expense 3", "140", "expense");
// addEntry("Expense 4", "200", "expense");

addEntry("Income 1", "2", "income");
addEntry("expense 1", "3", "expense");

updateDashboard();
// $(document).on("click", "#addExpenseBtn", (evt) => {
//   console.log(evt.target);
//   $("#entryType").text("Expense");
//   $(".modal").modal("open");

//   var description = $("#description").val();
//   var amount = $("#amount").val();
// });
