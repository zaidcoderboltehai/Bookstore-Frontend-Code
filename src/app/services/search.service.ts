import { Injectable } from "@angular/core"
import type { Router } from "@angular/router"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>("")
  searchQuery$ = this.searchQuerySubject.asObservable()

  constructor(private router: Router) {}

  search(query: string): void {
    if (query.trim()) {
      this.searchQuerySubject.next(query.trim())
      // Navigate to dashboard with search query
      this.router.navigate(["/dashboard"], {
        queryParams: { search: query.trim() },
      })
    }
  }

  getSearchQuery(): string {
    return this.searchQuerySubject.value
  }

  clearSearch(): void {
    this.searchQuerySubject.next("")
  }
}
