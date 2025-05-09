import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

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
    return this.http.get(`${this.apiUrl}/api/Books/search?author=${query}`)
  }

  // Method for sorted books
  getSortedBooks(sort: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Books/sorted?sort=${sort}`)
  }

  // Method for recent books
  getRecentBooks(count = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Books/recent?count=${count}`)
  }

  // New method for paginated books
  getBooksByPage(pageNumber: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Books/page/${pageNumber}`)
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
    return this.http.get<any[]>(`${this.apiUrl}/api/Cart`)
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
