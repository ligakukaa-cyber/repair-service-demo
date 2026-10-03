/* Прайс ФИКС. Правится здесь — верстку трогать не нужно.
   price: [от, до] в рублях для бренда с коэффициентом 1; warranty — месяцев. */
window.FIX_PRICES = {
  phone: {
    name: "Смартфон",
    brands: { apple: ["Apple", 1.3], samsung: ["Samsung", 1.1], xiaomi: ["Xiaomi / Redmi", 1], other: ["Другой", 1] },
    faults: {
      screen:  { name: "Разбит экран",            price: [2500, 9000], time: "40 минут",   warranty: 6 },
      battery: { name: "Быстро садится батарея",   price: [1500, 4000], time: "20 минут",   warranty: 6 },
      port:    { name: "Не заряжается",            price: [1200, 2500], time: "30 минут",   warranty: 3 },
      camera:  { name: "Не работает камера",       price: [1800, 5000], time: "40 минут",   warranty: 3 },
      water:   { name: "Попала вода",              price: [1500, 6000], time: "1–2 дня",    warranty: 3 },
      power:   { name: "Не включается",            price: [1000, 7000], time: "1–3 дня",    warranty: 3 },
    },
  },
  laptop: {
    name: "Ноутбук",
    brands: { apple: ["MacBook", 1.4], asus: ["ASUS / Lenovo / HP", 1], honor: ["Huawei / Honor", 1.05], other: ["Другой", 1] },
    faults: {
      clean:    { name: "Греется и шумит",          price: [1500, 2500],  time: "2 часа",   warranty: 3 },
      screen:   { name: "Разбита матрица",          price: [5000, 16000], time: "1 день",   warranty: 6 },
      keyboard: { name: "Не работает клавиатура",   price: [2500, 7000],  time: "1 день",   warranty: 6 },
      upgrade:  { name: "Тормозит — нужен SSD",     price: [1500, 3000],  time: "3 часа",   warranty: 6 },
      water:    { name: "Залили жидкостью",         price: [3000, 12000], time: "2–4 дня",  warranty: 3 },
      power:    { name: "Не включается",            price: [2000, 9000],  time: "1–3 дня",  warranty: 3 },
    },
  },
  tablet: {
    name: "Планшет",
    brands: { apple: ["iPad", 1.3], samsung: ["Samsung", 1.1], other: ["Другой", 1] },
    faults: {
      screen:  { name: "Разбит экран",           price: [3000, 11000], time: "1 день",   warranty: 6 },
      battery: { name: "Быстро садится батарея",  price: [2000, 5000],  time: "2 часа",   warranty: 6 },
      port:    { name: "Не заряжается",           price: [1500, 3000],  time: "1 час",    warranty: 3 },
      power:   { name: "Не включается",           price: [1500, 7000],  time: "1–3 дня",  warranty: 3 },
    },
  },
  console: {
    name: "Приставка",
    brands: { ps: ["PlayStation", 1.1], xbox: ["Xbox", 1], switch: ["Nintendo Switch", 1], deck: ["Steam Deck", 1.1] },
    faults: {
      hdmi:  { name: "Нет изображения",      price: [2500, 4500], time: "1 день",   warranty: 6 },
      clean: { name: "Греется и шумит",      price: [1500, 2500], time: "2 часа",   warranty: 3 },
      drift: { name: "Дрифт стиков",         price: [1500, 3000], time: "1 час",    warranty: 3 },
      power: { name: "Не включается",        price: [2500, 9000], time: "1–3 дня",  warranty: 3 },
    },
  },
};

/* Демо-заказы для проверки статуса. step: 0 принят, 1 диагностика, 2 ремонт, 3 готов. */
window.FIX_ORDERS = {
  "ФК-2417": { device: "iPhone 13 · замена экрана", step: 3, msg: "Готово! Можно забирать сегодня до 21:00. К оплате 7 400 ₽." },
  "ФК-1093": { device: "ASUS VivoBook · чистка и замена термопасты", step: 2, msg: "Мастер чистит систему охлаждения. Будет готово сегодня к 18:00." },
};
