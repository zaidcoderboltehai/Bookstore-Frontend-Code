import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class BookDetailService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  // Book details fetch karne ke liye method
  getBookById(id: number): Observable<any> {
    console.log("Calling API:", `${this.apiUrl}/api/Books/${id}`)
    return this.http.get(`${this.apiUrl}/api/Books/${id}`)
  }

  // Book rating submit karne ke liye method
  submitBookReview(bookId: number, rating: number, reviewText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Books/${bookId}/reviews`, {
      rating,
      reviewText,
    })
  }

  // Add searchBooks method to BookDetailService
  searchBooks(query: string): Observable<any> {
    console.log("Calling search API:", `${this.apiUrl}/api/Books/search?author=${query}`)
    return this.http.get(`${this.apiUrl}/api/Books/search?author=${query}`)
  }
}