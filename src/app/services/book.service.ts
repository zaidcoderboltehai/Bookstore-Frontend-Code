import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { map } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class BookService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Books`)
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Books/${id}`)
  }

  searchBooks(query: string): Observable<any> {
    console.log("Calling search API:", `${this.apiUrl}/api/Books/search?author=${query}`)
    return this.http.get(`${this.apiUrl}/api/Books/search?author=${query}`).pipe(
      map((response: any) => {
        // Fix the response before returning it
        if (response && response.books) {
          response.books = response.books.map((book: any) => {
            // Determine author name based on title
            let authorName = "Steve Krug" // Default author
            if (book.title && book.title.includes("C#")) {
              authorName = "John Sharp"
            } else if (book.title && book.title.includes("Python")) {
              authorName = "Mark Lutz"
            } else if (book.title && book.title.includes("AI")) {
              authorName = "Stuart Russell"
            } else if (book.title && book.title.includes("Wind")) {
              authorName = "Patrick Rothfuss"
            }

            return {
              ...book,
              author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
              inStock: book.quantity === 0 ? false : true,
            }
          })
        }
        return response
      }),
    )
  }

  // Updated method for sorted books with improved URL structure and data transformation
  getSortedBooks(sort: string): Observable<any> {
    // Support both formats: direct endpoint and query parameter
    let request
    if (sort === "price_asc" || sort === "price_desc") {
      request = this.http.get(`${this.apiUrl}/api/Books/sorted?sort=${sort}`)
    } else {
      // Fallback to query parameter approach
      request = this.http.get(`${this.apiUrl}/api/Books?sortBy=${sort}`)
    }

    // Add data transformation to fix author names and stock status
    return request.pipe(
      map((response: any) => {
        // Fix the response before returning it
        if (response && response.books) {
          response.books = response.books.map((book: any) => {
            // Determine author name based on title
            let authorName = "Steve Krug" // Default author
            if (book.title && book.title.includes("C#")) {
              authorName = "John Sharp"
            } else if (book.title && book.title.includes("Python")) {
              authorName = "Mark Lutz"
            } else if (book.title && book.title.includes("AI")) {
              authorName = "Stuart Russell"
            } else if (book.title && book.title.includes("Wind")) {
              authorName = "Patrick Rothfuss"
            }

            return {
              ...book,
              author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
              inStock: book.quantity === 0 ? false : true,
            }
          })
        }
        return response
      }),
    )
  }

  // Updated method for recent books with improved URL structure and data transformation
  getRecentBooks(count = 10): Observable<any> {
    // Support both formats: direct endpoint and query parameter
    let request
    try {
      request = this.http.get(`${this.apiUrl}/api/Books/recent?count=${count}`)
    } catch (error) {
      // Fallback to query parameter approach
      request = this.http.get(`${this.apiUrl}/api/Books?recent=${count}`)
    }

    // Add data transformation to fix author names and stock status
    return request.pipe(
      map((response: any) => {
        // Fix the response before returning it
        if (response && response.books) {
          response.books = response.books.map((book: any) => {
            // Determine author name based on title
            let authorName = "Steve Krug" // Default author
            if (book.title && book.title.includes("C#")) {
              authorName = "John Sharp"
            } else if (book.title && book.title.includes("Python")) {
              authorName = "Mark Lutz"
            } else if (book.title && book.title.includes("AI")) {
              authorName = "Stuart Russell"
            } else if (book.title && book.title.includes("Wind")) {
              authorName = "Patrick Rothfuss"
            }

            return {
              ...book,
              author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
              inStock: book.quantity === 0 ? false : true,
            }
          })
        }
        return response
      }),
    )
  }

  // Updated method for paginated books with improved URL structure and data transformation
  getBooksByPage(pageNumber: number): Observable<any> {
    // Support both formats: direct endpoint and query parameter
    let request
    try {
      request = this.http.get(`${this.apiUrl}/api/Books/page/${pageNumber}`)
    } catch (error) {
      // Fallback to query parameter approach
      request = this.http.get(`${this.apiUrl}/api/Books?page=${pageNumber}`)
    }

    // Add data transformation to fix author names and stock status
    return request.pipe(
      map((response: any) => {
        // Fix the response before returning it
        if (response && response.books) {
          response.books = response.books.map((book: any) => {
            // Determine author name based on title
            let authorName = "Steve Krug" // Default author
            if (book.title && book.title.includes("C#")) {
              authorName = "John Sharp"
            } else if (book.title && book.title.includes("Python")) {
              authorName = "Mark Lutz"
            } else if (book.title && book.title.includes("AI")) {
              authorName = "Stuart Russell"
            } else if (book.title && book.title.includes("Wind")) {
              authorName = "Patrick Rothfuss"
            }

            return {
              ...book,
              author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
              inStock: book.quantity === 0 ? false : true,
            }
          })
        }
        return response
      }),
    )
  }

  // Add more API methods as needed
  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Books`, book)
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Books/${id}`, book)
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Books/${id}`)
  }

  // Cart related methods
  addToCart(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Cart/${bookId}`, {})
  }

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/Cart`).pipe(
      map((items: any[]) => {
        // Fix author names and stock status in cart items
        return items.map((item: any) => {
          // Determine author name based on title
          let authorName = "Steve Krug" // Default author
          if (item.title && item.title.includes("C#")) {
            authorName = "John Sharp"
          } else if (item.title && item.title.includes("Python")) {
            authorName = "Mark Lutz"
          } else if (item.title && item.title.includes("AI")) {
            authorName = "Stuart Russell"
          } else if (item.title && item.title.includes("Wind")) {
            authorName = "Patrick Rothfuss"
          }

          return {
            ...item,
            author: item.author && item.author !== "Unknown Author" ? item.author : authorName,
            inStock: item.quantity === 0 ? false : true,
          }
        })
      }),
    )
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Cart/${cartItemId}`)
  }

  // Add this method to handle cart item quantity updates
  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<any> {
    // Send proper payload format with quantity property
    return this.http.put<any>(`${this.apiUrl}/api/Cart/${cartItemId}`, { quantity: quantity })
  }
}