//Constructing Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

  // Function for making a row and inserting a new book
  static makeTable(Book) {
    let tablemake = document.getElementById('tableBody');
    let row = document.createElement('tr');
    row.className = 'tData';
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
    let tablemake = document.getElementById('tableBody');
    let row = document.createElement('tr');
    row.className = 'tData';
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
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
      Book.ShowAlert('Book Deleted', 'warning');
    }
  }

  static clearFiled() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  static ShowAlert(massage, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(massage));
    const parentDiv = document.getElementById('ShowAlert');
    parentDiv.appendChild(div);

    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }
}

//fetching Books from DB
fetch('http://localhost:5000/books')
  .then((res) => res.json())
  .then((data) =>
    data.map((d) => {
      Book.getBooks(d);
    })
  );

// Adding a Book
document.getElementById('btn').addEventListener(
  'click',
  (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    if (title === '' || author === '' || isbn === '') {
      Book.ShowAlert('Please Fill The Form', 'danger');
    } else {
      const newBook = new Book(title, author, isbn);
      Book.makeTable(newBook);
      // console.log(newBook);
      Book.clearFiled();
      Book.ShowAlert('Book Added', 'success');

      fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

document.getElementById('tableBody').addEventListener('click', (e) => {
  Book.deleteBook(e.target);
});

// Searching by Book Title
// We need to add an event listener to the button
// Disable other boxes when ByTitle is checked
let ByTitle = document.getElementById('ByTitle');
ByTitle.addEventListener('click', SearchByTitle);
ByTitle.addEventListener('click', disabledByAuthorBox);

function SearchByTitle() {
  // Listen for user input
  // Getting the input filled to add a event listener to match it with the table
  document.getElementById('Search').addEventListener('keyup', filtered);

  // Declaring the function to match Search input with table
  function filtered() {
    // Getting the input value of the user and converting it to upper case.
    const GetValue = document.getElementById('Search').value.toUpperCase();
    console.log(GetValue);

    // Getting the place of where the data is.
    // Getting the parent Tag of the Data (Zooming in).
    const tBody = document
      .getElementById('tableBody')
      .getElementsByTagName('tr');

    // Looping through the data and matching it.
    for (let i = 0; i < tBody.length; i++) {
      // Zooming in more to the Tag where the data is & which Tag to look into[0].
      const td = tBody[i].getElementsByTagName('td')[0];

      // Setting a condition where if matched then show data, if not don't show.
      if (td.innerHTML.toUpperCase().indexOf(GetValue) > -1) {
        tBody[i].style.display = '';
      } else {
        tBody[i].style.display = 'none';
        Book.ShowAlert('Book Not Available', 'warning');
      }
    }
  }
}

function disabledByAuthorBox() {
  let TitleBox = document.getElementById('ByTitle');
  let AuthorBox = document.getElementById('ByAuthor');
  let TitleText = document.getElementById('TitleText');

  if (TitleBox.checked == true) {
    AuthorBox.disabled = true;
    TitleText.style.color = 'red';
  } else {
    AuthorBox.disabled = false;
    TitleText.style.color = 'white';
  }
}
// Search by Author's Name
let ByAuthor = document.getElementById('ByAuthor');
ByAuthor.addEventListener('click', SearchByAuthor);
ByAuthor.addEventListener('click', disabledByTitleBox);
// Make to function that listen for the input of user
function SearchByAuthor() {
  document.getElementById('Search').addEventListener('keyup', filtered);

  function filtered() {
    let input = document.getElementById('Search').value.toUpperCase();
    console.log(input);

    let tBody = document.getElementById('tableBody');
    let tData = tBody.getElementsByTagName('tr');

    for (let i = 0; i < tData.length; i++) {
      let td = tData[i].getElementsByTagName('td')[1];

      if (td.innerHTML.toLocaleUpperCase().indexOf(input) > -1) {
        tData[i].style.display = '';
      } else {
        tData[i].style.display = 'none';
        Book.ShowAlert('Book Not Available', 'warning');
      }
    }
  }
}

/* 
In order to disable a check box when another check box is checked.
We first have to get the id of the boxes in a function.
*/
function disabledByTitleBox() {
  let box = document.getElementById('ByAuthor');
  let box2 = document.getElementById('ByTitle');

  // Also for extra function u can get the id of the label.
  let AuthorBox = document.getElementById('AuthorBox');

  // Set a rule where when the first box checked is equal to true.
  if (box.checked == true) {
    // Then Set the other box or boxes to .disabled = true
    box2.disabled = true;
    AuthorBox.style.color = 'red';
  } else {
    box2.disabled = false;
    AuthorBox.style.color = 'white';
  }
}

// document.getElementById('isbn').addEventListener('click', SearchByISBN);

// function SearchByISBN() {
//   document.getElementById('Search').addEventListener('keyup', ISBNFilter);

//   function ISBNFilter() {
//     let input1 = document.getElementById('Search').value;
//     console.log(input1);

//     let tBody = document.getElementById('tableBody');
//     let tData = tBody.getElementsByTagName('tr');

//     for (let i = 0; i < tData; i++) {
//       let td = tData[i].getElementsByTagName('td')[2];

//       if (td.innerHTML.indexOf(input1) > -1) {
//         tData[i].style.display = '';
//       } else {
//         tData[i].style.display = 'none';
//       }
//     }
//   }
// }
// // Getting the input filled to add a event listener to match it with the table
// document.getElementById('Search').addEventListener('keyup', filtered);

// // Declaring the function to match Search input with table
// function filtered() {

//   // Getting the input value of the user and converting it to upper case.
//   let x = document.getElementById('Search').value.toUpperCase();
//   console.log(x);

//   // Getting the place of where the data is.
//   let tBody = document.getElementById('tableBody');

//   // Getting the parent Tag of the Data (Zooming in).
//   let tData = tBody.getElementsByTagName('tr');

//   // Looping through the data and matching it.
//   for (let i = 0; i < tData.length; i++) {

//     // Zooming in more to the Tag where the data is & which Tag to look into[0].
//     let td = tData[i].getElementsByTagName('td')[0];

//     // Setting a condition where if matched then show data, if not don't show.
//     if (td.innerHTML.toUpperCase().indexOf(x) > -1) {
//       tData[i].style.display = '';
//     } else {
//       tData[i].style.display = 'none';
//     }
//   }
// }

// class UI {
//   static makeTable(Book) {
//     let tablemake = document.getElementById('tableBody');
//     let row = document.createElement('tr');
//     row.innerHTML = `
//     <td>${Book.title}</td>
//           <td>${Book.author}</td>
//           <td>${Book.isbn}</td>
//           <td>
//             <button class="btn btn-danger btn-sm" id="btnDelete">X</button>
//           </td>
//           `;
//     tablemake.appendChild(row);
//   }
// }

// btn.addEventListener(
//   'click',
//   function addRow(e) {
//     e.preventDefault();
//     if (title === '' || author === '' || isbn === '') {
//       alert('Please meet the requirements');
//       return false;
//     } else {
//       let table = document.getElementById('tableBody');
//       let row = document.createElement('tr');
//       let tdt = document.createElement('td');
//       tdt.textContent = document.getElementById('title').value;
//       let tda = document.createElement('td');
//       tda.textContent = document.getElementById('author').value;
//       let tdi = document.createElement('td');
//       tdi.textContent = document.getElementById('isbn').value;
//       btnDelete = document.createElement('button');
//       btnDelete.className = 'btn btn-danger btn-sm text-center';
//       btnDelete.textContent = 'X';
//       row.appendChild(tdt);
//       row.appendChild(tda);
//       row.appendChild(tdi);
//       row.appendChild(btnDelete);
//       table.appendChild(row);
//     }
//   },
//   false
// );

//Test Btn
// const get_btn = document
//   .getElementById('get-btn')
//   .addEventListener('click', (e) => {
//     e.preventDefault;
//     fetch('http://localhost:5000/books'), {
//   method:'GET'
// }
//   .then((res) => res.json())
//   .then((data) => console.log(data));
//   });
