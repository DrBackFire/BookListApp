//fetching Books from DB
fetch("http://localhost:5000/books")
  .then((res) => res.json())
  .then((data) =>
    data.map((d) => {
      Book.getBooks(d);
    })
  );

//Constructing Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

  // Function for making a row and inserting a new book
  static makeTable(Book) {
    let tablemake = document.getElementById("tableBody");
    let row = document.createElement("tr");
    row.className = "tData";
    row.innerHTML = `
          <td>${Book.title}</td>
          <td>${Book.author}</td>
          <td>${Book.isbn}</td>
          <td>
            <button class="btn btn-danger btn-sm delete" id="btnDelete" >X</button>
          </td>
          `;
    tablemake.appendChild(row);
  }

  //Getting Books From DB
  static getBooks(data) {
    let tablemake = document.getElementById("tableBody");
    let row = document.createElement("tr");
    row.className = "tData";
    row.innerHTML = `
          <td>${data.title}</td>
          <td>${data.author}</td>
          <td>${data.isbn}</td>
          <td>
            <button class="btn btn-danger btn-sm delete" id="btnDelete" >X</button>
          </td>
          `;
    tablemake.appendChild(row);
  }

  // Function to delete a book from the table
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
      Book.ShowAlert("Book Deleted", "warning");
    }
  }
}

class UI {
  static ShowAlert(massage, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(massage));
    const parentDiv = document.getElementById("ShowAlert");
    parentDiv.appendChild(div);

    // Disable btn to stop alert spamming
    document.getElementById("btn").disabled = true;

    const disableBtn = () => {
      document.querySelector(".alert").remove();
      document.getElementById("btn").disabled = false;
    };

    setTimeout(disableBtn, 2000);
  }

  static clearFiled() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  static searchBook() {
    // Search by Author's Name
    let ByAuthor = document.getElementById("ByAuthor");
    document.getElementById("Search").addEventListener("keyup", filtered);

    function filtered() {
      let input = document.getElementById("Search").value.toUpperCase();
      console.log(input);

      let tBody = document.getElementById("tableBody");
      let tData = tBody.getElementsByTagName("tr");

      for (let i = 0; i < tData.length; i++) {
        let tdTitle = tData[i].getElementsByTagName("td")[0];
        let tdAuthor = tData[i].getElementsByTagName("td")[1];
        let tdISBN = tData[i].getElementsByTagName("td")[2];

        if (
          tdTitle.innerHTML.toLocaleUpperCase().indexOf(input) > -1 ||
          tdAuthor.innerHTML.toLocaleUpperCase().indexOf(input) > -1 ||
          tdISBN.innerHTML.toLocaleUpperCase().indexOf(input) > -1
        ) {
          tData[i].style.display = "";
        } else {
          tData[i].style.display = "none";
          // UI.ShowAlert("Book Not Available", "warning");
        }
      }
    }
  }
}

// Adding a Book
document.getElementById("btn").addEventListener(
  "click",
  (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    if (title === "" || author === "" || isbn === "") {
      UI.ShowAlert("Please Fill The Form", "danger");
    } else {
      const newBook = new Book(title, author, isbn);
      Book.makeTable(newBook);
      // console.log(newBook);
      UI.clearFiled();
      UI.ShowAlert("Book Added", "success");

      fetch("http://localhost:5000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      try {
      } catch (err) {
        console.log(err);
      }
    }
  },
  false
);

document.getElementById("tableBody").addEventListener("click", (e) => {
  Book.deleteBook(e.target);
});

UI.searchBook();
