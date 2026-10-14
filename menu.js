var dishes = [
  {
    id: "chettinad-chicken-curry",
    name: "Chettinad Chicken Curry",
    price: "₹280",
    icon: "🍗",
    summary: "Chicken simmered in a bold, aromatic roasted-spice gravy.",
    about: "Our signature dish. Chicken is slow-cooked in a gravy made from freshly roasted and ground spices, giving it a deep, smoky flavour and a lingering warmth.",
    ingredients: "Chicken, kalpasi (stone flower), star anise, fennel, dried red chillies, coconut, onion, tomato",
    spice: "Hot",
    type: "Non-vegetarian",
    pairs: "Parotta, steamed rice"
  },
  {
    id: "chettinad-mutton-curry",
    name: "Chettinad Mutton Curry",
    price: "₹360",
    icon: "🍖",
    summary: "Tender mutton cooked with fragrant spices and a rich gravy.",
    about: "Mutton is cooked low and slow until tender, in a thick gravy of ground spices, shallots and a touch of coconut.",
    ingredients: "Mutton, shallots, black pepper, cinnamon, cloves, cardamom, ginger, garlic, coconut",
    spice: "Hot",
    type: "Non-vegetarian",
    pairs: "Idiyappam, parotta, steamed rice"
  },
  {
    id: "pepper-chicken",
    name: "Pepper Chicken",
    price: "₹260",
    icon: "🌶️",
    summary: "Chicken tossed with crushed black pepper and curry leaves.",
    about: "A drier preparation where chicken is pan-roasted with coarsely crushed black pepper and fresh curry leaves for a sharp, peppery bite.",
    ingredients: "Chicken, crushed black pepper, curry leaves, shallots, ginger, garlic, fennel",
    spice: "Medium to hot",
    type: "Non-vegetarian",
    pairs: "Rice with rasam, or as a starter"
  },
  {
    id: "vegetable-kurma",
    name: "Vegetable Kurma",
    price: "₹180",
    icon: "🥥",
    summary: "Mixed vegetables in a creamy coconut and spice gravy.",
    about: "Seasonal vegetables simmered in a mild, creamy gravy of ground coconut, poppy seeds and gentle spices.",
    ingredients: "Carrot, beans, peas, potato, coconut, poppy seeds, cashew, fennel, green chilli",
    spice: "Mild",
    type: "Vegetarian",
    pairs: "Parotta, chapati, idli"
  },
  {
    id: "kuzhi-paniyaram",
    name: "Kuzhi Paniyaram",
    price: "₹120",
    icon: "🥟",
    summary: "Golden rice-and-lentil batter bites served with chutney.",
    about: "Soft-centred, crisp-edged bites made from fermented rice and lentil batter, cooked in a special pan and served with coconut chutney.",
    ingredients: "Rice, urad dal, onion, green chilli, curry leaves, mustard seeds, coconut chutney",
    spice: "Mild",
    type: "Vegetarian",
    pairs: "Coconut chutney, sambar"
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    price: "₹240",
    icon: "🍚",
    summary: "Fragrant rice cooked with chicken and warming spices.",
    about: "Long-grain rice and marinated chicken are layered and cooked together so every grain carries the aroma of the spices.",
    ingredients: "Basmati rice, chicken, yoghurt, mint, coriander, cardamom, cinnamon, cloves, fried onion",
    spice: "Medium",
    type: "Non-vegetarian",
    pairs: "Onion raita, boiled egg"
  }
];

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderMenu(container) {
  dishes.forEach(function (dish) {
    var card = el("article", "menu-card");
    var link = el("a", "card-link");
    link.href = "dish.html?dish=" + encodeURIComponent(dish.id);
    var icon = el("span", "dish-icon", dish.icon);
    icon.setAttribute("aria-hidden", "true");
    link.appendChild(icon);
    link.appendChild(el("h3", "", dish.name));
    link.appendChild(el("p", "price", dish.price));
    link.appendChild(el("p", "", dish.summary));
    link.appendChild(el("span", "view-link", "View details →"));
    card.appendChild(link);

    var order = el("a", "order-btn", "Order");
    order.href = "order.html?dish=" + encodeURIComponent(dish.id) + "#order";
    order.setAttribute("aria-label", "Order " + dish.name);
    order.setAttribute("data-dish", dish.id);
    card.appendChild(order);
    container.appendChild(card);
  });
}

function renderDish(container) {
  var id = new URLSearchParams(window.location.search).get("dish");
  var dish = dishes.filter(function (d) { return d.id === id; })[0];

  if (!dish) {
    container.appendChild(el("h2", "", "Dish not found"));
    container.appendChild(el("p", "", "Sorry, we could not find that dish. Please choose one from the menu."));
    return;
  }

  document.title = dish.name + " | Chettinad Spice";

  var icon = el("span", "dish-icon dish-icon-large", dish.icon);
  icon.setAttribute("aria-hidden", "true");
  container.appendChild(icon);
  container.appendChild(el("h2", "", dish.name));
  container.appendChild(el("p", "price", dish.price));
  container.appendChild(el("p", "dish-about", dish.about));

  var list = el("dl", "dish-details");
  [
    ["Key ingredients", dish.ingredients],
    ["Spice level", dish.spice],
    ["Type", dish.type],
    ["Best enjoyed with", dish.pairs]
  ].forEach(function (row) {
    var item = el("div");
    item.appendChild(el("dt", "", row[0]));
    item.appendChild(el("dd", "", row[1]));
    list.appendChild(item);
  });
  container.appendChild(list);

  var order = el("a", "order-btn", "Order");
  order.href = "order.html?dish=" + encodeURIComponent(dish.id);
  order.setAttribute("aria-label", "Order " + dish.name);
  container.appendChild(order);
}

var menuGrid = document.getElementById("menu-grid");
if (menuGrid) renderMenu(menuGrid);

var dishDetail = document.getElementById("dish-detail");
if (dishDetail) renderDish(dishDetail);
