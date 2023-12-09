<script>
  document.addEventListener('DOMContentLoaded', function () {
    const decrementButton = document.querySelector('.decrement');
    const incrementButton = document.querySelector('.increment');
    const quantityInput = document.querySelector('.quantity-input');

    decrementButton.addEventListener('click', function () {
      let currentQuantity = parseInt(quantityInput.value, 10);

      if (currentQuantity > 1) {
        currentQuantity -= 1;
        quantityInput.value = currentQuantity;
      }
    });

    incrementButton.addEventListener('click', function () {
      let currentQuantity = parseInt(quantityInput.value, 10);
      currentQuantity += 1;
      quantityInput.value = currentQuantity;
    });
  });

  function addToOrders() {
    // Add your logic for adding to orders here
    alert('Added to Orders: ' + document.querySelector('.quantity-input').value);
  }
</script>
