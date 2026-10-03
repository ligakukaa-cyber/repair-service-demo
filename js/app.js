/* ФИКС — калькулятор ремонта, статус заказа, заявка. */
(() => {
  /* ---------- шапка и появление ---------- */
  const nav = document.getElementById("nav");
  const fab = document.querySelector(".call-fab");
  const calcSec = document.getElementById("calc");
  const onScroll = () => {
    nav.classList.toggle("stuck", window.scrollY > 30);
    if (fab && calcSec) {
      const r = calcSec.getBoundingClientRect();
      const inCalc = r.top < window.innerHeight && r.bottom > 0;
      fab.classList.toggle("hide", window.scrollY < 400 || inCalc);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((items) => {
    items.forEach((it) => { if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- калькулятор ---------- */
  const P = window.FIX_PRICES;
  const rub = (n) => n.toLocaleString("ru-RU") + " ₽";
  const round = (n) => Math.round(n / 100) * 100;
  const pick = { device: "phone", brand: "apple", fault: "screen" };

  const devicesEl = document.getElementById("devices");
  const brandsEl = document.getElementById("brands");
  const faultsEl = document.getElementById("faults");

  const chips = (el, items, current, onPick) => {
    el.innerHTML = "";
    Object.entries(items).forEach(([key, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", String(key === current));
      b.textContent = label;
      b.addEventListener("click", () => onPick(key));
      el.appendChild(b);
    });
  };

  const render = () => {
    const dev = P[pick.device];
    if (!dev.brands[pick.brand]) pick.brand = Object.keys(dev.brands)[0];
    if (!dev.faults[pick.fault]) pick.fault = Object.keys(dev.faults)[0];

    chips(devicesEl, Object.fromEntries(Object.entries(P).map(([k, d]) => [k, d.name])),
      pick.device, (k) => { pick.device = k; render(); });
    chips(brandsEl, Object.fromEntries(Object.entries(dev.brands).map(([k, b]) => [k, b[0]])),
      pick.brand, (k) => { pick.brand = k; render(); });
    chips(faultsEl, Object.fromEntries(Object.entries(dev.faults).map(([k, f]) => [k, f.name])),
      pick.fault, (k) => { pick.fault = k; render(); });

    const [brandName, k] = dev.brands[pick.brand];
    const f = dev.faults[pick.fault];
    const lo = round(f.price[0] * k), hi = round(f.price[1] * k);
    document.getElementById("resWhat").textContent = `${dev.name} · ${brandName}`;
    document.getElementById("resFault").textContent = f.name;
    document.getElementById("resPrice").innerHTML = `${rub(lo)} <small>– ${rub(hi)}</small>`;
    document.getElementById("resTime").textContent = f.time;
    document.getElementById("resWarranty").textContent = `${f.warranty} мес.`;
  };
  if (devicesEl && P) render();

  // расчет переносим в заявку — менеджеру не придется переспрашивать
  document.getElementById("toForm")?.addEventListener("click", () => {
    const note = document.getElementById("note");
    const dev = P[pick.device];
    note.value = `${dev.name} ${dev.brands[pick.brand][0]}: ${dev.faults[pick.fault].name.toLowerCase()}. ` +
      `По калькулятору ${document.getElementById("resPrice").textContent}.`;
  });

  /* ---------- статус ремонта ---------- */
  const statusForm = document.getElementById("statusForm");
  if (statusForm) {
    const input = document.getElementById("orderNo");
    const out = document.getElementById("statusOut");
    const miss = document.getElementById("statusMiss");
    const steps = [...document.querySelectorAll("#track li")];

    // «фк 2417», «2417», «FK-2417» — все приводим к виду «ФК-2417»
    const normalize = (s) => {
      const digits = s.replace(/\D/g, "");
      return digits ? `ФК-${digits}` : "";
    };
    const check = () => {
      const order = window.FIX_ORDERS[normalize(input.value)];
      out.hidden = !order;
      miss.hidden = !!order || !input.value.trim();
      if (!order) return;
      document.getElementById("statusDev").textContent = order.device;
      document.getElementById("statusMsg").textContent = order.msg;
      steps.forEach((li, n) => {
        li.classList.toggle("done", n < order.step || order.step === steps.length - 1);
        li.classList.toggle("now", n === order.step && order.step < steps.length - 1);
      });
    };
    statusForm.addEventListener("submit", (e) => { e.preventDefault(); check(); });
    document.querySelectorAll("[data-order]").forEach((b) => b.addEventListener("click", () => {
      input.value = b.dataset.order;
      check();
      document.getElementById("status").scrollIntoView({ behavior: "smooth", block: "center" });
    }));
  }

  /* ---------- заявка ---------- */
  const form = document.getElementById("leadForm");
  if (form) {
    const ok = document.getElementById("ok");
    const bad = (input, text) => {
      const field = input.closest(".field, .check");
      field.classList.add("bad");
      if (text && !field.querySelector(".err")) {
        const p = document.createElement("p");
        p.className = "err";
        p.textContent = text;
        field.appendChild(p);
      }
    };
    const clean = (input) => {
      const field = input.closest(".field, .check");
      field.classList.remove("bad");
      field.querySelector(".err")?.remove();
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const agree = document.getElementById("agree");
      [name, phone, agree].forEach(clean);

      let valid = true;
      if (name.value.trim().length < 2) { bad(name, "Напишите, как к вам обращаться"); valid = false; }
      if (phone.value.replace(/\D/g, "").length < 10) { bad(phone, "Проверьте номер телефона"); valid = false; }
      if (!agree.checked) { bad(agree); valid = false; }
      if (!valid) return;

      const courier = form.querySelector('input[name="how"]:checked').value === "courier";
      ok.textContent = courier
        ? "Заявка принята. Перезвоним за 10 минут и согласуем время курьера."
        : "Заявка принята. Перезвоним за 10 минут.";
      ok.hidden = false;
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      setTimeout(() => { form.reset(); ok.hidden = true; btn.disabled = false; }, 6000);
    });

    document.getElementById("phone")?.addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 11);
      if (!d) { e.target.value = ""; return; }
      const body = d.length === 11 ? d.slice(1) : d;
      const parts = [body.slice(0, 3), body.slice(3, 6), body.slice(6, 8), body.slice(8, 10)];
      e.target.value = "+7 " + parts[0] + (parts[1] ? " " + parts[1] : "") +
        (parts[2] ? "-" + parts[2] : "") + (parts[3] ? "-" + parts[3] : "");
    });
  }
})();
