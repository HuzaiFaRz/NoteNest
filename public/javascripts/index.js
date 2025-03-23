const notesSearchInput = document.querySelector("#note-search-input");
const noteCard = document.querySelectorAll("#note-card");
const noteTittle = document.querySelectorAll("#note-tittle");

const noteSearchHandler = (event) => {
  noteTittle.forEach((elem, index) => {
    const noteTittleText = elem.textContent.replaceAll(" ", "").toLowerCase();
    const noteSearchInputText = event.target.value
      .toLowerCase()
      .replaceAll(" ", "");
    if (noteTittleText.includes(noteSearchInputText)) {
      noteCard[index].style.display = "block";
    } else {
      noteCard[index].style.display = "none";
    }
  });
};

if (noteCard) {
  notesSearchInput.addEventListener("input", noteSearchHandler);
}
