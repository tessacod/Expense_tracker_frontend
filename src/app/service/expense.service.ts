








import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 


export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  totalBudget: number;
  spentAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly apiUrl = `${environment.apiUrl}/expense`;
  private readonly budgetApiUrl = `${environment.apiUrl}/budget`;
  // private readonly apiUrl = '/api/expense';
  private readonly endpoints = {
    add: '/add',
    update: '/edit',
    delete: '/delete',
    list: '/list'
  } as const;

  constructor(private readonly httpClient: HttpClient) {}

  // Create headers with authentication token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getExpenses(): Observable<Expense[]> {
    const url = `${this.apiUrl}${this.endpoints.list}`;
    console.log(`Requesting expenses from: ${url}`);
    
    // Add headers to the request
    return this.httpClient.get<ApiResponse<Expense[]>>(url, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data), // Extract just the data array
      tap(expenses => console.log('Received expenses:', expenses)),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a single expense by ID
   * @param id Expense ID
   * @returns Observable of single expense
   */
  viewExpense(id: number): Observable<Expense> {
    return this.httpClient
      .get<ApiResponse<Expense>>(`${this.apiUrl}${this.endpoints.list}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.httpClient
      .get<ApiResponse<Expense>>(`${this.apiUrl}/list/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  addExpense(expenseObj: Omit<Expense, 'id'>): Observable<Expense> {
    return this.httpClient
      .post<ApiResponse<Expense>>(`${this.apiUrl}${this.endpoints.add}`, expenseObj, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  deleteExpense(id: string): Observable<any> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.apiUrl}${this.endpoints.delete}/${id}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.httpClient
      .put<ApiResponse<Expense>>(
        `${this.apiUrl}/edit/${id}`, 
        expense, 
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Budget-related methods
  getBudget(): Observable<Budget> {
    return this.httpClient
      .get<ApiResponse<Budget>>(`${this.budgetApiUrl}/current`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching budget:', error);
          // Return a default budget object if API fails
          return of({ totalBudget: 0 });
        })
      );
  }

  updateBudget(budgetData: { totalBudget: number }): Observable<Budget> {
    return this.httpClient
      .post<ApiResponse<Budget>>(
        `${this.budgetApiUrl}/update`, 
        budgetData, 
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}















