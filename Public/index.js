//Constructing Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

  // Function to delete a book from the table
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
      UI.showAlert("Book Deleted", "warning");
    }
  }
}

class DB {
  static getBooks() {
    //fetching Books from DB
    fetch("http://localhost:5000/books")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        UI.mapBooks(data);
      })

      .catch((error) => {
        // Show Error To User
        UI.serverError(
          `There has been a problem with your fetch operation: ${error}`,
          "warning"
        );
      });
  }

  static postBook(newBook) {
    fetch("http://localhost:5000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    }).catch((error) => {
      // Show Error To User
      UI.serverError(
        `There has been a problem with your fetch operation: ${error}`,
        "warning"
      );
    });
  }
}

class UI {
  static mapBooks(books) {
    books.map((book) => {
      this.makeTable(book);
    });
  }

  // Function for making a row and inserting a new book
  static makeTable(Book) {
    let tablemake = document.getElementById("tableBody");
    let row = document.createElement("tr");
    row.className = "tData";
    row.innerHTML = `
            <td class="title">${Book.title}</td>
            <td class="author">${Book.author}</td>
            <td class="isbn">${Book.isbn}</td>
            <td>
              <button class="btn btn-danger btn-sm delete" id="btnDelete" >X</button>
            </td>
            `;
    tablemake.appendChild(row);
  }

  static addBookToUI() {
    const addBook = (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const isbn = document.getElementById("isbn").value;

      if (title === "" || author === "" || isbn === "") {
        this.showAlert("Please Fill The Form", "danger");
      } else {
        // Instantiate book
        const newBook = new Book(title, author, isbn);

        // Add Book to UI
        this.makeTable(newBook);

        // Clear fields
        this.clearFiled();

        // Show success message
        this.showAlert("Book Added", "success");

        // Post Book To DB
        DB.postBook(newBook);
      }
    };

    return addBook;
  }

  static showAlert(massage, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} ShowAlert`;
    div.appendChild(document.createTextNode(massage));
    const parentDiv = document.getElementById("ShowAlert");
    parentDiv.appendChild(div);

    // Disable btn to stop alert spamming
    document.getElementById("btn").disabled = true;

    const disableBtn = () => {
      document.querySelector(".ShowAlert").remove();
      document.getElementById("btn").disabled = false;
    };

    setTimeout(disableBtn, 3000);
  }

  static serverError(massage, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} serverAlert`;
    div.appendChild(document.createTextNode(massage));
    const parentDiv = document.getElementById("serverAlert");
    parentDiv.appendChild(div);

    setTimeout(document.querySelector(".serverAlert").remove(), 10000);
  }

  static clearFiled() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  static searchBook() {
    document.getElementById("Search").addEventListener("keyup", filtered);

    function filtered() {
      let input = document.getElementById("Search").value.toUpperCase();

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
        }
      }
    }
  }
}
// Adding a Book
document
  .getElementById("btn")
  .addEventListener("click", UI.addBookToUI(), false);

document.getElementById("tableBody").addEventListener("click", (e) => {
  Book.deleteBook(e.target);
});

// Event: Display Books
document.addEventListener("DOMContentLoaded", DB.getBooks);

UI.searchBook();
