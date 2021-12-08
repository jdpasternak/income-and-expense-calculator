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

$(document).ready(() => {
  $(".modal").modal({
    onCloseEnd: () => {
      $("#description").val("");
      $("#description").removeClass("invalid");
      $("#amount").val("");
      $("#amount").removeClass("invalid");
    },
  });
});

$(document).on("click", "i", (evt) => {
  console.log(evt.target.dataset);
  if (evt.target.dataset.income !== undefined) {
    $("#entryType").text("Income");
    $(".modal form").attr("data-type", "income");
  } else if (evt.target.dataset.expense !== undefined) {
    $("#entryType").text("Expense");
    $(".modal form").attr("data-type", "expense");
  }
  $(".modal").modal("open");

  $("#addEntryBtn").on("click", addEntryHandler);
});

var addEntry = (description, amount, type) => {
  $("ul.collection[data-expense]").append(
    $(`<li class="collection">`).text("test!")
  );
};

var addEntryHandler = (evt) => {
  if ($(".modal form")[0].dataset.type === "income") {
    addEntry(null, null, "income");
  } else if (evt.target.dataset.expense !== undefined) {
  }
};

// $(document).on("click", "#addExpenseBtn", (evt) => {
//   console.log(evt.target);
//   $("#entryType").text("Expense");
//   $(".modal").modal("open");

//   var description = $("#description").val();
//   var amount = $("#amount").val();
// });
