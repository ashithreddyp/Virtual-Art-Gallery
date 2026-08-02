window.onload = function () {
  setTimeout(() => {
    // Start fade
    document.body.style.transition = "opacity 2s ease";
    document.body.style.opacity = "0";

    // After fade completes, redirect
    setTimeout(() => {
      window.location.href = "paintings.html";
    }, 2000); // matches transition duration
  }, 1000); // 7-second wait before fade
};
