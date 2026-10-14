var exploreButton = document.getElementById("explore-btn");
if (exploreButton) {
  exploreButton.addEventListener("click", function () {
    document.getElementById("about").scrollIntoView();
  });
}

/* Demo order form (multiple items) */
var orderForm = document.getElementById("order-form");

if (orderForm) {
  var nameInput = document.getElementById("customer-name");
  var itemsContainer = document.getElementById("order-items");
  var addItemButton = document.getElementById("add-item");
  var totalDisplay = document.getElementById("order-total");
  var confirmation = document.getElementById("order-confirmation");
  var rows = [];
  var rowCounter = 0;

  function priceOf(dish) {
    return parseInt(dish.price.replace(/[^0-9]/g, ""), 10);
  }

  function findDish(id) {
    return dishes.filter(function (d) { return d.id === id; })[0];
  }

  // Returns a positive whole number, or 0 if the quantity is not valid.
  function parseQuantity(input) {
    if (input.validity.badInput) return 0;
    var text = input.value.trim();
    return /^[0-9]+$/.test(text) ? parseInt(text, 10) : 0;
  }

  function setError(input, errorEl, message) {
    errorEl.textContent = message;
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  function updateTotal() {
    var total = 0;
    rows.forEach(function (row) {
      var dish = findDish(row.select.value);
      var quantity = parseQuantity(row.quantity);
      if (dish && quantity >= 1) total += priceOf(dish) * quantity;
    });
    totalDisplay.textContent = "₹" + total;
  }

  function makeField(labelText, control, errorEl) {
    var field = document.createElement("div");
    field.className = "field";
    var label = document.createElement("label");
    label.htmlFor = control.id;
    label.textContent = labelText;
    field.appendChild(label);
    field.appendChild(control);
    field.appendChild(errorEl);
    return field;
  }

  function renumberRows() {
    rows.forEach(function (row, index) {
      row.title.textContent = "Item " + (index + 1);
      row.removeButton.hidden = rows.length === 1;
      row.removeButton.setAttribute("aria-label", "Remove item " + (index + 1));
    });
  }

  function createRow(dishId, quantity) {
    rowCounter++;
    var n = rowCounter;

    var element = document.createElement("div");
    element.className = "order-row";
    element.setAttribute("role", "group");

    var title = document.createElement("p");
    title.className = "row-title";
    element.appendChild(title);
    element.setAttribute("aria-labelledby", "row-title-" + n);
    title.id = "row-title-" + n;

    var select = document.createElement("select");
    select.id = "dish-select-" + n;
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a dish";
    select.appendChild(placeholder);
    dishes.forEach(function (dish) {
      var option = document.createElement("option");
      option.value = dish.id;
      option.textContent = dish.name + " — " + dish.price;
      select.appendChild(option);
    });
    select.value = dishId || "";
    var dishError = document.createElement("p");
    dishError.className = "field-error";
    dishError.id = "dish-error-" + n;
    select.setAttribute("aria-describedby", dishError.id);

    var quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.id = "quantity-" + n;
    quantityInput.min = "1";
    quantityInput.step = "1";
    quantityInput.value = String(quantity || 1);
    quantityInput.setAttribute("inputmode", "numeric");
    var quantityError = document.createElement("p");
    quantityError.className = "field-error";
    quantityError.id = "quantity-error-" + n;
    quantityInput.setAttribute("aria-describedby", quantityError.id);

    var actions = document.createElement("div");
    actions.className = "row-actions";
    var removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn-secondary";
    removeButton.textContent = "Remove";
    actions.appendChild(removeButton);

    element.appendChild(makeField("Dish", select, dishError));
    element.appendChild(makeField("Quantity", quantityInput, quantityError));
    element.appendChild(actions);

    var row = {
      element: element,
      title: title,
      select: select,
      quantity: quantityInput,
      dishError: dishError,
      quantityError: quantityError,
      removeButton: removeButton
    };

    select.addEventListener("change", updateTotal);
    quantityInput.addEventListener("input", updateTotal);
    removeButton.addEventListener("click", function () {
      if (rows.length === 1) return;
      var index = rows.indexOf(row);
      rows.splice(index, 1);
      itemsContainer.removeChild(element);
      renumberRows();
      updateTotal();
      var next = rows[Math.min(index, rows.length - 1)];
      next.select.focus();
    });

    rows.push(row);
    itemsContainer.appendChild(element);
    renumberRows();
    updateTotal();
    return row;
  }

  // Put a dish into the order: bump an existing line, reuse an empty line, or add a new one.
  function addDishToOrder(id) {
    if (!findDish(id)) return null;
    var row = rows.filter(function (r) { return r.select.value === id; })[0];
    if (row) {
      row.quantity.value = String(parseQuantity(row.quantity) + 1);
    } else {
      row = rows.filter(function (r) { return !r.select.value; })[0];
      if (row) {
        row.select.value = id;
      } else {
        row = createRow(id, 1);
      }
    }
    updateTotal();
    return row;
  }

  createRow();
  addItemButton.addEventListener("click", function () {
    createRow().select.focus();
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    confirmation.textContent = "";

    var name = nameInput.value.trim();
    var nameError = document.getElementById("name-error");
    var firstInvalid = null;

    setError(nameInput, nameError, name ? "" : "Please enter your name.");
    if (!name) firstInvalid = nameInput;

    var lines = [];
    rows.forEach(function (row) {
      var dish = findDish(row.select.value);
      var quantity = parseQuantity(row.quantity);
      setError(row.select, row.dishError, dish ? "" : "Please select a dish.");
      setError(row.quantity, row.quantityError, quantity >= 1 ? "" : "Please enter a whole number of 1 or more.");
      if (!dish && !firstInvalid) firstInvalid = row.select;
      if (quantity < 1 && !firstInvalid) firstInvalid = row.quantity;
      if (dish && quantity >= 1) lines.push({ dish: dish, quantity: quantity });
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var total = 0;
    var list = document.createElement("ul");
    list.className = "order-lines";
    lines.forEach(function (line) {
      var lineTotal = priceOf(line.dish) * line.quantity;
      total += lineTotal;
      var li = document.createElement("li");
      li.textContent = line.dish.name + " × " + line.quantity + " — ₹" + lineTotal;
      list.appendChild(li);
    });

    var heading = document.createElement("h3");
    heading.textContent = "Your demo order has been recorded on this page.";

    var summary = document.createElement("dl");
    summary.className = "order-summary";
    [
      ["Customer name", name],
      ["Items", list],
      ["Total price", "₹" + total]
    ].forEach(function (row) {
      var item = document.createElement("div");
      var term = document.createElement("dt");
      var value = document.createElement("dd");
      term.textContent = row[0];
      if (typeof row[1] === "string") {
        value.textContent = row[1];
      } else {
        value.appendChild(row[1]);
      }
      item.appendChild(term);
      item.appendChild(value);
      summary.appendChild(item);
    });

    confirmation.appendChild(heading);
    confirmation.appendChild(summary);

    // Reset for the next order
    orderForm.reset();
    rows.slice().forEach(function (row) { itemsContainer.removeChild(row.element); });
    rows = [];
    createRow();
  });

  /* "Order" buttons on menu cards */
  document.addEventListener("click", function (event) {
    var button = event.target.closest(".order-btn");
    if (!button) return;
    event.preventDefault();
    var row = addDishToOrder(button.getAttribute("data-dish"));
    document.getElementById("order").scrollIntoView();
    if (row) row.quantity.focus();
  });

  // Arriving from another page (index.html?dish=...#order)
  addDishToOrder(new URLSearchParams(window.location.search).get("dish"));
}

/* Testimonials auto-scroll */
var testimonialTrack = document.getElementById("testimonial-track");

if (testimonialTrack) {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hovering = false;
  var focused = false;
  var holdUntil = 0;

  function advanceTestimonials() {
    var cards = testimonialTrack.children;
    var step = cards[1].offsetLeft - cards[0].offsetLeft;
    var atEnd = testimonialTrack.scrollLeft + testimonialTrack.clientWidth >= testimonialTrack.scrollWidth - 4;
    var target = atEnd ? 0 : Math.round(testimonialTrack.scrollLeft / step + 1) * step;
    testimonialTrack.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
  }

  setInterval(function () {
    if (hovering || focused || Date.now() < holdUntil) return;
    advanceTestimonials();
  }, 4000);

  var section = document.getElementById("testimonials");
  section.addEventListener("mouseenter", function () { hovering = true; });
  section.addEventListener("mouseleave", function () { hovering = false; });
  section.addEventListener("focusin", function () { focused = true; });
  section.addEventListener("focusout", function () { focused = false; });
  ["pointerdown", "wheel", "touchstart"].forEach(function (name) {
    testimonialTrack.addEventListener(name, function () { holdUntil = Date.now() + 6000; }, { passive: true });
  });

}
