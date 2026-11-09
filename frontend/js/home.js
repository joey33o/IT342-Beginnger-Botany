document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;
  function showSlide(index) {
    // Loops the slides
    // slide.length is to make sure it's not neagtive
    // the remainder will be the index that it shows
    currentIndex = (index + slides.length) % slides.length;

    // Make the dots and slides appear based on index
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
      dots[i].classList.toggle("active", i === currentIndex);
    });
  }

  // Arrow button click listeners
  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  // Dot click listeners
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
    });
  });
});
