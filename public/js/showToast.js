
document.addEventListener("DOMContentLoaded", function() {
var toastEl = document.querySelector(".toast");
if (toastEl) {
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
  console.log('hidden');
  
  setTimeout(() => {
    toast.hide();
  }, 3000);
}
});

// rest of the code 
// <% if (typeof flashMessage!='undefined' && flashMessage) { %>
//     <div class="toast show position-fixed end-0 bottom-0 mx-3 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
//       <div class="toast-header">
//         <strong class="me-auto">Notification</strong>
//         <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
//       </div>
//       <div class="toast-body">
//         <%= flashMessage %>
//       </div>
//     </div>
//     <% } %>