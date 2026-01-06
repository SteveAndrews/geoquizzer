function loadScriptWithFallback(options) {
    const {
        cdnSrc,
        localSrc,
        globalName,
        attrs = {},
        timeoutMs = 1500,
    } = options;

    return new Promise((resolve, reject) => {
        function addScript(src, extraAttrs, isFallback) {
            const s = document.createElement('script');
            s.src = src;

            for (const [k, v] of Object.entries(extraAttrs || {})) {
                s.setAttribute(k, v);
            }

            let done = false;
            const finish = (err, info) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                s.onload = null;
                s.onerror = null;
                if (err) reject(err);
                else resolve(info);
            };

            const timer = window.setTimeout(() => {
                // Stop waiting on this script
                try { s.remove(); } catch { /* ignore */ }

                if (!isFallback && localSrc) {
                    addScript(localSrc, {}, true);
                } else {
                    finish(new Error(`Timed out after ${timeoutMs}ms loading script: ${src}`));
                }
            }, timeoutMs);

            s.onload = () => {
                if (globalName && typeof window[globalName] === 'undefined') {
                    if (!isFallback && localSrc) {
                        addScript(localSrc, {}, true);
                    } else {
                        finish(new Error(`Global "${globalName}" not found after loading ${src}`));
                    }
                    return;
                }

                finish(null, { src, isFallback });
            };

            s.onerror = () => {
                if (!isFallback && localSrc) {
                    addScript(localSrc, {}, true);
                } else {
                    finish(new Error(`Failed to load script: ${src}`));
                }
            };

            document.head.appendChild(s);
        }

        addScript(cdnSrc, attrs, false);
    });
}

function loadStylesheetWithFallback(options) {
    const {
        cdnSrc,
        localSrc,
        attrs = {},
        timeoutMs = 1500,
    } = options;

    return new Promise((resolve, reject) => {
        function addStylesheet(src, extraAttrs, isFallback) {
            const s = document.createElement('link');
            s.rel = 'stylesheet';
            s.type = 'text/css';
            s.href = src;

            for (const [k, v] of Object.entries(extraAttrs || {})) {
                s.setAttribute(k, v);
            }

            let done = false;
            const finish = (err, info) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                s.onload = null;
                s.onerror = null;
                if (err) reject(err);
                else resolve(info);
            };

            const timer = window.setTimeout(() => {
                // Stop waiting on this stylesheet
                try { s.remove(); } catch { /* ignore */ }

                if (!isFallback && localSrc) {
                    addStylesheet(localSrc, {}, true);
                } else {
                    finish(new Error(`Timed out after ${timeoutMs}ms loading script: ${src}`));
                }
            }, timeoutMs);

            s.onload = () => {
                if (!s.sheet) {
                    if (!isFallback && localSrc) {
                        addStylesheet(localSrc, {}, true);
                    } else {
                        finish(new Error(`Global "${globalName}" not found after loading ${src}`));
                    }
                    return;
                }

                finish(null, { src, isFallback });
            };

            s.onerror = () => {
                if (!isFallback && localSrc) {
                    addStylesheet(localSrc, {}, true);
                } else {
                    finish(new Error(`Failed to load stylesheet: ${src}`));
                }
            };

            document.head.appendChild(s);
        }

        addStylesheet(cdnSrc, attrs, false);
    });
}

async function loadLocalStylesheets(hrefs) {
    for (const href of cssFiles) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
    }
}

//function (a, b, c, d) {
//    var e, f = document;
//    var g = f.getElementsByTagName('[SCRIPT]');
//    var h = g[g.length - 1].previousElementSibling;
//    var i = f.defaultView && f.defaultView.getComputedStyle ? f.defaultView.getComputedStyle(h) : h.currentStyle;
//    if (i && i[a] != b) {
//        for (var e = 0; e < c.length; e++) {
//            f.write('<link href=' + c[e] + '" ' + d + '" />');
//        }
//    }
//} ('position', 'absolute', ['\/lib\/bootstrap\/dist\/css\/bootstrap.css'], 'rel=\u0022stylesheet\u0022 crossorigin=\u0022anonymous\u0022 integrity=\abc<snip>BE=\u0022 ');