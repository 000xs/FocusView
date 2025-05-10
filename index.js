async function generateBookmarklet() {
  try {
    const response = await fetch("src/bookmarklet.js");
    let jsCode = await response.text();

    if (!jsCode.trim()) {
      alert("bookmarklet.js is empty");
      return;
    }

    if (
      !jsCode.trim().startsWith("(function") &&
      !jsCode.trim().startsWith("(() =>")
    ) {
      jsCode = `(function() { ${jsCode} })();`;
    }

    // Minify
    const minified = jsCode
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1")
      .replace(/\s+/g, " ")
      .trim();

    const bookmarklet = `javascript:${minified}`;

    const link = document.getElementById("bookmarklet");
    link.href = bookmarklet;

    // /create minfied js file end
     
  } catch (e) {
    alert("Failed to load bookmarklet.js");
  }
}

generateBookmarklet();
