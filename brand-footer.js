/* FilmHall brand footer: "Partner with FilmHall", founder message and footer links.
   Put <div id="brand-footer"></div> where it should appear. Add data-admin-link to also show the "Admin Login" link.
   Change the words in TEXT below. A link with an empty address is shown as plain text until you add one. */
(function () {
  "use strict";
  var host = document.getElementById("brand-footer");
  if (!host) return;

  var TEXT = {
    partnerTitle: "Partner with FilmHall",
    partnerLead: "Are you a filmmaker, distributor, theatre owner or venue partner? Become part of a growing regional cinema network.",
    partners: ["Film producers and distributors", "Theatre and venue owners", "Regional business partners"],
    founderTitle: "A Message from the Founder",
    quote: "Every region has stories worth telling. FilmHall aims to connect those stories with the audiences who cherish them.SHOW YOUR FILMS TO YOUR PEOPLE, LANGUAGE REALLY MATTERS ,ITS AN EMOTION.",
    name: "Prabhash Barik",
    role: "Founder, FilmHall",
    rights: "All Rights Reserved"
  };
  var LINKS = [["About FilmHall", ""], ["Contact", ""], ["Partnerships", ""], ["Regional Network", ""]];

  /* fixed, trusted icon drawings (film strip, theatre building, network) */
  var ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2 6 16.8M12 7.2l6 9.6M7.2 19h9.6"/></svg>'
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    return ((p[0] || "")[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "");
  }

  var sec = el("section", "bf");
  sec.setAttribute("aria-label", "About FilmHall");
  var inner = el("div", "bf-inner"), cols = el("div", "bf-cols");

  /* left: partner with FilmHall */
  var left = el("div");
  left.appendChild(el("h2", null, TEXT.partnerTitle));
  left.appendChild(el("p", "bf-lead", TEXT.partnerLead));
  var ul = el("ul", "bf-list");
  TEXT.partners.forEach(function (t, i) {
    var li = el("li"), ic = el("span", "bf-ico");
    ic.innerHTML = ICONS[i % ICONS.length];
    li.appendChild(ic); li.appendChild(el("span", null, t)); ul.appendChild(li);
  });
  left.appendChild(ul);

  /* right: message from the founder */
  var right = el("div");
  right.appendChild(el("h2", null, TEXT.founderTitle));
  right.appendChild(el("blockquote", "bf-quote", TEXT.quote));
  var sign = el("div", "bf-sign"), who = el("div");
  sign.appendChild(el("span", "bf-avatar", initials(TEXT.name).toUpperCase()));
  who.appendChild(el("strong", null, TEXT.name)); who.appendChild(el("span", "bf-role", TEXT.role));
  sign.appendChild(who); right.appendChild(sign);

  cols.appendChild(left); cols.appendChild(right); inner.appendChild(cols);

  /* bottom: links + copyright */
  var bottom = el("div", "bf-bottom"), nav = el("ul", "bf-links");
  LINKS.forEach(function (l) {
    var li = el("li");
    if (l[1]) { var a = el("a", null, l[0]); a.href = l[1]; li.appendChild(a); } else li.appendChild(el("span", null, l[0]));
    nav.appendChild(li);
  });
  bottom.appendChild(nav);
  var copy = el("p", "bf-copy", "\u00A9 " + new Date().getFullYear() + " FilmHall \u00B7 " + TEXT.rights);
  copy.setAttribute("data-cms", "site.footer");   /* the admin page can still change this line */
  bottom.appendChild(copy);
  if (host.hasAttribute("data-admin-link")) {
    var adm = el("a", "bf-admin", "Admin Login"); adm.href = "admin.html"; bottom.appendChild(adm);
  }
  inner.appendChild(bottom); sec.appendChild(inner);
  host.replaceChildren(sec);
})();
