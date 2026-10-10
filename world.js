/*!
 * FilmHall world page — zone loader.
 *
 * Reads the active zones (branches) HQ has published from the public CMS
 * endpoint GET /cms/public/regions and builds the "Select your Zone" grid.
 *
 * The static Odisha tile in index.html is the design and the no-API fallback:
 * if the API is unreachable or returns nothing, the page renders exactly as it
 * shipped. New zones appear the moment HQ creates an active region.
 *
 * Zone tile image/links may come from a region's brand JSON:
 *   brand.photo_media_id -> served from /cms/public/media/<id>/file
 *   brand.photo          -> a direct image URL
 *   brand.link           -> where the tile points (defaults to region host)
 */
(function () {
  "use strict";

  var ORIGIN = String(window.FILMHALL_CMS_ORIGIN || "https://api.filmhall.in").replace(/\/+$/, "");
  var REGIONS_URL = ORIGIN + "/cms/public/regions";
  var TIMEOUT_MS = 8000;

  function mediaUrl(id) {
    return ORIGIN + "/cms/public/media/" + encodeURIComponent(String(id)) + "/file";
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function safeUrl(value, base) {
    if (typeof value !== "string") return null;
    var s = value.trim();
    if (!s) return null;
    try {
      var url = new URL(s, base || ORIGIN);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch (e) { /* ignore */ }
    return null;
  }

  function guardImage(img, fallback) {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      if (img.getAttribute("src") !== fallback) img.src = fallback;
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function zoneImage(region, fallback) {
    var brand = region.brand || {};
    if (brand.photo_media_id) return mediaUrl(brand.photo_media_id);
    var direct = safeUrl(brand.photo || brand.image);
    if (direct) return direct;
    if (String(region.code).toLowerCase() === "odisha") return "odisha-map.jpg";
    return fallback;
  }

  function zoneLink(region) {
    var brand = region.brand || {};
    var explicit = safeUrl(brand.link || brand.url);
    if (explicit) return explicit;
    if (region.host) return safeUrl("https://" + String(region.host).replace(/^https?:\/\//, ""));
    return null;
  }

  function buildZone(region) {
    var card = el("div", "zone-card");
    var media = el("img");
    media.src = zoneImage(region, "logo.png");
    media.alt = (region.label || region.code) + " Zone";
    media.loading = "lazy";
    guardImage(media, "logo.png");

    var heading = el("h3", null, region.label || region.code);
    var href = zoneLink(region);

    if (href) {
      var a = document.createElement("a");
      a.href = href;
      a.appendChild(media);
      a.appendChild(heading);
      card.appendChild(a);
    } else {
      card.appendChild(media);
      card.appendChild(heading);
    }
    return card;
  }

  function renderZones(regions) {
    var box = qs("#zone-container");
    if (!box || !regions || !regions.length) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < regions.length; i++) {
      frag.appendChild(buildZone(regions[i]));
    }
    while (box.firstChild) box.removeChild(box.firstChild);
    box.appendChild(frag);
  }

  /* The global logo HQ set on the reserved 'world' region, if any. */
  function applyBrand(brand) {
    if (!brand || !brand.logo_media_id) return;
    var logo = qs(".world-header img.logo") || qs("header img.logo");
    if (!logo) return;
    guardImage(logo, "logo.png");
    logo.src = mediaUrl(brand.logo_media_id);
  }

  function load() {
    if (typeof fetch !== "function") return Promise.reject(new Error("no fetch"));
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
    return fetch(REGIONS_URL, {
      method: "GET",
      credentials: "omit",
      mode: "cors",
      cache: "no-cache",
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  function boot() {
    try {
      load().then(function (payload) {
        applyBrand(payload && payload.brand);
        renderZones(payload && payload.items ? payload.items : []);
      }).catch(function (err) {
        if (window.console && console.warn) {
          console.warn("[FilmHall zones] not loaded:", err && err.message ? err.message : err);
        }
      });
    } catch (e) {
      if (window.console && console.warn) console.warn("[FilmHall zones] loader failed:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
