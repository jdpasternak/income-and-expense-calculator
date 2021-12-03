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
  $(".modal").modal();
});

$(document).on("click", "#addIncomeBtn", (evt) => {
  console.log(evt.target);
  $("#entryType").text("Income");
  $(".modal").modal("open");
});

$(document).on("click", "#addExpenseBtn", (evt) => {
  console.log(evt.target);
  $("#entryType").text("Expense");
  $(".modal").modal("open");
});
