
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new Subject<string[]>();

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<string[]> {
    const url = `${environment.hostname}/notificaciones/${userId}`; // Append the userId to the URL
    this.http.get<string[]>(url).subscribe(
      (notifications) => {
        this.notificationsSubject.next(notifications);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );

    return this.notificationsSubject.asObservable();
  }

  addNotification(notificationData: { id_usuario: number; id_producto: number; message: string }) {
    console.log('Sending notification to the server:', notificationData);
    // Send the notification to the server
    this.http.post<any>(`${environment.hostname}/notificaciones`, notificationData)
      .subscribe((response) => {
        // Handle response from the server (e.g., update UI if needed)
        console.log('Notification sent to the server:', notificationData);
      });
  }

  clearNotifications() {
    // Clear notifications on the server (optional)
    this.http.delete('/notificaciones').subscribe(() => {
      // Handle successful deletion (e.g., update UI if needed)
      console.log('Notifications cleared on the server.');
    });

    // Clear local notifications subject
    this.notificationsSubject.next([]);
  }

}
