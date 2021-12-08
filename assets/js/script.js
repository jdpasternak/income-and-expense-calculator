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

$(document).ready(() => {
  $(".modal").modal({
    onCloseEnd: () => {
      $("#description").val("");
      $("#description").removeClass("invalid");
      $("#description").removeClass("valid");
      $(`label[for="description"]`).removeClass("active");
      $("#amount").val("");
      $("#amount").removeClass("invalid");
      $("#amount").removeClass("valid");
      $(`label[for="amount"]`).removeClass("active");
    },
  });

  $("#addEntryBtn").on("click", addEntryHandler);
});

$(document).on("click", "i", (evt) => {
  console.log(evt.target.dataset.category);
  if (evt.target.dataset.category === "income") {
    $("#entryType").text("Income");
    $(".modal form").attr("data-category", "income");
  } else if (evt.target.dataset.category === "expense") {
    $("#entryType").text("Expense");
    $(".modal form").attr("data-category", "expense");
  }
  $(".modal").modal("open");
});

var addEntry = (description, amount, category) => {
  var newEntry = $(
    `<a class="collection-item row d-flex justify-content-between">`
  );
  newEntry.html(`<span class="col s12 m4 left-align" data-description data-entryid="1">
      ${description}
  </span>
  <span class="col s12 m4 right-align" data-amount data-entryid="1">
      ${currencyFormatter.format(amount)}
  </span>`);
  $(`ul.collection[data-category="${category}"]`).append(newEntry);
  $(".modal").modal("close");
};

var addEntryHandler = (evt) => {
  // gather inputs
  var description = $("#description").val();
  var amount = $("#amount").val();

  // validate inputs
  if (description.length < 3 || amount <= 0) {
    console.log("invalid input");
    return false;
  } else {
    addEntry(description, amount, $(".modal form")[0].dataset.category);
  }
};

// $(document).on("click", "#addExpenseBtn", (evt) => {
//   console.log(evt.target);
//   $("#entryType").text("Expense");
//   $(".modal").modal("open");

//   var description = $("#description").val();
//   var amount = $("#amount").val();
// });
